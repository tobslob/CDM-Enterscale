import { UserServ } from "./user";
import { PaymentDTO } from "@app/data/payment/payment.model";
import forge from "node-forge";

class PaymentService {
  async confirmPaymentLink(token: string) {
    const value = await UserServ.viewSessionToken(token);
    return this.pick(value);
  }

  private async pick(value: any) {
    return {
      first_name: value.first_name,
      last_name: value.last_name,
      email_address: value.email_address,
      phone_number: value.phone_number,
      DOB: value.DOB,
      gender: value.gender,
      location: value.location,
      loan_id: value.loan_id,
      actual_disbursement_date: value.actual_disbursement_date,
      is_first_loan: value.is_first_loan,
      loan_amount: value.loan_amount,
      loan_tenure: value.loan_tenure,
      days_in_default: value.days_in_default,
      amount_repaid: value.amount_repaid,
      amount_outstanding: value.amount_outstanding,
      status: value.status,
      ...value._doc
    };
  }

  encryptPayment(key: string, payment: PaymentDTO): string {
    const payload = JSON.stringify(payment);
    const cipher = forge.cipher.createCipher("3DES-ECB", forge.util.createBuffer(key));
    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(payload, "utf8"));
    cipher.finish();
    const encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
  }
}

export const Payment = new PaymentService();
