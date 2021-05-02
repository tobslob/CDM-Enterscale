import { Schema, SchemaTypes } from "mongoose";
import { trimmedLowercaseString, trimmedString, readMapper, timestamps, uuid } from "../util";

export const SMSReportsSchema = new Schema(
  {
    _id: { ...uuid },
    sms_id: { ...trimmedLowercaseString, required: true, index: true },
    phoneNumber: { ...trimmedLowercaseString, index: true },
    networkCode: { ...trimmedLowercaseString, index: true },
    network: { ...trimmedLowercaseString, index: true },
    failureReason: { ...trimmedString, index: true },
    retryCount: { type: SchemaTypes.Number, index: true },
    status: { ...trimmedLowercaseString, index: true },
    workspace: { ...trimmedString, required: true, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
