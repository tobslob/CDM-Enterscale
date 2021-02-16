import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isWorkspaceWihAdminDTO = joi.object({
  name: JoiValidator.validateString().required(),
  address:  JoiValidator.validateString().required(),
  workspace_email: JoiValidator.validateEmail().required(),
  first_name: JoiValidator.validateString().required(),
  last_name: JoiValidator.validateString().required(),
  email_address: JoiValidator.validateEmail().required(),
  phone_number: JoiValidator.validPhoneNumber().required()
});