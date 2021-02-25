import JSend from "jsend";

export * from "./error";
export * from "./query";
export * from "./schema";
export * from "./controller";
export * from "./audits";
export * from "./validate";
export * from "./response";
export * from "./audits";

declare global {
  namespace Express {
    interface Response{
      id: string,
      body: any,
      jSend: JSend
    }
  }
}