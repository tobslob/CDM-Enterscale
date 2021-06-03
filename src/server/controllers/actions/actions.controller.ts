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
import { BaseController, ConstraintError, mapConcurrently, validate } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignRepo, CampaignDTO } from "@app/data/campaign";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { CampaignServ, VOICE_CAMPAIGN, USER_SESSION_KEY } from "@app/services/campaign";
import { DefaulterRepo, DefaulterQuery } from "@app/data/defaulter";
import { differenceInCalendarDays } from "date-fns";
import { Defaulter } from "@app/services/defaulter";
import { Store } from "@app/common/services";
import { SMSReportsDTO, SMSReportRepo } from "@app/data/sms";
import { isDefaulterQuery } from "../defaulter/defaulter.validator";
import { Session } from "@app/data/user";
import { EmailReportsDTO, EmailReportRepo, EmailReports } from "@app/data/email-report";
import { isCampaign } from "./actions.validator";
import { Voice, VoiceRepo } from "@app/data/voice";

type ControllerResponse = Campaign[] | Campaign | string | string[] | any;

@controller("/actions")
export class ActionsController extends BaseController<ControllerResponse> {
  @httpGet("/voice")
  async voiceKML(@request() req: Request, @response() res: Response) {
    try {
      const campaign = await Store.hget(VOICE_CAMPAIGN, "campaign_key");

      if (campaign == null) {
        return null;
      }

      const objCampaign: CampaignDTO = JSON.parse(campaign);

      const xmlDoc = `<?xml version="1.0" encoding="UTF-8"?>
<Response id="id1">
<Read>${objCampaign.message}</Read>
</Response>`;
      res.setHeader("Content-type", "application/xml");
      res.send(xmlDoc);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/sms")
  async smsReport(@request() req: Request, @response() res: Response, @requestBody() body: SMSReportsDTO) {
    try {
      const session = await Store.hget(USER_SESSION_KEY, "session_key");

      if (session == null) {
        return null;
      }
      const objSession: Session = JSON.parse(session);

      const networkCode = {
        "62120": "Airtel",
        "62130": "MTN",
        "62150": "Glo",
        "62160": "Etisalat"
      };

      body["network"] = networkCode[body.networkCode];

      await SMSReportRepo.smsReport(objSession.workspace, body);
      res.send(200);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/webhook")
  async voiceReport(@request() req: Request, @response() res: Response, @requestBody() body: string) {
    try {
      let objSession: Session;
      const voice: Voice = JSON.parse(body);
      const session = await Store.hget(USER_SESSION_KEY, "session_key");

      if (session) {
        objSession = JSON.parse(session);
        voice.data.workspace = objSession?.workspace;
      }

      await VoiceRepo.report(voice);
      res.send(200);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/email")
  async emailReport(@request() req: Request, @response() res: Response, @requestBody() body: EmailReportsDTO[]) {
    try {
      const session = await Store.hget(USER_SESSION_KEY, "session_key");

      if (session == null) {
        return null;
      }
      const objSession: EmailReports = JSON.parse(session);

      await mapConcurrently(body, async r => {
        const message_id = r.sg_message_id.split(".");
        r["sg_message_id"] = message_id[0];

        await EmailReportRepo.emailReport(objSession.workspace, r);
      });
      return;
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", canCreateCampaign)
  async startOrStopCampaign(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const campaign = await CampaignRepo.byID(id);

      if (campaign.status == "STOP") {
        const diff = differenceInCalendarDays(campaign.end_date, campaign.start_date);
        if (diff < 1) {
          throw new ConstraintError("The end date must at least be a day after start date");
        }

        await CampaignRepo.startCampaign(id);
        this.log(req, {
          object_id: campaign.id,
          activity: "start.campaign",
          message: "Started a campaign",
          channel: campaign.channel
        });
      } else {
        await CampaignRepo.stopCampaign(id);
        this.log(req, {
          object_id: campaign.id,
          activity: "stop.campaign",
          message: "Stopped a campaign",
          channel: campaign.channel
        });
      }
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/", canCreateCampaign, validate(isDefaulterQuery, "query"), validate(isCampaign, "body"))
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

      if (body.channel === "CALL") {
        const phone_numbers = await mapConcurrently(users, async u => {
          if (u.status !== "paid") {
            return u.phone_number;
          }
        });
        await CampaignServ.send(body, phone_numbers, req);

        this.handleSuccess(req, res, []);
      } else {
        await mapConcurrently(users, async u => {
          if (u.status !== "paid") {
            return await CampaignServ.send(body, u, req);
          }
        });

        this.handleSuccess(req, res, []);
      }
      this.log(req, {
        activity: "send.instant.campaign",
        message: `Sent out ${body.channel} campaign`,
        channel: body.channel
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
