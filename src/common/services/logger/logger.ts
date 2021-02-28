import Logger, { createLogger } from "bunyan";
import { createRequestSerializer, errSerializer, resSerializer } from "@random-guys/siber";
import dotenv from "dotenv";

dotenv.config();

export const Log: Logger = createLogger({
  name: process.env.service_name,
  serializers: {
    err: errSerializer,
    res: resSerializer,
    req: createRequestSerializer()
  }
});
