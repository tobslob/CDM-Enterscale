import { Model } from "../database";
import { Permissions } from "@app/data/role/role.model"

/**
 * Model of a Enterscale user.
 */
export interface User extends Model {
  first_name: string;
  last_name: string;
  password: string;
  email_address: string;
  phone_number: string;
  role_id: string;
  role_name: string;
  workspace: string;
}

export interface UserDTO {
  first_name: string;
  last_name: string;
  password: string;
  email_address: string;
  phone_number: string;
  role_id: string;
}

export interface LoginDTO {
  email_address: string;
  password: string;
}

export interface Session {
  email_address: string;
  first_name: string;
  last_name: string;
  token?: string;
  user: string;
  role: string;
  permissions: Permissions;
  workspace: string;
}
