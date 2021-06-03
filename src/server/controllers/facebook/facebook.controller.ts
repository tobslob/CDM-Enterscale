import { controller, request, response, httpPost } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Request, Response } from "express";

type ControllerResponse = any;

@controller("/facebook")
export class FaceBookController extends BaseController<ControllerResponse> {
  @httpPost("/audience")
  async deleteCustomerList(@request() req: Request, @response() res: Response) {
    try {
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
