import {
  controller,
  httpPost,
  request,
  response,
  httpGet,
  requestBody,
  requestParam,
  httpDelete
} from "inversify-express-utils";
import { BaseController, validate } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignDTO, CampaignRepo } from "@app/data/campaign";
import { canCreateCampaign } from "./campaign.middleware";
import { isCampaignDTO } from "./campaign.validator";

type ControllerResponse = Campaign[] | Campaign;

@controller("/campaigns", canCreateCampaign, validate(isCampaignDTO))
export class CampaignController extends BaseController<ControllerResponse> {
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

  @httpGet("/:id", canCreateCampaign)
  async getCampaign(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.byQuery({ workspace, id });

      this.handleSuccess(req, res, campaigns);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/:id", canCreateCampaign)
  async deleteCampaign(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.destroy({ workspace, id });

      this.handleSuccess(req, res, campaigns);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
