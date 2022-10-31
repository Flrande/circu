import * as Y from "yjs"
import * as awarenessProtocol from "y-protocols/awareness"
import * as syncProtocol from "y-protocols/sync"
import * as encoding from "lib0/encoding"
import { CustomSocket } from "src/types/socket-io"
import { Socket } from "socket.io"
import { MESSAGE_AWARENESS, MESSAGE_SYNC, SLATE_VALUE_YDOC_KEY } from "./constants"
import { Prisma, PrismaClient } from "@prisma/client"
import { slateNodesToInsertDelta, yTextToSlateElement } from "@slate-yjs/core"
import { Node } from "slate"

const prisma = new PrismaClient()

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

        // 持久化
        const dbDoc = await prisma.doc.findUnique({
          where: {
            id,
          },
          select: {
            value: true,
          },
        })
        if (dbDoc && dbDoc.value) {
          // 取出数据库中的 slate 格式数据, 载入到一个 Y.Doc 中以用于合并
          const YDoc = new Y.Doc()
          const YDocXmlText = YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText
          const dbDocDelta = slateNodesToInsertDelta(dbDoc.value as unknown as Node[])
          YDocXmlText.applyDelta(dbDocDelta)

          // 合并更新
          Y.applyUpdate(YDoc, update)

          // 将合并后的的 Y.Doc 转换为 slate 格式数据
          const newDbDocValue = yTextToSlateElement(YDocXmlText)

          // 更新数据库中的文档
          await prisma.doc.update({
            where: {
              id,
            },
            data: {
              value: newDbDocValue as unknown as Array<Prisma.JsonObject>,
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
