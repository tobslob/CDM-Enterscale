import {
  controller,
  httpPost,
  request,
  response,
  httpGet,
  requestBody,
  requestParam,
  httpDelete,
  httpPatch,
  queryParam
} from "inversify-express-utils";
import { BaseController, validate, ConstraintError, mapConcurrently } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignDTO, CampaignRepo, CampaignQuery } from "@app/data/campaign";
import { canCreateCampaign } from "./campaign.middleware";
import { SendMessageResponse } from "africastalking-ts";
import { isCampaignDTO, isCampaignQuery } from "./campaign.validator";
import { differenceInCalendarDays } from "date-fns";
import { WorkspaceRepo } from "@app/data/workspace";
import { isIDs } from "../defaulter/defaulter.validator";

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

      const wrkspace = await WorkspaceRepo.byID(workspace);

      const campaign = await CampaignRepo.createCampaign(wrkspace, user, body);
      this.handleSuccess(req, res, campaign);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateCampaign, validate(isCampaignQuery))
  async getCampaigns(@request() req: Request, @response() res: Response, @queryParam() query: CampaignQuery) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.getCampaigns(workspace, query);

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

  @httpDelete("/", canCreateCampaign, validate(isIDs))
  async deleteCampaign(@request() req: Request, @response() res: Response, @queryParam() query: CampaignQuery) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.all({ conditions: { workspace, _id: { $in: query.id } } });

      await mapConcurrently(campaigns, async d => {
        await CampaignRepo.destroy(d.id);
      });

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
