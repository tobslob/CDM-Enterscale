import { controller, request, response, httpDelete, httpGet, queryParam } from "inversify-express-utils";
import { BaseController, mapConcurrently, validate } from "@app/data/util";
import { ExtractedDefaulter } from "@app/services/extraction";
import { Request, Response } from "express";
import { DefaulterRepo, Defaulters, DefaulterQuery } from "@app/data/defaulter";
import { canCreateDefaulters } from "../defaulter/defaulter.middleware";
import { CustomerRepo } from "@app/data/customer-list/customer-list.repo";
import { Customers } from "@app/data/customer-list/customer-list.model";
import { isDefaulterQuery } from "../defaulter/defaulter.validator";

type ControllerResponse = ExtractedDefaulter[] | Defaulters[] | Defaulters | Customers | Customers[];

@controller("/customers")
export class CustomerController extends BaseController<ControllerResponse> {
  @httpDelete("/", canCreateDefaulters, validate(isDefaulterQuery))
  async deleteCustomerList(@request() req: Request, @response() res: Response, @queryParam() query: DefaulterQuery) {
    try {
      const workspace = req.session.workspace;

      await CustomerRepo.deleteCustomerList(workspace, query);
      const defaulters = await DefaulterRepo.getDefaulters(workspace, query);

      if (defaulters.length === 0) return;

      await mapConcurrently(defaulters, async d => {
        await DefaulterRepo.deleteDefaulter(d);
      });

      this.handleSuccess(req, res, null);

      this.log(req, {
        object_id: query.batch_id,
        activity: "delete.customer list",
        message: `delete customer list`
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateDefaulters)
  async getAllCustomerList(@request() req: Request, @response() res: Response, @queryParam() query: DefaulterQuery) {
    try {
      const customerList = await CustomerRepo.getAllCustomerList(req, query);

      this.handleSuccess(req, res, customerList);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
