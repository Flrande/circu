import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { CrdtService } from "./crdt/crdt.service"

@WebSocketGateway(process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8000, {
  path: "/crdt/",
  cors: {
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL : "http://localhost:5000",
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
