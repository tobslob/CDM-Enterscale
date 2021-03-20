import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isDefaulterQuery = joi.object({
  title: JoiValidator.validateString(),
  request_id: JoiValidator.validateString()
});
