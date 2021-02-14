import { RoleServ } from "./role";
import { UserRepo, UserDTO } from "@app/data/user";

class UserService {
  async createUser(workspace: string, dto: UserDTO) {
    const role = await RoleServ.createDefaultRole(workspace);
    const user = await UserRepo.newUser(role, workspace, dto);

    return user;
  }
}

export const UserServ = new UserService();
