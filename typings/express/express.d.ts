import { Session } from "../../src/data/User";

declare module Express {
  export interface Request {
    session: Session;
    sessionID: string;
    signedSessionID: string;
  }
}
