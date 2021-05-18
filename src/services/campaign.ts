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
import { Mail } from "@app/data/email/email.repo";
import { Defaulter } from "./defaulter";

dotenv.config();

export const VOICE_CAMPAIGN = "enterscale-robo-call";
export const SMS_CAMPAIGN = "enterscale-sms";
export const EMAIL_CAMPAIGN = "";

class CampaignService {
  async send(campaign: CampaignDTO, user: any, req?: Request) {
    switch (campaign.channel) {
      case "EMAIL":
        return await this.email(campaign, user, req);
      case "SMS":
        return await this.sms(campaign, user, req);
      case "CALL":
        return await this.voice(campaign, user);
      default:
        throw new NotFoundError("channel not found");
    }
  }

  private async email(campaign: CampaignDTO, user: any, req: Request) {
    const link = await Defaulter.generateDefaulterLink(user, req);
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

    await Store.hset(EMAIL_CAMPAIGN, "email_key", JSON.stringify(req.session));
    return email;
  }

  private async sms(campaign: CampaignDTO, user: any, req: Request) {
    const sms = await connect.SMS;

    const link = await Defaulter.generateDefaulterLink(user, req);
    const message = `${campaign.message}\n${link}`;

    const smsResponse = await sms.send({
      to: user.phone_number,
      message,
      from: process.env.sms_sender
    });

    await Store.hset(SMS_CAMPAIGN, "sms_key", JSON.stringify(req.session));
    return smsResponse;
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

  protected async facebook(req: Request, query: DefaulterQuery, campaign: CampaignDTO) {
    const { audience_id } = await Proxy.createCustomAudience(campaign);
    return await Proxy.uploadCustomFile(req, query, audience_id);
  }
}

export const CampaignServ = new CampaignService();
