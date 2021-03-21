import AdapterInstance from "@app/server/adapter/mail";
import { Campaign } from "@app/data/campaign";
import { Proxy } from "@app/services/proxy";
import { User } from "@app/data/user";

class CampaignService {
  async send(campaign: Campaign, user: User) {
    switch (campaign.channel) {
      case "EMAIL":
        await this.email(campaign, user);
      case "SMS":
        await Proxy.sms(campaign, user);
    }
  }

  private async email(campaign: Campaign, user: User) {
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
}

export const CampaignServ = new CampaignService();
