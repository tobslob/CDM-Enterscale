import { BaseRepository } from "@random-guys/bucket";
import { Defaulter, DefaulterDTO, DefaulterQuery } from "./defaulter.model";
import mongoose from "mongoose";
import { DefaultersSchema } from "./defaulter.schema";
import { Request } from "express";
import { orFromQueryMap } from "../util";
import { CampaignDTO } from "../campaign";

class DefaulterRepository extends BaseRepository<Defaulter> {
  constructor() {
    super(mongoose.connection, "Defaulters", DefaultersSchema);
  }

  async bulkDelete(request_token: string) {
    return this.truncate({ request_token });
  }

  async createDefaulter(workspace: string, defaulter: DefaulterDTO) {
    return this.create({
      title: defaulter.title,
      batch_id: defaulter.batch_id,
      upload_type: defaulter.upload_type,
      workspace,
      users: defaulter.users
    });
  }

  /**
   * returns an exact match and no pagination
   * @param req server request
   * @param campaign campaign dto object
   */
  async searchDefaulters(req: Request, campaign: CampaignDTO) {
    const workspace = req.session.workspace;
    const locationRegex = campaign.location && new RegExp(`.*${campaign.location}.*`, "i");
    const defaulters = await DefaulterRepo.model.aggregate([
      {
        $match: {
          workspace,
          users: {
            $elemMatch: {
              $and: [
                { location: locationRegex },
                { age: { $gte: campaign.age?.from, $lte: campaign.age?.to } },
                { gender: { $in: campaign?.gender } }
              ]
            }
          }
        }
      },
      {
        $project: {
          title: 1,
          batch_id: 1,
          users: {
            $filter: {
              input: "$users",
              as: "users",
              cond: {
                $and: [
                  { $gte: ["$$users.age", campaign.age?.from] },
                  { $lte: ["$$users.age", campaign.age?.to] },
                  { $in: ["$$users.gender", campaign?.gender] }
                ]
              }
            }
          }
        }
      }
    ]);

    return defaulters;
  }

  /**
   * returns a paginated related search
   */
  getDefaulters(workspace: string, query?: DefaulterQuery) {
    const nameRegex = query.title && new RegExp(`.*${query.title}.*`, "i");

    let conditions = orFromQueryMap(query, {
      batch_id: { batch_id: { $in: query.batch_id } },
      title: { title: nameRegex },
      id: { _id: { $in: query.id } },
      users: {
        users: {
          $elemMatch: {
            $and: [
              { location: { $regex: query?.location } },
              { age: { $gte: query.age?.from, $lte: query?.age.to } },
              { gender: { $in: query?.gender } }
            ]
          }
        }
      }
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
