import { compare, hash } from "bcrypt";
import randomPassword from "crypto-random-string";

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

  /**
   * Generate a ascii-printable password
   * @param length length of random password to be generated
   */
  generateRandomPassword(length: number) {
    return randomPassword({length})
  }
}

export const Passwords = new PasswordService();
