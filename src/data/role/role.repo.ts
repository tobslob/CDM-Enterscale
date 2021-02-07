import { BaseRepository } from "@app/data/database";
import { Role, RoleDTO } from "./role.model";
import mongoose from "mongoose";
import { RoleSchema } from "./role.schema";

class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(mongoose.connection, "Role", RoleSchema);
  }

  createRole(workspace: string, roleDTO: RoleDTO) {
    return this.create({
      ...roleDTO,
      workspace
    });
  }
}

export const RoleRepo = new RoleRepository();
