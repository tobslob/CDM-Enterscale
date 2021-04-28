import {
  controller,
  request,
  response,
  httpGet,
  queryParam
} from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Request, Response } from "express";
import { Proxy } from "@app/services/proxy";

type ControllerResponse = any;

@controller("/activity")
export class ActivityController extends BaseController<ControllerResponse> {
  @httpGet("/")
  async emailActivity(@request() req: Request, @response() res: Response, @queryParam() query: any) {
    try {
      const emailActivity = await Proxy.emailActivity(query);

      console.log(emailActivity)
    } catch (error) {
      console.log("ERRORR 😜 😜", error)
      this.handleError(req, res, error);
    }
  }
}
