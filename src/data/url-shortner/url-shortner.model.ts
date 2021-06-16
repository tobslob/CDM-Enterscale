import { Model } from "@random-guys/bucket";

export interface UrlShortner extends Model {
  long_url: string;
  short_url: string;
  click_count: number;
}

export interface UrlShortnerDTO {
  long_url: string;
}