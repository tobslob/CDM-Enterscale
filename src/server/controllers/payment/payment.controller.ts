import { controller, httpPost, request, response, requestBody, queryParam } from "inversify-express-utils";
import { BaseController, ForbiddenError } from "@app/data/util";
import { Request, Response } from "express";
import { Token, PaymentDTO, PaymentType } from "@app/data/payment/payment.model";
import { Payment } from "@app/services/payment";
import { SessionRequest } from "@app/data/user";

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

  @httpPost("/")
  async createRePayment(
    @request() req: Request,
    @response() res: Response,
    @queryParam() type: PaymentType,
    @requestBody() body: PaymentDTO
  ) {
    try {
      const payment = await Payment.request(type, body);
      this.handleSuccess(req, res, payment);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
