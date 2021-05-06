import { UserServ } from "./user";

class PaymentService {
  async confirmPaymentLink(token: string) {
    return await UserServ.viewSessionToken(token);
  }
}

export const Payment = new PaymentService();
