import { RoleServ } from "./role";
import { UserRepo, UserDTO } from "@app/data/user";
import { Passwords } from "./password";
import { RoleRepo } from "@app/data/role";
import { Role } from "@app/data/role";

class UserService {
  private role: Role;

  async createUser(workspace: string, dto: UserDTO) {
    try {
      this.role = await RoleServ.createRole(
        workspace,
        dto.permissions.loan_admin,
        dto.permissions.super_admin,
        dto.permissions.users
      );
      const generatedPassword = Passwords.generateRandomPassword(10);
      const password = await Passwords.generateHash(generatedPassword);
      const user = await UserRepo.newUser(this.role, workspace, password, dto);

      return user;
    } catch (err) {
      console.log(err)
      await RoleRepo.destroy(this.role.id);
    }
  }
}

export const UserServ = new UserService();
