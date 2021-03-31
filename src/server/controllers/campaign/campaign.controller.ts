import {
  controller,
  httpPost,
  request,
  response,
  httpGet,
  requestBody,
  requestParam,
  httpDelete,
  httpPatch
} from "inversify-express-utils";
import { BaseController, validate, ConstraintError } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignDTO, CampaignRepo } from "@app/data/campaign";
import { canCreateCampaign } from "./campaign.middleware";
import { SendMessageResponse } from "africastalking-ts";
import { isCampaignDTO } from "./campaign.validator";
import { differenceInCalendarDays } from "date-fns";

type ControllerResponse = Campaign[] | Campaign | SendMessageResponse | any;

@controller("/campaigns")
export class CampaignController extends BaseController<ControllerResponse> {
  @httpPost("/", canCreateCampaign, validate(isCampaignDTO))
  async createCampaign(@request() req: Request, @response() res: Response, @requestBody() body: CampaignDTO) {
    try {
      const workspace = req.session.workspace;
      const user = req.session.user;

      if (body.end_date) {
        const diff = differenceInCalendarDays(body.end_date, body.start_date);
        if (diff < 1) {
          throw new ConstraintError("The end date must at least be a day after start date");
        }
      }

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
  async getCampaign(@request() req: Request, @response() res: Response, @requestParam("id") _id: string) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.byQuery({ workspace, _id });

      this.handleSuccess(req, res, campaigns);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/:id", canCreateCampaign)
  async deleteCampaign(@request() req: Request, @response() res: Response, @requestParam("id") _id: string) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.destroy({ workspace, _id });

      this.handleSuccess(req, res, campaigns);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch("/:id", canCreateCampaign, validate(isCampaignDTO))
  async editCampaign(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string,
    @requestBody() body: CampaignDTO
  ) {
    try {
      const workspace = req.session.workspace;

      if (body.end_date) {
        const diff = differenceInCalendarDays(body.end_date, body.start_date);
        if (diff < 1) {
          throw new ConstraintError("The end date must at least be a day after start date");
        }
      }

      const campaign = await CampaignRepo.editCampaign(workspace, id, body);
      this.handleSuccess(req, res, campaign);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
