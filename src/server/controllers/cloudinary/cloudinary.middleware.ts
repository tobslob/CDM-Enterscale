import multer from "multer";
import { ConstraintError } from "@app/data/util";

const PNG_MIME = "image/png";
const JPEG_MIME = "image/jpeg";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter(_req, file, cb) {
    if (file.mimetype === PNG_MIME || file.mimetype === JPEG_MIME) {
      return cb(null, true);
    }

    cb(new ConstraintError("Only jpeg or png is allow."));
  }
});

export const isUpload = upload.array("images");
