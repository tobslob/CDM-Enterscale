import { controller, httpPost, request, response, httpGet, requestParam } from "inversify-express-utils";
import { BaseController, mapConcurrently } from "@app/data/util";
import { isUpload, canCreateDefaulters } from "./defaulter.middleware";
import { Extractions, ExtractedDefaulter } from "@app/services/extraction";
import { Request, Response } from "express";
import { Defaulter } from "@app/services/defaulter";
import { DefaulterRepo, Defaulters } from "@app/data/defaulter";

type ControllerResponse = ExtractedDefaulter[] | Defaulters[] | Defaulters;

@controller("/defaulters")
export class DefaultersController extends BaseController<ControllerResponse> {
  @httpPost("/bulk/extract", canCreateDefaulters, isUpload)
  async extractDefaulters(@request() req: Request, @response() res: Response) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await Extractions.extractDefaulters(req.file);

      const cratedDefaulters = await mapConcurrently(defaulters, async defaulter => {
        return await Defaulter.createDefaulters(res, workspace, defaulter);
      });

      this.handleSuccess(req, res, cratedDefaulters);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateDefaulters)
  async getAllDefaulters(@request() req: Request, @response() res: Response) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getDefaulters(workspace);

      this.handleSuccess(req, res, defaulters);
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

      this.handleSuccess(req, res, defaulters);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
