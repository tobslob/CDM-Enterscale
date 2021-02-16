import { compose } from "@app/data/util";
import { Auth } from "@app/common/services";
import { Request, Response, NextFunction } from "express";

export const canCreateWorkspace = compose(Auth.authCheck, (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.super_administrator) {
    return;
  }
  return next();
});
