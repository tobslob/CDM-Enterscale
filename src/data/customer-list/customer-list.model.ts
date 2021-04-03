import { Model } from "@random-guys/bucket";

export interface Customers extends Model {
  title: string;
  request_id: string;
  workspace: string;
}

export interface CustomerDTO {
  title: string;
  request_id: string;
}
