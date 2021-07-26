import { SMSReportRepo, SMSReportQuery } from "@app/data/sms";
import { EmailReportRepo } from "@app/data/email-report";
import { VoiceRepo, VoiceReportQuery } from "@app/data/voice";
import { ConstraintError } from "@random-guys/siber";
import { Channel } from "@app/data/campaign";

export interface ReportsQuery {
  channel: Channel
  campaign_id: string;
}

class ReportsService {
  async getReport(workspace: string, query: ReportsQuery) {
    switch (query.channel) {
      case "SMS":
        return await this.smsReports(workspace, { campaign_id: query.campaign_id });
      case "EMAIL":
        return await this.emailReports(workspace, { campaign_id: query.campaign_id });
      case "VOICE":
        return await this.voiceReports(workspace, { campaign_id: query.campaign_id });
      default:
        throw new ConstraintError("Invalid report type query.");
    }
  }

  async smsReports(workspace: string, query: SMSReportQuery) {
    const smsReports =  await SMSReportRepo.searchSmsReports(workspace, query);

    let total_delivered = 0;
    let total_clicks = "N/A";
    let conversion_rate = "N/A";

    smsReports.map(report => {
      if(report.status == "delivered" || report.status == "accepted" || report.status == "sent") {
        return total_delivered ++;
      }
    })

    let total_sent = smsReports.length
    return {
      smsReports,
      total_sent,
      total_delivered,
      total_clicks,
      conversion_rate
    }
  }

  async emailReports(workspace: string, query: SMSReportQuery) {
    const emailReports = await EmailReportRepo.searchEmailReports(workspace, query);

    let total_delivered = 0;
    let total_clicks = "N/A";
    let conversion_rate = "N/A"

    emailReports.map(report => {
      if(report.event == "open" || report.event == "delivered") {
        return total_delivered ++;
      }
    })

    let total_sent = emailReports.length;
    return {
      emailReports,
      total_sent,
      total_delivered,
      total_clicks,
      conversion_rate
    }
  }

  async voiceReports(workspace: string, query: VoiceReportQuery) {
    const voiceReports = await VoiceRepo.searchVoiceReports(workspace, query);

    let total_delivered = 0;
    let total_clicks = "N/A";
    let conversion_rate = "N/A"

    voiceReports.map(report => {
      if(report.status == "accepted" || report.status == "success") {
        return total_delivered ++;
      }
    })

    let total_sent = voiceReports.length;
    return {
      voiceReports,
      total_sent,
      total_delivered,
      total_clicks,
      conversion_rate
    }
  }
}

export const Reports = new ReportsService();
