import { Schema, SchemaTypes } from "mongoose";
import { trimmedLowercaseString, trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { uuid } from "@app/data/util";

export const UserSchema = new Schema(
  {
    _id: { ...uuid },
    first_name: { ...trimmedString, required: true, index: true },
    last_name: { ...trimmedString, required: true, index: true },
    password: { ...trimmedString, required: true },
    email_address: { ...trimmedLowercaseString, required: true, index: true },
    phone_number: { ...trimmedString, required: true, index: true },
    DOB: { type: SchemaTypes.Date, index: true },
    gender: { ...trimmedString, index: true },
    location: { ...trimmedString, index: true },
    role_id: { ...trimmedString, required: true, index: true },
    role_name: { ...trimmedString, required: true, index: true },
    workspace: { ...trimmedString, required: true, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
