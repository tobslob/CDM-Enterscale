import { BaseRepository } from "@random-guys/bucket";
import { Defaulters, DefaulterDTO, DefaulterQuery } from "./defaulter.model";
import mongoose from "mongoose";
import { DefaulterSchema } from "./defaulter.schema";
import { Passwords } from "@app/services/password";
import { User, UserRepo } from "../user";
import { Request } from "express";
import { fromQueryMap } from "../util";
import { RoleRepo } from "../role";

class DefaulterRepository extends BaseRepository<Defaulters> {
  constructor() {
    super(mongoose.connection, "Defaulters", DefaulterSchema);
  }

  async bulkDelete(request_token: string) {
    return this.truncate({ request_token });
  }

  async createDefaulters(req: Request, workspace: string, user: User, defaulter: DefaulterDTO) {
    return this.create({
      title: req.file.originalname,
      total_loan_amount: defaulter.total_loan_amount,
      loan_outstanding_balance: defaulter.loan_outstanding_balance,
      loan_tenure: defaulter.loan_tenure,
      time_since_default: defaulter.time_since_default,
      time_since_last_payment: defaulter.time_since_last_payment,
      last_contacted_date: defaulter.last_contacted_date,
      BVN: await Passwords.generateHash(defaulter.BVN),
      workspace,
      user: user.id,
      request_id: defaulter.request_id,
      role_id: user.role_id
    });
  }

  async getUniqueDefaulters(workspace: string, request_id: string) {
    return this.all({
      conditions: {
        workspace,
        request_id
      },
      sort: {
        created_at: -1
      }
    });
  }

  getDefaulters(req: Request, query?: DefaulterQuery) {
    const nameRegex = query.title && new RegExp(`.*${query.title}.*`, "i");

    let conditions = fromQueryMap(query, {
      request_id: { request_id: query.request_id },
      title: { title: nameRegex }
    });

    conditions = {
      ...conditions,
      workspace: req.session.workspace
    };

    return this.model.find(conditions);
  }

  async deleteDefaulter(defaulter: Defaulters) {
    await UserRepo.destroy(defaulter.user);
    await RoleRepo.destroy(defaulter.role_id);
    await DefaulterRepo.destroy(defaulter.id);
  }
}

export const DefaulterRepo = new DefaulterRepository();
