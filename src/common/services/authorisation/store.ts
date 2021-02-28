import { Redis as RedisType } from "ioredis";
import ms from "ms";

/**
 * Interface to allow multuple stores
 */
export interface IStore {
  /**
   * Save a value in the store using the given key
   * @param key key of the value
   * @param value value to be stored
   */
  set(key: string, value: any): Promise<any>;
  /**
   * Like `set` but with expiration
   * @param key key of the value
   * @param value value to be stored
   * @param duration expire time in milliseconds
   */
  set(key: string, value: any, duration: number): Promise<any>;
  /**
   * Get a value from the store using the given key
   * @param key key to use for search
   */
  get<T>(key: string): Promise<T | null>;
  /**
   * Remove the value mapped to the given key
   * @param key keyb to use for search
   */
  remove(key: string): Promise<any>;
}

/**
 * Basic implementation of a production redis session store
 */
export class RedisStore implements IStore {
  constructor(private redis: RedisType) {}

  set(key: string, value: any): Promise<any>;
  set(key: string, value: any, duration: string): Promise<any>;
  set(key: string, value: any, duration: number): Promise<any>;
  set(key: string, value: any, duration?: string | number): Promise<any> {
    if (!duration) {
      return this.redis.set(key, JSON.stringify(value));
    }
    const time = typeof duration === "string" ? ms(duration) : duration;
    return this.redis.set(key, JSON.stringify(value), "PX", time);
  }

  async get<T>(key: string): Promise<T> {
    const result = await this.redis.get(key);
    if (!result) {
      return null;
    }
    return JSON.parse(result);
  }

  remove(key: string): Promise<any> {
    return this.redis.del(key);
  }
}
