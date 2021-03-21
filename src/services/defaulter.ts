import { UserServ } from "@app/services/user";
import { DefaulterRepo, Defaulters } from "@app/data/defaulter";
import { mapConcurrently } from "@app/data/util";
import { ExtractedDefaulter } from "@app/services/extraction";
import { Request } from "express";
import { UserRepo } from "@app/data/user";
import sha256 from "sha256";

class DefaulterService {
  async createDefaulters(req: Request, workspace: string, defaulter: ExtractedDefaulter) {
    const user = await UserServ.createUser(workspace, {
      email_address: defaulter.email_address,
      first_name: defaulter.first_name,
      last_name: defaulter.last_name,
      phone_number: defaulter.phone_number,
      permissions: {
        loan_admin: false,
        super_admin: false,
        users: true
      }
    });

    return await DefaulterRepo.createDefaulters(req, workspace, user, defaulter);
  }

  async getDefaultUsers(cratedDefaulters: Defaulters[]) {
    return mapConcurrently(cratedDefaulters, async defaulter => {
      const user = await UserRepo.byID(defaulter.user);

      return {
        title: defaulter.title,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        phone_number: user.phone_number,
        total_loan_amount: defaulter.total_loan_amount,
        loan_outstanding_balance: defaulter.loan_outstanding_balance,
        loan_tenure: defaulter.loan_tenure,
        time_since_default: defaulter.time_since_default,
        time_since_last_payment: defaulter.time_since_last_payment,
        last_contacted_date: defaulter.last_contacted_date,
        BVN: defaulter.BVN,
        request_id: defaulter.request_id
      };
    });
  }

  async sha256Defaulter(req: Request) {
    const defaulters = await DefaulterRepo.getDefaulters(req);

    return mapConcurrently(defaulters, async defaulter => {
      const user = await UserRepo.byID(defaulter.user);
      return {
        email: sha256(user.email_address.toLowerCase().trim()),
        first_name: sha256(user.first_name.toLowerCase().trim()),
        last_name: sha256(user.last_name.toLowerCase().trim()),
        phone_number: sha256(user.phone_number.toLowerCase().trim())
      };
    });
  }
}

export const Defaulter = new DefaulterService();
