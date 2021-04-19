import { controller, request, response, httpGet, requestParam, httpPost, requestBody } from "inversify-express-utils";
import { BaseController, ConstraintError, mapConcurrently } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignRepo, CampaignDTO } from "@app/data/campaign";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { CampaignServ, VOICE_CAMPAIGN } from "@app/services/campaign";
import { DefaulterRepo } from "@app/data/defaulter";
import { differenceInCalendarDays } from "date-fns";
import { Defaulter } from "@app/services/defaulter";
import { Voice, VoiceRepo } from "@app/data/voice";
import { Store } from "@app/common/services";

type ControllerResponse = Campaign[] | Campaign | string | string[] | any;

const ISACTIVE = "is-active";

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
  async sendInstantMessage(@request() req: Request, @response() res: Response, @requestBody() body: CampaignDTO) {
    try {
      let voiceObj: Voice;
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, body.target_audience);

      if (body.channel == "CALL") {
        const voice = await Store.hget(ISACTIVE, "voice-key");

        if (voice == null) {
          return voiceObj["isActive"] == 0;
        }

        voiceObj = JSON.parse(voice);
      }

      const users = await Defaulter.getDefaultUsers(defaulters);

      const data = await mapConcurrently(users, async u => {
        if (u.status !== "completed") {
          if (body.channel == "CALL" && voiceObj.isActive === 0) {
            const calls = await CampaignServ.send(body, u);
            await Store.hdel(ISACTIVE, "voice-key");
            return calls;
          }
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

      await Store.hset(ISACTIVE, "voice-key", JSON.stringify(body));

      await VoiceRepo.createVoice(body);

      await Store.del(VOICE_CAMPAIGN, "campaign_key");
      return data;
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
