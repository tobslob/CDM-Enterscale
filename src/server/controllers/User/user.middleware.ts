import { compose } from "@app/data/util";
import { Auth } from "@app/common/services";
import { Request, Response, NextFunction } from "express";

export const canCreateUser = compose(Auth.authCheck, (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.loan_administrator) {
    return;
  }
  return next();
});
