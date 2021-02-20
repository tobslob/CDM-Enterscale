import { Model } from "@random-guys/bucket";

export interface Permissions {
  super_admin: boolean;
  loan_admin: boolean;
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
