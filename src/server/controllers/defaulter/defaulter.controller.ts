import {
  controller,
  httpPost,
  request,
  response,
  httpGet,
  requestParam,
  queryParam,
  httpDelete
} from "inversify-express-utils";
import { BaseController, mapConcurrently, validate, NotFoundError } from "@app/data/util";
import { isUpload, canCreateDefaulters } from "./defaulter.middleware";
import { Extractions, ExtractedDefaulter } from "@app/services/extraction";
import { Request, Response } from "express";
import { Defaulter } from "@app/services/defaulter";
import { DefaulterRepo, Defaulters, DefaulterQuery } from "@app/data/defaulter";
import { isDefaulterQuery } from "./defaulter.validator";
import { RoleRepo } from "@app/data/role";
import { UserRepo } from "@app/data/user";

type ControllerResponse = ExtractedDefaulter[] | Defaulters[] | Defaulters;

@controller("/defaulters")
export class DefaultersController extends BaseController<ControllerResponse> {
  @httpPost("/bulk/extract", canCreateDefaulters, isUpload)
  async extractDefaulters(@request() req: Request, @response() res: Response) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await Extractions.extractDefaulters(req.file);

      const cratedDefaulters = await mapConcurrently(defaulters, async defaulter => {
        return await Defaulter.createDefaulters(req, workspace, defaulter);
      });

      const defaultUsers = await Defaulter.getDefaultUsers(cratedDefaulters);

      this.handleSuccess(req, res, defaultUsers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateDefaulters, validate(isDefaulterQuery))
  async getAllDefaulters(@request() req: Request, @response() res: Response, @queryParam() query: DefaulterQuery) {
    try {
      const defaulters = await DefaulterRepo.getDefaulters(req, query);

      const defaultUsers = await Defaulter.getDefaultUsers(defaulters);

      this.handleSuccess(req, res, defaultUsers);
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

  @httpDelete("/:request_id", canCreateDefaulters)
  async deleteFaultUniqueDefaulters(
    @request() req: Request,
    @response() res: Response,
    @requestParam("request_id") request_id: string
  ) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, request_id);

      if(defaulters.length === 0) {
        throw new NotFoundError("We could not find any defaulter with such request id");
      }

      await mapConcurrently(defaulters, async d => {
        const user = await UserRepo.byID(d.user);
        await UserRepo.destroy(user.id)
        await RoleRepo.destroy(d.role_id);
        await DefaulterRepo.destroy({ request_id: d.request_id });
      });

      this.handleSuccess(req, res, null);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
