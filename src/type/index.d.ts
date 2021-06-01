declare module Express {
  export interface Request {
    session: any;
    sessionID: string;
    signedSessionID: string;
  }
}

declare module 'cloudinary' {
  export function config(conf: ConfigOptions);
}
