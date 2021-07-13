import axios from "axios";
import { BadRequestError } from "./error";

export const methods = <const>["get", "post", "patch", "delete", "put"];
export type methodType = typeof methods[number];

export async function Axios(url: string, method: methodType, data?: object, extras?: object) {
  try {
    const response = await axios({
      url: `${url}`,
      method,
      data,
      ...extras
    });
    return response.data;
  } catch (error) {
    console.log("🏂 🛷🎽", error.response)
    throw new BadRequestError(error.response.data.message);
  }
}

// delete campaign when channel fails
