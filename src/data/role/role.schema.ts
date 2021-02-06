import { SchemaFactory } from "@app/data/database";
import { SchemaDefinition, SchemaTypes } from "mongoose";
import { trimmedString } from "@app/data/util"

const PermissionSchema: SchemaDefinition = {
  super_administrator: { type: SchemaTypes.Boolean, default: false },
  loan_administrator: { type: SchemaTypes.Boolean, default: false }
};

export const RoleSchema = SchemaFactory({
  name: { ...trimmedString, required: true, index: { unique: true, background: false } },
  description: trimmedString,
  permissions: PermissionSchema,
  workspace: { ...trimmedString, required: true, index: true }
});
