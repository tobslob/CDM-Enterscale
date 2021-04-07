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

  async getDefaultUsers(createdDefaulters: Defaulters[]) {
    return mapConcurrently(createdDefaulters, async defaulter => {
      const user = await UserRepo.byID(defaulter.user);
      return {
        id: defaulter.id,
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
        request_id: defaulter.request_id,
        workspace: defaulter.workspace,
        status: defaulter.status
      };
    });
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

export const Defaulter = new DefaulterService();
