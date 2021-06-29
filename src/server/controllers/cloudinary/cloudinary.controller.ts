import "reflect-metadata";
import { Request, Response } from "express";
import { controller, httpPost, request, response } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { isUpload } from "./cloudinary.middleware";
import { canCreateDefaulters } from "../defaulter/defaulter.middleware";
import uploadMedia from "@app/services/upload";

@controller("/uploads")
export class UploadController extends BaseController<string[]> {
  @httpPost("/", canCreateDefaulters, isUpload)
  async UploadToCloudinary(@request() req: Request, @response() res: Response) {
    try {
      await uploadMedia(req, res);
      this.handleSuccess(req, res, req["urls"]);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
