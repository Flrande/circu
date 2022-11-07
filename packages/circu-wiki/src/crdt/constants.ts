import type { Socket } from "socket.io-client"

export const MESSAGE_SYNC = 0
export const MESSAGE_AWARENESS = 1

export const SLATE_VALUE_YDOC_KEY = "slate"

export const CRDT_MESSAGE_EVENT = "crdt:message"
export const CRDT_ERROR_EVENT = "crdt:error"

export type ServerToClientEvents = {
  "crdt:message": (payload: ArrayBuffer) => void
  "crdt:error": (message: string) => void
}

export interface ClientToServerEvents {
  "crdt:message": (payload: ArrayBuffer) => void
}

export type CustomSocket = Socket<ServerToClientEvents, ClientToServerEvents>
