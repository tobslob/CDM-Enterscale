import { Model } from "@random-guys/bucket";
import { PaginationQuery } from "../util";
import { Gender } from "../user";

export const status = <const>["part payment", "owning", "completed"];
export type StatusType = typeof status[number];

export interface Defaulters extends Model {
  title: string;
  loan_id: number;
  actual_disbursement_date: Date;
  is_first_loan: boolean;
  loan_amount: number;
  loan_tenure: number;
  days_in_default: number;
  amount_repaid: number;
  amount_outstanding: number;
  workspace: string;
  user: string;
  batch_id: string;
  role_id: string;
  status: StatusType;
}

export interface DefaulterDTO {
  title: string;
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

export interface DefaulterQuery extends PaginationQuery {
  id?: string[];
  batch_id?: string;
  title?: string;
  status: StatusType;
}
