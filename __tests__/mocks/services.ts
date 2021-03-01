import { WorkspaceRepo } from "../../src/data/workspace";
import faker from "faker";
import sinon from "sinon";
import { AdapterInstance } from "../../src/server/adapter/mail";

const mockMailer = sinon.stub(AdapterInstance, "send");

export const createWorkspace = () =>
  WorkspaceRepo.create({
    name: faker.company.companyName(),
    email_address: faker.internet.email(),
    address: faker.address.city()
  });

export function mockSendMailNotification() {
  return mockMailer.calledOnce;
}
