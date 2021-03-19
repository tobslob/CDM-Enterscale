import { BaseRepository } from "@random-guys/bucket";
import { Defaulters, DefaulterDTO } from "./defaulter.model";
import mongoose from "mongoose";
import { DefaulterSchema } from "./defaulter.schema";
import { Passwords } from "@app/services/password";
import { User } from "../user";
import { Request } from "express";

class DefaulterRepository extends BaseRepository<Defaulters> {
  constructor() {
    super(mongoose.connection, "Defaulters", DefaulterSchema);
  }

  async bulkDelete(request_token: string) {
    return this.truncate({ request_token });
  }

  async createDefaulters(req: Request, workspace: string, user: User, defaulterDTO: DefaulterDTO) {
    return this.create({
      title: req.file.originalname,
      total_loan_amount: defaulterDTO.total_loan_amount,
      loan_outstanding_balance: defaulterDTO.loan_outstanding_balance,
      loan_tenure: defaulterDTO.loan_tenure,
      time_since_default: defaulterDTO.time_since_default,
      time_since_last_payment: defaulterDTO.time_since_last_payment,
      last_contacted_date: defaulterDTO.last_contacted_date,
      BVN: await Passwords.generateHash(defaulterDTO.BVN),
      workspace,
      user: user.id,
      request_id: defaulterDTO.request_id,
      role_id: user.role_id
    });
  }

  async getDefaulters(workspace: string) {
    return this.all({
      conditions: {
        workspace
      },
      sort: {
        created_at: -1
      }
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
}

export const DefaulterRepo = new DefaulterRepository();
