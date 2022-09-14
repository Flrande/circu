import { Module } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { GeneralDocAuthService } from "./general-doc-auth.service"
import { GeneralDocController } from "./general-doc.controller"
import { GeneralDocService } from "./general-doc.service"

@Module({
  controllers: [GeneralDocController],
  providers: [GeneralDocService, GeneralDocAuthService, PrismaService],
})
export class DocModule {}
