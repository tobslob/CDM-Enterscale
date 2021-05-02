import "reflect-metadata";
import { Request, Response } from "express";
import { controller, httpPost, request, requestBody, response, httpGet, requestParam } from "inversify-express-utils";
import { validate } from "@app/data/util/validate";
import { BaseController } from "@app/data/util";
import { isWorkspaceWihAdminDTO, isValidID } from "./workspace.validator";
import { Workspace, WorkspaceDTO, WorkspaceRepo } from "@app/data/workspace";
import { WorkspaceServ } from "@app/services/workspace";
import { canCreateWorkspace } from "./workspace.middleware";

@controller("/workspaces")
export class WorkspaceController extends BaseController<Workspace> {
  @httpPost("/", canCreateWorkspace, validate(isWorkspaceWihAdminDTO))
  async CreateWorkspaceWithAdmin(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: WorkspaceDTO
  ) {
    try {
      const workspace = await WorkspaceServ.createWorkspaceWithAdmin(body);

      this.handleSuccess(req, res, workspace);

      this.log(req, {
        object_id: workspace.id,
        activity: "create.workspace",
        message: "created workspace"
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", canCreateWorkspace, validate(isValidID))
  async GetWorkspace(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const workspace = await WorkspaceRepo.byID(id);

      this.handleSuccess(req, res, workspace);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
