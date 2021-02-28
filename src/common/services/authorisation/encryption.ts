import { decode as decodeBase64, encode as encodeBase64 } from "@stablelib/base64";
import { decode as decodeUtf8, encode as encodeUtf8 } from "@stablelib/utf8";
import { randomBytes, secretbox } from "tweetnacl";

function genNonce() {
  return randomBytes(secretbox.nonceLength);
}

export async function encrypt(value: any, secret: string) {
  if (secret.length < secretbox.keyLength) {
    throw new Error(`Secret not long enough. Expected ${secretbox.keyLength}, got ${secret.length}`);
  }

  const nonce = genNonce();
  const key = encodeUtf8(secret);
  const message = encodeUtf8(JSON.stringify(value));
  const box = secretbox(message, nonce, key);

  const completeMessage = new Uint8Array(nonce.length + box.length);
  completeMessage.set(nonce);
  completeMessage.set(box, nonce.length);

  return encodeBase64(completeMessage);
}

export async function decrypt(encrypted: string, secret: string) {
  try {
    const key = encodeUtf8(secret);
    const completeMessage = decodeBase64(encrypted);
    const nonce = completeMessage.slice(0, secretbox.nonceLength);
    const message = completeMessage.slice(secretbox.nonceLength, completeMessage.length);

    const decrypted = secretbox.open(message, nonce, key);

    if (!decrypted) {
      throw new Error("Could not decrypt message");
    }

    return JSON.parse(decodeUtf8(decrypted));
  } catch (err) {
    throw new Error("Could not decrypt message");
  }
}
