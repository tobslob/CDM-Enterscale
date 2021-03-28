import axios from "axios";

export const methods = <const>["get", "post", "patch", "delete", "put"];
export type methodType = typeof methods[number];

export async function Axios(url: string, method: methodType, data?: any, params?: any, extras?: object) {
  const response = await axios({
    url: `${url}`,
    method,
    data,
    params,
    ...extras
  });
  return response.data;
}
