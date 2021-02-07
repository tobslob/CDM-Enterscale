import { Model } from "@app/data/database";

export interface Permissions {
  super_administrator: boolean;
  loan_administrator: boolean;
  users: boolean;
}

export interface Role extends Model {
  name: string;
  description: string;
  permissions: Permissions;
  workspace: string;
}

export interface RoleDTO {
  name: string;
  description: string;
  permissions?: Permissions;
}
