import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

export const isDefaulterQuery = joi
  .object({
    id: JoiValidator.validArray(),
    title: JoiValidator.validateString(),
    batch_id: JoiValidator.validateString()
  })
  .xor("id", "title", "batch_id");

export const isDefaulterDTO = joi.object({
  total_loan_amount: JoiValidator.validateNumber(),
  loan_outstanding_balance: JoiValidator.validateNumber(),
  loan_tenure: JoiValidator.validateNumber(),
  time_since_default: JoiValidator.validDate(),
  time_since_last_payment: JoiValidator.validDate(),
  last_contacted_date: JoiValidator.validDate()
});

export const isIDs = joi.object({
  id: JoiValidator.validArray().required()
});
