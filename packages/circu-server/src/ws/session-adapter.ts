import { INestApplicationContext } from "@nestjs/common"
import { IoAdapter } from "@nestjs/platform-socket.io"
import { Request, RequestHandler, Response } from "express"
import { Server, ServerOptions, Socket } from "socket.io"

export class SessionAdapter extends IoAdapter {
  private sessionMiddleware: RequestHandler

  constructor(sessionMiddleware: RequestHandler, app: INestApplicationContext) {
    super(app)
    this.sessionMiddleware = sessionMiddleware
  }

  override create(
    port: number,
    options?: ServerOptions & {
      namespace?: string
      server?: any
    }
  ): Server {
    const server: Server = super.create(port, options)

    const wrap = (middleware: RequestHandler) => (socket: Socket, next: () => void) =>
      middleware(socket.request as Request, {} as Response, next)

    server.use(wrap(this.sessionMiddleware))

    return server
  }
}
