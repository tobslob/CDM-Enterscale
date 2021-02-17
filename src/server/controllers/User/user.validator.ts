import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";
import { isPermissions } from "../workspace/workspace.validator";

export const isUserDTO = joi.object({
  first_name: JoiValidator.validateString(),
  last_name: JoiValidator.validateString(),
  email_address: JoiValidator.validateEmail(),
  phone_number: JoiValidator.validPhoneNumber(),
  permissions: isPermissions.required()
});
