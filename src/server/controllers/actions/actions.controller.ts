import { controller, request, response, httpGet, requestParam, httpPost, requestBody } from "inversify-express-utils";
import { BaseController, mapConcurrently, ConstraintError } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignRepo, CampaignDTO } from "@app/data/campaign";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { CampaignServ, VOICE_CAMPAIGN } from "@app/services/campaign";
import { DefaulterRepo } from "@app/data/defaulter";
import { differenceInCalendarDays } from "date-fns";
import { Defaulter } from "@app/services/defaulter";
import { Voice, VoiceRepo } from "@app/data/voice";
import xml from "xml";
import { Store } from "@app/common/services";

type ControllerResponse = Campaign[] | Campaign | string | string[];

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
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, body.target_audience);

      const users = await Defaulter.getDefaultUsers(defaulters);

      if (body.channel !== "CALL") {
        const data = await mapConcurrently(users, async u => {
          if (u.status !== "completed") {
            return await CampaignServ.send(body, u);
          }
        });

        return this.handleSuccess(req, res, data);
      }

      if (body.channel === "CALL") {
        const phone_numbers = await mapConcurrently(users, async u => {
          if (u.status !== "completed") {
            return u.phone_number;
          }
        });
        CampaignServ.send(body, phone_numbers);
        return this.handleSuccess(req, res, phone_numbers);
      }
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/voice")
  async voiceCallback(@request() req: Request, @response() res: Response, @requestBody() body: Voice) {
    try {
      const campaign = await Store.hget(VOICE_CAMPAIGN, "campain_key");

      if (campaign == null) {
        return null;
      }
      const objCampaign: CampaignDTO = JSON.parse(campaign);

      const data = xml({
        Response: [{ Say: [{ _attr: { voice: "woman", playBeep: true } }, `${objCampaign.message}`] }]
      });

      await VoiceRepo.createVoice(body);
      await Store.del(VOICE_CAMPAIGN, "campain_key");

      this.handleSuccess(req, res, data);
      return data;
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
