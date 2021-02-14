import { connection } from "mongoose";
import { BaseRepository } from "../database";
import { Workspace } from "./workspace.model";
import { WorkspaceSchema } from "./workspace.schema";

class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor() {
    super(connection, "Workspaces", WorkspaceSchema);
  }
}

export const WorkspaceRepo = new WorkspaceRepository();
