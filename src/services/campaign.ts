import AdapterInstance from "@app/server/adapter/mail";
import { CampaignDTO } from "@app/data/campaign";
import { User } from "@app/data/user";
import Africastalking from "africastalking";
import dotenv from "dotenv";
import { NotFoundError } from "@app/data/util";

dotenv.config();

class CampaignService {
  async send(campaign: CampaignDTO, user: any) {
    switch (campaign.channel) {
      case "EMAIL":
        return await this.email(campaign, user);
      case "SMS":
        return await this.sms(campaign, user);
      default:
        return new NotFoundError("channel not found");
    }
  }

  private async email(campaign: CampaignDTO, user: any) {
    AdapterInstance.send({
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
    const sms = Africastalking({
      apiKey: process.env.sms_api_key,
      username: process.env.sms_username,
      enqueue: true
    }).SMS;

    return await sms.send({
      to: user.phone_number, 
      message: campaign.message,
      from: process.env.sms_sender
    });
  }
}

export const CampaignServ = new CampaignService();
