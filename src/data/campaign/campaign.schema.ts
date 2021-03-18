import { trimmedString } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";

export const CampaignSchema = new Schema({
  campaign_name: { ...trimmedString, required: true, index: true, unique: true },
  channel: { ...trimmedString, required: true, index: true },
  amount: { type: SchemaTypes.Number, required: true, index: true },
  frequency: { type: SchemaTypes.Number, required: true, index: true },
  start_date: { type: SchemaTypes.Date, required: true, index: true },
  end_date: { type: SchemaTypes.Date, required: true, index: true },
  target_audience: { ...trimmedString, index: true },
  message: { ...trimmedString, required: true, index: true },
  user: { ...trimmedString, required: true, index: true },
  workspace: { ...trimmedString, index: true }
});
