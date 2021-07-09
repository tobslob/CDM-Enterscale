import { Schema, SchemaTypes } from "mongoose";
import { trimmedString, readMapper, timestamps, uuid } from "../util";

export const UrlShortnerSchema = new Schema(
  {
    _id: { ...uuid },
    long_url: { ...trimmedString, required: true, index: true },
    short_url: { ...trimmedString, required: true, index: true, unique: true },
    click_count: { type: SchemaTypes.Number, required: true, default: 0 }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
