import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isCampaignDTO = joi.object({
  campaign_name: JoiValidator.validateString().required(),
  channel: JoiValidator.validateString().required(),
  amount: JoiValidator.validateNumber().required(),
  frequency: JoiValidator.validateNumber().required(),
  start_date: JoiValidator.validDate().required(),
  end_date: JoiValidator.validDate().required(),
  target_audience: JoiValidator.validateString().required(),
  message: JoiValidator.validateString().required(),
});
