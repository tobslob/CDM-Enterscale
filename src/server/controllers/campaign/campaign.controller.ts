import { controller, httpPost, request, response, httpGet, requestBody } from "inversify-express-utils";
import { BaseController, validate } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignDTO, CampaignRepo } from "@app/data/campaign";
import { canCreateCampaign } from "./campaign.middleware";
import { isCampaignDTO } from "./campaign.validator";

type ControllerResponse = Campaign[] | Campaign;

@controller("/campaigns", canCreateCampaign, validate(isCampaignDTO))
export class DefaultersController extends BaseController<ControllerResponse> {
  @httpPost("/")
  async createCampaign(@request() req: Request, @response() res: Response, @requestBody() body: CampaignDTO) {
    try {
      const workspace = req.session.workspace;
      const user = req.session.user;

      const campaign = await CampaignRepo.createCampaign(workspace, user, body);
      this.handleSuccess(req, res, campaign);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateCampaign)
  async getCampaigns(@request() req: Request, @response() res: Response) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.getCampaigns(workspace);

      this.handleSuccess(req, res, campaigns);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
