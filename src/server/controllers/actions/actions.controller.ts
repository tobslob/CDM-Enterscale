import { controller, request, response, httpGet, requestParam } from "inversify-express-utils";
import { BaseController, mapConcurrently } from "@app/data/util";
import { Request, Response } from "express";
import { Campaign, CampaignRepo } from "@app/data/campaign";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { CampaignServ } from "@app/services/campaign";
import { DefaulterRepo } from "@app/data/defaulter";
import { UserRepo } from "@app/data/user";

type ControllerResponse = Campaign[] | Campaign;

@controller("/actions")
export class CampaignController extends BaseController<ControllerResponse> {
  @httpGet("/:id", canCreateCampaign)
  async startOrStopCampaign(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const campaign = await CampaignRepo.byID(id);

      if (campaign.status == "STOP") {
        const defaulters = await DefaulterRepo.all({
          conditions: {
            workspace: req.session.workspace,
            request_id: campaign.target_audience
          }
        });
  
        await mapConcurrently(defaulters, async defaulter => {
          const user = await UserRepo.byID(defaulter.user);
          await CampaignServ.send(campaign, user);
        });
  
        return await CampaignRepo.startCampaign(id);
      } else {
        return await CampaignRepo.stopCampaign(id);
      }
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
