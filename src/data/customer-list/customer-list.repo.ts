import { BaseRepository } from "@random-guys/bucket";
import { Customers, CustomerDTO } from "./customer-list.model";
import mongoose from "mongoose";
import { CustomerSchema } from "./customer-list.schema";
import { fromQueryMap, loopConcurrently } from "../util";
import { DefaulterQuery } from "../defaulter";
import { Request } from "express";

class CustomerRepository extends BaseRepository<Customers> {
  constructor() {
    super(mongoose.connection, "Customers", CustomerSchema);
  }

  async createCustomerList(workspace: string, customer: CustomerDTO) {
    return this.create({
      title: customer.title,
      batch_id: customer.batch_id,
      workspace
    });
  }

  async getAllCustomerList(req: Request, query?: DefaulterQuery) {
    const nameRegex = query.title && new RegExp(`.*${query.title}.*`, "i");

    let conditions = fromQueryMap(query, {
      batch_id: { batch_id: query.batch_id },
      title: { title: nameRegex },
      id: { _id: { $in: query.id } }
    });

    conditions = {
      ...conditions,
      workspace: req.session.workspace
    };

    const limit = Number(query.limit);
    const offset = Number(query.offset);

    return new Promise<Customers[]>((resolve, reject) => {
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

  async deleteCustomerList(workspace: string, query: DefaulterQuery) {
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
    const customerList = await this.model.find(conditions);

    await loopConcurrently(customerList, async l => {
      await this.destroy({ workspace, title: l.title, batch_id: l.batch_id });
    });
  }
}

export const CustomerRepo = new CustomerRepository();
