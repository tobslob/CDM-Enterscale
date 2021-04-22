import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isCampaignDTO = joi.object({
  name: JoiValidator.validateString().required(),
  description: JoiValidator.validateString().required(),
  channel: JoiValidator.validateString()
    .valid("FACEBOOK", "TWITTER", "EMAIL", "SMS", "INSTAGRAM", "VOICE", "LINKEDIN")
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
  channel: JoiValidator.validateString().valid("FACEBOOK", "TWITTER", "EMAIL", "SMS", "INSTAGRAM", "VOICE", "LINKEDIN"),
  description: JoiValidator.validateString()
});
