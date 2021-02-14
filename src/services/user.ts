import { RoleServ } from "./role";
import { UserRepo, UserDTO } from "@app/data/user";
import { Passwords } from "./password";
import { RoleRepo } from "@app/data/role/role.repo";
import { ServerError } from "@app/data/util";
import { Role } from "@app/data/role/role.model";
import { WorkspaceRepo } from "@app/data/workspace";

class UserService {
  private role: Role;

  async createUser(workspace: string, dto: UserDTO) {
    try {
      this.role = await RoleServ.createDefaultRole(workspace);
      const generatedPassword = Passwords.generateRandomPassword(10);
      const password = await Passwords.generateHash(generatedPassword);
      const user = await UserRepo.newUser(this.role, workspace, password, dto);

      return user;
    } catch (err) {
      await RoleRepo.destroy(this.role.id);
      await WorkspaceRepo.destroy(workspace);
      throw new ServerError("Internal server error");
    }
  }
}

export const UserServ = new UserService();
