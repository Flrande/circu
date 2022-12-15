import { Module } from "@nestjs/common"
import { PrismaService } from "../database/prisma.service"
import { AuthService } from "./auth.service"

@Module({
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
