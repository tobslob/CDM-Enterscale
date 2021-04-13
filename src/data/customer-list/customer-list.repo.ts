import { BaseRepository } from "@random-guys/bucket";
import { Customers, CustomerDTO } from "./customer-list.model";
import mongoose from "mongoose";
import { CustomerSchema } from "./customer-list.schema";
import { fromQueryMap, paginate } from "../util";
import { DefaulterQuery } from "../defaulter";
import { Request } from "express";

class CustomerRepository extends BaseRepository<Customers> {
  constructor() {
    super(mongoose.connection, "Customers", CustomerSchema);
  }

  async createCustomerList(workspace: string, customer: CustomerDTO) {
    return this.create({
      title: customer.title,
      request_id: customer.request_id,
      workspace
    });
  }

  async getAllCustomerList(req: Request, query?: DefaulterQuery) {
    const nameRegex = query.title && new RegExp(`.*${query.title}.*`, "i");

    let conditions = fromQueryMap(query, {
      request_id: { request_id: query.request_id },
      title: { title: nameRegex }
    });

    conditions = {
      ...conditions,
      workspace: req.session.workspace
    };

    const [per_page, offset] = paginate(query);
    return this.model.find(conditions).limit(per_page).skip(offset).sort({ created_at: -1 }).exec();
  }

  async deleteCustomerList(workspace: string, title: string, request_id: string) {
    return this.destroy({ workspace, title, request_id });
  }
}

export const CustomerRepo = new CustomerRepository();
