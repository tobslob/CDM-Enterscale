import { uploader } from "@app/common/config/cloudinary";
import { Request, Response } from "express";
import { generate } from "shortid";
import { ConstraintError } from "@app/data/util";
import fs from "fs";

/**
 * a function that is used to upload the supplied image to the cloud
 * @param file - a proccessed file
 * @param index - the index of the file
 * @returns string - return the uploaded image url
 */
const uploadSingleFile = async (file: string) => {
  const { secure_url } = await uploader.upload(file, {
    resource_type: "raw",
    public_id: generate(),
    overwrite: true,
    folder: "qx-items",
    transformation: [
      {
        width: 500,
        height: 250,
        crop: "scale",
        quality: "auto"
      }
    ],
    allowedFormats: ["jpg", "jpeg", "png", "gif", "svg", "mp4", "mp3", "wav"]
  });

  return secure_url;
};

/**
 * a middleware to upload image
 * @param req - request object
 * @param res - response object
 */
const uploadMedia = async (req: Request, _res: Response) => {
  try {
    if (!req.file) {
      throw new ConstraintError("An upload is required.");
    }

    const { path } = req.file;

    const url = await uploadSingleFile(path);
    req["url"] = url;

    fs.unlinkSync(path);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default uploadMedia;
