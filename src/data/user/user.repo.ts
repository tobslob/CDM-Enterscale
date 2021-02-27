import { connection, model } from "mongoose";
import { User, UserDTO } from "./user.model";
import { UserSchema } from "./user.schema";
import { BaseRepository } from "@random-guys/bucket";
import { Passwords } from "@app/services/password";
import { UnauthorizedError } from "@app/data/util";
import { Role } from "../role/role.model";


const User = model<User>("User", UserSchema);

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(connection, "Users", UserSchema);
  }

    /**
   * Creates an unconfirmed user
   * @param dto DTO of the user to create
   */
  async newUser(role: Role, workspace: string, password: string, dto: UserDTO): Promise<User> {
    return this.create({
      email_address: dto.email_address,
      first_name: dto.first_name,
      last_name: dto.last_name,
      password,
      phone_number: dto.phone_number,
      role_id: role.id,
      role_name: role.name,
      workspace
    });
  }

  /**
   * Get a user by email as long as the passed password is correct. Be careful
   * with the returned user as it contains the password hash.
   * @param email user's email address
   * @param password user's password
   */
  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    const user = await this.byQuery({ email_address: email }, false);
    if (!user) {
      throw new UnauthorizedError("Your email or password is incorrect");
    }

    const correctPassword = await Passwords.validate(password, user.password);

    if (!correctPassword) {
      throw new UnauthorizedError("Your email or password is incorrect");
    }

    return user;
  }

  async setPassword(user: string, password: string): Promise<User> {
    return this.atomicUpdate(user, { $set: { password: await Passwords.generateHash(password) } });
  }
}

export const UserRepo = new UserRepository();
