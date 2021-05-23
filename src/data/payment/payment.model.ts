import { Model } from "@random-guys/bucket";

export interface Token {
  token: string;
}

export const paymentType = <const>["card", "bank_transfer", "ussd", "debit_ng_account"];
export type PaymentType = typeof paymentType[number];

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

export interface PaymentHook extends Model {
  event: string;
  data: {
    payment_id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: PaymentType;
    created_at: Date;
    account_id: number;
    customer: {
      customer_id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: Date;
    };
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      expiry: string;
    };
  };
}

export interface PaymentHookDTO {
  event: string;
  data: {
    payment_id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: PaymentType;
    created_at: Date;
    account_id: number;
    customer: {
      customer_id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: Date;
    };
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      expiry: string;
    };
  };
}
