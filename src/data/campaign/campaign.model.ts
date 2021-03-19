import { Model } from "@random-guys/bucket";

const channel = <const>["FACEBOOK", "TWITTER", "EMAIL", "SMS", "INSTAGRAM"]
export type Channel = typeof channel[number]

const status = <const>["START", "STOP"]
export type Status = typeof status[number]

export interface Campaign extends Model {
  name: string;
  subject: string;
  description: string;
  channel: Channel;
  amount: number;
  frequency?: number;
  start_date?: Date;
  end_date?: Date;
  target_audience: string;
  message: string;
  user: string;
  workspace: string;
  status: Status;
}

export interface CampaignDTO {
  name: string;
  subject: string;
  description: string;
  channel: Channel;
  amount: number;
  frequency?: number;
  start_date?: Date;
  end_date?: Date;
  target_audience: string;
  message: string;
}
