declare module Express {
  export interface Request {
    session: any;
    sessionID: string;
    signedSessionID: string;
  }
}
