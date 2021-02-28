import jwt from "jsonwebtoken";

/**
 * Used to create a token that can be passed to Iris
 * @param data the payload to be encrypted
 * @param secret Non-random secret key to be used for encrypting and decrypting the token
 * @param ttl Lifetime of the token. Can accept either a number which is accepted as the
 * time in seconds or a string value such as `1h`. For string values, the unit of
 * time is required such as `m,s etc`. Read more at `https://github.com/zeit/ms`.
 */
export function seal(data: any, secret: string, ttl: number | string): Promise<string> {
  const expiresIn = typeof ttl === "number" ? `${ttl}s` : ttl;
  return new Promise((resolve, reject) => {
    const claim = data.toJSON ? data.toJSON() : data;
    jwt.sign({ claim }, secret, { expiresIn }, (err, sig) => {
      if (err) return reject(err);
      resolve(sig);
    });
  });
}

/**
 * Used to verify a token. Note that it expects the data to be stored in the
 * `claim` property.
 * @param token This is a valid JWT that is to be decoded
 * @param secret Non-random secret key to be used for encrypting and decrypting the token
 */
export function unseal(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, val) => {
      if (err) return reject(err);
      resolve(val["claim"]);
    });
  });
}
