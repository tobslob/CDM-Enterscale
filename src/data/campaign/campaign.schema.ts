import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";
import { uuid } from "@app/data/util";

export const CampaignSchema = new Schema(
  {
    _id: { ...uuid },
    name: { ...trimmedString, required: true, index: true, unique: true },
    subject: { ...trimmedString, required: true, index: true },
    description: { ...trimmedString, required: true, index: true },
    channel: { ...trimmedString, required: true, index: true },
    amount: { type: SchemaTypes.Number, required: true, index: true },
    frequency: { ...trimmedString, index: true },
    start_date: { type: SchemaTypes.Date, index: true },
    end_date: { type: SchemaTypes.Date, index: true },
    target_audience: { ...trimmedString, index: true },
    message: { ...trimmedString, required: true, index: true },
    user: { ...trimmedString, required: true, index: true },
    workspace: { ...trimmedString, index: true },
    status: { ...trimmedString, index: true, default: "STOP" },
    sent: { type: SchemaTypes.Boolean, required: true, index: true, default: false }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
