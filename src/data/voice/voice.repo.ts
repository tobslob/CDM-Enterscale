import { BaseRepository } from "@random-guys/bucket";
import mongoose from "mongoose";
import { VoiceSchema } from "./voice.schema";
import { Voice, VoiceReportQuery } from "./voice.model";
import { fromQueryMap } from "../util";

class VoiceRepository extends BaseRepository<Voice> {
  constructor() {
    super(mongoose.connection, "Voice", VoiceSchema);
  }

  async report(voice: Voice) {
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
      api_token: voice?.api_token,
      event_timestamp: voice?.event_timestamp,
      queued: voice?.queued,
      timestamp: voice?.timestamp,
      cmd: voice?.cmd,
      workspace: voice.workspace
    });
  }

  async searchVoiceReports(workspace: string, query?: VoiceReportQuery) {
    let conditions = fromQueryMap(query, {
      call_id: { call_id: query.call_id },
      recipient: { phoneNumber: query.recipient },
      status: { status: query.status }
    });

    conditions = {
      ...conditions,
      workspace
    };

    const limit = Number(query.limit);
    const offset = Number(query.offset);

    return new Promise<Voice[]>((resolve, reject) => {
      let directQuery = this.model.find(conditions).skip(offset).sort({ created_at: -1 });

      if (query.limit !== 0) {
        directQuery = directQuery.limit(limit);
      }

      return directQuery.exec((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

export const VoiceRepo = new VoiceRepository();
