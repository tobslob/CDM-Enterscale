import Datauri from "datauri/sync";
import { uploader } from "@app/common/config/cloudinary";
import { Request } from "express";
import FormData from "form-data";

export const uploadMedia = (filePath: string) =>{
  const form = new FormData();
  form.append("voice", filePath);

  return form;
}

const extractSingleFile = async (filePath) => {
  const meta = Datauri(filePath);
  return meta.content;
};

const uploadSingleFile = async (file: string, req: Request) => {
  const { secure_url: imageUrl } = await uploader.upload(file, {
    resource_type: "raw",
    public_id: `${req.session.workspace}`,
    overwrite: true,
    folder: "voice",
    allowed_formats: ["jpg", "jpeg", "png", "mp3", "wav"]
  });

  return imageUrl;
};

export const uploadFile = async (req: Request) => {
  try {
    if (!req.file) throw new Error("File is required for upload.");
    const file = await extractSingleFile(req.file.path);
    return await uploadSingleFile(file, req);
  } catch (error) {
    throw new Error(error.response);
  }
};
