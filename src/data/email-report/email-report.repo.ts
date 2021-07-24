import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { EmailReports, EmailReportsQuery, EmailReportsDTO } from "./email-report.model";
import { EmailReportsSchema } from "./email-report.schema";
import { fromQueryMap } from "../util";

export class EmailReportRepository extends BaseRepository<EmailReports> {
  constructor() {
    super(mongoose.connection, "EmailReport", EmailReportsSchema);
  }

  async emailReport(workspace: string, report: EmailReportsDTO) {
    return this.create({
      email: report.email,
      timestamp: report.timestamp,
      "smtp-id": report["smtp-id"],
      event: report.event,
      category: report.category,
      sg_event_id: report.sg_event_id,
      sg_message_id: report.sg_message_id,
      useragent: report.useragent,
      ip: report.ip,
      url: report.url,
      asm_group_id: report.asm_group_id,
      response: report.response,
      reason: report.reason,
      workspace,
      email_id: report.email_id
    });
  }

  async searchEmailReports(workspace: string, query: EmailReportsQuery) {
    let conditions = fromQueryMap(query, {
      email: { email: query.email },
      timestamp: { timestamp: query.timestamp },
      event: { event: query.event },
      category: { category: query.category },
      useragent: { useragent: query.useragent },
      ip: { ip: query.ip },
      url: { url: query.url },
      response: { response: query.url },
      reason: { reason: query.reason }
    });

    conditions = {
      workspace,
      ...conditions
    };

    const limit = Number(query.limit);
    const offset = Number(query.offset);

    return new Promise<EmailReports[]>((resolve, reject) => {
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

export const EmailReportRepo = new EmailReportRepository();
