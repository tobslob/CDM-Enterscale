import { SchemaFactory } from "@app/data/database";
import { SchemaDefinition, SchemaTypes } from "mongoose";
import { trimmedString } from "@app/data/util";

const PermissionSchema: SchemaDefinition = {
  super_admin: { type: SchemaTypes.Boolean, index: true, default: false },
  loan_admin: { type: SchemaTypes.Boolean, index: true, default: false },
  users: { type: SchemaTypes.Boolean, index: true, default: false }
};

export const RoleSchema = SchemaFactory({
  name: { ...trimmedString, required: true, index: true },
  description: trimmedString,
  permissions: PermissionSchema,
  workspace: { ...trimmedString, required: true, index: true }
});
