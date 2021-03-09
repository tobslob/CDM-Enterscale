import { trimmedString } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";

export const DefaulterSchema = new Schema({
  total_loan_amount: { type: SchemaTypes.Number, required: true, index: true},
  loan_outstanding_balance: { type: SchemaTypes.Number, required: true, index: true},
  loan_tenure: { type: SchemaTypes.Number, required: true, index: true},
  time_since_default: { type: SchemaTypes.Number, required: true, index: true},
  time_since_last_payment: { type: SchemaTypes.Number, required: true, index: true},
  last_contacted_date: { type: SchemaTypes.Date, required: true, index: true},
  BVN: { ...trimmedString, index: true, unique: true},
  workspace: { ...trimmedString, required: true, index: true},
  user: { ...trimmedString, required: true, index: true},
  request_token: { ...trimmedString, index: true },
  role_id: { ...trimmedString, index: true }
});
