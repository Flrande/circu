import * as Y from "yjs"
import * as awarenessProtocol from "y-protocols/awareness"
import * as syncProtocol from "y-protocols/sync"
import * as encoding from "lib0/encoding"
import { CustomSocket } from "src/types/socket-io"
import { Socket } from "socket.io"
import { MESSAGE_AWARENESS, MESSAGE_SYNC } from "./constants"

export class WSSharedDoc extends Y.Doc {
  id: string
  awarenessChannel: string
  conns: Map<CustomSocket, Set<number>>
  awareness: awarenessProtocol.Awareness

  constructor(id: string) {
    super()

    this.id = id
    this.awarenessChannel = `${id}-awareness`
    this.conns = new Map()
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)

    //TODO: awareness 的更新回调写成异步形式?
    const awarenessChangeHandler = (
      { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
      origin: CustomSocket
    ) => {
      const changedClients = added.concat(updated, removed)
      const connControlledIds = this.conns.get(origin)

      if (connControlledIds) {
        added.forEach((clientId) => {
          connControlledIds.add(clientId)
        })
        removed.forEach((clientId) => {
          connControlledIds.delete(clientId)
        })
      }

      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, MESSAGE_AWARENESS)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
      const buff = encoding.toUint8Array(encoder)

      this.conns.forEach((_, c) => {
        c.emit("message", buff)
      })
    }

    const updateHandler = async (update: Uint8Array, origin: any, doc: WSSharedDoc) => {
      const isOriginWSConn = origin instanceof Socket && doc.conns.has(origin)

      if (isOriginWSConn) {
        //TODO: 通过 Redis 异步广播
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, MESSAGE_SYNC)
        syncProtocol.writeUpdate(encoder, update)
        const buff = encoding.toUint8Array(encoder)

        doc.conns.forEach((_, c) => {
          c.emit("message", buff)
        })

        //TODO: 持久化
      }
    }

    this.awareness.on("update", awarenessChangeHandler)
    this.on("update", updateHandler)

    //TODO: 订阅 Redis 广播
  }

  override destroy() {
    super.destroy()

    //TODO: 取消广播
  }
}
