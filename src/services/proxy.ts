import * as queryString from "query-string";
import dotenv from "dotenv";
import { Axios } from "@app/data/util/proxy";

dotenv.config();

export const customAudience = <const>["USER_PROVIDED_ONLY", "PARTNER_PROVIDED_ONLY", "BOTH_USER_AND_PARTNER_PROVIDED"];
export type customAudienceType = typeof customAudience[number];

class ProxyServices {
  async verifyBVN(bvn: string) {
    const data = Axios(`${process.env.flutter_url}`, "get", bvn, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.auth_scheme} ${process.env.sec_key}`
      }
    });

    return data;
  }

  stringifiedParams = queryString.stringify({
    client_id: process.env.fb_client_id,
    redirect_uri: `${process.env.fb_login_url}`,
    scope: ["email"].join(","),
    response_type: "code",
    auth_type: "rerequest",
    display: "popup"
  });

  facebookLoginUrl = `${process.env.fb_url}/dialog/oauth?${this.stringifiedParams}`;

  async getAccessTokenFromCode(code: string) {
    const { data } = await Axios(`${process.env.fb_url}/oauth/access_token`, "get", null, null, {
      client_id: process.env.fb_client_id,
      client_secret: process.env.fb_app_secret,
      redirect_uri: `${process.env.fb_login_url}`,
      code
    });

    return data.access_token;
  }

  async getFacebookUserData(access_token: string) {
    const { data } = await Axios(`${process.env.fb_graph_url}/me`, "get", null, null, {
      fields: ["id", "email", "first_name", "last_name"].join(","),
      access_token
    });

    return data;
  }

  async createCustomAudience(
    access_token: string,
    name: string,
    subtype: string,
    description: string,
    customer_file_source: customAudienceType
  ) {
    const { data } = await Axios(
      `${process.env.fb_graph_url}/v10.0/act_${process.env.fb_account_id}/customaudiences`,
      "post",
      null,
      {
        name,
        subtype,
        description,
        customer_file_source,
        access_token
      }
    );
    return data;
  }
}

export const Proxy = new ProxyServices();
