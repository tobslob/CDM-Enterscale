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
import { Campaign, CampaignDTO, CampaignRepo, CampaignQuery, GetCampaignQuery } from "@app/data/campaign";
import { canCreateCampaign } from "./campaign.middleware";
import { isCampaignDTO, isCampaignQuery, isGetCampaignQuery } from "./campaign.validator";
import { differenceInDays } from "date-fns";
import { WorkspaceRepo } from "@app/data/workspace";
import { isIDs } from "../defaulter/defaulter.validator";
import { CampaignServ } from "@app/services/campaign";
import { replaceUrlWithShortUrl } from "@app/services/url-shortner";
import { listTimeZones } from "timezone-support";
import { Excel } from "@app/services/excel";

type ControllerResponse = Campaign[] | Campaign | string[] | object;
const excelContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const csvContentType = "text/plain";

@controller("/campaigns")
export class CampaignController extends BaseController<ControllerResponse> {
  @httpPost("/", canCreateCampaign, validate(isCampaignDTO, "body"))
  async createCampaign(@request() req: Request, @response() res: Response, @requestBody() body: CampaignDTO) {
    try {
      let campaign: Campaign;
      let instantResponse;
      const workspace = req.session.workspace;
      const user = req.session.user;

      if (body.end_date) {
        const diff = differenceInDays(new Date(body.end_date), new Date(body.start_date));
        if (diff < 1) {
          throw new ConstraintError("The end date must at least be a day after start date");
        }
      }

      const wrkspace = await WorkspaceRepo.byID(workspace);
      body.short_link ? (body["message"] = await replaceUrlWithShortUrl(body.message)) : body.message;
      campaign = await CampaignRepo.createCampaign(wrkspace, user, body);

      if (!body.schedule) {
        instantResponse = await CampaignServ.sendInstantCampaign(campaign, req);
        await CampaignRepo.atomicUpdate(
          {
            _id: campaign.id,
            workspace
          },
          {
            $set: {
              state: "COMPLETED"
            }
          }
        );
      }
      this.handleSuccess(req, res, campaign && !body.schedule ? campaign : instantResponse);

      this.log(req, {
        object_id: campaign.id,
        activity: "create.campaign",
        message: `create a campaign`,
        channel: body.channel
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateCampaign, validate(isCampaignQuery, "query"))
  async getCampaigns(@request() req: Request, @response() res: Response, @queryParam() query: CampaignQuery) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.getCampaigns(workspace, query);

      this.handleSuccess(req, res, campaigns);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", canCreateCampaign, validate(isGetCampaignQuery, "query"))
  async getCampaign(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string,
    @queryParam() query: GetCampaignQuery
  ) {
    try {
      const campaign = await CampaignRepo.byID(id);

      if (query.file_type === "json") {
        this.handleSuccess(req, res, campaign);
      }
      res.status(200);
      res.setHeader("Content-disposition", `attachment; filename=TransactionReceipt.${query.file_type}`);
      switch (query.file_type) {
        case "csv":
          res.setHeader("Content-type", csvContentType);
          return Excel.campaignReport(query, campaign, res);
        case "xlsx":
          res.setHeader("Content-type", excelContentType);
          return Excel.campaignReport(query, campaign, res);
      }
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/", canCreateCampaign, validate(isIDs, "query"))
  async deleteCampaign(@request() req: Request, @response() res: Response, @queryParam() query: CampaignQuery) {
    try {
      const workspace = req.session.workspace;
      const campaigns = await CampaignRepo.all({ conditions: { workspace, _id: { $in: query.id } } });

      await mapConcurrently(campaigns, async d => {
        await CampaignRepo.destroy(d.id);
      });

      this.handleSuccess(req, res, campaigns);

      this.log(req, {
        activity: "delete.campaigns",
        message: `delete campaigns`
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch("/:id", canCreateCampaign, validate(isCampaignDTO, "body"))
  async editCampaign(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string,
    @requestBody() body: CampaignDTO
  ) {
    try {
      const workspace = req.session.workspace;

      if (body.end_date) {
        const diff = differenceInDays(new Date(body.end_date), new Date(body.start_date));
        if (diff < 1) {
          throw new ConstraintError("The end date must at least be a day after start date");
        }
      }

      const campaign = await CampaignRepo.editCampaign(workspace, id, body);
      this.handleSuccess(req, res, campaign);

      this.log(req, {
        object_id: campaign.id,
        activity: "edit.campaign",
        message: `edit campaign`
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/time-zone", canCreateCampaign)
  async timeZone(@request() req: Request, @response() res: Response) {
    try {
      this.handleSuccess(req, res, listTimeZones());
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
