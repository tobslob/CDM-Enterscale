import "reflect-metadata";
import { Request, Response } from "express";
import { controller, httpPost, request, response } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { canCreateDefaulters, isUpload } from "../defaulter/defaulter.middleware";

@controller("/uploads")
export class SessionController extends BaseController<any> {
  @httpPost("/file", canCreateDefaulters, isUpload)
  async UploadToCloudinary(@request() req: Request, @response() res: Response) {
    try {
      
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
