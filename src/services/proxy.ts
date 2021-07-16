import dotenv from "dotenv";
import { Axios } from "@app/data/util/proxy";
import { CampaignDTO } from "@app/data/campaign";
import { ValidatePaymentDTO, PaymentPlan, PaymentPlanQuery, UpdatePaymentPlan } from "@app/data/payment";
import { DefaulterQuery, DefaulterRepo, FacebookAudienceDTO } from "@app/data/defaulter";
import { Defaulters } from "./defaulter";
import { Request } from "express";
import { mapConcurrently } from "@app/data/util";
dotenv.config();

export const customFileSource = <const>["USER_PROVIDED_ONLY", "PARTNER_PROVIDED_ONLY", "BOTH_USER_AND_PARTNER_PROVIDED"];
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
export type CustomFileSource = typeof customFileSource[number];
export type SubType = typeof subType[number];

const prop = <const>["media_url", "doc_url"];
export type Prop = typeof prop[number];

class ProxyServices {
  async makePayment(client: string, type: string) {
    const data = await Axios(
      `${process.env.flutter_url}/charges`,
      "post",
      { client },
      {
        params: { type },
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

  async voice(campaign: CampaignDTO, prop: Prop, recipient: Array<string>, req: Request) {
    let url: string;
    url = prop == "doc_url" ? `${process.env.base_url}/actions/voice` : campaign.audio_url;
    const data = await Axios(
      `${process.env.kirusa_url}/${process.env.kirusa_account_id}/Calls`,
      "post",
      {
        id: req.session.workspace,
        caller_id: `${process.env.kirusa_caller_id}`,
        recipient,
        direction: "outbound",
        [prop]: url,
        callback_url: `${process.env.base_url}/actions/webhook`
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

  async sms(recipient: string, body: string, req: Request) {
    const data = await Axios(
      `${process.env.kirusa_url}/${process.env.kirusa_account_id}/Messages`,
      "post",
      {
        id: req.session.workspace,
        to: [recipient],
        direction: "2way",
        sender_mask: "Mooyi io",
        body,
        callback_url: `${process.env.base_url}/actions/sms`
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

  async createCustomAudience(campaign: FacebookAudienceDTO) {
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
    const hashedInfo = await mapConcurrently(defaulters, async d => {
      return await Defaulters.sha256Users(d.users);
    });

    const response = await Axios(`${process.env.fb_graph_url}/v10.0/${audience_id}/users `, "post", {
      payload: {
        schema: ["EXTERN_ID", "EMAIL", "FN", "LN", "PHONE", "GEN", "DOBY", "DOBM", "DOBD"],
        data: [...hashedInfo]
      },
      access_token: process.env.fb_access_token
    });
    return response;
  }
}

export const Proxy = new ProxyServices();
