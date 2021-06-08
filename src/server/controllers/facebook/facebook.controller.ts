import { controller, request, response, httpPost, requestBody } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Request, Response } from "express";
import { Proxy } from "@app/services/proxy";
import { CampaignDTO } from "@app/data/campaign";

type ControllerResponse = any;

@controller("/facebook")
export class FaceBookController extends BaseController<ControllerResponse> {
  @httpPost("/audience")
  async createCustomAudience(@request() req: Request, @response() res: Response, @requestBody() body: CampaignDTO) {
    try {

      const audience = await Proxy.createCustomAudience(body);
      res.send(audience)

    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
