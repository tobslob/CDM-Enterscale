import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";
import { uuid } from "@app/data/util";

const CustomerSchema = {
  customer_id: { type: SchemaTypes.Number, index: true },
  name: { ...trimmedString, index: true },
  phone_number: { ...trimmedString, index: true },
  email: { ...trimmedString, index: true },
  created_at: { type: SchemaTypes.Date, index: true }
};

const CardSchema = {
  first_6digits: { ...trimmedString, index: true },
  last_4digits: { ...trimmedString, index: true },
  issuer: { ...trimmedString, index: true },
  country: { ...trimmedString, index: true },
  type: { ...trimmedString, index: true },
  expiry: { ...trimmedString, index: true }
};

const PaymentDateSchema = {
  _id: { ...uuid },
  payment_id: { type: SchemaTypes.Number, index: true },
  tx_ref: { ...trimmedString, index: true },
  flw_ref: { ...trimmedString, index: true },
  device_fingerprint: { ...trimmedString, index: true },
  amount: { type: SchemaTypes.Number, index: true },
  currency: { ...trimmedString, index: true },
  charged_amount: { type: SchemaTypes.Number, index: true },
  app_fee: { type: SchemaTypes.Number, index: true },
  merchant_fee: { type: SchemaTypes.Number, index: true },
  processor_response: { ...trimmedString, index: true },
  auth_model: { ...trimmedString, index: true },
  ip: { ...trimmedString, index: true },
  narration: { ...trimmedString, index: true },
  status: { ...trimmedString, index: true },
  payment_type: { ...trimmedString, index: true },
  created_at: { type: SchemaTypes.Date, index: true },
  account_id: { type: SchemaTypes.Number, index: true },
  customer: CustomerSchema,
  card: CardSchema
};

export const PaymentSchema = new Schema(
  {
    event: { ...trimmedString, index: true },
    data: PaymentDateSchema
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
