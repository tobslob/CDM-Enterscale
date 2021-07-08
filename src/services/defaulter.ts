import { UserServ } from "@app/services/user";
import { DefaulterRepo, DefaultUser } from "@app/data/defaulter";
import { mapConcurrently } from "@app/data/util";
import { Request } from "express";
import sha256 from "sha256";
import { MooyiUser } from "@app/data/user";

class DefaulterService {
  async generateDefaulterLink(user: DefaultUser, batch_id: string[], req: Request) {
    const defaulter = await DefaulterRepo.searchDefaulterUser(req, user, batch_id);
    const usrs = defaulter.map(d => d["users"]);

    return await UserServ.generateRePaymentLink(usrs[0]);
  }

  async sha256Users(users: MooyiUser[]) {
    return mapConcurrently(users, async usr => {
      return [
        // @ts-ignore
        usr.id,
        sha256(usr.email_address.toLowerCase().trim()),
        sha256(usr.first_name.toLowerCase().trim()),
        sha256(usr.last_name.toLowerCase().trim()),
        sha256(usr.phone_number.toLowerCase().trim()),
        sha256(usr.gender.charAt(0).toLowerCase().trim()),
        sha256(new Date(usr.DOB).getFullYear().toString()),
        sha256(new Date(usr.DOB).getMonth().toString()),
        sha256(new Date(usr.DOB).getDay().toString())
      ];
    });
  }
}

export const Defaulters = new DefaulterService();
