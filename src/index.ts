import "module-alias/register";
import "reflect-metadata";
import http from "http";
import { App } from "./server/app";
import dotenv from "dotenv";
// import { rAmqp } from "./common/services/amqp";
import logger from "./common/services/logger";

dotenv.config();

const start = async () => {
  try {
    const app = new App();
    const appServer = app.getServer().build();

    // connect to MongoDB
    await app.connectDB();
    logger.message("📦  MongoDB Connected!");

    // connect to amqp
    // await rAmqp.init(process.env.amqp_url)
    // logger.message("🐰  Amqp Connected!");

    // start server
    const httpServer = http.createServer(appServer);
    httpServer.listen(process.env.PORT);
    httpServer.on("listening", () => logger.message(`🚀  ${process.env.service_name} listening on ` + process.env.port));
  } catch (err) {
    logger.error(err, "Fatal server error");
  }
};

start();
