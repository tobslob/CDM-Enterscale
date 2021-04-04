import { BaseRepository } from "@random-guys/bucket";
import { Customers, CustomerDTO } from "./customer-list.model";
import mongoose from "mongoose";
import { CustomerSchema } from "./customer-list.schema";

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

  async getAllCustomerList(workspace: string) {
    return this.all({
      conditions: {
        workspace
      }
    });
  }

  async deleteCustomerList(workspace: string, title: string, request_id: string) {
    return this.destroy({ workspace, title, request_id });
  }
}

export const CustomerRepo = new CustomerRepository();
