import joi from "@hapi/joi";
import { JoiValidator } from "@app/data/util";
import { subType, customFileSource } from "@app/services/proxy";

export const isFacebookAudienceDTO = joi.object({
  name: JoiValidator.validateString().required(),
  subtype: JoiValidator.validateString().valid(...subType).required(),
  description: JoiValidator.validateString().required(),
  customer_file_source: JoiValidator.validateString().valid(...customFileSource).required(),
});
