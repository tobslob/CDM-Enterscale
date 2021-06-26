import "module-alias/register";
import "reflect-metadata";

import { Extractions, ExtractedUsers } from "./data";
import { WorkspaceRepo } from "@app/data/workspace";
import faker from "faker";
import { Gender, UserRepo } from "@app/data/user";
import mongoose from "mongoose";
import { config } from "dotenv";
import { RoleServ } from "./role";
import { Passwords } from "./password";

config();

async function main() {
  await mongoose.connect(process.env.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  const results = await Extractions.extractUsers("mooyii");

  const { id } = await WorkspaceRepo.create({
    name: "Mooyi Acquisition",
    email_address: "growthteam@enterscale.com",
    address: `${faker.address.streetAddress(), faker.address.zipCode(), faker.address.state()}`
  });

  const role = await RoleServ.createRole(
    id, false, false, true
  );

  results.map(async (result: ExtractedUsers) => {
    await UserRepo.create({
      first_name: result.name?.split(" ")[0] || "N/A",
      last_name: result.name?.split(" ")[1] || "N/A",
      email_address: result.email_address,
      phone_number: "09024372836",
      location: `${faker.address.streetAddress(), faker.address.zipCode(), faker.address.state()}`,
      DOB: faker.date.past(),
      gender: Gender.Male,
      workspace: id,
      role_id: role.id,
      role_name: "acquisition role",
      password: await Passwords.generateHash(Passwords.generateRandomPassword(8)),
    });
  })
  console.log("🏂 🚨 Migration completed 🚨")
} main();