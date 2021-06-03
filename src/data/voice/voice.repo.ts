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
      callback_url: voice?.callback_url,
      data: {
        id: voice.data?.id,
        ref_id: voice.data?.ref_id,
        recipient: voice.data?.recipient,
        caller_id: voice.data?.caller_id,
        status: voice.data?.status,
        price: voice.data?.price,
        account_balance: voice.data?.account_balance,
        error_code: voice.data?.error_code,
        error_reason: voice.data?.error_reason,
        call_start_time: voice?.data.call_start_time,
        call_end_time: voice.data?.call_end_time,
        call_connect_time: voice.data?.call_connect_time,
        media_duration: voice.data?.media_duration,
        key_pressed: voice.data?.key_pressed,
        media_url: voice.data?.media_url,
        workspace: voice.data?.workspace,
        api_token: voice.data?.api_token,
        event_timestamp: voice.data?.event_timestamp,
        queued: voice.data?.queued,
        timestamp: voice.data?.timestamp
      },
      api_token: voice?.api_token,
      cmd: voice?.cmd
    });
  }
}

export const VoiceRepo = new VoiceRepository();
