import { Defaulters } from "@app/data/defaulter";
import AdapterInstance from "@app/server/adapter/mail";
import { UserRepo } from "@app/data/user";
import { Campaign } from "@app/data/campaign";

class CampaignService {
  async send(champaign: Campaign, defaulter: Defaulters) {
    switch (champaign.channel) {
      case "EMAIL":
        await this.emailCampaign(defaulter, champaign);
    }
  }

  async emailCampaign(defaulter: Defaulters, champaign: Campaign) {
    const user = await UserRepo.byID(defaulter.user)
    AdapterInstance.send({
      subject: champaign.subject,
      channel: "mail",
      recipient: user.email_address,
      template: "email-template",
      template_vars: {
        firstname: user.first_name,
        emailaddress: user.email_address,
        subject: champaign.subject,
        message: champaign.message,
      }
    });
  }
}

export const campaignService = new CampaignService();
