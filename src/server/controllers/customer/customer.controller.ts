import { controller, request, response, requestParam, httpDelete, httpGet, queryParam } from "inversify-express-utils";
import { BaseController, mapConcurrently, NotFoundError } from "@app/data/util";
import { ExtractedDefaulter } from "@app/services/extraction";
import { Request, Response } from "express";
import { DefaulterRepo, Defaulters, DefaulterQuery } from "@app/data/defaulter";
import { canCreateDefaulters } from "../defaulter/defaulter.middleware";
import { Defaulter } from "@app/services/defaulter";
import { CustomerRepo } from "@app/data/customer-list/customer-list.repo";
import { Customers } from "@app/data/customer-list/customer-list.model";

type ControllerResponse = ExtractedDefaulter[] | Defaulters[] | Defaulters | Customers | Customers[];

@controller("/customers")
export class CustomerController extends BaseController<ControllerResponse> {
  @httpDelete("/:request_id/:title", canCreateDefaulters)
  async deleteCustomerList(
    @request() req: Request,
    @response() res: Response,
    @requestParam("request_id") request_id: string,
    @requestParam("title") title: string
  ) {
    try {
      const workspace = req.session.workspace;

      await CustomerRepo.deleteCustomerList(workspace, title, request_id);
      const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, request_id);

      if (defaulters.length === 0) {
        throw new NotFoundError("We could not find any defaulter with such request id");
      }

      await mapConcurrently(defaulters, async d => {
        await DefaulterRepo.deleteDefaulter(d);
      });

      this.handleSuccess(req, res, null);
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

  @httpGet("/:request_id", canCreateDefaulters)
  async getUniqueDefaulters(
    @request() req: Request,
    @response() res: Response,
    @requestParam("request_id") request_id: string
  ) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, request_id);

      const defaultUsers = await Defaulter.getDefaultUsers(defaulters);

      this.handleSuccess(req, res, defaultUsers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
