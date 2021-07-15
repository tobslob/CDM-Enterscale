import cookieParser, { CookieParseOptions } from "cookie-parser";
import { CookieOptions, NextFunction, Request, Response } from "express";
import ms from "ms";
import { asyncRandomString } from "./crypto";
import { seal, unseal } from "./jwt";
import { IStore } from "./store";
import { TokenExpiredError } from "jsonwebtoken";
import { FORBIDDEN, UNAUTHORIZED } from "http-status-codes";

/**
 * Extends `CookieOptions` to
 */
export interface SessionCookie extends CookieOptions {
  /**
   * name of the cookie to set
   */
  name: string;
}

export class InvalidSessionError extends Error {
  code = FORBIDDEN
  constructor(message: string) {
    super(message);
  }
}

export class NoAuthenticationError extends Error {
  code = UNAUTHORIZED
  constructor(message: string) {
    super(message);
  }
}

/**
 * Configuration for creating sessions. At least one of `stateful` or
 * stateless.
 */
export interface SessionConfig {
  /**
   * 32 char secret used to encode and decode. This key is used
   * with all strategies
   */
  secret: string;
  /**
   * configuration for `Bearer` and cookie sessions, as they are both
   * stateful
   */
  stateful?: {
    /**
     * configration for cookies. Set this to enable cookies
     */
    cookieOptions?: SessionCookie;
    /**
     * expire time for `Bearer` and cookie session in milliseconds. You can
     * also pass [ms](https://github.com/zeit/ms) compatible time values
     */
    duration: string | number;
    /**
     * IStore instance for managing the session
     */
    store: IStore;
  };

  stateless?: {
    scheme: string;
    /**
     * expire time for stateless tokens. You can also pass [ms](https://github.com/zeit/ms)
     * compatible time values
     */
    duration: string | number;
  };
}

/**
 * Service for creating, loading and destroying cookie and auth header
 * sessions
 */
export class SessionService {
  private store: IStore;
  private secret: string;
  private cookieOptions: SessionCookie;
  private statelessDuration: number | string;
  private statefulDuration: number;
  private statelessScheme: string;

  /**
   * Creates a new session service.
   * @param options configuration for the `SessionService`
   */
  constructor(options: SessionConfig) {
    if (!options.stateful && !options.stateless) {
      throw new Error("At least one type of session must be enabled");
    }

    this.secret = options.secret;

    if (options.stateful) {
      this.store = options.stateful.store;
      this.cookieOptions = options.stateful.cookieOptions;
      this.statefulDuration =
        typeof options.stateful.duration == "string" ? ms(options.stateful.duration) : options.stateful.duration;
    }

    if (options.stateless) {
      this.statelessDuration = options.stateless.duration;
      this.statelessScheme = options.stateless.scheme;
    }
  }

  /**
   * Save a session to the session store returning an encrypted version
   * of the session ID. If `cookieOptions` is enabled it will save the
   * session ID to a cookie based off the config.
   * @param key session ID of the session
   * @param value session to save
   * @param res response to set cookies. Make sure to pass this if
   * `cookieOptions` is enabled
   */
  async saveSession(key: string, value: any, res?: Response) {
    if (!this.store) {
      throw new Error("Stateful sessions are not enabled");
    }

    const oldSession = await this.store.get(key);
    if (oldSession) {
      await this.destroySession(key);
    }

    const sessionID = await asyncRandomString(32);
    // save the session data using session ID
    await this.store.set(sessionID, { key, value }, this.statefulDuration);
    // link the session ID to the session key
    await this.store.set(key, sessionID, this.statefulDuration);

    if (this.cookieOptions) {
      if (!res) throw new Error("You must pass a response so a cookie can be created");

      res.cookie(this.cookieOptions.name, sessionID, this.cookieOptions);
    }

    return sessionID;
  }

  /**
   * Create an expiring token
   * @param value value to encode in the token
   */
  headless(value: any) {
    if (!this.statelessScheme) {
      throw new Error("Stateless sessions are not enabled");
    }

    return seal(value, this.secret, this.statelessDuration);
  }

  autoload(parserOpts?: CookieParseOptions) {
    const parser = cookieParser(null, parserOpts);
    return async (req: Request, res: Response, next: NextFunction) => {
      return parser(req, res, async err => {
        try {
          if (err) return next(err);

          let session: any;

          session = await this.loadCookieSession(req, res);
          if (session) return next();

          session = await this.loadBearerSession(req);
          if (session) return next();

          session = await this.loadToken(req);
          next();
        } catch (err) {
          next(new InvalidSessionError("Your session is invalid. Please log in"));
        }
      });
    };
  }

  authCheck(req: Request, res: Response, next: NextFunction) {
    if (!req.session) {
      throw new NoAuthenticationError("There's no session associated with this request");
    }
    next();
  }

  /**
   * Remove a session from the session store. If a `Response` is
   * passed and cookies are enabled, it will clear the cookie
   * @param key session ID of session to destroy
   * @param res optional response for clearing the cookie.
   */
  async destroySession(key: string, res?: Response) {
    if (!this.store) {
      throw new Error("Can't destroy session when stateful sessions are not enabled");
    }

    const sessionID = await this.store.get<string>(key);

    this.store.remove(key);
    this.store.remove(sessionID);

    if (res && this.cookieOptions) {
      res.clearCookie(this.cookieOptions.name, this.cookieOptions);
    }
  }

  private async loadCookieSession(req: Request, res: Response) {
    if (!this.store || !this.cookieOptions) {
      return null;
    }
    const { name } = this.cookieOptions;
    const cookieSession = req.cookies && req.cookies[name];

    if (!cookieSession) {
      return null;
    }

    const { value } = await this.store.get<any>(cookieSession);
    Object.assign(req, {
      session: value,
      sessionID: cookieSession
    });

    // extend cookie expiry
    res.cookie(name, cookieSession, this.cookieOptions);
    return req.session;
  }

  private async loadBearerSession(req: Request) {
    const authSession = req.headers.authorization;

    if (!authSession) {
      return null;
    }

    const [scheme, token] = authSession.split(/\s+/);

    if (scheme !== "Bearer" || !this.store) {
      return null;
    }

    const redisSession: any = await this.store.get(token);
    if (!redisSession) {
      throw new Error("We could not find a session for your token");
    }

    const { value, key } = redisSession;
    req.sessionID = token;
    req.session = value;

    // extend it's time in prison
    await this.store.set(token, { key, value }, this.statefulDuration);
    // save the session data using session ID
    await this.store.set(key, token, this.statefulDuration);

    return req.session;
  }

  private async loadToken(req: Request) {
    const authSession = req.headers.authorization;

    if (!authSession) {
      return null;
    }

    const [scheme, token] = authSession.split(/\s+/);

    if (!this.statelessScheme || scheme !== this.statelessScheme) {
      return null;
    }

    req.session = await unseal(token, this.secret);
    return req.session;
  }

  /**
   * Create a 32 char single use token for a particular duration
   * @param value value to save in the token
   * @param duration duration of token validaty. See `SessionConfig`
   */
  async commission(value: any, duration: string) {
    const token = await asyncRandomString(32);
    this.store.set(`TIMED:${token}`, value, ms(duration));

    return token;
  }

  /**
   * Load the given token and make it impossible to reuse it.
   * @param token is the string generated by `commission`
   */
  async decommission<T = any>(token: string) {
    const value = await this.store.get<T>(`TIMED:${token}`);
    if (!value) {
      throw new TokenExpiredError("Your token has expired", new Date());
    }

    await this.store.remove(`TIMED:${token}`);

    return value;
  }

  /**
   * Loads the token and gives a view into its contents without decommissioning it.
   * @param token is the string generated by the `commission` function
   */
  async peek<T = any>(token: string) {
    const value = await this.store.get<T>(`TIMED:${token}`);
    if (!value) {
      throw new TokenExpiredError("Your token has expired", new Date());
    }
    return value;
  }

  /**
   * Loads the token and gives a view into its contents without decommissioning it while
   * extending it's expiration by `duration`
   * @param token is the string generated by the `commission` function
   */
  async refresh<T = any>(token: string, duration: string) {
    const tokenKey = `TIMED:${token}`;
    const value = await this.store.get<T>(tokenKey);
    if (!value) {
      throw new TokenExpiredError("Your token has expired", new Date());
    }

    // set the token again
    await this.store.set(tokenKey, value, ms(duration));

    return value;
  }

  /**
   * Resets a session to the value provided returning an encrypted version
   * of the session ID. If `cookieOptions` is enabled it will save the
   * session ID to a cookie based off the config.
   * @param key session ID of the session
   * @param value session to save
   * @param res response to set cookies. Make sure to pass this if
   * `cookieOptions` is enabled
   */
  async refreshSession(key: string, value: any, res?: Response) {
    if (!this.store) {
      throw new Error("Stateful sessions are not enabled");
    }

    const sessionID: string = await this.store.get(key);
    if (!sessionID) {
      throw new NoAuthenticationError("There's no session associated with this request");
    }

    // save the session data using session ID
    await this.store.set(sessionID, { key, value }, this.statefulDuration);

    if (this.cookieOptions) {
      if (!res) throw new Error("You must pass a response so a cookie can be created");

      res.cookie(this.cookieOptions.name, sessionID, this.cookieOptions);
    }

    return sessionID;
  }
}
