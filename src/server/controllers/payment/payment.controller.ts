import { controller, httpPost, request, response, requestBody, queryParam } from "inversify-express-utils";
import { BaseController, ForbiddenError, validate } from "@app/data/util";
import { Request, Response } from "express";
import { Token, PaymentDTO, PaymentType, ValidatePaymentDTO, PaymentHookDTO } from "@app/data/payment/payment.model";
import { Payment } from "@app/services/payment";
import { SessionRequest, UserRepo } from "@app/data/user";
import { isPayment, isTypeOfPayment, isOTP } from "./payment.validator";
import { Proxy } from "@app/services/proxy";
import { PaymentRepo } from "@app/data/payment";
import dotenv from "dotenv";
import { DefaulterRepo } from "@app/data/defaulter";

dotenv.config();

type ControllerResponse = SessionRequest;

@controller("/payments")
export class PaymentController extends BaseController<ControllerResponse> {
  @httpPost("/session")
  async confirmRepayment(@request() req: Request, @response() res: Response, @requestBody() body: Token) {
    try {
      let value = await Payment.confirmPaymentLink(body.token);

      if (!value) {
        throw new ForbiddenError("Failed to validate this user");
      }
      this.handleSuccess(req, res, value);

      this.log(
        req,
        {
          activity: "Click.link",
          message: `${value.first_name} ${value.last_name} clicked on payment link`
        },
        value
      );
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/", validate(isTypeOfPayment, "query"), validate(isPayment, "body"))
  async createRePayment(
    @request() req: Request,
    @response() res: Response,
    @queryParam() type: PaymentType,
    @requestBody() body: PaymentDTO
  ) {
    try {
      const payment = await Payment.request(type, body);
      this.handleSuccess(req, res, payment.meta.authorization);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/authorise", validate(isTypeOfPayment, "query"), validate(isPayment, "body"))
  async authorisePayment(
    @request() req: Request,
    @response() res: Response,
    @queryParam() type: PaymentType,
    @requestBody() body: PaymentDTO
  ) {
    try {
      const payment = await Payment.authorisePayment(type, body);
      this.handleSuccess(req, res, payment.data);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/validate-otp", validate(isOTP, "body"))
  async validatePayment(@request() req: Request, @response() res: Response, @requestBody() body: ValidatePaymentDTO) {
    try {
      const payment = await Proxy.validatePayment(body);
      this.handleSuccess(req, res, payment.data);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/webhook")
  async paymentWebhook(@request() req: Request, @response() res: Response, @requestBody() body: PaymentHookDTO) {
    try {
      const hash = req.headers["verif-hash"];
      if (!hash) return;
      if (hash !== process.env.secret_hash) {
        throw new Error("You are not authorized to call this endpoint");
      }

      await PaymentRepo.webhook(body);

      if (body.data.amount > 0) {
        const user = await UserRepo.byQuery({
          email_address: body.data.customer.email,
          phone_number: body.data.customer.phone_number
        });
        const defaulter = await DefaulterRepo.byQuery({ workspace: user.workspace, user: user.id });
        const amount_outstanding = defaulter.amount_outstanding - body.data.amount;
        const amount_repaid = defaulter.loan_amount - amount_outstanding;

        defaulter["amount_outstanding"] = amount_outstanding;
        defaulter["amount_repaid"] = amount_repaid;

        await DefaulterRepo.editDefulter(defaulter.workspace, defaulter.id, defaulter);
      }

      res.send(200);
    } catch (error) {
      res.send(400);
    }
  }
}
