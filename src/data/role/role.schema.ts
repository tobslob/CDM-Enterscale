import { SchemaFactory } from "@app/data/database";
import { SchemaDefinition, SchemaTypes } from "mongoose";
import { trimmedString } from "@app/data/util";

const PermissionSchema: SchemaDefinition = {
  super_admin: { type: SchemaTypes.Boolean, default: false },
  loan_admin: { type: SchemaTypes.Boolean, default: false },
  users: { type: SchemaTypes.Boolean, default: true }
};

export const RoleSchema = SchemaFactory({
  name: { ...trimmedString, required: true, index: { unique: true, background: false } },
  description: trimmedString,
  permissions: PermissionSchema,
  workspace: { ...trimmedString, required: true, index: true }
});
