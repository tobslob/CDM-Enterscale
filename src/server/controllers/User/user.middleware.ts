import { NextFunction, Request, Response } from "express";

import { UNAUTHORIZED, FORBIDDEN } from "http-status-codes";
import { response } from "@app/data/util/response";

export const canCreateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    return response(res, UNAUTHORIZED, "You are not allowed to perform this operation", null);
  }
  if (!req.session.loan_admin) {
    return response(res, FORBIDDEN, "You are not allowed to perform this operation", null);
  }
  return next();
}
