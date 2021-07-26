import { Model } from "@random-guys/bucket";

const status = <const>["accepted", "failed", "queued", "success", "rejected"];
type VStatus = typeof status[number];

export interface Voice extends Model {
  callback_url?: string;
  campaign_id?: string;
  ref_id?: string;
  recipient?: string;
  caller_id?: string;
  status?: VStatus;
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

export interface VoiceReportQuery {
  campaign_id?: string;
  recipient?: string;
  status?: VStatus;
  limit?: number;
  offset?: number;
}
