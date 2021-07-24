import { controller, request, response, httpGet, requestParam, httpPost, requestBody } from "inversify-express-utils";
import { BaseController, ConstraintError, mapConcurrently } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignRepo, CampaignDTO } from "@app/data/campaign";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { VOICE_CAMPAIGN } from "@app/services/campaign";
import { differenceInCalendarDays } from "date-fns";
import { Store } from "@app/common/services";
import { SMSReportsDTO, SMSReportRepo } from "@app/data/sms";
import { EmailReportsDTO, EmailReportRepo } from "@app/data/email-report";
import { Voice, VoiceRepo } from "@app/data/voice";
import { UrlShortnerRepo } from "@app/data/url-shortner/url-shortner.repo";
import { Mail } from "@app/data/email/email.repo";
import { fromUnixTime } from "date-fns";

type ControllerResponse = Campaign[] | Campaign | string | string[];

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
  async smsReport(@request() req: Request, @response() res: Response, @requestBody() body: string) {
    try {
      const smsReport: SMSReportsDTO = JSON.parse(body);

      const campaign = await CampaignRepo.byID(smsReport.id);
      smsReport["workspace"] = campaign.workspace;
      await SMSReportRepo.smsReport(smsReport);

      res.sendStatus(200);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/webhook")
  async voiceReport(@request() req: Request, @response() res: Response, @requestBody() body: string) {
    try {
      const voice: Voice = JSON.parse(body);

      const campaign = await CampaignRepo.byID(voice.id);
      voice["workspace"] = campaign.workspace;
      await VoiceRepo.report(voice);

      res.sendStatus(200);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/email")
  async emailReport(@request() req: Request, @response() res: Response, @requestBody() body: EmailReportsDTO[]) {
    try {
      await mapConcurrently(body, async r => {
        const message_id = r.sg_message_id.split(".");
        r["sg_message_id"] = message_id[0];

        const { workspace, email_id } = await Mail.byQuery({ message_id: message_id[0] });
        r["email_id"] = email_id;
        r["timestamp"] = fromUnixTime(r.timestamp);
        await EmailReportRepo.emailReport(workspace, r);
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

  @httpGet("/short-url/:id")
  async getUrlShortner(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const shortUrlRes = await UrlShortnerRepo.byQuery({ short_url: id });
      const inc = shortUrlRes.click_count + 1;
      await UrlShortnerRepo.update(
        { short_url: id },
        {
          click_count: inc
        }
      );

      res.redirect(shortUrlRes.long_url);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
