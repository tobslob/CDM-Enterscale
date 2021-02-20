import { Schema } from "mongoose";
import { trimmedLowercaseString, trimmedString } from "@random-guys/bucket";

export const WorkspaceSchema = new Schema({
  name: { ...trimmedString, required: true, index: true, unique: true },
  address: { ...trimmedString, required: true, index: true },
  email_address: { ...trimmedLowercaseString, required: true, index: true, unique: true },
});