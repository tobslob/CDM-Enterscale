import { Response } from "express";
import { Workbook } from "exceljs";
import { CampaignQuery, Campaign } from "@app/data/campaign";

class ExcelService {
  async campaignReport(query: CampaignQuery, campaign: Campaign, response: Response) {
    const workbook = new Workbook();
    workbook.creator = "Mooyi";
    workbook.created = new Date();
    // const sheet = workbook.addWorksheet("Campaign");

    if (campaign.channel === "SMS") {
      // const sms = searchSmsReports
      // sheet.columns =  [
      //   { header: "Time Stamp", key: "timestamp" },
      //   { header: "Phone Number", key: "to" },
      //   { header: "Status", key: "status" },
      // ];

      // sheet.addRows({
      //   timestamp: ,
      //   to: ,
      //   status: 
      // });
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
