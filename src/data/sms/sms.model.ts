import { Model } from "@random-guys/bucket";

const status = <const>["Sent", "Submitted", "Buffered", "Rejected", "Success", "Failed"];
export type SMSStatus = typeof status[number];

const network = <const>["Airtel", "MTN", "Glo", "Etisalat"];
export type NetworkProvider = typeof network[number];

const reason = <const>[
  "InsufficientCredit",
  "InvalidLinkId",
  "UserIsInactive",
  "UserInBlackList",
  "UserAccountSuspended",
  "NotNetworkSubcriber",
  "UserNotSubscribedToProduct",
  "UserDoesNotExist",
  "DeliveryFailure"
];
export type FailureReason = typeof reason[number];

export interface SMSReports extends Model {
  sms_id: string;
  phoneNumber?: string;
  networkCode?: string;
  network?: NetworkProvider;
  failureReason?: FailureReason;
  retryCount?: number;
  status?: SMSStatus;
  workspace: string;
}

export interface SMSReportsDTO {
  id: string;
  phoneNumber?: string;
  networkCode?: string;
  network?: NetworkProvider;
  failureReason?: FailureReason;
  retryCount?: number;
  status?: SMSStatus;
}

export interface SMSReportQuery {
  phoneNumber?: string;
  network?: NetworkProvider;
  failureReason?: FailureReason;
  retryCount?: number;
  status?: SMSStatus;
  limit?: number;
  offset?: number;
}
