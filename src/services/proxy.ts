import dotenv from "dotenv";
import { Axios } from "@app/data/util/proxy";
import { CampaignDTO } from "@app/data/campaign";
import { Defaulter } from "./defaulter";
import { DefaulterRepo, DefaulterQuery } from "@app/data/defaulter";
import { Request } from "express";
import uuid from "uuid/v4";
import { PaymentType } from "@app/data/payment/payment.model";
dotenv.config();

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
  async makePayment(client: string, _type: PaymentType) {
    const data = await Axios(`${process.env.flutter_url}/charges?type=card`, "post", { client }, null, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.flutter_secret_key}`
      }
    });

    return data;
  }

  async validatePayment(client: string, _type: PaymentType) {
    const data = await Axios(`${process.env.flutter_url}/charges?type=card`, "post", { client }, null, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.flutter_secret_key}`
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
    return response;
  }

  async uploadCustomFile(req: Request, query: DefaulterQuery, audience_id: string) {
    const workspace = req.session.workspace;

    const defaulters = await DefaulterRepo.getDefaulters(workspace, query);
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
