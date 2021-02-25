declare module Express {
  export interface Request {
    id: any
    session: any;
    sessionID: string;
    signedSessionID: string;
  }
}

declare module 'jsend' {
  export default interface JSend {
    success(data: any): any;
    fail(data: any): any;
    error(data: any, message: string, code: number, error_code?: number): any;
  }
}
