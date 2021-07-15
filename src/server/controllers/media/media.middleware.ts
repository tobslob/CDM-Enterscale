import multer from "multer";
import { ConstraintError } from "@app/data/util";
import uuid from "uuid/v4";

const PNG_MIME = "image/png";
const JPEG_MIME = "image/jpeg";
const MP3_MINE = "audio/mpeg";
const MP4_MINE = "video/mp4";
const THREE_MEGABYTES = 5 * 1024 * 1024;;

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    const fileExt = file.originalname.split(".").pop();
    const filename = `${uuid()}.${fileExt}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: THREE_MEGABYTES, files: 5 },
  fileFilter(_req, file, cb) {
    if (file.mimetype === PNG_MIME || file.mimetype === JPEG_MIME || MP3_MINE || MP4_MINE) {
      return cb(null, true);
    }

    cb(new ConstraintError("Only jpeg, png, wav, mp3, and mp4 are allow."));
  }
});

export const isUpload = upload.single("upload");
