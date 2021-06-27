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
    workspace_name: { ...trimmedString, index: true },
    status: { ...trimmedString, index: true, default: "STOP" },
    sent: { type: SchemaTypes.Boolean, index: true, default: false },
    organisation: { ...trimmedString, index: true },
    subtype: { ...trimmedString, index: true },
    customer_file_source: { ...trimmedString, index: true },
    short_link: { type: SchemaTypes.Boolean, index: true, default: false },
    campaign_type: { ...trimmedString, index: true },
    gender: { ...trimmedString, index: true },
    age: { type: SchemaTypes.Number, index: true },
    percentage_to_send_to: { type: SchemaTypes.Number, index: true },
    template_id: { ...trimmedString, index: true },
    delivery_time: { type: SchemaTypes.Number, index: true },
    time_zone: { type: SchemaTypes.Number, index: true },
    action: { ...trimmedString, index: true },
    location: { ...trimmedString, index: true },
    sent_date: { type: SchemaTypes.Date, index: true },
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
