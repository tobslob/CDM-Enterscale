import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { AuditLogSchema } from "./audit-log.schema";
import { AuditLog, AuditLogDTO } from "./audit-log.model";
import { UserRepo } from "../user";
import { Request } from "express";


export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor() {
    super(mongoose.connection, "AuditLog", AuditLogSchema);
  }

  async saveLog(req: Request, log: AuditLogDTO) {

    const user = await UserRepo.byID(req.session.user)
    return this.create({
      user_id: user.id,
      user_name: `${user.first_name} ${user.last_name}`,
      workspace: log.workspace,
      role_id: user.role_id,
      role_name: user.role_name,
      activity: log.activity,
      object_id: log.object_id,
      message: log.message,
      ip_address: log.ip_address,
      channel: log.channel,
      status: log.status
    });
  }
}

export const AuditLogRepo = new AuditLogRepository();
