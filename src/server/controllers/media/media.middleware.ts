import multer from "multer";
import uuid from "uuid/v4";
import { UnSupportedFileError } from "@app/data/util";

const PNG_MIME = "image/png";
const JPEG_MIME = "image/jpeg";
const JPG_MIME = "image/jpg";
const MP3_MINE = "audio/mpeg";
const MP4_MINE = "video/mp4";
const FIVE_MEGABYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    const fileExt = file.originalname.split(".").pop();
    const filename = `${uuid()}.${fileExt}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: FIVE_MEGABYTES, files: 1 },
  fileFilter(_req, file, cb) {
    if (
      file.mimetype == PNG_MIME ||
      file.mimetype == JPEG_MIME ||
      file.mimetype == JPG_MIME ||
      file.mimetype == MP3_MINE ||
      file.mimetype == MP4_MINE
    ) {
      return cb(null, true);
    }

    cb(new UnSupportedFileError("Only jpeg, png, wav, mp3, and mp4 are allowed."));
  }
});

export const isUpload = upload.single("upload");
