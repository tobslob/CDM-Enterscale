import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isPermissions = joi.object({
  super_admin: joi.bool().default(false),
  loan_admin: joi.bool().default(true),
  users: joi.bool().default(false)
});

export const isWorkspaceWihAdminDTO = joi.object({
  name: JoiValidator.validateString().required(),
  address: JoiValidator.validateString().required(),
  workspace_email: JoiValidator.validateEmail().required(),
  first_name: JoiValidator.validateString().required(),
  last_name: JoiValidator.validateString().required(),
  email_address: JoiValidator.validateEmail().required(),
  phone_number: JoiValidator.validPhoneNumber().required()
});

export const isValidID = joi.string().regex(/^[0-9a-fA-F]{24}$/);
