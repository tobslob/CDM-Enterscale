import { Model } from "@random-guys/bucket";

export interface AuditLog extends Model {
  user_id?: string;
  user_name?: string;
  workspace: string;
  role_id?: string;
  role_name?: string;
  activity: string;
  object_id?: string;
  message: string;
  ip_address?: string | string[];
  channel?: string;
}

export interface AuditLogDTO {
  activity: string;
  message: string;
  object_id?: string;
  // ip_address?: string | string[];
  channel?: string;
}
