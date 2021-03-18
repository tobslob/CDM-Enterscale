import { Model } from "@random-guys/bucket";

export interface Defaulters extends Model {
  total_loan_amount: number;
  loan_outstanding_balance: number;
  loan_tenure: number;
  time_since_default: number;
  time_since_last_payment: number;
  last_contacted_date: Date;
  BVN: string;
  workspace: string;
  user: string;
  request_id: string;
  role_id: string;
}

export interface DefaulterDTO {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  total_loan_amount: number;
  loan_outstanding_balance: number;
  loan_tenure: number;
  time_since_default: number;
  time_since_last_payment: number;
  last_contacted_date: Date;
  BVN: string;
  request_id?: string;
}
