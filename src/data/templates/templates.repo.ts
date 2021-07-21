import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { Template, EmailTemplateSchema, TemplateDTO } from ".";

export class TemplateRepository extends BaseRepository<Template> {
  constructor() {
    super(mongoose.connection, "Templates", EmailTemplateSchema);
  }

  async createTemplate(template: TemplateDTO) {
    return this.create({
      name: template.name,
      identifier: template.identifier
    });
  }

  async getTemplate(id: string) {
    return this.byID(id);
  }

  async getAllTemplate() {
    return this.all({});
  }
}

export const TemplateRepo = new TemplateRepository();
