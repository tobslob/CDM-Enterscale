import { BaseRepository } from "@random-guys/bucket";
import { Campaign, CampaignDTO, CampaignQuery } from "./campaign.model";
import mongoose from "mongoose";
import { CampaignSchema } from "./campaign.schema";
import { Workspace } from "../workspace";
import { fromQueryMap } from "../util";

class CampaignRepository extends BaseRepository<Campaign> {
  constructor() {
    super(mongoose.connection, "Campaign", CampaignSchema);
  }

  async createCampaign(workspace: Workspace, user: string, campaignDTO: CampaignDTO) {
    return this.create({
      name: campaignDTO.name,
      subject: campaignDTO.subject,
      description: campaignDTO.description,
      channel: campaignDTO.channel,
      frequency: campaignDTO.frequency,
      start_date: campaignDTO.start_date,
      end_date: campaignDTO.end_date,
      target_audience: campaignDTO.target_audience,
      message: campaignDTO.message,
      user: user,
      workspace: workspace.id,
      workspace_name: workspace.name,
      status: "STOP",
      subtype: campaignDTO.subtype,
      customer_file_source: campaignDTO.customer_file_source,
      short_link: campaignDTO.short_link,
      campaign_type: campaignDTO.campaign_type,
      gender: campaignDTO.gender,
      age: campaignDTO.age,
      percentage_to_send_to: campaignDTO.percentage_to_send_to,
      template_id: campaignDTO.template_id,
      delivery_time: campaignDTO.delivery_time,
      time_zone: campaignDTO.time_zone,
      schedule: campaignDTO.schedule,
      location: campaignDTO.location
    });
  }

  async editCampaign(workspace: string, id: string, campaignDTO: CampaignDTO) {
    return this.atomicUpdate(
      {
        _id: id,
        workspace
      },
      {
        $set: {
          name: campaignDTO.name,
          subject: campaignDTO.subject,
          description: campaignDTO.description,
          channel: campaignDTO.channel,
          frequency: campaignDTO.frequency,
          start_date: campaignDTO.start_date,
          end_date: campaignDTO.end_date,
          target_audience: campaignDTO.target_audience,
          message: campaignDTO.message,
          status: "STOP",
          subtype: campaignDTO.subtype,
          customer_file_source: campaignDTO?.customer_file_source,
          campaign_type: campaignDTO.campaign_type,
          gender: campaignDTO.gender,
          age: campaignDTO.age,
          percentage_to_send_to: campaignDTO.percentage_to_send_to,
          template_id: campaignDTO.template_id,
          delivery_time: campaignDTO.delivery_time,
          time_zone: campaignDTO.time_zone,
          location: campaignDTO.location
        }
      }
    );
  }

  async getCampaigns(workspace: string, query: CampaignQuery) {
    const subjectRegex = query.subject && new RegExp(`.*${query.subject}.*`, "i");
    const descriptionRegex = new RegExp(`.*${query.subject}.*`, "i");
    const nameRegex = new RegExp(`.*${query.name}.*`, "i");
    const organisationRegex = new RegExp(`.*${query.organisation}.*`, "i");

    let conditions = fromQueryMap(query, {
      $always: {
        start_date: {
          $gte: query.from,
          $lte: query.to
        }
      },
      name: { name: nameRegex },
      subject: { subject: subjectRegex },
      description: { description: descriptionRegex },
      channel: { channel: query.channel },
      frequency: { frequency: query.frequency },
      organisation: { organisation: organisationRegex }
    });

    conditions = {
      ...conditions,
      workspace
    };

    const limit = Number(query.limit);
    const offset = Number(query.offset);
    return new Promise<Campaign[]>((resolve, reject) => {
      let directQuery = this.model.find({ workspace }).skip(offset).sort({ created_at: -1 });

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

  async startCampaign(id: string) {
    return this.atomicUpdate(id, {
      $set: {
        status: "START",
        start_date: new Date()
      }
    });
  }

  async stopCampaign(id: string) {
    return this.atomicUpdate(id, {
      $set: {
        status: "STOP"
      }
    });
  }
}

export const CampaignRepo = new CampaignRepository();
