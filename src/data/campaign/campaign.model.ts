import { Model } from "@random-guys/bucket";
import { Frequency } from "@app/services/scheduler";
import { SubType, CustomAudienceType } from "@app/services/proxy";

const channel = <const>["FACEBOOK", "TWITTER", "EMAIL", "SMS", "INSTAGRAM"]
export type Channel = typeof channel[number]

const status = <const>["START", "STOP"]
export type Status = typeof status[number]

export interface Campaign extends Model {
  name?: string;
  subject?: string;
  description?: string;
  channel: Channel;
  amount?: number;
  frequency?: Frequency;
  start_date?: Date;
  end_date?: Date;
  /**
   * request_id from uploaded file
   */
  target_audience: string;
  message: string;
  user: string;
  workspace: string;
  workspace_name: string;
  status?: Status;
  sent?: boolean;
  organisation?: string;
  subtype?: SubType;
  customer_file_source?: CustomAudienceType;
}

export interface CampaignDTO {
  name?: string;
  subject?: string;
  description?: string;
  channel: Channel;
  amount?: number;
  frequency?: Frequency;
  start_date?: Date;
  end_date?: Date;
  target_audience: string;
  message: string;
  organisation?: string;
  subtype?: SubType;
  customer_file_source?: CustomAudienceType;
}
