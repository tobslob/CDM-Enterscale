import { trimmedString } from "@random-guys/bucket";
import { SchemaDefinition, SchemaTypes, Schema } from "mongoose";

const PermissionSchema: SchemaDefinition = {
  super_admin: { type: SchemaTypes.Boolean, index: true, default: false },
  loan_admin: { type: SchemaTypes.Boolean, index: true, default: false },
  users: { type: SchemaTypes.Boolean, index: true, default: false }
};

export const RoleSchema = new Schema({
  name: { ...trimmedString, required: true, index: true },
  description: trimmedString,
  permissions: PermissionSchema,
  workspace: { ...trimmedString, required: true, index: true }
});
