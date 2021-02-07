import "reflect-metadata";
import { UserRepo, User, UserDTO } from "@app/data/user";
import { Request, Response } from "express";
import { controller, httpPost, request, requestBody, response } from "inversify-express-utils";
import { validate } from "@app/data/util/validate";
import { BaseController } from "@app/data/util";
import { isUserDTO } from "./user.validator";
import { UserServ } from "@app/services/role";
import { canCreateUser } from "./user.middleware";

@controller("/users")
export class UserController extends BaseController<User> {
  @httpPost("/", canCreateUser, validate(isUserDTO))
  async CreateUser(@request() req: Request, @response() res: Response, @requestBody() body: UserDTO) {
    const workspace = req.session.workspace;

    const role = await UserServ.createDefaultRole(workspace);
    const user = await UserRepo.newUser(body, role);

    this.handleSuccess(req, res, user);
  }
}
