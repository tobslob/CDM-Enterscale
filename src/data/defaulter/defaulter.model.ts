import { PaginationQuery } from "../util";
import { MooyiUser, Gender } from "../user";
import { Model } from "@random-guys/bucket";
import { CampaignType } from "../campaign";
import { SubType, CustomFileSource } from "@app/services/proxy";

export const status = <const>["owing", "paid"];
export type StatusType = typeof status[number];


export interface defaultUser extends MooyiUser {
  loan_id?: number;
  actual_disbursement_date?: Date;
  is_first_loan?: boolean;
  loan_amount?: number;
  loan_tenure?: number;
  days_in_default?: number;
  amount_repaid?: number;
  amount_outstanding?: number;
  status?: StatusType;
}

export interface Defaulter extends Model {
  title: string;
  batch_id: string;
  upload_type: CampaignType;
  workspace: string;
  users: defaultUser[];
}

export interface DefaulterDTO {
  title: string;
  batch_id?: string;
  upload_type: CampaignType;
  users: defaultUser[];
}

export interface DefaulterQuery extends PaginationQuery {
  id?: string[];
  batch_id?: string[];
  title?: string;
  upload_type?: CampaignType;
  location?: string;
  gender?: Gender[];
  age?: {
    from?: number;
    to?: number;
  };
}

export interface FacebookAudienceDTO {
  name: string;
  subtype: SubType;
  description: string;
  customer_file_source: CustomFileSource,
}
