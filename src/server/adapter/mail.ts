import { Log } from "@app/common/services/logger";
import { Mailer } from "@app/services/mailer";
import joi from "@hapi/joi";
import { Adapter } from "./base";
import dotenv from "dotenv";
import { JoiValidator } from "@app/data/util";
import { Notification } from "@app/data/notification";

dotenv.config();

export interface MailNotification extends Notification {
  /**
   * subject of the email
   */
  subject: string;
  /**
   * name of the template in kebab case
   */
  template: string;
  /**
   * variables to be used for generating the message off the template
   */
  template_vars: any;
}

class MailAdapter implements Adapter {
  private templates = {};

  getTemplates() {
    return Object.keys(this.templates);
  }

  createTemplate(name: string, fn: (x: any) => Promise<string>) {
    this.templates[name] = fn;
  }

  getTemplate(tmplName: string) {
    const tmplFn = this.templates[tmplName];

    if (!tmplFn) {
      throw new Error(`There's no template named ${tmplName}`);
    }

    return tmplFn;
  }

  async send(rawNoty: MailNotification) {
    const { value, error } = isMailNotification.validate(rawNoty, {
      abortEarly: false,
      stripUnknown: true
    });

    // ignore invalid notifications
    if (error) {
      Log.error(error, "Failed to validate email notification");
      return;
    }

    const templateFn = this.templates[rawNoty.template];
    const [resp] = await Mailer.send({
      from: process.env.mail_sender_address,
      to: value.recipient,
      subject: value.subject,
      html: await templateFn(value.template_vars)
    });

    return resp;
  }
}

export const AdapterInstance = new MailAdapter();

// welcome mail to onboarded users
AdapterInstance.createTemplate("welcome-mail", Mailer.mailLoader("welcome-mail.mjml"));
// Reset password
AdapterInstance.createTemplate("reset-password-mail", Mailer.mailLoader("reset-password-mail.mjml"));
// campaign mail
AdapterInstance.createTemplate("campaign-template", Mailer.mailLoader("campaign-template.mjml"));
AdapterInstance.createTemplate("congratulations", Mailer.mailLoader("congratulations.mjml"));
AdapterInstance.createTemplate("happy-anniversary-1", Mailer.mailLoader("happy-anniversary-1.mjml"));
AdapterInstance.createTemplate("happy-anniversary-2", Mailer.mailLoader("happy-anniversary-2.mjml"));
AdapterInstance.createTemplate("happy-birthday-1", Mailer.mailLoader("happy-birthday-1.mjml"));
AdapterInstance.createTemplate("happy-birthday-2", Mailer.mailLoader("happy-birthday-2.mjml"));
AdapterInstance.createTemplate("happy-birthday-3", Mailer.mailLoader("happy-birthday-3.mjml"));
AdapterInstance.createTemplate("happy-holiday-1", Mailer.mailLoader("happy-holiday-1.mjml"));
AdapterInstance.createTemplate("happy-holiday-2", Mailer.mailLoader("happy-holiday-2.mjml"));
AdapterInstance.createTemplate("loan-repayment-1", Mailer.mailLoader("loan-repayment-1.mjml"));
AdapterInstance.createTemplate("loan-repayment-2", Mailer.mailLoader("loan-repayment-2.mjml"));
AdapterInstance.createTemplate("loan-repayment-3", Mailer.mailLoader("loan-repayment-3.mjml"));
AdapterInstance.createTemplate("season-greetings-1", Mailer.mailLoader("season-greetings-1.mjml"));
AdapterInstance.createTemplate("special-offer", Mailer.mailLoader("special-offer.mjml"));
AdapterInstance.createTemplate("special-reward-1", Mailer.mailLoader("special-reward-1.mjml"));
AdapterInstance.createTemplate("special-reward-2", Mailer.mailLoader("special-reward-2.mjml"));
AdapterInstance.createTemplate("thank-you-1", Mailer.mailLoader("thank-you-1.mjml"));
AdapterInstance.createTemplate("thank-you-2", Mailer.mailLoader("thank-you-2.mjml"));
AdapterInstance.createTemplate("we-are-sorry-1", Mailer.mailLoader("we-are-sorry-1.mjml"));
AdapterInstance.createTemplate("we-are-sorry-2", Mailer.mailLoader("we-are-sorry-2.mjml"));
AdapterInstance.createTemplate("we-are-sorry-3", Mailer.mailLoader("we-are-sorry-3.mjml"));

export const isMailNotification = joi.object({
  subject: JoiValidator.validateString().required(),
  recipient: JoiValidator.validateEmail(),
  template: JoiValidator.validateString()
    .valid(...AdapterInstance.getTemplates())
    .required(),
  template_vars: joi.object()
});

export default AdapterInstance;
