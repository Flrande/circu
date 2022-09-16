import { Module } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { DocAuthService } from "./doc-auth.service"
import { GeneralDocController } from "./general-doc.controller"
import { GeneralDocService } from "./general-doc.service"

@Module({
  controllers: [GeneralDocController],
  providers: [GeneralDocService, DocAuthService, PrismaService],
})
export class DocModule {}
