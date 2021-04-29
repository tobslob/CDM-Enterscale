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
      sms_id: report.id,
      phoneNumber: report.phoneNumber,
      networkCode: report.networkCode,
      failureReason: report.failureReason,
      retryCount: report.retryCount,
      status: report.status,
      workspace
    });
  }

  async searchSmsReports(workspace: string, query: SMSReportQuery) {
    let conditions = fromQueryMap(query, {
      phoneNumber: { phoneNumber: query.phoneNumber },
      networkCode: { networkCode: query.networkCode },
      failureReason: { failureReason: query.failureReason },
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
