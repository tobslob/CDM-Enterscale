import {
  controller,
  request,
  response,
  httpGet,
  requestParam,
  httpPost,
  requestBody,
  queryParam
} from "inversify-express-utils";
import { BaseController, ConstraintError, mapConcurrently } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignRepo, CampaignDTO } from "@app/data/campaign";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { CampaignServ, VOICE_CAMPAIGN } from "@app/services/campaign";
import { DefaulterRepo, DefaulterQuery } from "@app/data/defaulter";
import { differenceInCalendarDays } from "date-fns";
import { Defaulter } from "@app/services/defaulter";
import { Voice, VoiceRepo } from "@app/data/voice";
import { Store } from "@app/common/services";
import { SMSReportsDTO, SMSReportRepo } from "@app/data/sms";

type ControllerResponse = Campaign[] | Campaign | string | string[] | any;

@controller("/actions")
export class ActionsController extends BaseController<ControllerResponse> {
  @httpGet("/:id", canCreateCampaign)
  async startOrStopCampaign(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const campaign = await CampaignRepo.byID(id);

      if (campaign.status == "STOP") {
        const diff = differenceInCalendarDays(campaign.end_date, campaign.start_date);
        if (diff < 1) {
          throw new ConstraintError("The end date must at least be a day after start date");
        }

        return await CampaignRepo.startCampaign(id);
      } else {
        return await CampaignRepo.stopCampaign(id);
      }
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/", canCreateCampaign)
  async sendInstantMessage(
    @request() req: Request,
    @response() res: Response,
    @queryParam() query: DefaulterQuery,
    @requestBody() body: CampaignDTO
  ) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getDefaulters(workspace, query);
      const users = await Defaulter.getDefaultUsers(defaulters);

      const data = await mapConcurrently(users, async u => {
        if (u.status !== "completed") {
          return await CampaignServ.send(body, u);
        }
      });

      this.handleSuccess(req, res, data);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/voice")
  async voiceCallback(@request() req: Request, @response() res: Response, @requestBody() body: Voice) {
    try {
      const campaign = await Store.hget(VOICE_CAMPAIGN, "campaign_key");

      if (campaign == null) {
        return null;
      }
      const objCampaign: CampaignDTO = JSON.parse(campaign);

      const data = `<Response><Say voice="man" playBeep="true">${objCampaign.message}</Say></Response>`;

      await VoiceRepo.createVoice(body);
      await Store.del(VOICE_CAMPAIGN, "campaign_key");
      return data;
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/sms")
  async smsCallback(@request() req: Request, @response() res: Response, @requestBody() body: SMSReportsDTO) {
    try {
      const report = await SMSReportRepo.smsReport(req, body);
      return report;
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
