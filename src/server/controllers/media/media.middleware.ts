import multer from "multer";
import { ConstraintError } from "@app/data/util";

const PNG_MIME = "image/png";
const JPEG_MIME = "image/jpeg";
const MP3_MINE = "audio/mpeg";
const MP4_MINE = "video/mp4";
const TEN_MEGABYTES = 3 * 1024 * 1024;;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: TEN_MEGABYTES, files: 1 },
  fileFilter(_req, file, cb) {
    if (file.mimetype === PNG_MIME || file.mimetype === JPEG_MIME || MP3_MINE || MP4_MINE) {
      return cb(null, true);
    }

    cb(new ConstraintError("Only jpeg or png is allow."));
  }
});

export const isUpload = upload.array("uploads");
