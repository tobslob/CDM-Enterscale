import { BaseRepository } from "@random-guys/bucket";
import { Defaulters, DefaulterDTO, DefaulterQuery } from "./defaulter.model";
import mongoose from "mongoose";
import { DefaulterSchema } from "./defaulter.schema";
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
    if (!user) return;

    const title = req.file.originalname.split(".");

    return this.create({
      title: title[0],
      loan_id: defaulter.loan_id,
      actual_disbursement_date: defaulter.actual_disbursement_date,
      is_first_loan: defaulter.is_first_loan,
      loan_amount: defaulter.loan_amount,
      loan_tenure: defaulter.loan_tenure,
      days_in_default: defaulter.days_in_default,
      amount_repaid: defaulter.amount_repaid,
      amount_outstanding: defaulter.amount_outstanding,
      workspace,
      user: user.id,
      batch_id: defaulter.batch_id,
      role_id: user.role_id
    });
  }

  getDefaulters(workspace: string, query?: DefaulterQuery) {
    const nameRegex = query.title && new RegExp(`.*${query.title}.*`, "i");

    let conditions = fromQueryMap(query, {
      batch_id: { batch_id: query.batch_id },
      title: { title: nameRegex },
      id: { _id: { $in: query.id } },
      status: { status: query.status }
    });

    conditions = {
      ...conditions,
      workspace
    };

    const limit = Number(query.limit);
    const offset = Number(query.offset);

    return new Promise<Defaulters[]>((resolve, reject) => {
      let directQuery = this.model.find(conditions).skip(offset).sort({ created_at: -1 });

      if (query.limit !== 0) {
        directQuery = directQuery.limit(limit);
      }

      return directQuery.exec((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async deleteDefaulter(defaulter: Defaulters) {
    await UserRepo.destroy(defaulter.user);
    await RoleRepo.destroy(defaulter.role_id);
    await DefaulterRepo.destroy(defaulter.id);
  }

  async editDefulter(workspace: string, id: string, defaulter: any) {
    return this.atomicUpdate(
      {
        _id: id,
        workspace
      },
      {
        $set: {
          loan_id: defaulter.loan_id,
          actual_disbursement_date: defaulter.actual_disbursement_date,
          loan_amount: defaulter.loan_amount,
          loan_tenure: defaulter.loan_tenure,
          days_in_default: defaulter.days_in_default,
          amount_repaid: defaulter.amount_repaid,
          amount_outstanding: defaulter.amount_outstanding
        }
      }
    );
  }
}

export const DefaulterRepo = new DefaulterRepository();
