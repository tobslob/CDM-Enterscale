import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";
import { status } from "@app/data/defaulter";

export const isDefaulterQuery = joi
  .object({
    id: JoiValidator.validArray(),
    title: JoiValidator.validateString(),
    batch_id: JoiValidator.validateString(),
    status: JoiValidator.validateString().valid(...status)
  })
  .xor("id", "title", "batch_id", "status");

export const isDefaulterDTO = joi.object({
  loan_id: JoiValidator.validateNumber(),
  actual_disbursement_date: JoiValidator.validDate(),
  loan_amount: JoiValidator.validateNumber(),
  loan_tenure: JoiValidator.validateNumber(),
  days_in_default: JoiValidator.validateNumber(),
  amount_repaid: JoiValidator.validateNumber(),
  amount_outstanding: JoiValidator.validateNumber()
});

export const isIDs = joi.object({
  id: JoiValidator.validArray().required()
});
