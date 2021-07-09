import { Voice } from "../voice";

const status = <const>["sent", "delivered", "undelivered", "rejected", "received", "failed"];
export type SMSStatus = typeof status[number];

export interface SMSReports extends Voice {
  to?: string;
  from?: string;
  body?: string;
  url_access_time?: string;
  status: SMSStatus;
}

export interface SMSReportsDTO {
  callback_url?: string;
  call_id?: string;
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
  phoneNumber?: string;
  status?: SMSStatus;
  limit?: number;
  offset?: number;
}
