import { Schema } from "mongoose";
import { trimmedLowercaseString, trimmedString, readMapper, timestamps, uuid } from "../util";

export const AuditLogSchema = new Schema(
  {
    _id: { ...uuid },
    user_id: { ...trimmedLowercaseString, required: true, index: true },
    user_name: { ...trimmedLowercaseString, required: true, index: true },
    workspace: { ...trimmedLowercaseString, required: true, index: true },
    role_id: { ...trimmedLowercaseString, required: true, index: true },
    role_name: { ...trimmedString, required: true, index: true },
    activity: { ...trimmedLowercaseString, required: true, index: true },
    object_id: { ...trimmedLowercaseString, index: true },
    message: { ...trimmedString, required: true },
    ip_address: { ...trimmedLowercaseString, index: true },
    channel: { ...trimmedLowercaseString, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
