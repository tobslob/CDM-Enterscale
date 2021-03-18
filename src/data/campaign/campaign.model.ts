import { Model } from "@random-guys/bucket";

export interface Campaign extends Model {
  campaign_name: string;
  channel: string;
  amount: number;
  frequency: number;
  start_date: Date;
  end_date: Date;
  target_audience: string;
  message: string;
  user: string;
  workspace: string;
}

export interface CampaignDTO {
  campaign_name: string;
  channel: string;
  amount: number;
  frequency: number;
  start_date: Date;
  end_date: Date;
  target_audience: string;
  message: string;
}
