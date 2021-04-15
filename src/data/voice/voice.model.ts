import { Model } from "@random-guys/bucket";

export interface Voice extends Model {
  isActive?: boolean | string;
  sessionId?: string;
  direction?: string;
  callerNumber?: string;
  destinationNumber?: string;
  dtmfDigits?: string;
  recordingUrl?: string;
  durationInSeconds?: string;
  currencyCode?: string;
  amount?: string | number;
}
