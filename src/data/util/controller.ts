import { Query, ControllerError } from "@app/data/util";
import { Request, Response } from "express";
import { injectable } from "inversify";
import _ from "lodash";
import { Log } from "@app/common/services/logger";
import { ModelNotFoundError, DuplicateModelError } from "@random-guys/bucket";
import { NOT_FOUND, BAD_REQUEST, CONFLICT } from "http-status-codes";
import { AuditLogDTO, AuditLogRepo } from "../audit-log";

@injectable()
export class Controller<T> {
  /**
   * Handles operation success and sends a HTTP response.
   * __Note__: if the data passed is a promise, no value is sent
   * until the promise resolves.
   * @param req Express request
   * @param res Express response
   * @param result Success data
   */
  async handleSuccess(req: Request, res: Response, result: T) {
    res.json({
      status: "success",
      data: result
    });
    Log.info({ req, res });
  }

  /*
   * Determines the HTTP status code of an error
   * @param err Error object
   */
  getHTTPErrorCode(err) {
    // check if error code exists and is a valid HTTP code.
    if (err.code >= 100 && err.code < 600) {
      if (err instanceof ModelNotFoundError) return NOT_FOUND;
      if (err instanceof DuplicateModelError) return CONFLICT;
      return err.code;
    }
    return BAD_REQUEST;
  }

  /**
   * Handles operation error, sends a HTTP response and logs the error.
   * @param req Express request
   * @param res Express response
   * @param error Error object
   * @param message Optional error message. Useful for hiding internal errors from clients.
   */
  handleError(req: Request, res: Response, err: Error, message?: string) {
    /**
     * Useful when we call an asynchrous function that might throw
     * after we've sent a response to client
     */
    if (res.headersSent) return Log.error(err);

    const { code } = <ControllerError>err;

    const errorMessage = message || err.message;

    res.status(this.getHTTPErrorCode(err) ?? code).json({
      code: this.getHTTPErrorCode(err) ?? code,
      data: null,
      message: errorMessage
    });
    Log.error(req, res, err);
  }

  getPaginationOptions(query: any): PaginationOptions {
    return _.pick(query, ["page", "per_page", "projections", "sort"]);
  }
}

export type PaginationOptions = Pick<Query, Exclude<keyof Query, "conditions" | "archived">>;

export class BaseController<T> extends Controller<T> {
  async log(req: Request, action: AuditLogDTO, value?: any) {
    await AuditLogRepo.saveLog(req, {
      activity: action.activity,
      message: action.message,
      object_id: action.object_id,
      channel: action.channel
    }, value);
  }
}
