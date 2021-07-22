import { Schema } from "mongoose";
import { trimmedLowercaseString, readMapper, timestamps, uuid } from "../util";

export const EmailTemplateSchema = new Schema(
  {
    _id: { ...uuid },
    name: { ...trimmedLowercaseString, index: true },
    identifier: { ...trimmedLowercaseString, unique: true, index: true },
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
