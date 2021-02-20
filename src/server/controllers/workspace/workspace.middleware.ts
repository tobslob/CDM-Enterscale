import { Request, Response, NextFunction } from "express";
import { UNAUTHORIZED, FORBIDDEN } from "http-status-codes";
import { response } from "@app/data/util/response";

export const canCreateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    return response(res, UNAUTHORIZED, "You are not allowed to perform this operation", null);
  }
  if (!req.session.super_admin) {
    return response(res, FORBIDDEN, "You are not allowed to perform this operation", null);
  }
  return next();
};
