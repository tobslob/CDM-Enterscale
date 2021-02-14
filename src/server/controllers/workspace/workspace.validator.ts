import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isWorkspaceWihAdminDTO = joi.object({
  name: JoiValidator.validateString(),
  address:  JoiValidator.validateString(),
  workspace_email: JoiValidator.validateEmail(),
  first_name: JoiValidator.validateString(),
  last_name: JoiValidator.validateString(),
  password: JoiValidator.validatePassword(),
  email_address: JoiValidator.validateEmail(),
  phone_number: JoiValidator.validPhoneNumber()
});