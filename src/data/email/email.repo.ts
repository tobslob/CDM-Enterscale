import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { Email } from "./email.model";
import { EmailTrackerSchema } from "./email.schema";

export class MailRepository extends BaseRepository<Email> {
  constructor() {
    super(mongoose.connection, "EmailTracker", EmailTrackerSchema);
  }

  async tracker(workspace: string, message_id: string) {
    return this.create({
      message_id,
      workspace
    });
  }
}

export const Mail = new MailRepository();
