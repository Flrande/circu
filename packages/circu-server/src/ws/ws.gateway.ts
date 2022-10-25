import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { CrdtService } from "./crdt/crdt.service"

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server

  constructor(private readonly crdtService: CrdtService) {}

  async handleConnection(socket: Socket): Promise<void> {
    await this.crdtService.setupCRDT(this.server, socket)
  }
}
