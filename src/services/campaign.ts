import AdapterInstance from "@app/server/adapter/mail";
import { CampaignDTO } from "@app/data/campaign";
import dotenv from "dotenv";
import { NotFoundError, mapConcurrently } from "@app/data/util";
import { Proxy, Prop } from "@app/services/proxy";
import { Request } from "express";
import { Store } from "@app/common/services";
import { Mail } from "@app/data/email/email.repo";
import { User } from "@app/data/user";
import { DefaulterRepo, Defaulter } from "@app/data/defaulter";
import { Defaulters } from "./defaulter";

dotenv.config();

export const VOICE_CAMPAIGN = "enterscale-robo-call";
export const SMS_CAMPAIGN = "enterscale-sms";
export const EMAIL_CAMPAIGN = "enterscale-campaign";
export const USER_SESSION_KEY = "user_session_key";

class CampaignService {
  async sendInstantCampaign(campaign: CampaignDTO, req: Request) {
    const workspace = campaign.campaign_type == "acquisition" ? process.env.mooyi_workspace : req.session.workspace;
    const defaulters = await DefaulterRepo.getDefaulters(workspace, {
      batch_id: campaign.target_audience,
      age: campaign.age,
      gender: campaign.gender,
      campaign_type: campaign.campaign_type
    });

    if (defaulters.length <= 0) {
      throw new NotFoundError("There is no match for your list search query.");
    }

    if (campaign.channel === "VOICE") {
      const phone_numbers = [];
      await mapConcurrently(defaulters, async (defaulter: Defaulter) => {
        defaulter.users.forEach(async user => {
          phone_numbers.push(user.phone_number);
        });
      });
      return await this.send(campaign, phone_numbers, req);
    }

    return await mapConcurrently(defaulters, async (defaulter: Defaulter) => {
      defaulter.users.forEach(async user => {
        await this.send(campaign, user, req);
      });
    });
  }

  async send(campaign: CampaignDTO, user: any, req?: Request) {
    await Store.hset(USER_SESSION_KEY, "session_key", JSON.stringify(req.session));

    switch (campaign.channel) {
      case "EMAIL":
        return await this.email(campaign, user, req);
      case "SMS":
        return await this.sms(campaign, user, req);
      case "VOICE":
        return await this.voice(campaign, user, req);
      default:
        throw new NotFoundError("channel not found");
    }
  }

  private async email(campaign: CampaignDTO, user: any, req: Request) {
    const link =
      campaign.campaign_type == "engagement"
        ? await Defaulters.generateDefaulterLink(user, campaign.target_audience, req)
        : "";
    const email = await AdapterInstance.send({
      subject: campaign.subject,
      channel: "mail",
      recipient: user.email_address,
      template: campaign?.template_identifier ?? "campaign-template",
      template_vars: {
        firstname: user.first_name,
        emailaddress: user.email_address,
        message: campaign?.message ?? null,
        workspace: req.session.workspace,
        amount: user.amount_outstanding,
        link
      }
    });

    await Mail.tracker(req.session.workspace, email.headers["x-message-id"]);
    return email;
  }

  private async sms(campaign: CampaignDTO, user: User, req: Request) {
    const link =
      campaign.campaign_type == "engagement"
        ? await Defaulters.generateDefaulterLink(user, campaign.target_audience, req)
        : "";
    const body = `${campaign.message}\n${link}`;
    return await Proxy.sms(user.phone_number, body, req);
  }

  private async voice(campaign: CampaignDTO, phone_numbers: string[], req: Request) {
    await Store.hset(VOICE_CAMPAIGN, "campaign_key", JSON.stringify(campaign));
    let prop: Prop = campaign.audio_url ? "media_url" : "doc_url";
    return await Proxy.voice(campaign, prop, phone_numbers, req);
  }
}

export const CampaignServ = new CampaignService();
