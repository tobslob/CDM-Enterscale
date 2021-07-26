import { Model } from "@random-guys/bucket";

const status = <const>[
  "sent",
  "delivered",
  "undelivered",
  "rejected",
  "queued",
  "failed",
  "accepted",
  "dnd",
  "expired",
  "internal error",
  "expired"
];
export type SMSStatus = typeof status[number];

export interface SMSReports extends Model {
  to?: string;
  from?: string;
  body?: string;
  url_access_time?: string;
  status: SMSStatus;
  campaign_id?: string;
  callback_url?: string;
  ref_id?: string;
  recipient?: string;
  caller_id?: string;
  price?: string;
  account_balance?: string;
  error_code?: string;
  error_reason?: string;
  call_start_time?: string;
  call_end_time?: string;
  call_connect_time?: string;
  media_duration?: string;
  key_pressed?: string;
  media_url?: string;
  workspace?: string;
  event_timestamp?: string;
  queued?: string;
  timestamp?: string;
  api_token?: string;
  cmd?: string;
}

export interface SMSReportsDTO {
  callback_url?: string;
  id?: string;
  ref_id?: string;
  recipient?: string;
  caller_id?: string;
  price?: string;
  account_balance?: string;
  error_code?: string;
  error_reason?: string;
  media_duration?: string;
  workspace?: string;
  event_timestamp?: string;
  timestamp?: string;
  api_token?: string;
  cmd?: string;
  to?: string;
  from?: string;
  body?: string;
  url_access_time?: string;
  status: SMSStatus;
}

export interface SMSReportQuery {
  campaign_id: string;
  to?: string;
  status?: SMSStatus;
  limit?: number;
  offset?: number;
}
