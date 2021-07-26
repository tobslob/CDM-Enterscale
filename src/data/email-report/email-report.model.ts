import { Model } from "@random-guys/bucket";

export const event = <const>[
  "open",
  "click",
  "spamreport",
  "unsubscribe",
  "group_unsubscribe",
  "group_resubscribe",
  "blocked",
  "bounce",
  "deferred",
  "delivered",
  "dropped",
  "processed"
];
export type Event = typeof event[number];

export interface EmailReports extends Model {
  email: string;
  timestamp?: Date;
  "smtp-id"?: string;
  event?: Event;
  category?: string;
  sg_event_id?: string;
  sg_message_id?: string;
  useragent?: string;
  ip?: string;
  url?: string;
  asm_group_id?: number;
  response?: string;
  reason?: string;
  workspace: string;
  campaign_id: string;
}

export interface EmailReportsDTO {
  email: string;
  timestamp?: any;
  "smtp-id"?: string;
  event?: Event;
  category?: string;
  sg_event_id?: string;
  sg_message_id?: string;
  useragent?: string;
  ip?: string;
  url?: string;
  asm_group_id?: number;
  response?: string;
  reason?: string;
  campaign_id?: string
}

export interface EmailReportsQuery {
  campaign_id?: string;
  email?: string;
  timestamp?: Date;
  event?: Event;
  category?: string;
  useragent?: string;
  ip?: string;
  url?: string;
  response?: string;
  reason?: string;
  limit?: number;
  offset?: number;
}
