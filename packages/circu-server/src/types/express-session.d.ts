import "express-session"

declare module "express-session" {
  interface SessionData {
    userid: string
  }
}

declare module "http" {
  interface IncomingMessage {
    session: {
      userid: string
    }
  }
}
