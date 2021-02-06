import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isLoginDTO = joi.object({
  email_address: JoiValidator.validateEmail(),
  password: JoiValidator.validatePassword()
});
