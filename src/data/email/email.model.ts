import { Model } from "@random-guys/bucket";

export interface EmailReports extends Model {
  email: string;
  timestamp?: string;
  "smtp-id"?: string;
  event?: string;
  category?: number;
  sg_event_id?: string;
  sg_message_id?: string;
  useragent?: string;
  ip?: string;
  url?: string;
  asm_group_id?: number;
  response?: string;
  reason?: string;
  workspace: string;
}

export interface EmailReportsDTO {
  email: string;
  timestamp?: string;
  "smtp-id"?: string;
  event?: string;
  category?: number;
  sg_event_id?: string;
  sg_message_id?: string;
  useragent?: string;
  ip?: string;
  url?: string;
  asm_group_id?: number;
  response?: string;
  reason?: string;
}
