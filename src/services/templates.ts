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
      identifier: "congratulations"
    },
    {
      name: "Happy Anniversary",
      identifier: "happy-anniversary-1"
    },
    {
      name: "Happy Anniversary",
      identifier: "happy-anniversary-2"
    },
    {
      name: "Happy Birthday",
      identifier: "happy-birthday-1"
    },
    {
      name: "Happy Birthday",
      identifier: "happy-birthday-2"
    },
    {
      name: "Happy Birthday",
      identifier: "happy-birthday-3"
    },
    {
      name: "Happy Holiday",
      identifier: "happy-holiday-1"
    },
    {
      name: "Happy Holiday",
      identifier: "happy-holiday-2"
    },
    {
      name: "Loan Repayment",
      identifier: "loan-repayment-1"
    },
    {
      name: "Loan Repayment",
      identifier: "loan-repayment-2"
    },
    {
      name: "Loan Repayment",
      identifier: "loan-repayment-3"
    },
    {
      name: "Season Greetings",
      identifier: "season-greetings-1"
    },
    {
      name: "Special Offer",
      identifier: "special-offer"
    },
    {
      name: "Special Reward",
      identifier: "special-reward-1"
    },
    {
      name: "Special Reward",
      identifier: "special-reward-2"
    },
    {
      name: "Thank You",
      identifier: "thank-you-1"
    },
    {
      name: "Thank You",
      identifier: "thank-you-2"
    },
    {
      name: "We Are Sorry",
      identifier: "we-are-sorry-1"
    },
    {
      name: "We Are Sorry",
      identifier: "we-are-sorry-2"
    },
    {
      name: "We Are Sorry",
      identifier: "we-are-sorry-3"
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
}

main();
