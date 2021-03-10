import multer = require("multer");
import { CSV_MIME, XLSX_MIME } from "@app/services/extraction";
import { ConstraintError } from "@random-guys/siber";
import { compose } from "@random-guys/siber";
import { Auth } from "@app/common/services";
import { because } from "@app/common/services/authorisation";

export const canCreateDefaulters = compose(
  Auth.authCheck,
  because("You are not allowed to perform this operation", "loan_admin")
)

const storage = multer.memoryStorage();
const upload = <any>multer({
  storage: storage,
  fileFilter(_req, file, cb) {
    if (file.mimetype === CSV_MIME || file.mimetype === XLSX_MIME) {
      return cb(null, true);
    }

    cb(new ConstraintError("Only CSV and XLSX files are supported for extraction"));
  }
});

export const isUpload = upload.single("defaulters");
