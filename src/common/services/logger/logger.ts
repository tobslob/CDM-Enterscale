import bunyan from 'bunyan';
import { Request, Response } from 'express';
import { reqSerializer, resSerializer, errSerializer } from './serializers';
import dotenv from "dotenv";

dotenv.config();

interface ILogger {
  error(err: Error, message?: any);
  message(message: any);
  logAPIRequest(req: Request);
  logAPIResponse(req: Request, res: Response);
  logAPIError(req: Request, res: Response, err: Error);
}

class Logger implements ILogger {
  private log: bunyan;
  constructor(name: string = process.env.service_name) {
    this.log = bunyan.createLogger({
      name,
      serializers: {
        err: errSerializer,
        res: resSerializer,
        req: reqSerializer,
      },
    });

    /**
     * Overrides the default bunyan log fields and formats it into a format Logstash/Elastic Search
     * understands (for uniform indexing) in production or staging.
     */
    if (['production', 'staging'].includes(process.env.app_env)) {
      // @ts-ignore
      this.log._emit = (rec, noemit) => {
        rec.message = rec.msg;
        rec.timestamp = rec.time;

        delete rec.msg;
        delete rec.time;
        delete rec.v;

        //@ts-ignore
        // Call the default bunyan emit function with the modified log record
        bunyan.prototype._emit.call(this.log, rec, noemit);
      };
    }
  }

  /**
   * Logs an error along with information describing the
   * error.
   * @param err Error object
   * @param info Additional information about the error.
   */
  error(err: Error, info?: any) {
    return this.log.error({ err, ...(typeof info === 'string' ? { info } : info) });
  }

  /**
   * Logs arbitrary data
   * @param message Arbitrary data to be logged
   */
  message(message: any) {
    return this.log.info(message);
  }

  /**
   * Logs an incoming HTTP request
   * @param req Express request
   */
  logAPIRequest(req: Request) {
    return this.log.info({ req });
  }

  /**
   * Logs an outgoing HTTP response
   * @param req Express request
   * @param res Express responser
   */
  logAPIResponse(req: Request, res: Response) {
    return this.log.info({
      res,
      req,
    });
  }

  /**
   * Logs an error that occured during an operation
   * initiated via a HTTP request
   * @param req Express request
   * @param res Express responser
   * @param err Error object
   */
  logAPIError(req: Request, res: Response, err: Error) {
    return this.log.error({
      err,
      res,
      req,
    });
  }
}

export default new Logger();
