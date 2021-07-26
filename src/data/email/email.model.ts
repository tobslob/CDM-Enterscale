import { Model } from "@random-guys/bucket";

export interface Email extends Model {
  campaign_id: string;
  message_id: string;
  workspace: string;
}
