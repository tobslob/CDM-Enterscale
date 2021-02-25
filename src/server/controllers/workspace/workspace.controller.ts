import "reflect-metadata";
import { Request, Response } from "express";
import { controller, httpPost, request, requestBody, response } from "inversify-express-utils";
import { validate } from "@app/data/util/validate";
import { BaseController } from "@app/data/util";
import { isWorkspaceWihAdminDTO } from "./workspace.validator";
import { Workspace, WorkspaceDTO } from "@app/data/workspace";
import { WorkspaceServ } from "@app/services/workspace";
// import { canCreateWorkspace } from "./workspace.middleware";

@controller("/workspaces")
export class WorkspaceController extends BaseController<Workspace> {
  @httpPost("/", validate(isWorkspaceWihAdminDTO))
  async CreateWorkspaceWithAdmin(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: WorkspaceDTO
  ) {
    try {
      const workspace = await WorkspaceServ.createWorkspaceWithAdmin(body);

      this.handleSuccess(req, res, workspace);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
