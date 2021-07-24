import { Schema } from "mongoose";
import { trimmedString, readMapper, timestamps, uuid } from "../util";

export const EmailTrackerSchema = new Schema(
  {
    _id: { ...uuid },
    email_id: { ...trimmedString, required: true, index: true },
    message_id: { ...trimmedString, required: true, index: true },
    workspace: { ...trimmedString, required: true, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
