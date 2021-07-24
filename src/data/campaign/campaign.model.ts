import { Model } from "@random-guys/bucket";
import { Frequency } from "@app/services/scheduler";
import { SubType, CustomFileSource } from "@app/services/proxy";
import { PaginationQuery } from "../util";
import { Gender } from "../user";

export const channel = <const>["FACEBOOK", "TWITTER", "EMAIL", "SMS", "INSTAGRAM", "VOICE"];
export type Channel = typeof channel[number];

export const status = <const>["START", "STOP"];
export type Status = typeof status[number];

export const state = <const>["CREATED", "ONGOING", "COMPLETED"];
export type State = typeof state[number];

export enum CampaignType {
  ENGAGEMENT = "engagement",
  AQUISITION = "acquisition"
}

export enum FileType {
  JSON = "json",
  CSV = "csv",
  XLSX = "xlsx"
}

export interface AgeGroup {
  from: number;
  to: number;
}

export interface BodyCampaignType {
  campaign_type: CampaignType;
}

export interface Campaign extends Model {
  name?: string;
  subject?: string;
  description: string;
  channel: Channel;
  frequency?: Frequency;
  start_date?: Date;
  end_date?: Date;
  sent_date?: Date;
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
  subtype?: SubType;
  customer_file_source?: CustomFileSource;
  short_link?: boolean;
  campaign_type: CampaignType;
  gender: Gender[];
  age: AgeGroup;
  percentage_to_send_to: number;
  template_identifier?: string;
  delivery_time: string[];
  schedule: boolean;
  video_url?: string;
  brand_logo?: string;
  hero_image?: string;
  audio_url?: string;
  state: State;
}

export interface CampaignDTO {
  name?: string;
  subject?: string;
  description: string;
  channel?: Channel;
  frequency?: Frequency;
  start_date?: Date;
  end_date?: Date;
  target_audience?: string[];
  location?: string;
  message?: string;
  subtype?: SubType;
  customer_file_source?: CustomFileSource;
  short_link?: boolean;
  campaign_type: CampaignType;
  gender?: Gender[];
  age?: AgeGroup;
  percentage_to_send_to: number;
  template_identifier?: string;
  delivery_time: string[];
  time_zone?: string;
  schedule: boolean;
  video_url?: string;
  brand_logo?: string;
  hero_image?: string;
  audio_url?: string;
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
  state?: State;
}

export interface GetCampaignQuery {
  file_type: FileType
}
