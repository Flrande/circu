import * as Y from "yjs"
import * as encoding from "lib0/encoding"
import * as decoding from "lib0/decoding"
import * as syncProtocol from "y-protocols/sync.js"
import * as awarenessProtocol from "y-protocols/awareness"
import { Injectable } from "@nestjs/common"
import { Server } from "socket.io"
import { GeneralDocService } from "src/doc/service/general-doc.service"
import { CustomSocket } from "src/types/socket-io"
import { URL } from "url"
import { WSSharedDoc } from "./WSSharedDoc"
import { MESSAGE_AWARENESS, MESSAGE_SYNC, SLATE_VALUE_YDOC_KEY } from "./constants"
import { crdtPrisma } from "./crdt-prisma"
import { slateNodesToInsertDelta } from "@slate-yjs/core"
import { Node } from "slate"

//TODO: 通过 y-leveldb 降低占用内存?
// https://discuss.yjs.dev/t/scalability-of-y-websocket-server/274
// https://discuss.yjs.dev/t/understanding-memory-requirements-for-production-usage/198
// https://discuss.yjs.dev/t/how-is-y-leveldb-coming-along/126
const docs = new Map<string, WSSharedDoc>()

const getYDoc = (docId: string): [WSSharedDoc, boolean] => {
  const doc = docs.get(docId)
  if (doc) {
    return [doc, false]
  }

  const newDoc = new WSSharedDoc(docId)
  docs.set(docId, newDoc)

  return [newDoc, true]
}

@Injectable()
export class CrdtService {
  constructor(private readonly generalDocService: GeneralDocService) {}

  async setupCRDT(server: Server, socket: CustomSocket): Promise<void> {
    const url = new URL(socket.handshake.address)
    const docId = url.pathname.split("/").at(-1)
    const userId = socket.request.session.userid

    if (!userId) {
      socket.emit("crdtError", "未认证")
      return
    }

    if (!docId) {
      socket.emit("crdtError", "未发现文档 id")
      return
    }

    //TODO: 校验用户是否有读权限
    //TODO: 区分只读用户和可写用户

    try {
      const doc = await this.generalDocService.getDocMetaDataById(userId, docId)
      const [YDoc, isNew] = getYDoc(doc.id)
      YDoc.conns.set(socket, new Set())

      // 若出现新注册的文档, 要先将数据库内的数据载入
      if (isNew) {
        const dbDoc = await crdtPrisma.doc.findUnique({
          where: {
            id: docId,
          },
          select: {
            value: true,
          },
        })
        if (dbDoc && dbDoc.value) {
          // 取出数据库中的 slate 格式数据, 载入到 Y.Doc 中
          const YDocXmlText = YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText
          const dbDocDelta = slateNodesToInsertDelta(dbDoc.value as unknown as Node[])
          YDocXmlText.applyDelta(dbDocDelta)
        }
      }

      const messageListener = async (conn: CustomSocket, doc: WSSharedDoc, message: Uint8Array) => {
        const encoder = encoding.createEncoder()
        const decoder = decoding.createDecoder(message)
        const messageType = decoding.readVarUint(decoder)

        switch (messageType) {
          case MESSAGE_SYNC: {
            encoding.writeVarUint(encoder, MESSAGE_SYNC)
            syncProtocol.readSyncMessage(decoder, encoder, doc, conn)

            if (encoding.length(encoder) > 1) {
              socket.emit("message", encoding.toUint8Array(encoder))
            }
            break
          }
          case MESSAGE_AWARENESS: {
            //TODO: Redis 广播 awareness 信息
            const update = decoding.readVarUint8Array(decoder)
            awarenessProtocol.applyAwarenessUpdate(doc.awareness, update, conn)
            break
          }
          default:
            throw new Error("unreachable")
        }
      }

      socket.on("message", (message) => messageListener(socket, YDoc, message))

      socket.on("disconnect", () => {
        //TODO: 连接关闭的回调
      })

      // put the following in a variables in a block so the interval handlers don't keep them in
      // scope
      {
        // send sync step 1
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, MESSAGE_SYNC)
        syncProtocol.writeSyncStep1(encoder, YDoc)
        socket.emit("message", encoding.toUint8Array(encoder))

        const awarenessStates = YDoc.awareness.getStates()
        if (awarenessStates.size > 0) {
          const encoder = encoding.createEncoder()
          encoding.writeVarUint(encoder, MESSAGE_AWARENESS)
          encoding.writeVarUint8Array(
            encoder,
            awarenessProtocol.encodeAwarenessUpdate(YDoc.awareness, Array.from(awarenessStates.keys()))
          )
          socket.emit("message", encoding.toUint8Array(encoder))
        }
      }
    } catch (error) {
      //TODO: 错误处理, 记录
      socket.emit("crdtError", "连接建立失败")
    }
  }
}
