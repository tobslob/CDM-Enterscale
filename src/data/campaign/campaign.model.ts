import { Model } from "@random-guys/bucket";
import { Frequency } from "@app/services/scheduler";
import { SubType, CustomAudienceType } from "@app/services/proxy";
import { PaginationQuery } from "../util";
import { Gender } from "../user";

export const channel = <const>["FACEBOOK", "TWITTER", "EMAIL", "SMS", "INSTAGRAM", "CALL"];
export type Channel = typeof channel[number];

export const status = <const>["START", "STOP"];
export type Status = typeof status[number];

export enum CampaignType {
  STANDARD = "standard",
  AQUISITION = "acquisition"
}

export interface AgeGroup {
  from: number;
  to: number;
}

export interface BodyCampaignType{
  type: CampaignType;
}

export interface Action {
  schedule: boolean;
  right_away: boolean;
}

export interface Campaign extends Model {
  name?: string;
  subject?: string;
  description?: string;
  channel: Channel;
  amount?: number;
  frequency?: Frequency;
  start_date?: Date;
  end_date?: Date;
  sent_date?: Date
  /**
   * batch_id from uploaded files
   */
  target_audience: string[];
  location?: string;
  message: string;
  user: string;
  workspace: string;
  workspace_name: string;
  status?: Status;
  sent?: boolean;
  organisation?: string;
  subtype?: SubType;
  customer_file_source?: CustomAudienceType;
  short_link?: boolean;
  campaign_type: CampaignType;
  gender: Gender;
  age: AgeGroup;
  percentage_to_send_to: number;
  template_id?: string;
  delivery_time: number;
  time_zone?: string;
  action: Action;
}

export interface CampaignDTO {
  name?: string;
  subject?: string;
  description?: string;
  channel?: Channel;
  amount?: number;
  frequency?: Frequency;
  start_date?: Date;
  end_date?: Date;
  target_audience?: string[];
  location?: string;
  message?: string;
  organisation?: string;
  subtype?: SubType;
  customer_file_source?: CustomAudienceType;
  short_link?: boolean;
  campaign_type: CampaignType;
  gender: Gender;
  age: AgeGroup;
  percentage_to_send_to: number;
  template_id?: string;
  delivery_time: number;
  time_zone?: string;
  action: Action;
}

export interface CampaignQuery extends PaginationQuery {
  id?: string;
  name?: string;
  subject?: string;
  frequency?: Frequency;
  from?: Date;
  to?: Date;
  organisation?: string;
  channel?: Channel;
  description?: string;
}
