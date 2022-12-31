import * as Y from "yjs"
import * as awarenessProtocol from "y-protocols/awareness"
import * as syncProtocol from "y-protocols/sync"
import * as encoding from "lib0/encoding"
import { CRDT_MESSAGE_EVENT, CustomSocket, MESSAGE_AWARENESS, MESSAGE_SYNC } from "./constants"
import { crdtPrisma } from "./crdt-prisma"

export class WSSharedDoc extends Y.Doc {
  id: string
  awarenessChannel: string
  // 每一个连接到当前文档的 socket 对应一组 Y.Doc 实例的 id, 据此对应一组 awareness
  conns: Map<CustomSocket, Set<number>>
  awareness: awarenessProtocol.Awareness

  constructor(id: string) {
    super()
    this.id = id
    this.awarenessChannel = `${id}-awareness`
    this.conns = new Map()
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)

    const awarenessChangeHandler = (
      { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
      origin: CustomSocket
    ) => {
      console.log("awareness get update from", (origin as CustomSocket).id)
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
        c.emit(CRDT_MESSAGE_EVENT, buff)
      })
    }

    const updateHandler = async (update: Uint8Array, origin: any, doc: WSSharedDoc) => {
      console.log("server doc get update from", (origin as CustomSocket).id)
      if (doc.conns.has(origin)) {
        //TODO: 通过 Redis 异步广播
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, MESSAGE_SYNC)
        syncProtocol.writeUpdate(encoder, update)
        const buff = encoding.toUint8Array(encoder)

        doc.conns.forEach((_, c) => {
          c.emit(CRDT_MESSAGE_EVENT, buff)
        })

        // 持久化
        const dbDoc = await crdtPrisma.doc.findUnique({
          where: {
            id,
          },
          select: {
            value: true,
          },
        })
        if (dbDoc) {
          // 更新数据库
          await crdtPrisma.doc.update({
            where: {
              id,
            },
            data: {
              value: Buffer.from(Y.encodeStateAsUpdate(this)),
            },
          })
        }
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
