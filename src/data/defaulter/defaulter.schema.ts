import { trimmedString, readMapper, timestamps, trimmedLowercaseString } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";

const DefaultUserSchema = new Schema({
  first_name: { ...trimmedString, index: true },
  last_name: { ...trimmedString, index: true },
  email_address: { ...trimmedLowercaseString, required: true, unique: true, index: true },
  phone_number: { ...trimmedString, required: true, index: true },
  DOB: { type: SchemaTypes.Date, required: true, index: true },
  age: { type: SchemaTypes.Number, required: true, index: true }, 
  gender: { ...trimmedString, required: true, index: true },
  location: { ...trimmedString, required: true, index: true },
  loan_id: { type: SchemaTypes.Number, index: true },
  actual_disbursement_date: { type: SchemaTypes.Date, index: true },
  is_first_loan: { type: SchemaTypes.Boolean, index: true },
  loan_amount: { type: SchemaTypes.Number, index: true },
  loan_tenure: { type: SchemaTypes.Number, index: true },
  days_in_default: { type: SchemaTypes.Number, index: true },
  amount_repaid: { type: SchemaTypes.Number, index: true },
  amount_outstanding: { type: SchemaTypes.Number, index: true },
  status: { ...trimmedString, index: true }
}, { _id: false });

export const DefaultersSchema = new Schema(
  {
    title: { ...trimmedString, required: true, unique: true, index: true },
    batch_id: { ...trimmedString, required: true, index: true },
    upload_type: { ...trimmedString, index: true },
    workspace: { ...trimmedString, required: true, index: true },
    users: { type: [DefaultUserSchema], required: true}
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
