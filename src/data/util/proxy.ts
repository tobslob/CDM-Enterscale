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
    throw new BadRequestError(error.response.data.message);
  }
}
// technical debt.
// service to return failed calls and also service to retry them.
// delete campaign when instant campaign fails
// needs error handler if 3rd party service fails.
