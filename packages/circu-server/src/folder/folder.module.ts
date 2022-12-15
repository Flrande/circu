import { Module } from "@nestjs/common"
import { PrismaService } from "../database/prisma.service"
import { FolderAuthService } from "./folder-auth.service"
import { FolderController } from "./folder.controller"
import { FolderService } from "./folder.service"

@Module({
  controllers: [FolderController],
  providers: [FolderService, FolderAuthService, PrismaService],
  exports: [FolderAuthService],
})
export class FolderModule {}
