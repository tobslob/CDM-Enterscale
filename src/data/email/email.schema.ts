import { Schema } from "mongoose";
import { trimmedString, readMapper, timestamps, uuid, trimmedLowercaseString } from "../util";

export const EmailTrackerSchema = new Schema(
  {
    _id: { ...uuid },
    campaign_id: { ...trimmedString, required: true, index: true },
    message_id: { ...trimmedLowercaseString, required: true, index: true },
    workspace: { ...trimmedString, required: true, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
