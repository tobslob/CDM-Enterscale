import { Schema } from "mongoose";
import { trimmedLowercaseString, trimmedString, readMapper, timestamps, uuid } from "../util";

export const SMSReportsSchema = new Schema(
  {
    _id: { ...uuid },
    callback_url: { ...trimmedLowercaseString, index: true },
    call_id: { ...trimmedLowercaseString, index: true },
    ref_id: { ...trimmedLowercaseString, index: true },
    recipient: { ...trimmedLowercaseString, index: true },
    price: { ...trimmedLowercaseString, index: true },
    account_balance: { ...trimmedLowercaseString, index: true },
    error_code: { ...trimmedLowercaseString, index: true },
    error_reason: { ...trimmedLowercaseString, index: true },
    event_timestamp: { ...trimmedLowercaseString, index: true },
    timestamp: { ...trimmedLowercaseString, index: true },
    api_token: { ...trimmedLowercaseString, index: true },
    to: { ...trimmedLowercaseString, index: true },
    from: { ...trimmedLowercaseString, index: true },
    body: { ...trimmedLowercaseString, index: true },
    url_access_time: { ...trimmedLowercaseString, index: true },
    status: { ...trimmedLowercaseString, index: true },
    workspace: { ...trimmedString, required: true, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
