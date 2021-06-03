import { BaseRepository } from "@random-guys/bucket";
import mongoose from "mongoose";
import { VoiceSchema } from "./voice.schema";
import { Voice } from "./voice.model";
import { Session } from "../user";

class VoiceRepository extends BaseRepository<Voice> {
  constructor() {
    super(mongoose.connection, "Voice", VoiceSchema);
  }

  async report(voice: Voice, session: Session) {
    return this.create({
      callback_url: voice?.callback_url,
      call_id: voice?.id,
      ref_id: voice?.ref_id,
      recipient: voice?.recipient,
      caller_id: voice?.caller_id,
      status: voice?.status,
      price: voice?.price,
      account_balance: voice?.account_balance,
      error_code: voice?.error_code,
      error_reason: voice?.error_reason,
      call_start_time: voice?.call_start_time,
      call_end_time: voice?.call_end_time,
      call_connect_time: voice?.call_connect_time,
      media_duration: voice?.media_duration,
      key_pressed: voice?.key_pressed,
      media_url: voice?.media_url,
      workspace: session?.workspace,
      api_token: voice?.api_token,
      event_timestamp: voice?.event_timestamp,
      queued: voice?.queued,
      timestamp: voice?.timestamp,
      cmd: voice?.cmd
    });
  }
}

export const VoiceRepo = new VoiceRepository();
