import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { CrdtService } from "./crdt/crdt.service"

@WebSocketGateway(process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8000, {
  path: "/crdt/",
  //TODO: 合理化跨域规则
  cors: true,
})
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server

  constructor(private readonly crdtService: CrdtService) {}

  async handleConnection(socket: Socket): Promise<void> {
    await this.crdtService.setupCRDT(socket)
  }
}
