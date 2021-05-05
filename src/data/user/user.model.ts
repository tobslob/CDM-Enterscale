import { Model } from "@random-guys/bucket";
import { Permissions } from "@app/data/role";

export enum Gender {
  Male = "M",
  Female = "F"
}

/**
 * Model of a Enterscale user.
 */
export interface User extends Model {
  first_name: string;
  last_name: string;
  password: string;
  email_address: string;
  phone_number: string;
  DOB: Date;
  gender: Gender;
  location: string;
  role_id: string;
  role_name: string;
  workspace: string;
}

export interface UserDTO {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  DOB: Date;
  gender: Gender;
  location: string;
  permissions: Permissions;
}

export interface LoginDTO {
  email_address: string;
  password: string;
}

export interface PasswordDTO {
  old_password: string;
  new_password: string;
}

export interface ResetPasswordDTO {
  email_address: string;
}

export interface Session {
  email_address: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  token?: string;
  user: string;
  role: string;
  permissions: Permissions;
  workspace: string;
}
