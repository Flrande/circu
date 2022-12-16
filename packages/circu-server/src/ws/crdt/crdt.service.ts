import * as Y from "yjs"
import * as encoding from "lib0/encoding"
import * as decoding from "lib0/decoding"
import * as syncProtocol from "y-protocols/sync"
import * as awarenessProtocol from "y-protocols/awareness"
import { Injectable } from "@nestjs/common"
import { WSSharedDoc } from "./WSSharedDoc"
import { CRDT_ERROR_EVENT, CRDT_MESSAGE_EVENT, CustomSocket, MESSAGE_AWARENESS, MESSAGE_SYNC } from "./constants"
import { crdtPrisma } from "./crdt-prisma"
import { DocService } from "../../doc/doc.service"

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
const WSDocs = new Map<string, WSSharedDoc>()

const getWSDoc = (docId: string): [WSSharedDoc, boolean] => {
  const doc = WSDocs.get(docId)
  if (doc) {
    return [doc, false]
  }

  const newDoc = new WSSharedDoc(docId)
  WSDocs.set(docId, newDoc)

  return [newDoc, true]
}

@Injectable()
export class CrdtService {
  constructor(private readonly docService: DocService) {}

  async setupCRDT(socket: CustomSocket): Promise<void> {
    if (!socket.handshake.query["docId"]) {
      socket.emit(CRDT_ERROR_EVENT, "需要文档 id")
      socket.disconnect()
      return
    }

    const docId = socket.handshake.query["docId"] as string
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
      const docMeta = await this.docService.getDocMetaInfo(userId, docId)

      // 设置共享文档
      const [WSDoc, isNew] = getWSDoc(docMeta.id)

      // 将共享文档与 socket 对应
      WSDoc.conns.set(socket, new Set())

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
          // 取出数据库中的数据, 载入到 Y.Doc 中, 注意要添加 origin
          Y.applyUpdate(WSDoc, dbDoc.value, socket)
        }
      }

      const messageListener = async (message: Uint8Array) => {
        const encoder = encoding.createEncoder()
        const decoder = decoding.createDecoder(message)
        const messageType = decoding.readVarUint(decoder)

        switch (messageType) {
          case MESSAGE_SYNC: {
            encoding.writeVarUint(encoder, MESSAGE_SYNC)
            syncProtocol.readSyncMessage(decoder, encoder, WSDoc, socket)

            // 如果载荷长度大于 1, 说明有需要回复的数据
            if (encoding.length(encoder) > 1) {
              socket.emit(CRDT_MESSAGE_EVENT, encoding.toUint8Array(encoder))
            }
            break
          }
          case MESSAGE_AWARENESS: {
            //TODO: Redis 广播 awareness 信息
            const update = decoding.readVarUint8Array(decoder)
            awarenessProtocol.applyAwarenessUpdate(WSDoc.awareness, update, socket)
            break
          }
          default:
            throw new Error("unreachable")
        }
      }

      const closeConn = () => {
        const controlledId = WSDoc.conns.get(socket)

        if (controlledId) {
          WSDoc.conns.delete(socket)
          awarenessProtocol.removeAwarenessStates(WSDoc.awareness, Array.from(controlledId), socket)

          if (WSDoc.conns.size === 0) {
            WSDoc.destroy()
            WSDocs.delete(WSDoc.id)
          }
        }
      }

      socket.on(CRDT_MESSAGE_EVENT, (message) => messageListener(new Uint8Array(message)))

      socket.on("disconnect", closeConn)

      // put the following in a variables in a block so the interval handlers don't keep them in
      // scope
      {
        // send sync step 1
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, MESSAGE_SYNC)
        syncProtocol.writeSyncStep1(encoder, WSDoc)
        socket.emit(CRDT_MESSAGE_EVENT, encoding.toUint8Array(encoder))

        const awarenessStates = WSDoc.awareness.getStates()
        if (awarenessStates.size > 0) {
          const encoder = encoding.createEncoder()
          encoding.writeVarUint(encoder, MESSAGE_AWARENESS)
          encoding.writeVarUint8Array(
            encoder,
            awarenessProtocol.encodeAwarenessUpdate(WSDoc.awareness, Array.from(awarenessStates.keys()))
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
