import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { EmailReports, EmailReportsDTO } from "./email.model";
import { EmailReportsSchema } from "./email.schema";

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
      workspace
    });
  }
}

export const EmailReportRepo = new EmailReportRepository();
