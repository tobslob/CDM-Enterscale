import { BaseRepository } from "@random-guys/bucket";
import { Defaulters, DefaulterDTO } from "./defaulter.model";
import mongoose from "mongoose";
import { DefaulterSchema } from "./defaulter.schema";

class DefaulterRepository extends BaseRepository<Defaulters> {
  constructor() {
    super(mongoose.connection, "Defaulters", DefaulterSchema);
  }

  async createDefaulters(workspace: string, user: string, defaulterDTO: DefaulterDTO) {
    return this.create({
      total_loan_amount: defaulterDTO.total_loan_amount,
      loan_outstanding_balance: defaulterDTO.loan_outstanding_balance,
      loan_tenure: defaulterDTO.loan_tenure,
      time_since_default: defaulterDTO.time_since_default,
      time_since_last_payment: defaulterDTO.time_since_last_payment,
      last_contacted_date: defaulterDTO.last_contacted_date,
      BVN: defaulterDTO.BVN,
      workspace,
      user
    });
  }
}

export const DefaulterRepo = new DefaulterRepository();
