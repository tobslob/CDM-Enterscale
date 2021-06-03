import "module-alias/register";
import "reflect-metadata";
import bodyparser from "body-parser";
import responseTime from "response-time";
import { getRouteInfo, InversifyExpressServer } from "inversify-express-utils";
import mongoose, { Connection } from "mongoose";
import container from "../common/config/ioc";
import { Application, Request, Response } from "express";
import { Store, Auth } from "@app/common/services";
import { secureMongoOpts, defaultMongoOpts } from "@random-guys/bucket";
import { errors } from "@app/data/util";
import cors from "cors";
import dotenv from "dotenv";
import { cloudinaryConfig } from "@app/common/config/cloudinary";
import express from "express";

dotenv.config();

export class App {
  db: Connection;
  private server: InversifyExpressServer;
  constructor() {
    this.server = new InversifyExpressServer(container, null, {
      rootPath: process.env.api_version
    });

    // setup server-level middlewares
    this.server.setConfig((app: Application) => {
      app.enabled("x-powered-by");

      // automatically load sessions
      app.use(Auth.autoload());

      app.use(responseTime());
      app.use(bodyparser.urlencoded({ extended: true }));
      app.use(bodyparser.json());
      app.use(express.text())

      // Handle image upload
      app.use('*', cloudinaryConfig);

      // CORS
      const domains = ["enterscale--client.herokuapp.com"];
      const corsConf = {
        origin: [/localhost/, ...domains.map(domain => new RegExp(`${domain}$`))],
        credentials: true
      };

      app.use(function (_req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

      app.use(cors(corsConf));
      app.options("*", cors(corsConf));
    });

    this.server.setErrorConfig((app: Application) => {
      // expose index endpoint
      app.get("/", (_req: Request, res: Response) => {
        if (mongoose.connections.every(conn => conn.readyState !== 1)) {
          return res.status(500).send("MongoDB is not ready");
        }

        res.status(200).json({
          status: "success",
          data: { message: "Welcome To Enterscale" }
        });
      });

      // register 404 route handler
      app.use((_req, res, _next) => {
        res.status(404).json({
          status: "error",
          data: { message: "Route Not Found" }
        });
      });

      // handle thrown error
      app.use(errors);
    });
  }

  printRoutes() {
    const routeInfo = getRouteInfo(container);
    console.log(JSON.stringify(routeInfo));
  }

  getServer = () => this.server;

  async connectDB() {
    await Store.connect();
    await mongoose.connect(process.env.mongodb_url, {
      ...(process.env.is_production
        ? secureMongoOpts({
            mongodb_url: process.env.mongodb_url,
            mongodb_username: process.env.mongodb_username,
            mongodb_password: process.env.mongodb_password
          })
        : defaultMongoOpts)
    });
    this.db = mongoose.connection;
  }

  /**
   * Closes MongoDB and Redis connection
   */
  async closeDB() {
    await mongoose.disconnect();
    await Store.quit();
  }
}
