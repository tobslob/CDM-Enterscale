import { controller, request, response, httpGet } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Request, Response } from "express";
import { listTimeZones } from "timezone-support";

type ControllerResponse = string[];

@controller("/time")
export class TimeController extends BaseController<ControllerResponse> {
  @httpGet("/zone")
  async timeZone(@request() req: Request, @response() res: Response) {
    try {
      this.handleSuccess(req, res, listTimeZones());
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
