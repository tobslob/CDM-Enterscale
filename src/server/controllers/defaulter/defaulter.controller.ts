import { controller, httpPost, request, response } from "inversify-express-utils";
import { Auth } from "@app/common/services";
import { BaseController } from "@app/data/util";
import { isUpload } from "./defaulter.middleware";
import { Extractions, ExtractedDefaulters } from "@app/services/extraction";
import { Request, Response } from "express";
import { UserServ } from "@app/services/user";
import { DefaulterRepo } from "@app/data/defaulter";

type ControllerResponse = ExtractedDefaulters[];

@controller("/defaulters")
export class DefaultersController extends BaseController<ControllerResponse> {
  @httpPost("/bulk/extract", Auth.authCheck, isUpload)
  async extractDefaulters(@request() req: Request, @response() res: Response) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await Extractions.extractDefaulters(req.file);

      defaulters.forEach(async defaulter => {
        const user = await UserServ.createUser(workspace, {
          email_address: defaulter.email_address,
          first_name: defaulter.first_name,
          last_name: defaulter.last_name,
          phone_number: defaulter.phone_number,
          permissions: {
            loan_admin: false,
            super_admin: false,
            users: true
          }
        });

        await DefaulterRepo.createDefaulters(workspace, user.id, defaulter);
      });

      this.handleSuccess(req, res, defaulters);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
