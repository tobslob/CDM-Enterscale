import { Request } from "express";

export function getRemoteIP(req: Request) {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
}
