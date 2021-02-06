import { createRequestSerializer, errSerializer, resSerializer } from "@app/data/util";
import Logger, { createLogger } from "bunyan";
import IORedis from "ioredis";
import { RedisStore, SessionService } from "@random-guys/sp-auth";
import dotenv from "dotenv";

dotenv.config();

export const Log: Logger = createLogger({
  name: process.env.service_name,
  serializers: {
    err: errSerializer,
    res: resSerializer,
    req: createRequestSerializer("password")
  }
});

export const Store = new IORedis(
  process.env.redis_url,
  process.env.is_production ? { lazyConnect: true, password: process.env.redis_password } : { lazyConnect: true }
);
Store.on("ready", () => Log.info("🐳 Redis Connected!"));
Store.on("error", err => Log.error(err, "An error occured with the Redis client."));

export const Auth = new SessionService({
  secret: process.env.service_secret,
  stateful: {
    duration: process.env.stateful_session_duration,
    store: new RedisStore(Store)
  },
  stateless: {
    duration: process.env.stateless_session_duration,
    scheme: process.env.auth_scheme
  }
});
