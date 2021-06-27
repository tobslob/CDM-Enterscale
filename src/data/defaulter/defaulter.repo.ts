import { BaseRepository } from "@random-guys/bucket";
import { Defaulter, DefaulterDTO, DefaulterQuery } from "./defaulter.model";
import mongoose from "mongoose";
import { DefaultersSchema } from "./defaulter.schema";
import { Request } from "express";
import { fromQueryMap } from "../util";

class DefaulterRepository extends BaseRepository<Defaulter> {
  constructor() {
    super(mongoose.connection, "Defaulters", DefaultersSchema);
  }

  async bulkDelete(request_token: string) {
    return this.truncate({ request_token });
  }

  async createDefaulter(req: Request, workspace: string, defaulter: DefaulterDTO) {
    const title = req.file.originalname.split(".");

    return this.create({
      title: title[0],
      batch_id: defaulter.batch_id,
      upload_type: defaulter.upload_type,
      workspace,
      users: defaulter.users
    });
  }

  getDefaulters(workspace: string, query?: DefaulterQuery) {
    const nameRegex = query.title && new RegExp(`.*${query.title}.*`, "i");

    let conditions = fromQueryMap(query, {
      batch_id: { batch_id: query.batch_id },
      title: { title: nameRegex },
      id: { _id: { $in: query.id } }
    });

    conditions = {
      ...conditions,
      workspace
    };

    const limit = Number(query.limit);
    const offset = Number(query.offset);

    return new Promise<Defaulter[]>((resolve, reject) => {
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

  async deleteDefaulterList(query: DefaulterQuery, workspace: string) {
    await DefaulterRepo.destroy({ workspace, query });
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
