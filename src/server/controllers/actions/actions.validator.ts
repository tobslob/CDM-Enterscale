import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";
import { Frequency } from "@app/services/scheduler";
import { channel } from "@app/data/campaign";
import { subType, customFileSource } from "@app/services/proxy";
import { values } from "lodash";

export const isCampaign = joi.object({
  name: JoiValidator.validateString(),
  subject: joi.when("channel", {
    is: "EMAIL",
    then: joi.string().required()
  }),
  description: JoiValidator.validateString(),
  channel: JoiValidator.validateString().valid(...channel),
  amount: JoiValidator.validateNumber(),
  frequency: JoiValidator.validateString().valid(values(Frequency)),
  start_date: JoiValidator.validDate(),
  end_date: JoiValidator.validDate(),
  target_audience: JoiValidator.validateString(),
  message: joi.when("channel", {
    is: "EMAIL" || "CALL",
    then: joi.string().required()
  }),
  organisation: JoiValidator.validateString(),
  subtype: JoiValidator.validateString().valid(...subType),
  customer_file_source: JoiValidator.validateString().valid(...customFileSource)
});
