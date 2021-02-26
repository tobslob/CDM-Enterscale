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

export const isPasswordDTO = joi.object({
  old_password: JoiValidator.validateString().required(),
  new_password: JoiValidator.validatePassword()
})

export const isEditUserDTO = joi.object({
    first_name: JoiValidator.validateString(),
    last_name: JoiValidator.validateString(),
    phone_number: JoiValidator.validPhoneNumber()
})
