import axios from "axios";

export const methods = <const>["get", "post", "patch", "delete", "put"];
export type methodType = typeof methods[number];

export async function Axios(url: string, method: methodType, value?: string, data?: any, params?: any, extras?: {}) {
  const response = await axios({
    url: `${url}/${value}`,
    method,
    data,
    params,
    ...extras
  });
  return response.data;
}
