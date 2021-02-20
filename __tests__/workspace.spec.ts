import "module-alias/register";
import "reflect-metadata";

import supertest, { SuperTest, Test } from "supertest";

import { Store } from "../src/common/services";
import { App } from "../src/server/app";
import { timeout, getResponse, createAuthToken, createSession, getError } from "./helpers";
import { OK, FORBIDDEN } from "http-status-codes";
import { workspaceDTO } from "./mocks/data";
import sinon from "sinon";

let app: App;
let request: SuperTest<Test>;
const baseUrl = "/api/v1/workspaces";

beforeAll(async () => {
  app = new App();
  await app.connectDB();

  const server = app.getServer().build();
  request = supertest(server);
});

afterEach(async () => {
  sinon.restore();
  await app.db.dropDatabase();
});

afterAll(async () => {
  await Store.flushdb();
  timeout(500);
  await app.db.dropDatabase();
  await app.closeDB();
});

describe("Workspace Creation", () => {
  it("Only Super admin can create workspace", async () => {
    const session = createSession({ super_admin: true });
    const token = await createAuthToken(session);

    const dto = workspaceDTO()

    const workspace = await getResponse(
      request.post(`${baseUrl}/`).set("Authorization", token).send(dto).expect(OK)
    );

    expect(workspace.name).toMatch(dto.name)
    expect(workspace.address).toMatch(dto.address)
  });

  it.only("Should not create workspace if not super_admin", async () => {
    const session = createSession({ super_admin: false });
    const token = await createAuthToken(session);

    const dto = workspaceDTO()

    const message = await getError(
      request.post(`${baseUrl}/`).set("Authorization", token).send(dto).expect(FORBIDDEN)
    );

    expect(message).toMatch("You are not allowed to perform this operation")
  });
});
