import { SessionData } from "express-session"
import { Socket } from "socket.io"

declare module "http" {
  interface IncomingMessage {
    session: SessionData
  }
}
