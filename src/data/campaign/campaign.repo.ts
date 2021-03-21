import { BaseRepository } from "@random-guys/bucket";
import { Campaign, CampaignDTO } from "./campaign.model";
import mongoose from "mongoose";
import { CampaignSchema } from "./campaign.schema";
import { User } from "../user";

class CampaignRepository extends BaseRepository<Campaign> {
  constructor() {
    super(mongoose.connection, "Campaign", CampaignSchema);
  }

  async createCampaign(workspace: string, user: User, campaignDTO: CampaignDTO) {
    return this.create({
      name: campaignDTO.name,
      subject: campaignDTO.subject,
      description: campaignDTO.description,
      channel: campaignDTO.channel,
      amount: campaignDTO.amount,
      frequency: campaignDTO.frequency,
      start_date: campaignDTO.start_date,
      end_date: campaignDTO.end_date,
      target_audience: campaignDTO.target_audience,
      message: campaignDTO.message,
      user: user.id,
      workspace,
      status: "STOP"
    });
  }

  async getCampaigns(workspace: string) {
    return this.all({
      conditions: {
        workspace
      },
      sort: {
        created_at: -1
      }
    });
  }

  async startCampaign(id: string) {
    return this.atomicUpdate(id, {
      $set: {
        status: "START"
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
