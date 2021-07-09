import { Model } from "@random-guys/bucket";

export interface Email extends Model {
  message_id: string;
  workspace: string;
}
