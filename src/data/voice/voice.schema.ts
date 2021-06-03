import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { Schema } from "mongoose";
import { uuid } from "@app/data/util";

export const VoiceSchema = new Schema(
  {
    _id: { ...uuid },
    callback_url: { ...trimmedString, index: true },
    call_id: { ...trimmedString, index: true },
    ref_id: { ...trimmedString, index: true },
    recipient: { ...trimmedString, index: true },
    caller_id: { ...trimmedString, index: true },
    status: { ...trimmedString, index: true },
    price: { ...trimmedString, index: true },
    account_balance: { ...trimmedString, index: true },
    error_code: { ...trimmedString, index: true },
    error_reason: { ...trimmedString, index: true },
    call_start_time: { ...trimmedString, index: true },
    call_end_time: { ...trimmedString, index: true },
    call_connect_time: { ...trimmedString, index: true },
    media_duration: { ...trimmedString, index: true },
    key_pressed: { ...trimmedString, index: true },
    media_url: { ...trimmedString, index: true },
    workspace: { ...trimmedString, index: true },
    api_token: { ...trimmedString, index: true },
    event_timestamp: { ...trimmedString, index: true },
    queued: { ...trimmedString, index: true },
    timestamp: { ...trimmedString, index: true },
    cmd: { ...trimmedString, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
