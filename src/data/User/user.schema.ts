import { Schema } from "mongoose";
import { trimmedLowercaseString, trimmedString } from "@random-guys/bucket";

export const UserSchema = new Schema({
  first_name: { ...trimmedString, required: true, index: true },
  last_name: { ...trimmedString, required: true, index: true },
  password: { ...trimmedString, required: true },
  email_address: { ...trimmedLowercaseString, required: true, index: true, unique: true },
  phone_number: { ...trimmedString, required: true, index: true },
  role_id: { ...trimmedString, required: true, index: true },
  role_name: { ...trimmedString, required: true, index: true },
  workspace: { ...trimmedString, required: true, index: true }
});