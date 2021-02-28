import { Request, RequestHandler } from "express";
import { FORBIDDEN } from "http-status-codes";

export type RequestPredicate = (req: Request) => void;

/**
 * Create a middleware that runs all the predicates passed and fails with `FailedPredicateError` when
 * any one of them fails. If scheme is not null, it will not run any predicate for a request whose
 * authorisation uses that scheme
 * @param predicate function to test a request
 * @param scheme authorisation scheme to ignore
 */
export function checkRequest(scheme: string | null, ...predicates: RequestPredicate[]): RequestHandler {
  return (req, _res, next) => {
    // ignore headless requests
    if (scheme && req.headers.authorization) {
      const [reqScheme] = req.headers.authorization.split(" ");
      if (scheme.toLowerCase() === reqScheme.toLowerCase()) {
        return next();
      }
    }

    for (const p of predicates) {
      p(req);
    }

    next();
  };
}

export const sessionPermissions = <const>["super_admin", "loan_admin", "users"];
export type Permission = typeof sessionPermissions[number];

/**
 * Creates a function that tests a request and throws `FailedPredicateError` with
 * the right message.
 * @param message message to return to the client
 * @param predicate test to be done over the user's session
 */
export function because(message: string, predicate: Permission): RequestHandler {
  return (req, _res, next) => {
    if (!req.session[predicate]) {
      throw new FailedPredicateError(message);
    }

    next();
  };
}

/**
 * Is the type of error thrown when a request predicates fail.
 */
export class FailedPredicateError extends Error {
  code = FORBIDDEN;
  constructor(message: string) {
    super(message);
  }
}
