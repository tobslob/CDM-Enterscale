import { controller, httpPost, request, response } from "inversify-express-utils";
import { Auth } from "@app/common/services";
import { BaseController, mapConcurrently } from "@app/data/util";
import { isUpload } from "./defaulter.middleware";
import { Extractions, ExtractedDefaulter } from "@app/services/extraction";
import { Request, Response } from "express";
import { Defaulter } from "@app/services/defaulter";

type ControllerResponse = ExtractedDefaulter[];

@controller("/defaulters")
export class DefaultersController extends BaseController<ControllerResponse> {
  @httpPost("/bulk/extract", Auth.authCheck, isUpload)
  async extractDefaulters(@request() req: Request, @response() res: Response) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await Extractions.extractDefaulters(req.file);

      await mapConcurrently(defaulters, defaulter => {
        return Defaulter.createDefaulters(res, workspace, defaulter);
      });

      this.handleSuccess(req, res, defaulters);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
