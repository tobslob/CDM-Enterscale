import "reflect-metadata";
import { Request, Response } from "express";
import { controller, request, response, httpGet, requestParam } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Proxy } from "@app/services/proxy";
import { UserServ } from "@app/services/user";

@controller("/facebook")
export class FaceController extends BaseController<any> {
  @httpGet("/authenticate/:code")
  async getUserFaceBookDetails(@request() req: Request, @response() res: Response, @requestParam() code: string) {
    try {
      const token = await Proxy.getAccessTokenFromCode(code);
      const user = await Proxy.getFacebookUserData(token);

      await UserServ.createUser("", user);
      // this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
