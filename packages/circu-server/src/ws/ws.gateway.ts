import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { corsOrigins } from "../constants"
import { CrdtService } from "./crdt/crdt.service"

@WebSocketGateway({
  path: "/crdt/",
  cors: {
    origin: corsOrigins,
    credentials: true,
  },
})
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server

  constructor(private readonly crdtService: CrdtService) {}

  async handleConnection(socket: Socket): Promise<void> {
    await this.crdtService.setupCRDT(socket)
  }
}
