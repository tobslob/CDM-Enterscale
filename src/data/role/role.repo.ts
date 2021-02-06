import { BaseRepository } from "@app/data/database";
import { Role } from "./role.model";
import mongoose from "mongoose";
import { RoleSchema } from "./role.schema";

class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(mongoose.connection, "Role", RoleSchema);
  }
}

export const RoleRepo = new RoleRepository();
