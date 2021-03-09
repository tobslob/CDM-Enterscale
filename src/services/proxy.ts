// import Axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export interface BVNResponse {
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  registration_date: string;
  enrollment_bank: string;
  address: string;
  gender: string;
  email: string;
  state_of_residence: string;
  lga_of_residence: string;
}

class ProxyServices {
  async verifyBVN<BVNResponse>(bvn: string): Promise<BVNResponse> {
    const response = await fetch(`${process.env.flutter_url}/v3/kyc/bvns/${bvn}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.auth_scheme} ${process.env.sec_key}`
      }
    });

    return (await response.json()) as Promise<BVNResponse>;
  }
}

export const Proxy = new ProxyServices();
