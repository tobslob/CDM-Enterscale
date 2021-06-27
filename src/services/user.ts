import { RoleServ } from "./role";
import { UserRepo, UserDTO, SessionRequest } from "@app/data/user";
import { Passwords } from "./password";
import AdapterInstance from "@app/server/adapter/mail";
import { UnauthorizedError, ForbiddenError } from "@app/data/util";
import { Auth } from "@app/common/services";
import { Log } from "@app/common/services/logger";
import { WorkspaceRepo } from "@app/data/workspace";
import { RoleRepo, Role } from "@app/data/role";

class UserService {
  async createUser(workspace: string, dto: UserDTO) {
    const usr = await UserRepo.model.exists({ workspace, email_address: dto.email_address });
    if (usr) return;

    let role: Role;

    if (dto.role_id) {
      role = await RoleRepo.byID(dto.role_id);
    } else {
      role = await RoleServ.createRole(
        workspace,
        dto.permissions.loan_admin,
        dto.permissions.super_admin,
        dto.permissions.users
      );
    }

    const generatedPassword = Passwords.generateRandomPassword(10);
    const password = await Passwords.generateHash(generatedPassword);
    const user = await UserRepo.newUser(role, workspace, password, dto);

    if (!role.permissions.users) {
      const wrkspace = await WorkspaceRepo.byID(workspace);
      await AdapterInstance.send({
        subject: "Welcome! Supercharge your digital transformation",
        channel: "mail",
        recipient: user.email_address,
        template: "welcome-mail",
        template_vars: {
          firstname: user.first_name,
          emailaddress: user.email_address,
          password: generatedPassword,
          company: wrkspace.name
        }
      });
    }

    return user;
  }

  async resetPassword(email: string) {
    const user = await UserRepo.byQuery({ email_address: email }, null, false);

    if (!user) {
      throw new UnauthorizedError("Your email is incorrect.");
    }

    const generatedPassword = Passwords.generateRandomPassword(10);
    const updatedUser = await UserRepo.setPassword(user.id, generatedPassword);

    await AdapterInstance.send({
      subject: "Reset Password",
      channel: "mail",
      recipient: user.email_address,
      template: "reset-password-mail",
      template_vars: {
        firstname: user.first_name,
        emailaddress: user.email_address,
        password: generatedPassword
      }
    });

    return updatedUser;
  }

  async editUser(id: string, user: UserDTO) {
    const updatedUser = await UserRepo.atomicUpdate(id, {
      $set: {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number
      }
    });

    return updatedUser;
  }

  async generateRePaymentLink(request: SessionRequest) {
    const token = await Auth.commission(request, "90 days");
    return `${process.env.repayment_page}/${token}`;
  }

  /**
   * Returns the SessionToken
   * @param requestToken This is the request token that should be viewed
   */
  async viewSessionToken(requestToken: string): Promise<SessionRequest> {
    try {
      return await Auth.peek(requestToken);
    } catch (err) {
      Log.error({ err });
      throw new ForbiddenError("Failed to validate defaulter token");
    }
  }
}

export const UserServ = new UserService();
