import { BaseRepository } from "@random-guys/bucket";
import { Campaign, CampaignDTO } from "./campaign.model";
import mongoose from "mongoose";
import { CampaignSchema } from "./campaign.schema";
import { addDays } from "date-fns";

class CampaignRepository extends BaseRepository<Campaign> {
  constructor() {
    super(mongoose.connection, "Campaign", CampaignSchema);
  }

  async createCampaign(workspace: string, user: string, campaignDTO: CampaignDTO) {
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
      user: user,
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
        status: "START",
        start_date: addDays(new Date(), 1)
      }
    });
  }

  async stopCampaign(id: string) {
    return this.atomicUpdate(id, {
      $set: {
        status: "STOP",
        end_date: addDays(new Date(), 1)
      }
    });
  }
}

export const CampaignRepo = new CampaignRepository();
