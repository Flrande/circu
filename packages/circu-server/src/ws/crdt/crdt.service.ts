import { Injectable } from "@nestjs/common"
import { WsException } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { GeneralDocService } from "src/doc/service/general-doc.service"
import { URL } from "url"

@Injectable()
export class CrdtService {
  constructor(private readonly generalDocService: GeneralDocService) {}

  async setupCRDT(server: Server, socket: Socket): Promise<void> {
    const url = new URL(socket.handshake.address)
    const docId = url.pathname.split("/").at(-1)
    const userId = socket.request.session.userid

    //TODO: 针对 Websocket 的全局错误过滤器
    if (!userId) {
      throw new WsException("未认证")
    }

    if (!docId) {
      throw new WsException("未能找到文档 id")
    }

    const doc = await this.generalDocService.getDocMetaDataById(userId, docId)
  }
}
