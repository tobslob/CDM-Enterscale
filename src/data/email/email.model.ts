import { Model } from "@random-guys/bucket";

export interface Email extends Model {
  email_id: string;
  message_id: string;
  workspace: string;
}
