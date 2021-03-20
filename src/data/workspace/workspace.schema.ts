import { Schema } from "mongoose";
import { trimmedLowercaseString, trimmedString } from "@random-guys/bucket";
import { uuid } from "@app/data/util";

export const WorkspaceSchema = new Schema({
  _id: { ...uuid },
  name: { ...trimmedString, required: true, index: true, unique: true },
  address: { ...trimmedString, required: true, index: true },
  email_address: { ...trimmedLowercaseString, required: true, index: true, unique: true },
});