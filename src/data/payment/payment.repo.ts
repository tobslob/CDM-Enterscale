import { BaseRepository } from "@random-guys/bucket";
import mongoose from "mongoose";
import { PaymentSchema } from "./payment.schema";
import { PaymentHook, PaymentHookDTO } from "./payment.model";

class PaymentRepository extends BaseRepository<PaymentHook> {
  constructor() {
    super(mongoose.connection, "PaymentWebHook", PaymentSchema);
  }

  async webhook(payment: PaymentHookDTO) {
    return await this.create({
      event: payment.event,
      data: {
        payment_id: payment.data.payment_id,
        tx_ref: payment.data.tx_ref,
        flw_ref: payment.data.flw_ref,
        device_fingerprint: payment.data.device_fingerprint,
        amount: payment.data.amount,
        currency: payment.data.currency,
        charged_amount: payment.data.charged_amount,
        app_fee: payment.data.app_fee,
        merchant_fee: payment.data.merchant_fee,
        processor_response: payment.data.processor_response,
        auth_model: payment.data.auth_model,
        ip: payment.data.ip,
        narration: payment.data.narration,
        status: payment.data.status,
        payment_type: payment.data.payment_type,
        created_at: payment.data.created_at,
        account_id: payment.data.account_id,
        payment_plan: payment.data.payment_plan,
        customer: {
          customer_id: payment.data.customer.customer_id,
          name: payment.data.customer.name,
          phone_number: payment.data.customer.phone_number,
          email: payment.data.customer.email,
          created_at: payment.data.customer.created_at
        },
        card: {
          first_6digits: payment.data.card.first_6digits,
          last_4digits: payment.data.card.last_4digits,
          issuer: payment.data.card.issuer,
          country: payment.data.card.country,
          type: payment.data.card.type,
          expiry: payment.data.card.expiry
        }
      }
    });
  }
}

export const PaymentRepo = new PaymentRepository();
