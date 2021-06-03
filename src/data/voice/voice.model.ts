import { Model } from "@random-guys/bucket";

export interface Voice extends Model {
  callback_url?: string;
  call_id?: string;
  ref_id?: string;
  recipient?: string;
  caller_id?: string;
  status?: string;
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
