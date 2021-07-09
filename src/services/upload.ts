import Datauri from "datauri/parser";
import { uploader } from "@app/common/config/cloudinary";
import { Request, Response } from "express";
import path from "path";
import { generate } from "shortid";
import { ConstraintError } from "@app/data/util";

const parser = new Datauri();

/**
 * extract the content of a raw file
 * @param file - the raw file
 */
const extractSingleFile = file => {
  return parser.format(path.extname(file.originalname).toString(), file.buffer).content;
};

/**
 * extract the content of the supplied raw files
 * @param files - the list of the raw files
 */
const extractFiles = files => files.map(file => extractSingleFile(file));

/**
 * a function that is used to upload the supplied image to the cloud
 * @param file - a proccessed file
 * @param index - the index of the file
 * @returns string - return the uploaded image url
 */
const uploadSingleFile = async (file: any, index: number) => {
  const { secure_url } = await uploader.upload(file, {
    resource_type: "raw",
    public_id: `${generate()}-${index}`,
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
    if (!req.files) {
      throw new ConstraintError("Atleast one upload is required.");
    }
    const files = extractFiles(req.files);
    const urls = await Promise.all(files.map((file, index) => uploadSingleFile(file, index)));
    req["urls"] = urls;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default uploadMedia;
