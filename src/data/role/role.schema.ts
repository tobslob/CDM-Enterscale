import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { SchemaDefinition, SchemaTypes, Schema } from "mongoose";
import { uuid } from "@app/data/util";

const PermissionSchema: SchemaDefinition = {
  super_admin: { type: SchemaTypes.Boolean, index: true, default: false },
  loan_admin: { type: SchemaTypes.Boolean, index: true, default: false },
  users: { type: SchemaTypes.Boolean, index: true, default: false }
};

export const RoleSchema = new Schema(
  {
    _id: { ...uuid },
    name: { ...trimmedString, required: true, index: true },
    description: trimmedString,
    permissions: PermissionSchema,
    workspace: { ...trimmedString, required: true, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
