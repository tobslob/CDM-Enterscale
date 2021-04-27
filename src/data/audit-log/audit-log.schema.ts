import { Schema } from "mongoose";
import { trimmedLowercaseString, trimmedString } from "../util";

export const AuditLogSchema = new Schema({
  user_id: { ...trimmedLowercaseString, required: true, index: true },
  workspace: { ...trimmedLowercaseString, required: true, index: true },
  role_id: { ...trimmedLowercaseString, required: true, index: true },
  role_name: { ...trimmedString, required: true, index: true },
  activity: { ...trimmedLowercaseString, required: true, index: true },
  object_id: { ...trimmedLowercaseString, required: true, index: true },
  message: { ...trimmedString, required: true },
  ip_address: { ...trimmedLowercaseString, required: true, index: true },
  channel: { ...trimmedLowercaseString, index: true },
  status: { ...trimmedLowercaseString, index: true },
});
