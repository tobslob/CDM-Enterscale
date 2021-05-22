export interface Token {
  token: string;
}

export const paymentType = <const>["card", "bank_transfer", "ussd", "debit_ng_account"];
export type PaymentType = typeof paymentType[number]

export interface PaymentDTO {
  amount: number;
  currency: string;
  card_number: number;
  cvv: number;
  expiry_month: number;
  expiry_year: number;
  email: string;
  tx_ref: string;
  phone_number: string;
  fullname: string;
  preauthorize?: boolean;
  redirect_url: string;
  client_ip: string;
  device_fingerprint?: string;
  meta: {
    flightID?: string;
    sideNote?: string;
    authorization?: {
      mode?: string;
      pin?: number;
      city?: string;
      address?: string;
      state?: string;
      country?: string;
      zipcode?: number;
    };
  };
}

export interface ValidatePaymentDTO {
  otp: string;
  flw_ref: string;
  type?: string;
}
