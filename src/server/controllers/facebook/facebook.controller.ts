import { controller, request, response, httpPost, requestBody, queryParam } from "inversify-express-utils";
import { BaseController, validate } from "@app/data/util";
import { Request, Response } from "express";
import { Proxy } from "@app/services/proxy";
import { DefaulterQuery, FacebookAudienceDTO } from "@app/data/defaulter";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { isDefaulterQuery } from "../defaulter/defaulter.validator";
import { isFacebookAudienceDTO } from "./facebook.validation";

type ControllerResponse = any;

@controller("/facebook")
export class FaceBookController extends BaseController<ControllerResponse> {
  @httpPost("/audience", canCreateCampaign, validate(isDefaulterQuery, "query"), validate(isFacebookAudienceDTO, "body"))
  async createCustomAudience(
    @request() req: Request,
    @response() res: Response,
    @queryParam() query: DefaulterQuery,
    @requestBody() body: FacebookAudienceDTO
  ) {
    try {
      const audience = await Proxy.createCustomAudience(body);
      const files = await Proxy.uploadCustomFile(req, query, audience);
      this.handleSuccess(req, res, files);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
