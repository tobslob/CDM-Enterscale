import { Model } from "@random-guys/bucket";

export interface Customers extends Model {
  title: string;
  batch_id: string;
  workspace: string;
}

export interface CustomerDTO {
  title: string;
  batch_id: string;
}
