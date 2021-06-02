import { BaseRepository } from "@random-guys/bucket";
import mongoose from "mongoose";
import { VoiceSchema } from "./voice.schema";
import { Voice } from "./voice.model";

class VoiceRepository extends BaseRepository<Voice> {
  constructor() {
    super(mongoose.connection, "Voice", VoiceSchema);
  }

  async report(voice: Voice) {
    return this.create({
      ref_id: voice.ref_id,
      recipient: voice.recipient,
      caller_id: voice.caller_id,
      status: voice.status,
      price: voice.price,
      balance: voice.balance,
      error_code: voice.error_code,
      error_reason: voice.error_reason,
      call_start_time: voice.call_start_time,
      call_end_time: voice.call_end_time,
      call_connect_time: voice.call_connect_time,
      media_duration: voice.media_duration,
      key_pressed: voice.key_pressed,
      media_url: voice.media_url,
      workspace: voice.workspace
    });
  }
}

export const VoiceRepo = new VoiceRepository();
