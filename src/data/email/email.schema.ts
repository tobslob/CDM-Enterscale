import { Schema } from "mongoose";
import { trimmedLowercaseString, trimmedString } from "../util";

export const EmailReportsSchema = new Schema({
  email: { ...trimmedLowercaseString, required: true, index: true },
  timestamp: { ...trimmedLowercaseString, index: true },
  "smtp-id": { ...trimmedString, index: true },
  event: { ...trimmedString, index: true },
  category: { ...trimmedString, index: true },
  sg_event_id: { ...trimmedLowercaseString, index: true },
  sg_message_id: { ...trimmedLowercaseString, index: true },
  useragent: { ...trimmedLowercaseString, index: true },
  ip: { ...trimmedString, index: true },
  url: { ...trimmedString, index: true },
  asm_group_id: { ...trimmedString, index: true },
  response: { ...trimmedLowercaseString, index: true },
  reason: { ...trimmedLowercaseString, index: true },
  workspace: { ...trimmedString, required: true, index: true }
});
