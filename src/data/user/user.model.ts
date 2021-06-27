import { Model } from "@random-guys/bucket";
import { Permissions } from "@app/data/role";
import { StatusType } from "../defaulter";

export enum Gender {
  Male = "M",
  Female = "F",
  NonBinary = "N",
  Other = "o"
}

export interface MooyiUser {
  first_name: string;
  last_name: string;
  password?: string;
  email_address: string;
  phone_number: string;
  DOB: Date;
  age?: number;
  gender: Gender;
  location: string;
}

/**
 * Model of a Enterscale user.
 */
export interface User extends MooyiUser, Model {
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
  role_id?: string;
  permissions?: Permissions;
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

export interface SessionRequest {
  user: string;
  title?: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  DOB: Date;
  gender: Gender;
  location: string;
  loan_id: number;
  actual_disbursement_date: Date;
  is_first_loan: boolean;
  loan_amount: number;
  loan_tenure: number;
  days_in_default: number;
  amount_repaid: number;
  amount_outstanding: number;
  batch_id?: string;
  status: StatusType;
}

export interface SessionRequestWithToken {
  request: SessionRequest;
  token: string;
}
