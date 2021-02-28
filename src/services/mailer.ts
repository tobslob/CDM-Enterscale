import template from "lodash/template";
import mjml from "mjml";
import sendGrid from "@sendgrid/mail";
import dotenv from "dotenv";
import fs from "fs"

dotenv.config();

export class MjmlError extends Error {
  readonly line: number;
  readonly message: string;
  readonly tagName: string;
  readonly formattedMessage: string;

  constructor(error: any) {
    super(error.message);
    this.line = error.line;
    this.tagName = error.tagName;
    this.formattedMessage = error.formattedMessage;
  }
}

export interface MailDTO {
  subject: string;
  from: string;
  to: string;
  html: string;
}

class MailServices {
  constructor(apiKey: string) {
    sendGrid.setApiKey(apiKey);
  }

  mailLoader<T extends object>(file: string) {
    return async function loader(data: T) {
      const mjmlTemplateRaw = await fs.promises.readFile(`./src/services/templates/${file}`, "utf-8");

      // mjml template with data
      const mjmlTemplate = template(mjmlTemplateRaw)(data);

      // html template
      let { errors, html } = mjml(mjmlTemplate);
      if (errors.length === 0) {
        return html;
      }

      throw new MjmlError(errors[0]);
    };
  }

  send(mail: MailDTO) {
    return sendGrid.send(mail);
  }
}

export const Mailer = new MailServices(process.env.sendgrid_key);
