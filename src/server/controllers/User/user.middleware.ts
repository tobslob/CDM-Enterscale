import { compose } from "compose-middleware";
import { Auth } from "@app/common/services";
import { when } from "@random-guys/sp-auth";

export const canCreateUser = compose(
  Auth.authCheck,
  when(req => req.session.loan_admin)
);
