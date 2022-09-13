import { Module } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { DocController } from "./doc.controller"
import { DocService } from "./doc.service"

@Module({
  controllers: [DocController],
  providers: [DocService, PrismaService],
})
export class DocModule {}
