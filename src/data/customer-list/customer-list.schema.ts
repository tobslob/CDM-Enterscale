import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { Schema } from "mongoose";
import { uuid } from "@app/data/util";

export const CustomerSchema = new Schema(
  {
    _id: { ...uuid },
    title: { ...trimmedString, required: true, index: true, unique: true },
    request_id: { ...trimmedString, index: true },
    workspace: { ...trimmedString, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
