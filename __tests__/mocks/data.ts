import faker from "faker";

export function workspaceDTO() {
  return {
    name: faker.company.companyName(),
    address: faker.address.city(),
    workspace_email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email_address: faker.internet.email(),
    phone_number: phoneNumber
  };
}

const phoneNumber = `070${faker.finance.account(8)}`
