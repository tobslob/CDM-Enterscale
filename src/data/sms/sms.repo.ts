import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { SMSReports, SMSReportsDTO } from "./sms.model";
import { SMSReportsSchema } from "./sms.schema";
import { Request } from "express";

export class SMSReportRepository extends BaseRepository<SMSReports> {
  constructor() {
    super(mongoose.connection, "SMSReport", SMSReportsSchema);
  }

  async smsReport(req: Request, report: SMSReportsDTO) {
    return this.create({
      sms_id: report.id,
      phoneNumber: report.phoneNumber,
      networkCode: report.networkCode,
      failureReason: report.failureReason,
      retryCount: report.retryCount,
      status: report.status,
      workspace: req.session.workspace
    });
  }
}

export const SMSReportRepo = new SMSReportRepository();
