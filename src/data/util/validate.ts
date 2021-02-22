import Joi, { SchemaLike,} from "@hapi/joi";
import { Request, Response, NextFunction, RequestHandler} from "express";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";

export function validate(schema: SchemaLike): RequestHandler{
  return (req: Request, res: Response, next: NextFunction) => {
  if (!schema) return next();

  const { body, params, query } = req;

  Joi.validate({ ...body, ...params, ...query }, schema, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true
  })
    .then(() => next())
    .catch(err => {
      const errors = {};
      err.details.forEach(e => {
        errors[e.message.split(" ", 1)[0].replace(/['"]/g, "")] = e.message.replace(/['"]/g, "");
      });
      return res.status(422).json({
        code: UNPROCESSABLE_ENTITY,
        message: errors
      });
    });
  }
};

/** *
 *  Object that help to validate user details
 */
export const JoiValidator = {
  validateString() {
    return Joi.string();
  },

  validateEmail() {
    return Joi.string().email();
  },

  validatePassword() {
    return Joi.string().min(8).strict().required();
  },

  validateNumber() {
    return Joi.number();
  },

  validateID() {
    return Joi.string().uuid().trim().required();
  },

  validPhoneNumber() {
    return Joi.string().regex(/^\d{11}$/);
  }
};
