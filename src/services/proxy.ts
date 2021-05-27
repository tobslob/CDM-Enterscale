import dotenv from "dotenv";
import { Axios } from "@app/data/util/proxy";
import { CampaignDTO } from "@app/data/campaign";
import { Defaulter } from "./defaulter";
import { DefaulterRepo, DefaulterQuery } from "@app/data/defaulter";
import { Request } from "express";
import uuid from "uuid/v4";
import { ValidatePaymentDTO, PaymentPlan, PaymentPlanQuery, UpdatePaymentPlan } from "@app/data/payment";
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
  async makePayment(client: string, type: string) {
    const data = await Axios(
      `${process.env.flutter_url}/charges`,
      "post",
      { client },
      {
        params: type,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.flutter_secret_key}`
        }
      }
    );

    return data;
  }

  async validatePayment(payment: ValidatePaymentDTO) {
    const data = await Axios(
      `${process.env.flutter_url}/validate-charge`,
      "post",
      {
        otp: payment.otp,
        flw_ref: payment.flw_ref,
        type: payment.type
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.flutter_secret_key}`
        }
      }
    );

    return data;
  }

  async createPaymentPlan(payment: PaymentPlan) {
    const data = await Axios(
      `${process.env.flutter_url}/payment-plans`,
      "post",
      {
        amount: payment.amount,
        name: "Loan Repayment Plan",
        interval: payment.interval,
        duration: payment.duration
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.flutter_secret_key}`
        }
      }
    );

    return data;
  }

  async getPaymentPlans(payment: PaymentPlanQuery) {
    const data = await Axios(`${process.env.flutter_url}/payment-plans`, "get", {
      params: {
        amount: payment.amount,
        currency: payment.currency,
        from: payment.from,
        to: payment.to,
        interval: payment.interval,
        page: payment.page,
        status: payment.status
      },
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.flutter_secret_key}`
      }
    });

    return data;
  }

  async getPaymentPlan(id: string) {
    const data = await Axios(`${process.env.flutter_url}/payment-plans/${id}`, "get", {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.flutter_secret_key}`
      }
    });

    return data;
  }

  async updatePaymentPlan(payment: UpdatePaymentPlan) {
    const data = await Axios(
      `${process.env.flutter_url}/payment-plans/${payment.id}`,
      "put",
      {
        name: payment.name,
        status: payment.status
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.flutter_secret_key}`
        }
      }
    );

    return data;
  }

  async cancelPaymentPlan(id: string) {
    const data = await Axios(`${process.env.flutter_url}/payment-plans/${id}/cancel`, "put", {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.flutter_secret_key}`
      }
    });

    return data;
  }

  async voice(recipient: Array<string>) {
    const data = await Axios(
      `${process.env.kirusa_url}/${process.env.kirusa_account_id}/Calls`,
      "post",
      {
        id: `Mooyi-${uuid()}`,
        caller_id: `${process.env.kirusa_caller_id}`,
        recipient,
        direction: "outbound",
        doc_url: "https://enterscale.herokuapp.com/api/v1/actions/voice"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.kirusa_api_token}`
        }
      }
    );

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
