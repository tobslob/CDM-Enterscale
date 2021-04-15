import { controller, request, response, httpGet, requestParam, httpPost, requestBody } from "inversify-express-utils";
import { BaseController, mapConcurrently, ConstraintError } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignRepo, CampaignDTO } from "@app/data/campaign";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { CampaignServ } from "@app/services/campaign";
import { DefaulterRepo } from "@app/data/defaulter";
import { differenceInCalendarDays } from "date-fns";
import { Defaulter } from "@app/services/defaulter";
import { Voice, VoiceRepo } from "@app/data/voice";
import xml from "xml";
import { connect } from "@app/services/africaistalking";
import { rAmqp } from "@app/common/services/amqp";
import { Message } from "amqplib";
import { Log } from "@app/common/services/logger";

type ControllerResponse = Campaign[] | Campaign | string;

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
      let data;
      await rAmqp.subscribe(
        process.env.queue_name,
        async (message: Message) => {
          if (message === null) {
            Log.info("Consumer cancelled by server. Ignoring");
            return;
          }

          const campaign: CampaignDTO = JSON.parse(message.content.toString());

          await connect.VOICE.fetchQuedCalls({ phoneNumber: process.env.phone_number });

          data = xml({
            Response: [{ Say: [{ _attr: { voice: "woman", playBeep: true } }, `${campaign.message}`] }]
          });

          rAmqp.acknowledgeMessage(message);
          Log.info({ campaign }, "Successfully sent voice campaign");

          await VoiceRepo.createVoice(body);
        },
        30
      );

      this.handleSuccess(req, res, data);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
