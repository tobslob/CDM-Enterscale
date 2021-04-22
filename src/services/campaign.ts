import AdapterInstance from "@app/server/adapter/mail";
import { CampaignDTO } from "@app/data/campaign";
import { User } from "@app/data/user";
import dotenv from "dotenv";
import { NotFoundError } from "@app/data/util";
import { Proxy } from "@app/services/proxy";
import { Request } from "express";
import { connect } from "./africaistalking";
import { Store } from "@app/common/services";
import { DefaulterQuery } from "@app/data/defaulter";

dotenv.config();

export const VOICE_CAMPAIGN = "enterscale-robo-call";

class CampaignService {
  async send(campaign: CampaignDTO, user: any) {
    switch (campaign.channel) {
      case "EMAIL":
        return await this.email(campaign, user);
      case "SMS":
        return await this.sms(campaign, user);
      case "CALL":
        return await this.voice(campaign, user);
      default:
        return new NotFoundError("channel not found");
    }
  }

  private async email(campaign: CampaignDTO, user: any) {
    return await AdapterInstance.send({
      subject: campaign.subject,
      channel: "mail",
      recipient: user.email_address,
      template: "email-template",
      template_vars: {
        firstname: user.first_name,
        emailaddress: user.email_address,
        subject: campaign.subject,
        message: campaign.message
      }
    });
  }

  private async sms(campaign: CampaignDTO, user: User) {
    const sms = await connect.SMS;

    return await sms.send({
      to: user.phone_number,
      message: campaign.message,
      from: process.env.sms_sender
    });
  }

  private async voice(campaign: CampaignDTO, user: User) {
    const voice = await connect.VOICE;

    const call = await voice.call({
      callFrom: process.env.phone_number,
      callTo: user.phone_number
    });

    await Store.hset(VOICE_CAMPAIGN, "campaign_key", JSON.stringify(campaign));
    return call;
  }

  protected async facebook(req: Request, query: DefaulterQuery, campaign: CampaignDTO, ) {
    const { audience_id } = await Proxy.createCustomAudience(campaign);
    return await Proxy.uploadCustomFile(req, query, audience_id);
  }
}

export const CampaignServ = new CampaignService();
