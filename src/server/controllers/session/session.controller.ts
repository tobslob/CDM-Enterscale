import "reflect-metadata";
import { Auth } from "@app/common/services";
import { RoleRepo } from "@app/data/role";
import { LoginDTO, Session, UserRepo } from "@app/data/user";
import { Request, Response } from "express";
import { controller, httpDelete, httpGet, httpPost, request, requestBody, response } from "inversify-express-utils";
import { validate } from "@app/data/util/validate";
import { isLoginDTO } from "./session.validator";
import { BaseController } from "@app/data/util";

@controller("/sessions")
export class SessionController extends BaseController<Session> {
  @httpPost("/login", validate(isLoginDTO))
  async Login(@request() req: Request, @response() res: Response, @requestBody() body: LoginDTO) {
    try {
      const user = await UserRepo.getAuthenticatedUser(body.email_address, body.password);
      const role = await RoleRepo.byID(user.role_id);

      const token = await Auth.saveSession(user.id, {
        ...role.permissions,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        phone_number: user.phone_number,
        user: user.id,
        role: role.id,
        workspace: user.workspace
      });

      const value = {
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        phone_number: user.phone_number,
        token: token,
        user: user.id,
        role: role.id,
        permissions: role.permissions,
        workspace: user.workspace
      };

      this.handleSuccess(req, res, value);

      this.log(
        req,
        {
          object_id: user.id,
          activity: "session.user",
          message: `Logged in`
        },
        { ...value, role_id: value.role }
      );
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", Auth.authCheck)
  async getSession(@request() req: Request, @response() res: Response) {
    try {
      const user = await UserRepo.byID(req.session.user);
      const role = await RoleRepo.byID(user.role_id);

      this.handleSuccess(req, res, {
        permissions: role.permissions,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        phone_number: user.phone_number,
        user: user.id,
        role: role.id,
        workspace: user.workspace,
        token: req.sessionID
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/logout", Auth.authCheck)
  async logout(@request() req: Request, @response() res: Response) {
    try {
      Auth.destroySession(req.session.user);
      this.handleSuccess(req, res, null);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
