import { compose, ConstraintError } from "@app/data/util";
import { Auth } from "@app/common/services";
import { Request, Response, NextFunction } from "express";

export const canCreateWorkspace = compose(Auth.authCheck, (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.super_admin) {
    throw new ConstraintError("You are not allowed to perform this operation");
  }
  return next();
});
