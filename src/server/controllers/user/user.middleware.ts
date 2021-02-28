import { compose } from "@random-guys/siber";
import { Auth } from "@app/common/services";
import { because } from "@app/common/services/authorisation";

export const canCreateUser = compose(
  Auth.authCheck,
  because("You are not allowed to perform this operation", req => req.session.loan_admin)
)
