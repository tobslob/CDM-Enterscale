import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";
import { channel } from "@app/data/campaign";
import { subType, customFileSource } from "@app/services/proxy";
import { gender } from "@app/data/user";

export const isCampaignDTO = joi.object({
  name: JoiValidator.validateString().required(),
  description: JoiValidator.validateString(),
  channel: JoiValidator.validateString()
    .valid(...channel)
    .required(),
  frequency: JoiValidator.validateString().valid("DAILY", "WEEKLY", "MONTHLY").required(),
  start_date: JoiValidator.validDate().required(),
  end_date: JoiValidator.validDate(),
  target_audience: joi.array().items(JoiValidator.validateString()),
  message: JoiValidator.validateString().required(),
  subject: JoiValidator.validateString(),
  location: JoiValidator.validateString(),
  subtype: JoiValidator.validateString().valid(...subType),
  customer_file_source: JoiValidator.validateString().valid(...customFileSource),
  short_link: joi.boolean(),
  campaign_type: JoiValidator.validateString().valid("standard", "acquisition").required(),
  gender: joi.array().items(JoiValidator.validateString().valid(...gender)),
  age: joi.object({
    from: JoiValidator.validateNumber(),
    to: JoiValidator.validateNumber()
  }),
  percentage_to_send_to: JoiValidator.validateNumber(),
  template_id: JoiValidator.validateString(),
  delivery_time: joi.array().items(JoiValidator.validateString()),
  time_zone: JoiValidator.validateString(),
  schedule: joi.boolean(),
  video_url: JoiValidator.validateString(),
  brand_logo: JoiValidator.validateString(),
  hero_image: JoiValidator.validateString(),
  audio_url: JoiValidator.validateString(),
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
  campaign_type: JoiValidator.validateString().valid("standard", "acquisition").required()
})
