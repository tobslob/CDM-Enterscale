import { Schema, SchemaTypes } from "mongoose";
import { trimmedString, readMapper, timestamps, uuid } from "../util";
import { generate } from "shortid";

export const UrlShortnerSchema = new Schema(
  {
    _id: { ...uuid },
    long_url: { ...trimmedString, required: true, index: true },
    short_url: { ...trimmedString, required: true, index: true , default: generate },
    click_count: { type: SchemaTypes.Number, required: true, default: 0 },
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
