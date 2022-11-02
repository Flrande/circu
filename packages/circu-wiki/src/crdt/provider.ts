import type * as Y from "yjs"
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness"
import * as encoding from "lib0/encoding"
import * as decoding from "lib0/decoding"
import * as syncProtocol from "y-protocols/sync"
import { proxy } from "valtio"
import { io } from "socket.io-client"
import { CRDT_ERROR_EVENT, CustomSocket, MESSAGE_AWARENESS, MESSAGE_SYNC } from "./constants"

export type SocketIoProviderState = {
  connecting: boolean
  connected: boolean
  sync: boolean
  error: string | null
}

export type SocketIoProviderMethod = {
  connect: () => void
  disconnect: () => void
}

export const createSocketIoProvider: (
  serverUrl: string,
  YDoc: Y.Doc,
  options?: {
    awareness?: Awareness
    autoConnect?: boolean
  }
) => [SocketIoProviderMethod, SocketIoProviderState] = (
  serverUrl,
  YDoc,
  { awareness = new Awareness(YDoc), autoConnect = true } = {}
) => {
  const store = proxy<SocketIoProviderState>({
    connecting: false,
    connected: false,
    sync: false,
    error: null,
  })
  const socket: CustomSocket = io(serverUrl, {
    autoConnect,
  })

  socket.on(CRDT_ERROR_EVENT, (msg) => {
    store.connected = false
    store.connecting = false
    store.sync = false
    store.error = msg
  })

  socket.on("disconnect", () => {
    store.connected = false
    store.connecting = false
    store.sync = false
  })

  socket.on("connect", () => {
    store.connecting = false
    store.connected = true
    store.error = null
  })

  // send sync step 1 when connected
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, MESSAGE_SYNC)
  syncProtocol.writeSyncStep1(encoder, YDoc)
  socket.emit("crdt:message", encoding.toUint8Array(encoder))

  // broadcast local awareness state
  if (awareness.getLocalState() !== null) {
    const encoderAwarenessState = encoding.createEncoder()
    encoding.writeVarUint(encoderAwarenessState, MESSAGE_AWARENESS)
    encoding.writeUint8Array(encoderAwarenessState, encodeAwarenessUpdate(awareness, [YDoc.clientID]))
    socket.emit("crdt:message", encoding.toUint8Array(encoderAwarenessState))
  }

  socket.on("crdt:message", (buffer) => {
    const decoder = decoding.createDecoder(buffer)
    const encoder = encoding.createEncoder()
    const messageType = decoding.readVarUint(decoder)

    // 同步文档数据
    if (messageType === MESSAGE_SYNC) {
      encoding.writeVarInt(encoder, MESSAGE_SYNC)
      const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, YDoc, socket)
      if (syncMessageType === syncProtocol.messageYjsSyncStep2 && !store.sync) {
        store.sync = true
      }
    }

    // 同步文档数据之外的数据
    if (messageType === MESSAGE_AWARENESS) {
      applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), socket)
    }
  })

  return [
    {
      connect: () => {
        if (!store.connecting && !store.connected) {
          store.connecting = true
          socket.connect()
        }
      },
      disconnect: () => {
        socket.disconnect()
      },
    },
    store,
  ]
}
