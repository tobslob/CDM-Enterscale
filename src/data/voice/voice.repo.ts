import { BaseRepository } from "@random-guys/bucket";
import mongoose from "mongoose";
import { VoiceSchema } from "./voice.schema";
import { Voice } from "./voice.model";

class VoiceRepository extends BaseRepository<Voice> {
  constructor() {
    super(mongoose.connection, "Voice", VoiceSchema);
  }

  async createVoice(voice: Voice) {
    return this.create({
      isActive: voice.isActive,
      sessionId: voice.sessionId,
      direction: voice.direction,
      callerNumber: voice.callerNumber,
      destinationNumber: voice.destinationNumber,
      dtmfDigits: voice.dtmfDigits,
      recordingUrl: voice.recordingUrl,
      durationInSeconds: voice.durationInSeconds,
      currencyCode: voice.currencyCode,
      amount: voice.amount
    });
  }
}

export const VoiceRepo = new VoiceRepository();
