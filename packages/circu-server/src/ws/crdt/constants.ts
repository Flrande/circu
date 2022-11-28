import { Socket } from "socket.io"

export const MESSAGE_SYNC = 0
export const MESSAGE_AWARENESS = 1

export const SLATE_VALUE_YDOC_KEY = "slate"

export const CRDT_MESSAGE_EVENT = "crdt:message"
export const CRDT_ERROR_EVENT = "crdt:error"

export type ServerToClientEvents = {
  "crdt:message": (payload: Uint8Array) => void
  "crdt:error": (message: string) => void
}

export type ClientToServerEvents = {
  "crdt:message": (payload: Buffer) => void
}

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>
