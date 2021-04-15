import dotenv from "dotenv";
import { Axios } from "@app/data/util/proxy";
import { CampaignDTO } from "@app/data/campaign";
import { Defaulter } from "./defaulter";
import { DefaulterRepo } from "@app/data/defaulter";
import { Request } from "express";
import uuid from "uuid/v4";

dotenv.config();

const clientId = uuid()

export const customAudience = <const>["USER_PROVIDED_ONLY", "PARTNER_PROVIDED_ONLY", "BOTH_USER_AND_PARTNER_PROVIDED"];
export const subType = <const>[
  "CUSTOM",
  "WEBSITE",
  "APP",
  "OFFLINE_CONVERSION",
  "CLAIM",
  "PARTNER",
  "MANAGED",
  "VIDEO",
  "LOOKALIKE",
  "ENGAGEMENT",
  "BAG_OF_ACCOUNTS",
  "STUDY_RULE_AUDIENCE",
  "FOX",
  "MEASUREMENT",
  "REGULATED_CATEGORIES_AUDIENCE"
];
export type CustomAudienceType = typeof customAudience[number];
export type SubType = typeof subType[number];

class ProxyServices {
  async verifyBVN(bvn: string) {
    const data = await Axios(`${process.env.flutter_url}/${bvn}`, "get", null, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.auth_scheme} ${process.env.sec_key}`
      }
    });

    return data;
  }

  async createCustomAudience(campaign: CampaignDTO) {
    const response = await Axios(
      `${process.env.fb_graph_url}/v10.0/act_${process.env.fb_account_id}/customaudiences`,
      "post",
      {
        name: campaign.name,
        subtype: campaign.subtype,
        description: campaign.description,
        customer_file_source: campaign.customer_file_source,
        access_token: process.env.fb_access_token
      }
    );
    return response.data;
  }

  async voice(user: any) {
    const response = await Axios(
      `${process.env.voice_url}`,
      "post",
      {
        username: process.env.sms_username,
        from: process.env.phone_number,
        to: user.phone_number,
        clientRequestId: clientId,
        isActive: true
      },
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `${process.env.auth_scheme} ${process.env.sec_key}`
        }
      }
    );
    return response.data;
  }

  async uploadCustomFile(req: Request, request_id: string, audience_id: string) {
    const workspace = req.session.workspace;

    const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, request_id);
    const users = await Defaulter.getDefaultUsers(defaulters);
    const hashedInfo = await Defaulter.sha256Users(users);

    const response = await Axios(`${process.env.fb_graph_url}/v10.0/${audience_id}/users `, "post", {
      payload: {
        schema: ["EXTERN_ID", "EMAIL", "FN", "LN", "PHONE"],
        data: [[uuid(), ...hashedInfo.values()]]
      },
      access_token: process.env.fb_access_token
    });
    return response.data;
  }
}

export const Proxy = new ProxyServices();
