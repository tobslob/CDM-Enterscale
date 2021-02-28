import crypto from "crypto";
import { promisify } from "util";

export const MIN_SECRET_LENGTH = 32;
export const asyncRandomBytes = promisify(crypto.randomBytes);

export function randomString(length: number) {
  let rand = crypto.randomBytes(Math.ceil(length / 2));
  return rand.toString("hex").slice(0, length);
}

export async function asyncRandomString(length: number) {
  let rand = await asyncRandomBytes(Math.ceil(length / 2));
  return rand.toString("hex").slice(0, length);
}

export async function asyncScrypt(
  password: string | Buffer | NodeJS.TypedArray | DataView,
  salt: string | Buffer | NodeJS.TypedArray | DataView,
  keylen: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, derived) => {
      if (err) return reject(err);
      resolve(derived);
    });
  });
}

/**
 * Stolen from https://github.com/tj/node-cookie-signature
 */
export function sign256(value: any, secret: string) {
  const valRaw = typeof value === "string" ? value : JSON.stringify(value);
  const signature = crypto.createHmac("sha256", secret).update(valRaw).digest("base64").replace(/\=+$/, "");
  return `${valRaw}.${signature}`;
}

/**
 * Stolen from https://github.com/tj/node-cookie-signature
 */
export function unsign256<T>(sig: string, secret: string): T {
  const value = getValue(sig);
  const valueMac = sign256(value, secret);
  return crypto.timingSafeEqual(Buffer.from(valueMac), Buffer.from(sig)) ? value : null;
}

function getValue(sig: string) {
  const sep = sig.lastIndexOf(".");
  if (sep == -1 || sep == 0) {
    throw new Error("Not a signature");
  }
  return JSON.parse(sig.slice(0, sep));
}
