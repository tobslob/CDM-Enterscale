import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { Schema } from "mongoose";
import { uuid } from "@app/data/util";

export const VoiceSchema = new Schema(
  {
    _id: { ...uuid },
    ref_id: { ...trimmedString, index: true },
    recipient: { ...trimmedString, index: true },
    caller_id: { ...trimmedString, index: true },
    status: { ...trimmedString, index: true },
    price: { ...trimmedString, index: true },
    balance: { ...trimmedString, index: true },
    error_code: { ...trimmedString, index: true },
    error_reason: { ...trimmedString, index: true },
    call_start_time: { ...trimmedString, index: true },
    call_end_time: { ...trimmedString, index: true },
    call_connect_time: { ...trimmedString, index: true },
    media_duration: { ...trimmedString, index: true },
    key_pressed: { ...trimmedString, index: true },
    media_url: { ...trimmedString, index: true },
    workspace: { ...trimmedString, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
