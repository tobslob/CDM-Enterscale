import "reflect-metadata";
import { Request, Response } from "express";
import { controller, httpPost, request, response, requestBody } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { isUpload } from "./media.middleware";
import { canCreateDefaulters } from "../defaulter/defaulter.middleware";
import uploadMedia from "@app/services/upload";
import { sayIt, SayIt, exportSayIt } from "@app/services/say-it";

@controller("/media")
export class UploadController extends BaseController<string[]> {
  @httpPost("/", canCreateDefaulters, isUpload)
  async uploadToCloudinary(@request() req: Request, @response() res: Response) {
    try {
      await uploadMedia(req, res);
      this.handleSuccess(req, res, req["urls"]);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/audio")
  async sayIt(@request() req: Request, @response() res: Response, @requestBody() body: SayIt) {
    try {
      await sayIt(body);
      res.sendStatus(200);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/export-audio")
  async exportSayIt(@request() req: Request, @response() res: Response, @requestBody() body: SayIt) {
    try {
      await exportSayIt(body);
      res.sendStatus(200);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
