import AdapterInstance from "@app/server/adapter/mail";
import { CampaignDTO } from "@app/data/campaign";
import dotenv from "dotenv";
import { NotFoundError, mapConcurrently } from "@app/data/util";
import { Proxy, Prop } from "@app/services/proxy";
import { Request } from "express";
import { Store } from "@app/common/services";
import { Mail } from "@app/data/email/email.repo";
import { User } from "@app/data/user";
import { DefaulterRepo, Defaulter, DefaulterQuery } from "@app/data/defaulter";
import { Defaulters } from "./defaulter";

dotenv.config();

export const VOICE_CAMPAIGN = "enterscale-robo-call";
export const SMS_CAMPAIGN = "enterscale-sms";
export const EMAIL_CAMPAIGN = "enterscale-campaign";
export const USER_SESSION_KEY = "user_session_key";

class CampaignService {
  async sendInstantCampaign(campaign: CampaignDTO, req: Request) {
    const defaulters = await DefaulterRepo.searchDefaulters(req, campaign);

    if (campaign.channel === "VOICE") {
      const phone_numbers = []
      await mapConcurrently(defaulters, async (defaulter: Defaulter) => {
        defaulter.users.forEach(async user => {
          phone_numbers.push(user.phone_number);
        });
      });
      return await this.send(campaign, phone_numbers, req);
    }

    await mapConcurrently(defaulters, async (defaulter: Defaulter) => {
      defaulter.users.forEach(async user => {
        return await this.send(campaign, user, req);
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
        return await this.voice(campaign, user);
      default:
        throw new NotFoundError("channel not found");
    }
  }

  private async email(campaign: CampaignDTO, user: any, req: Request) {
    const link = await Defaulters.generateDefaulterLink(user, req);
    const email = await AdapterInstance.send({
      subject: campaign.subject,
      channel: "mail",
      recipient: user.email_address,
      template: "email-template",
      template_vars: {
        firstname: user.first_name,
        emailaddress: user.email_address,
        message: campaign.message,
        link
      }
    });

    await Mail.tracker(req.session.workspace, email.headers["x-message-id"]);
    return email;
  }

  private async sms(campaign: CampaignDTO, user: User, req: Request) {
    const link = campaign.campaign_type == "standard" ? await Defaulters.generateDefaulterLink(user, req) : "";
    const body = `${campaign.message}\n${link}`;
    return await Proxy.sms(user.phone_number, body, link);
  }

  private async voice(campaign: CampaignDTO, phone_numbers: string[]) {
    await Store.hset(VOICE_CAMPAIGN, "campaign_key", JSON.stringify(campaign));
    let prop: Prop = campaign.audio_url ? "media_url" : "doc_url";
    return await Proxy.voice(campaign, prop,  phone_numbers);
  }

  protected async facebook(req: Request, query: DefaulterQuery, campaign: CampaignDTO) {
    const { audience_id } = await Proxy.createCustomAudience(campaign);
    return await Proxy.uploadCustomFile(req, query, audience_id);
  }
}

export const CampaignServ = new CampaignService();
