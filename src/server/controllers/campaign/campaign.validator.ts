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
  frequency: JoiValidator.validateString().valid("DAILY", "WEEKLY", "MONTHLY"),
  start_date: JoiValidator.validDate(),
  end_date: joi.date().greater(joi.ref("start_date")),
  target_audience: joi.array().items(JoiValidator.validateString()),
  message: JoiValidator.validateString(),
  subject: JoiValidator.validateString(),
  location: JoiValidator.validateString(),
  subtype: JoiValidator.validateString().valid(...subType),
  customer_file_source: JoiValidator.validateString().valid(...customFileSource),
  short_link: joi.boolean(),
  campaign_type: JoiValidator.validateString().valid("engagement", "acquisition").required(),
  gender: joi.array().items(JoiValidator.validateString().valid(...gender)),
  age: joi.object({
    from: JoiValidator.validateNumber().default(18),
    to: JoiValidator.validateNumber().default(100)
  }),
  percentage_to_send_to: JoiValidator.validateNumber(),
  template_identifier: JoiValidator.validateString(),
  delivery_time: joi.array().items(JoiValidator.validateString()),
  time_zone: JoiValidator.validateString(),
  schedule: joi.boolean(),
  video_url: JoiValidator.validateString(),
  brand_logo: JoiValidator.validateString(),
  hero_image: JoiValidator.validateString(),
  audio_url: JoiValidator.validateString()
});

export const isCampaignQuery = joi.object({
  name: JoiValidator.validateString(),
  subject: JoiValidator.validateString(),
  frequency: JoiValidator.validateString().valid("DAILY", "WEEKLY", "MONTHLY"),
  from: joi.date().max("now"),
  to: joi.date().max("now").greater(joi.ref("from")),
  organisation: JoiValidator.validateString(),
  channel: JoiValidator.validateString().valid(...channel),
  description: JoiValidator.validateString(),
  state: JoiValidator.validateString().valid("CREATED", "ONGOING", "COMPLETED")
});

export const isCampaignType = joi.object({
  campaign_type: JoiValidator.validateString().valid("engagement", "acquisition").required()
});

export const isGetCampaignQuery = joi.object({
  file_type: joi.string().valid("json", "csv", "xlsx").default("json").required()
});
