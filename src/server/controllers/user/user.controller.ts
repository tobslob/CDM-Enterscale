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
import { Auth } from "@app/common/services";
import { Passwords } from "@app/services/password";
import { ForbiddenError } from "@random-guys/siber";

@controller("/users")
export class UserController extends BaseController<User> {
  @httpPost("/", canCreateUser, validate(isUserDTO, "body"))
  async CreateUser(@request() req: Request, @response() res: Response, @requestBody() body: UserDTO) {
    try {
      const workspace = req.session.workspace;
      const user = await UserServ.createUser(workspace, body);
      this.handleSuccess(req, res, user);

      this.log(req, {
        object_id: user.id,
        activity: "create.user",
        message: `created user`
      }, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", canCreateUser)
  async GetUser(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const user = await UserRepo.byID(id);

      if (user.workspace !== req.session.workspace && !req.session.super_admin) {
        throw new ForbiddenError("You are not allowed to perform this operation.");
      }

      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch("/change-password", Auth.authCheck, validate(isPasswordDTO, "body"))
  async ChangePassword(@request() req: Request, @response() res: Response, @requestBody() body: PasswordDTO) {
    try {
      const user = await UserRepo.byID(req.session.user);
      const isCorrectPassword = await Passwords.validate(body.old_password, user.password);
      if (!isCorrectPassword) {
        throw new UnauthorizedError("Your password is incorrect");
      }
      await UserRepo.setPassword(req.session.user, body.new_password);

      this.handleSuccess(req, res, user);

      this.log(req, {
        object_id: user.id,
        activity: "edit.password",
        message: `edited password`
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch("/reset-password")
  async resetPassword(@request() req: Request, @response() res: Response, @requestBody() body: ResetPasswordDTO) {
    try {
      await UserServ.resetPassword(body.email_address);

      this.handleSuccess(req, res, null);

      this.log(req, {
        activity: "reset.password",
        message: "reset password"
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPut("/", Auth.authCheck, validate(isEditUserDTO, "body"))
  async editUser(@request() req: Request, @response() res: Response, @requestBody() body: UserDTO) {
    try {
      const user = await UserServ.editUser(req.session.user, body);

      this.handleSuccess(req, res, user);

      this.log(req, {
        object_id: user.id,
        activity: "edit.user",
        message: "edited profile"
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
