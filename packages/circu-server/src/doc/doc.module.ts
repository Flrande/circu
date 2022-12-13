import { Module } from "@nestjs/common"
import { PrismaService } from "src/database/prisma.service"
import { FolderModule } from "src/folder/folder.module"
import { DocAuthService } from "./doc-auth.service"
import { DocController } from "./doc.controller"
import { DocService } from "./doc.service"

@Module({
  imports: [FolderModule],
  controllers: [DocController],
  providers: [DocService, DocAuthService, PrismaService],
  exports: [DocService],
})
export class DocModule {}
