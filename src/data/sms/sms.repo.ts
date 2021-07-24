import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { SMSReports, SMSReportsDTO, SMSReportQuery } from "./sms.model";
import { SMSReportsSchema } from "./sms.schema";
import { fromQueryMap } from "../util";

export class SMSReportRepository extends BaseRepository<SMSReports> {
  constructor() {
    super(mongoose.connection, "SMSReport", SMSReportsSchema);
  }

  async smsReport(workspace: string, report: SMSReportsDTO) {
    return this.create({
      callback_url: report.callback_url,
      call_id: report.call_id,
      ref_id: report.ref_id,
      recipient: report.recipient,
      price: report.price,
      account_balance: report.account_balance,
      error_code: report.error_code,
      error_reason: report.error_reason,
      event_timestamp: report.event_timestamp,
      timestamp: report.timestamp,
      api_token: report.api_token,
      to: report.to,
      from: report.from,
      body: report.body,
      url_access_time: report.url_access_time,
      status: report.status,
      workspace
    });
  }

  async searchSmsReports(workspace: string, query?: SMSReportQuery) {
    let conditions = fromQueryMap(query, {
      phoneNumber: { phoneNumber: query.phoneNumber },
      status: { status: query.status }
    });

    conditions = {
      ...conditions,
      workspace
    };

    const limit = Number(query.limit);
    const offset = Number(query.offset);

    return new Promise<SMSReports[]>((resolve, reject) => {
      let directQuery = this.model.find(conditions).skip(offset).sort({ created_at: -1 });

      if (query.limit !== 0) {
        directQuery = directQuery.limit(limit);
      }

      return directQuery.exec((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

export const SMSReportRepo = new SMSReportRepository();
