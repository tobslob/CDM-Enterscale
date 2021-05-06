import { UserServ } from "@app/services/user";
import { DefaulterRepo, Defaulters } from "@app/data/defaulter";
import { mapConcurrently } from "@app/data/util";
import { ExtractedDefaulter } from "@app/services/extraction";
import { Request } from "express";
import { UserRepo } from "@app/data/user";
import sha256 from "sha256";
import { pick } from "lodash";

class DefaulterService {
  async createDefaulters(req: Request, workspace: string, defaulter: ExtractedDefaulter) {
    const user = await UserServ.createUser(workspace, {
      email_address: defaulter.email_address,
      first_name: defaulter.first_name,
      last_name: defaulter.last_name,
      phone_number: defaulter.phone_number,
      DOB: defaulter.DOB,
      gender: defaulter.gender,
      location: defaulter.location,
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
      if (!defaulter) return;
      const user = await UserRepo.byID(defaulter.user);
      return {
        id: defaulter.id,
        title: defaulter.title,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email_address,
        phone_number: user.phone_number,
        DOB: user.DOB,
        gender: user.gender,
        location: user.location,
        loan_id: defaulter.loan_id,
        actual_disbursement_date: defaulter.actual_disbursement_date,
        is_first_loan: defaulter.is_first_loan,
        loan_amount: defaulter.loan_amount,
        loan_tenure: defaulter.loan_tenure,
        days_in_default: defaulter.days_in_default,
        amount_repaid: defaulter.amount_repaid,
        amount_outstanding: defaulter.amount_outstanding,
        batch_id: defaulter.batch_id,
        status: defaulter.status
      };
    });
  }

  async generateDefaulterLink(user: any, req: Request) {
    const defaulter = await DefaulterRepo.byQuery({ _id: user.id, workspace: req.session.workspace });
    const usr = pick(user, "first_name", "last_name", "phone_number", "email_address", "id");
    // @ts-ignore
    return await UserServ.generateRePaymentLink({ ...usr, ...defaulter });
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
