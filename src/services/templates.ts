import "module-alias/register";
import "reflect-metadata";
import { TemplateDTO, TemplateRepo } from "@app/data/templates";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { secureMongoOpts, defaultMongoOpts } from "@random-guys/bucket";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.mongodb_url, {
    ...(process.env.is_production
      ? secureMongoOpts({
          mongodb_url: process.env.mongodb_url,
          mongodb_username: process.env.mongodb_username,
          mongodb_password: process.env.mongodb_password
        })
      : defaultMongoOpts)
  });

  const templates: TemplateDTO[] = [
    {
      name: "Congratulations",
      identifier: "congratulations.mjml"
    },
    {
      name: "Happy Anniversary",
      identifier: "happy-anniversary-1.mjml"
    },
    {
      name: "Happy Anniversary",
      identifier: "happy-anniversary-2.mjml"
    },
    {
      name: "Happy Birthday",
      identifier: "happy-birthday-1.mjml"
    },
    {
      name: "Happy Birthday",
      identifier: "happy-birthday-2.mjml"
    },
    {
      name: "Happy Birthday",
      identifier: "happy-birthday-3.mjml"
    },
    {
      name: "Happy Holiday",
      identifier: "happy-holiday-1.mjml"
    },
    {
      name: "Happy Holiday",
      identifier: "happy-holiday-2.mjml"
    },
    {
      name: "Loan Repayment",
      identifier: "loan-repayment-1.mjml"
    },
    {
      name: "Loan Repayment",
      identifier: "loan-repayment-2.mjml"
    },
    {
      name: "Loan Repayment",
      identifier: "loan-repayment-3.mjml"
    },
    {
      name: "Season Greetings",
      identifier: "season-greetings-1.mjml"
    },
    {
      name: "Special Offer",
      identifier: "special-offer.mjml"
    },
    {
      name: "Special Reward",
      identifier: "special-reward-1.mjml"
    },
    {
      name: "Special Reward",
      identifier: "special-reward-2.mjml"
    },
    {
      name: "Thank You",
      identifier: "thank-you-1.mjml"
    },
    {
      name: "Thank You",
      identifier: "thank-you-2.mjml"
    },
    {
      name: "We Are Sorry",
      identifier: "we-are-sorry-1.mjml"
    },
    {
      name: "We Are Sorry",
      identifier: "we-are-sorry-2.mjml"
    },
    {
      name: "We Are Sorry",
      identifier: "we-are-sorry-3.mjml"
    }
  ];

  const temps = async () => {
    console.log("Started insertion 🚨");
    for (const temp of templates) {
      await TemplateRepo.createTemplate(temp);
    }
    console.log("Completed insertion 🆑");
  };

  temps();
  await mongoose.connection.close();
}

main();
