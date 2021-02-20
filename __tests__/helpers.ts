import { RequestContract } from "@random-guys/iris";
import faker from "faker";
import { Test } from "supertest";
import { Auth } from "../src/common/services";
import dotenv from "dotenv";

dotenv.config();

/**
 * Is list of value generators(static and dynamic) and their weight.
 * The weight is used to calculate the probabilty of the generator being
 * used.
 */
export type Choices = [() => any | any, number][];

export const TokenHeader = "X-Request-Token";
export const fakeReq: RequestContract = { id: "some-random-string" };

export interface Session {
  workspace?: string;
  user?: string;
  security_key?: string;
  [key: string]: any;
}

/**
 * Run this function after `duration` wrapping the entire delay
 * in a promise. This is useful for testing workers as it would
 * take some time to send and receive messages, as well as an
 * event queue break to handle the message
 * @param fn function to run tests or anything you want...do your
 * worst
 */
export function delayed(fn: () => Promise<void>, duration = 500) {
  return new Promise(resolve => {
    setTimeout(async () => {
      await fn();
      resolve(true);
    }, duration);
  });
}

export function timeout(duration = 500) {
  return delayed(() => Promise.resolve(), duration);
}

/**
 * Generate multiple version using a mock data function.
 * @param n number of values to generate
 * @param fn mock data function
 */
export function multiply<T>(n: number, fn: () => T): T[] {
  const results: T[] = [];

  for (let i = 0; i < n; i++) {
    results.push(fn());
  }

  return results;
}

/**
 * Run async job `fn` `n` times.
 * @param n number of times to run it
 * @param fn job to run
 */
export async function repeat(n: number, fn: () => Promise<any>): Promise<any[]> {
  const jobs = Array.from({ length: n }).map(() => fn());
  return Promise.all(jobs);
}

/**
 * Create a basic user session with possible extra properties(e.g. user permissions)
 * @param extras extra permissions an session properties
 */
export function createSession(extras = {}): Session {
  return {
    workspace: faker.random.uuid(),
    user: faker.random.uuid(),
    ...extras
  };
}

/**
 * Create a user session with accounts attached to the user.
 * @param account account to attach to the session
 * @param minimum minimum amount for the account
 * @param maximum maximum amount allowed on the account
 * @param extras extra permissions an session properties
 */
export function createSessionWithAccounts(account: string, minimum: number, maximum: number, extras = {}) {
  return {
    workspace: faker.random.uuid(),
    user: faker.random.uuid(),
    ...extras,
    accounts: [
      {
        account_number: account,
        min_amount: minimum,
        max_amount: maximum
      }
    ]
  };
}

/**
 * Create an `Authorization` header value that bypasses permission check
 * and OTP check
 * @param session session used to derive a token
 */
export async function createHeadlessToken(session?: Session) {
  const token = await Auth.headless(session ?? createSession());
  return `${process.env.auth_scheme} ${token}`;
}

/**
 * Create an `Authorization` header that passes through the normal security
 * checks
 * @param session session used to derive a token
 */
export async function createAuthToken(session = createSession()) {
  const sessionID = await Auth.saveSession(session.user, session);
  return `Bearer ${sessionID}`;
}

/**
 * Create a fake OTP
 */
export function createOTPToken() {
  return faker.finance.account(6);
}

/**
 * Pick a random value based on the choice configurations
 * @param items choice configurations. See `Choices`
 */
export function randomise(...items: Choices) {
  const choices: any[] = [];

  for (let i = 0; i < items.length; i++) {
    const [val, size] = items[i];
    let fn = typeof val === "function" ? val : () => val;

    choices.push(...multiply(size, fn));
  }

  return faker.random.arrayElement(choices);
}

export async function getResponse<T = any>(test: Test): Promise<T> {
  const response = await test;
  return response.body.data as T;
}

export async function getError(test: Test): Promise<string> {
  const response = await test;
  return response.body.message;
}

export async function prettyPrint(data: any) {
  console.log(JSON.stringify(data, null, 2));
}
