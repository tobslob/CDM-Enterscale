import { UserServ } from "@app/services/user";
import { DefaulterRepo } from "@app/data/defaulter";
import { mapConcurrently } from "@app/data/util";
import { Request } from "express";
import sha256 from "sha256";

class DefaulterService {
  async generateDefaulterLink(user: any, req: Request) {
    const defaulter = await DefaulterRepo.byQuery({ _id: user.id, workspace: req.session.workspace });
    const value = { ...defaulter, ...user };
    return await UserServ.generateRePaymentLink({ ...value });
  }

  async sha256Users(users: any[]) {
    return mapConcurrently(users, async usr => {
      return {
        EMAIL: sha256(usr.email_address.toLowerCase().trim()),
        FN: sha256(usr.first_name.toLowerCase().trim()),
        LN: sha256(usr.last_name.toLowerCase().trim()),
        PHONE: sha256(usr.phone_number.toLowerCase().trim())
      };
    });
  }
}

export const Defaulters = new DefaulterService();
