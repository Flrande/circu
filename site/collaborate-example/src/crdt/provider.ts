import * as Y from "yjs"
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate, removeAwarenessStates } from "y-protocols/awareness"
import * as encoding from "lib0/encoding"
import * as decoding from "lib0/decoding"
import * as syncProtocol from "y-protocols/sync"
import { proxy } from "valtio"
import { io } from "socket.io-client"
import { CRDT_ERROR_EVENT, CRDT_MESSAGE_EVENT, CustomSocket, MESSAGE_AWARENESS, MESSAGE_SYNC } from "./constants"

export type SocketIoProviderState = {
  connecting: boolean
  connected: boolean
  sync: boolean
  error: string | null
}

export type SocketIoProvider = {
  YDoc: Y.Doc
  awareness: Awareness
  connect: () => void
  disconnect: () => void
}

export const createSocketIoProvider: (
  serverUrl: string,
  docId?: string,
  options?: {
    YDoc?: Y.Doc
    awareness?: Awareness
    autoConnect?: boolean
  }
) => [SocketIoProvider | null, SocketIoProviderState] = (
  serverUrl,
  docId,
  { YDoc = new Y.Doc(), awareness = new Awareness(YDoc), autoConnect = true } = {}
) => {
  const store = proxy<SocketIoProviderState>({
    connecting: false,
    connected: false,
    sync: false,
    error: null,
  })

  let socket: CustomSocket
  if (docId) {
    socket = io(serverUrl, {
      autoConnect,
      path: "/crdt/",
      query: {
        docId,
      },
      withCredentials: true,
    })

    socket.on("connect_error", (err) => {
      store.connected = false
      store.connecting = false
      store.sync = false
      store.error = err.message
    })

    socket.on("disconnect", (reason) => {
      removeAwarenessStates(
        awareness,
        Array.from(awareness.getStates().keys()).filter((client) => client !== YDoc.clientID),
        socket
      )

      store.connected = false
      store.connecting = false
      store.sync = false
      store.error = reason
    })

    socket.on("connect", () => {
      // send sync step 1 when connected
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, MESSAGE_SYNC)
      syncProtocol.writeSyncStep1(encoder, YDoc)
      socket.emit("crdt:message", encoding.toUint8Array(encoder))

      // broadcast local awareness state
      // if (awareness.getLocalState() !== null) {
      //   const encoderAwarenessState = encoding.createEncoder()
      //   encoding.writeVarUint(encoderAwarenessState, MESSAGE_AWARENESS)
      //   encoding.writeUint8Array(encoderAwarenessState, encodeAwarenessUpdate(awareness, [YDoc.clientID]))
      //   socket.emit("crdt:message", encoding.toUint8Array(encoderAwarenessState))
      // }

      store.connecting = false
      store.connected = true
      store.error = null
    })

    socket.on(CRDT_ERROR_EVENT, (msg) => {
      store.connected = false
      store.connecting = false
      store.sync = false
      store.error = msg
    })

    socket.on(CRDT_MESSAGE_EVENT, (buffer) => {
      const decoder = decoding.createDecoder(new Uint8Array(buffer))
      const encoder = encoding.createEncoder()
      const messageType = decoding.readVarUint(decoder)

      // 同步文档数据
      if (messageType === MESSAGE_SYNC) {
        encoding.writeVarInt(encoder, MESSAGE_SYNC)
        const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, YDoc, socket)
        if (syncMessageType !== syncProtocol.messageYjsSyncStep1 && !store.sync) {
          store.sync = true
        }
      } else if (messageType === MESSAGE_AWARENESS) {
        // 同步文档数据之外的数据
        applyAwarenessUpdate(awareness, decoding.readVarUint8Array(decoder), socket)
      }

      if (encoding.length(encoder) > 1) {
        socket.emit(CRDT_MESSAGE_EVENT, encoding.toUint8Array(encoder))
      }
    })

    YDoc.on("update", (update: Uint8Array, origin: CustomSocket) => {
      if (origin !== socket) {
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, MESSAGE_SYNC)
        syncProtocol.writeUpdate(encoder, update)
        if (socket.connected) {
          socket.emit(CRDT_MESSAGE_EVENT, encoding.toUint8Array(encoder))
        }
      }
    })

    awareness.on(
      "update",
      (
        { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
        origin: CustomSocket
      ) => {
        const changedClients = added.concat(updated, removed)
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, MESSAGE_AWARENESS)
        encoding.writeVarUint8Array(encoder, encodeAwarenessUpdate(awareness, changedClients))
        const buff = encoding.toUint8Array(encoder)

        if (socket.connected) {
          socket.emit(CRDT_MESSAGE_EVENT, buff)
        }
      }
    )
  }

  if (docId) {
    return [
      {
        YDoc,
        awareness,
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
  } else {
    return [null, store]
  }
}
