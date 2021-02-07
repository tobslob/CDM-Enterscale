import { connection } from "mongoose";
import { User, UserDTO } from "./user.model";
import { UserSchema } from "./user.schema";
import { BaseRepository } from "../database";
import { Passwords } from "@app/services/password";
import { RoleRepo } from "../role/role.repo";
import { UnAuthorisedError } from "../util";
import { Role } from "../role/role.model";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(connection, "Users", UserSchema);
  }

    /**
   * Creates an unconfirmed user
   * @param dto DTO of the user to create
   */
  async newUser(dto: UserDTO, role: Role): Promise<User> {
    return this.create({
      email_address: dto.email_address,
      first_name: dto.first_name,
      last_name: dto.last_name,
      role_id: role.id,
      role_name: role.name,
    });
  }

  /**
   * Edit a user
   * @param id id of the user to edit
   * @param dto DTO of the user to edit
   */
  async editUser(userId: string, dto: UserDTO) {
    const role = await RoleRepo.byID(dto.role_id);
    return this.atomicUpdate(
      { _id: userId },
      {
        email_address: dto.email_address,
        first_name: dto.first_name,
        last_name: dto.last_name,
        role_id: role.id,
        role_name: role.name
      }
    );
  }

  /**
   * Get a user by email as long as the passed password is correct. Be careful
   * with the returned user as it contains the password hash.
   * @param email user's email address
   * @param password user's password
   */
  async getAuthenticatedUser(email: string, password: string) {
    const user = await this.byQuery({ email_address: email }, false);
    if (!user) {
      throw new UnAuthorisedError("Your email or password is incorrect");
    }

    const correctPassword = await Passwords.validate(password, user.password);

    if (!correctPassword) {
      throw new UnAuthorisedError("Your email or password is incorrect");
    }

    return user;
  }
}

export const UserRepo = new UserRepository();
