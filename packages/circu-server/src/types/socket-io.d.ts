import { SessionData } from "express-session"
import { Socket } from "socket.io"

declare module "http" {
  interface IncomingMessage {
    session: SessionData
  }
}

export interface ServerToClientEvents {
  message: (payload: Uint8Array) => void
  crdtError: (message: string) => void
}

export interface ClientToServerEvents {
  message: (payload: Uint8Array) => void
}

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>
