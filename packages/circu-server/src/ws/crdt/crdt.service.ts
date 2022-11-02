import * as Y from "yjs"
import * as encoding from "lib0/encoding"
import * as decoding from "lib0/decoding"
import * as syncProtocol from "y-protocols/sync.js"
import * as awarenessProtocol from "y-protocols/awareness"
import { Injectable } from "@nestjs/common"
import { Server } from "socket.io"
import { GeneralDocService } from "src/doc/service/general-doc.service"
import { URL } from "url"
import { WSSharedDoc } from "./WSSharedDoc"
import {
  CRDT_ERROR_EVENT,
  CRDT_MESSAGE_EVENT,
  CustomSocket,
  MESSAGE_AWARENESS,
  MESSAGE_SYNC,
  SLATE_VALUE_YDOC_KEY,
} from "./constants"
import { crdtPrisma } from "./crdt-prisma"
import { slateNodesToInsertDelta } from "@slate-yjs/core"
import { Node } from "slate"

/**
 * 交互协议:
 *    文档数据同步:
 *      [MESSAGE_SYNC, messageYjsSyncStep1 = 0, ...]:
 *          包含发送方的版本向量, 接收方通过 Y.encodeStateAsUpdate(接收方的 Y.Doc, 发送方的的版本向量) 生成 diff
 *          数据, 返回 YjsSyncStep2
 *      [MESSAGE_SYNC, messageYjsSyncStep2 = 1, ...]:
 *      [MESSAGE_SYNC, messageYjsUpdate = 2, ...]:
 *          包含发送方与接收方的 diff 数据, 接收方读取 diff 数据并将其载入自己的 Y.doc 中
 *    文档数据之外得数据(如光标位置)同步:
 *      [MESSAGE_AWARENESS, ...]:
 *          包含更新所需的数据, 接收方可用于更新
 */

//TODO: 通过 y-leveldb 降低占用内存?
// https://discuss.yjs.dev/t/scalability-of-y-websocket-server/274
// https://discuss.yjs.dev/t/understanding-memory-requirements-for-production-usage/198
// https://discuss.yjs.dev/t/how-is-y-leveldb-coming-along/126
const YDocs = new Map<string, WSSharedDoc>()

const getYDoc = (docId: string): [WSSharedDoc, boolean] => {
  const doc = YDocs.get(docId)
  if (doc) {
    return [doc, false]
  }

  const newDoc = new WSSharedDoc(docId)
  YDocs.set(docId, newDoc)

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
      socket.emit(CRDT_ERROR_EVENT, "未认证")
      socket.disconnect()
      return
    }

    if (!docId) {
      socket.emit(CRDT_ERROR_EVENT, "未发现文档 id")
      socket.disconnect()
      return
    }

    //TODO: 校验用户是否有读权限
    //TODO: 区分只读用户和可写用户

    try {
      const docMeta = await this.generalDocService.getDocMetaDataById(userId, docId)
      const [YDoc, isNew] = getYDoc(docMeta.id)
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

            // 如果载荷长度大于 1, 说明有需要回复的数据
            if (encoding.length(encoder) > 1) {
              socket.emit(CRDT_MESSAGE_EVENT, encoding.toUint8Array(encoder))
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

      const closeConn = () => {
        const controlledId = YDoc.conns.get(socket)

        if (controlledId) {
          YDoc.conns.delete(socket)
          awarenessProtocol.removeAwarenessStates(YDoc.awareness, Array.from(controlledId), null)

          if (YDoc.conns.size === 0) {
            YDoc.destroy()
            YDocs.delete(YDoc.id)
          }
        }
      }

      socket.on(CRDT_MESSAGE_EVENT, (message) => messageListener(socket, YDoc, message))

      socket.on("disconnect", closeConn)

      // put the following in a variables in a block so the interval handlers don't keep them in
      // scope
      {
        // send sync step 1
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, MESSAGE_SYNC)
        syncProtocol.writeSyncStep1(encoder, YDoc)
        socket.emit(CRDT_MESSAGE_EVENT, encoding.toUint8Array(encoder))

        const awarenessStates = YDoc.awareness.getStates()
        if (awarenessStates.size > 0) {
          const encoder = encoding.createEncoder()
          encoding.writeVarUint(encoder, MESSAGE_AWARENESS)
          encoding.writeVarUint8Array(
            encoder,
            awarenessProtocol.encodeAwarenessUpdate(YDoc.awareness, Array.from(awarenessStates.keys()))
          )
          socket.emit(CRDT_MESSAGE_EVENT, encoding.toUint8Array(encoder))
        }
      }
    } catch (error) {
      socket.emit(CRDT_ERROR_EVENT, "连接建立失败")
      socket.disconnect()
    }
  }
}
