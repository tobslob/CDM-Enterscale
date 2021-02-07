import { RoleRepo } from "@app/data/role/role.repo";

class UserService {
  createDefaultRole(workspace: string) {
    return RoleRepo.createRole(workspace, {
      name: "platform user",
      description: "user without any administrative role"
    });
  }
}

export const UserServ = new UserService();
