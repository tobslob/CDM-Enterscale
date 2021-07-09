import { config, v2 } from "cloudinary";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const cloudinaryConfig = (_req: Request, _res: Response, next: NextFunction) => {
  config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
  });
  next();
};

const { uploader } = v2;
export { cloudinaryConfig, uploader };
