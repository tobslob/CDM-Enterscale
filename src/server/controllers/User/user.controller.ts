import "reflect-metadata";
import { User, UserDTO, UserRepo, PasswordDTO, ResetPasswordDTO } from "@app/data/user";
import { Request, Response } from "express";
import {
  controller,
  httpPost,
  request,
  requestBody,
  response,
  httpGet,
  requestParam,
  httpPatch,
  httpPut
} from "inversify-express-utils";
import { validate } from "@app/data/util/validate";
import { BaseController, UnauthorizedError } from "@app/data/util";
import { isUserDTO, isPasswordDTO, isEditUserDTO } from "./user.validator";
import { UserServ } from "@app/services/user";
import { canCreateUser } from "./user.middleware";
import { isValidID } from "../workspace/workspace.validator";
import { Auth } from "@app/common/services";
import { Passwords } from "@app/services/password";

@controller("/users")
export class UserController extends BaseController<User> {
  @httpPost("/", canCreateUser, validate(isUserDTO))
  async CreateUser(@request() req: Request, @response() res: Response, @requestBody() body: UserDTO) {
    try {
      const workspace = req.session.workspace;
      const user = await UserServ.createUser(workspace, body);
      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", canCreateUser, validate(isValidID))
  async GetUser(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const user = await UserRepo.byID(id);

      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch("/change-password", Auth.authCheck, validate(isPasswordDTO))
  async ChangePassword(@request() req: Request, @response() res: Response, @requestBody() body: PasswordDTO) {
    try {
      const user = await UserRepo.byID(req.session.user);
      const isCorrectPassword = await Passwords.validate(body.old_password, user.password);
      if (!isCorrectPassword) {
        throw new UnauthorizedError("Your password is incorrect");
      }
      await UserRepo.setPassword(req.session.user, body.new_password);

      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch("/reset-password")
  async resetPassword(@request() req: Request, @response() res: Response, @requestBody() body: ResetPasswordDTO) {
    try {
      const user = await UserServ.resetPassword(body.email_address);

      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPut("/", Auth.authCheck, validate(isEditUserDTO))
  async editUser(@request() req: Request, @response() res: Response, @requestBody() body: UserDTO) {
    try {
      const user = await UserServ.editUser(req.session.user, body);

      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
