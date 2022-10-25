import { Module } from "@nestjs/common"
import { DocModule } from "src/doc/doc.module"
import { CrdtService } from "./crdt/crdt.service"
import { WsGateway } from "./ws.gateway"

@Module({
  imports: [DocModule],
  providers: [WsGateway, CrdtService],
})
export class WsModule {}
