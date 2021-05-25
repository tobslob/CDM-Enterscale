import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";
import { uuid } from "@app/data/util";

export const DefaulterSchema = new Schema(
  {
    _id: { ...uuid },
    title: { ...trimmedString, required: true, index: true },
    loan_id: { type: SchemaTypes.Number, required: true, index: true },
    actual_disbursement_date: { type: SchemaTypes.Date, required: true, index: true },
    is_first_loan: { type: SchemaTypes.Boolean, required: true, index: true },
    loan_amount: { type: SchemaTypes.Number, required: true, index: true },
    loan_tenure: { type: SchemaTypes.Number, required: true, index: true },
    days_in_default: { type: SchemaTypes.Number, required: true, index: true },
    amount_repaid: { type: SchemaTypes.Number, required: true, index: true },
    amount_outstanding: { type: SchemaTypes.Number, required: true, index: true },
    workspace: { ...trimmedString, required: true, index: true },
    user: { ...trimmedString, required: true, unique: true, index: true },
    batch_id: { ...trimmedString, index: true },
    role_id: { ...trimmedString, index: true, required: true },
    status: { ...trimmedString, index: true, required: true, default: "owing" }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
