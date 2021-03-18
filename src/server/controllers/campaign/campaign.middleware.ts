import { compose } from "@random-guys/siber";
import { Auth } from "@app/common/services";
import { because } from "@app/common/services/authorisation";

export const canCreateCampaign = compose(
  Auth.authCheck,
  because("You are not allowed to perform this operation", "loan_admin")
)
