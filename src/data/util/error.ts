import HttpStatus from "http-status-codes";
import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { Log } from "@app/common/services/logger";
import { responseHandler } from "./response";
import Logger from "bunyan";
import { NoAuthenticationError, InvalidSessionError, FailedPredicateError } from "@app/common/services/authorisation";

/**
 * Base error type for errors that the server can respond
 * with.
 */
export class ControllerError extends Error {
  /**
   * HTTP status code for this error
   */
  code: number;
  constructor(message: string) {
    super(message);
  }
}

export class DuplicateModelError extends ControllerError {
  code = HttpStatus.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}

export class ModelNotFoundError extends ControllerError {
  code = HttpStatus.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends ControllerError {
  code = HttpStatus.INTERNAL_SERVER_ERROR;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends ControllerError {
  code = HttpStatus.FORBIDDEN;
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends ControllerError {
  code = HttpStatus.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}

export class BadGatewayError extends ControllerError {
  code = HttpStatus.BAD_GATEWAY;
  constructor(message: string) {
    super(message);
  }
}

export class GatewayTimeoutError extends ControllerError {
  code = HttpStatus.GATEWAY_TIMEOUT;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends ControllerError {
  code = HttpStatus.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

export class ConstraintError extends ControllerError {
  code = HttpStatus.UNPROCESSABLE_ENTITY;
  constructor(message: string) {
    super(message);
  }
}

export class ConstraintDataError extends ControllerError {
  code = HttpStatus.UNPROCESSABLE_ENTITY;
  readonly data: any;
  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }
}

export class ConflictError extends ControllerError {
  code = HttpStatus.CONFLICT;
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends ControllerError {
  code = HttpStatus.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export class UnSupportedFileError extends ControllerError {
  code = HttpStatus.UNPROCESSABLE_ENTITY;
  constructor(message: string) {
    super(message);
  }
}

export const errors = universalErrorHandler(Log);

/**
 * A global error handler for an entire app.
 * @param logger Logger to log errors and their corresponding
 * request/response pair
 */
export function universalErrorHandler(logger: Logger): ErrorRequestHandler {
  // useful when we have call an asynchrous function that might throw
  // after we've sent a response to client
  return async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    if (err instanceof NoAuthenticationError) {
      return responseHandler(res, err.code, err.message, null);
    } else if (err instanceof InvalidSessionError) {
      Log.error(err);
      return responseHandler(res, err.code, err.message, null);
    } else if (err instanceof FailedPredicateError) {
      Log.error(err);
      return responseHandler(res, err.code, err.message, null);
    } else if (err instanceof UnSupportedFileError) {
      Log.error(err);
      return responseHandler(res, err.code, err.message, null);
    }

    // exit early when we don't understand it
    if (!(err instanceof ControllerError)) {
      logger.error({ err, res, req });
      return responseHandler(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "We are having internal issues. Please bear with us",
        null
      );
    }

    responseHandler(res, err.code, err.message, err["data"]);
    logger.error({ err, res, req });
  };
}
