import { SchemaFactory } from "../database";
import { trimmedLowercaseString, trimmedString } from "../util/schema";

export const WorkspaceSchema = SchemaFactory({
  name: { ...trimmedString, required: true, index: true, unique: true },
  address: { ...trimmedString, required: true, index: true },
  email_address: { ...trimmedLowercaseString, required: true, index: true, unique: true },
});