import "reflect-metadata";
import { User, UserDTO } from "@app/data/user";
import { Request, Response } from "express";
import { controller, httpPost, request, requestBody, response } from "inversify-express-utils";
import { validate } from "@app/data/util/validate";
import { BaseController } from "@app/data/util";
import { isUserDTO } from "./user.validator";
import { UserServ } from "@app/services/user";
import { canCreateUser } from "./user.middleware";

@controller("/users")
export class UserController extends BaseController<User> {
  @httpPost("/", canCreateUser, validate(isUserDTO))
  async CreateUser(@request() req: Request, @response() res: Response, @requestBody() body: UserDTO) {
    const workspace = req.session.workspace;
    const user = await UserServ.createUser(workspace, body);
    this.handleSuccess(req, res, user);
  }
}
