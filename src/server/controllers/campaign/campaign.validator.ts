import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";
import { channel } from "@app/data/campaign";

export const isCampaignDTO = joi.object({
  name: JoiValidator.validateString().required(),
  description: JoiValidator.validateString().required(),
  channel: JoiValidator.validateString()
    .valid(...channel)
    .required(),
  amount: JoiValidator.validateNumber().required(),
  frequency: JoiValidator.validateString().valid("DAILY", "WEEKLY", "MONTHLY").required(),
  start_date: JoiValidator.validDate().required(),
  end_date: JoiValidator.validDate(),
  target_audience: JoiValidator.validateString().required(),
  message: JoiValidator.validateString().required(),
  organisation: JoiValidator.validateString()
});

export const isCampaignQuery = joi.object({
  name: JoiValidator.validateString(),
  subject: JoiValidator.validateString(),
  frequency: JoiValidator.validateString().valid("DAILY", "WEEKLY", "MONTHLY"),
  from: JoiValidator.validDate(),
  to: JoiValidator.validDate(),
  organisation: JoiValidator.validateString(),
  channel: JoiValidator.validateString().valid(...channel),
  description: JoiValidator.validateString()
});

export const isCampaignType = joi.object({
  campaign_type: JoiValidator.validateString().allow("standard", "acquisition").required()
})
