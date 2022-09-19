import { Module } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { FolderController } from "./controller/folder.controller"
import { FolderService } from "./service/folder.service"
import { GeneralDocService } from "./service/general-doc.service"
import { GeneralDocAuthService } from "./service/auth/general-doc-auth.service"
import { FolderAuthService } from "./service/auth/folder-auth.service"
import { GeneralDocController } from "./controller/general-doc.controller"

@Module({
  controllers: [GeneralDocController, FolderController],
  providers: [GeneralDocService, GeneralDocAuthService, FolderService, FolderAuthService, PrismaService],
})
export class DocModule {}
