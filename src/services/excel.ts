import { Response } from "express";
import { Workbook } from "exceljs";
import { GetCampaignQuery, Campaign } from "@app/data/campaign";
import { SMSReportRepo } from "@app/data/sms";
import { VoiceRepo } from "@app/data/voice";
import { EmailReportRepo } from "@app/data/email-report";

class ExcelService {
  async campaignReport(query: GetCampaignQuery, campaign: Campaign, response: Response) {
    const workbook = new Workbook();
    workbook.creator = "Mooyi";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Campaign");

    if (campaign.channel === "SMS") {
      const smsReports = await SMSReportRepo.searchSmsReports(campaign.workspace, { campaign_id: campaign.id });
      sheet.columns = [
        { header: "Time Stamp", key: "timestamp" },
        { header: "Phone Number", key: "to" },
        { header: "Status", key: "status" },
        { header: "Reference ID", key: "ref_id" }
      ];

      sheet.addRows(
        smsReports.map(report => {
          return { timestamp: report.timestamp, to: report.to, status: report.status, ref_id: report.ref_id };
        })
      );
    }

    if (campaign.channel === "VOICE") {
      const voiceReports = await VoiceRepo.searchVoiceReports(campaign.workspace, { campaign_id: campaign.id });
      sheet.columns = [
        { header: "Time Stamp", key: "timestamp" },
        { header: "Recipient", key: "recipient" },
        { header: "Status", key: "status" },
        { header: "Reason", key: "error_reason" },
        { header: "Reference ID", key: "ref_id" }
      ];

      sheet.addRows(
        voiceReports.map(report => {
          return {
            timestamp: report.timestamp,
            to: report.recipient,
            status: report.status,
            error_reason: report.error_reason,
            ref_id: report.ref_id
          };
        })
      );
    }

    if (campaign.channel === "EMAIL") {
      const emailReports = await EmailReportRepo.searchEmailReports(campaign.workspace, { campaign_id: campaign.id });
      sheet.columns = [
        { header: "Time Stamp", key: "timestamp" },
        { header: "Recipient", key: "email" },
        { header: "Status", key: "event" },
        { header: "IP", key: "ip" },
        { header: "User Agent", key: "useragent" }
      ];

      sheet.addRows(
        emailReports.map(report => {
          return {
            timestamp: report.timestamp,
            email: report.email,
            event: report.event,
            ip: report.ip,
            useragent: report.useragent
          };
        })
      );
    }

    if (query.file_type === "csv") {
      return workbook.csv.write(response, {
        dateFormat: "DD-MMM-YYYY"
      });
    } else if (query.file_type === "xlsx") {
      return workbook.xlsx.write(response);
    }
  }
}

export const Excel = new ExcelService();
