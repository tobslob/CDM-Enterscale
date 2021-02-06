import { compare, hash } from "bcrypt";

class PasswordService {
  /**
   * Generate a hash for the given password
   * @param password
   */
  generateHash(password: string) {
    return hash(password, 10);
  }

  /**
   * Confirm the password leads to the given hash
   * @param password password in pure strings
   * @param hashPassword hash of user password
   */
  validate(password: string, hashPassword: string) {
    return compare(password, hashPassword);
  }
}

export const Passwords = new PasswordService();
