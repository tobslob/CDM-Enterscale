import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";
import { uuid } from "@app/data/util";

export const VoiceSchema = new Schema(
  {
    _id: { ...uuid },
    isActive: { type: SchemaTypes.Mixed, index: true },
    sessionId: { ...trimmedString, index: true },
    direction: { ...trimmedString, index: true },
    channel: { ...trimmedString, index: true },
    amount: { type: SchemaTypes.Mixed, index: true },
    callerNumber: { ...trimmedString, index: true },
    destinationNumber: { type: SchemaTypes.Date, index: true },
    dtmfDigits: { type: SchemaTypes.Date, index: true },
    recordingUrl: { ...trimmedString, index: true },
    durationInSeconds: { ...trimmedString, index: true },
    currencyCode: { ...trimmedString, index: true },
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
