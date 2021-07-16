import multer from "multer";
// import { ConstraintError } from "@app/data/util";
import uuid from "uuid/v4";
import { UnSupportedFileError } from "@app/data/util";

const PNG_MIME = "image/png";
const JPEG_MIME = "image/jpeg";
const MP3_MINE = "audio/mpeg";
const MP4_MINE = "video/mp4";
const FIVE_MEGABYTES = 5 * 1024 * 1024;;

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    const fileExt = file.originalname.split(".").pop();
    const filename = `${uuid()}.${fileExt}`;
    cb(null, filename);
  },
});

const fileType = PNG_MIME || JPEG_MIME || MP3_MINE || MP4_MINE

const upload = multer({
  storage: storage,
  limits: { fileSize: FIVE_MEGABYTES, files: 1 },
  fileFilter(_req, file, cb) {
    if (file.mimetype == fileType) {
      return cb(null, true);
    }

    cb(new UnSupportedFileError("Only jpeg, png, wav, mp3, and mp4 are allowed."));
  }
});

export const isUpload = upload.single("upload");
