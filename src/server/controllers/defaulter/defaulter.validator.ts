import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";
import { gender } from "@app/data/user";

export const isDefaulterQuery = joi
  .object({
    id: JoiValidator.validArray(),
    title: JoiValidator.validateString(),
    batch_id: JoiValidator.validateString(),
    campaign_type: JoiValidator.validateString().valid("acquistion", "engagement").required(),
    age: joi.when("campaign_type", {
      is: joi.valid("acquistion"),
      then: joi.object({
        from: JoiValidator.validateNumber().default(18),
        to: JoiValidator.validateNumber().default(100)
      }).required(),
    }),
    gender: joi.when("campaign_type", {
      is: joi.valid("acquistion"),
      then: JoiValidator.validateString().valid(...gender)
    })
  })

export const isDefaulterDTO = joi.object({
  loan_id: JoiValidator.validateNumber(),
  actual_disbursement_date: JoiValidator.validDate(),
  loan_amount: JoiValidator.validateNumber(),
  loan_tenure: JoiValidator.validateNumber(),
  days_in_default: JoiValidator.validateNumber(),
  amount_repaid: JoiValidator.validateNumber(),
  amount_outstanding: JoiValidator.validateNumber(),
  first_name: JoiValidator.validateString(),
  last_name: JoiValidator.validateString(),
  email_address: JoiValidator.validateString(),
  DOB: JoiValidator.validateString(),
  gender: JoiValidator.validateString(),
  location: JoiValidator.validateString(),
  phone_number: JoiValidator.validPhoneNumber()
});

export const isIDs = joi.object({
  id: JoiValidator.validArray().required()
});
