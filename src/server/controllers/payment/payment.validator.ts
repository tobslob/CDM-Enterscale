import { JoiValidator } from "@app/data/util/validate";
import joi from "@hapi/joi";

const isAuthorization = joi.object({
  mode: JoiValidator.validateString().valid("pin", "avs_noauth", "avs"),
  pin: joi.when("mode", {
    is: "pin",
    then: joi.string().required()
  }),
  city: joi.when("mode", {
    is: "avs",
    then: joi.string().required()
  }),
  address: joi.when("mode", {
    is: "avs",
    then: joi.string().required()
  }),
  state: joi.when("mode", {
    is: "avs",
    then: joi.string().required()
  }),
  country: joi.when("mode", {
    is: "avs",
    then: joi.string().required()
  }),
  zipcode: joi.when("mode", {
    is: "avs",
    then: joi.string().required()
  })
})

export const isPayment = joi.object({
  amount: JoiValidator.validateNumber().required(),
  currency: JoiValidator.validateString().valid("NGN", "USD").required(),
  card_number: joi
    .string()
    .regex(
      /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/
    )
    .required(),
  cvv: JoiValidator.validateNumber().required(),
  expiry_month: JoiValidator.validateNumber().required(),
  expiry_year: JoiValidator.validateNumber().required(),
  email: JoiValidator.validateEmail().required(),
  phone_number: JoiValidator.validPhoneNumber().required(),
  fullname: JoiValidator.validateString().required(),
  authorization: isAuthorization
});
