import { WorkspaceRepo } from "../../src/data/workspace";
import faker from "faker";

export const createWorkspace = () =>
  WorkspaceRepo.create({
    name: faker.company.companyName(),
    email_address: faker.internet.email(),
    address: faker.address.city()
  });
