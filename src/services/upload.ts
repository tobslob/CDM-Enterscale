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
 * @param {Object} file - a proccessed file
 * @param {Object} index - the index of the file
 * @returns {Object} - return the uploaded image url
 */
const uploadSingleFile = async (file, index) => {
  const { secure_url } = await uploader.upload(file, {
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
    allowedFormats: ["jpg", "jpeg", "png", "gif", "svg"]
  });

  return secure_url;
};

/**
 * a middleware to upload image
 * @param req - request object
 * @param res - response object
 */
const uploadImage = async (req: Request, _res: Response) => {
  try {
    if (!req.files) {
      throw new ConstraintError("Atleast one book cover should be uploaded.");
    }
    const files = extractFiles(req.files);
    const imageUrls = await Promise.all(files.map((file, index) => uploadSingleFile(file, index)));
    req["imageUrls"] = imageUrls;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default uploadImage;
