import { Module } from "@nestjs/common"
import { AuthModule } from "src/auth/auth.module"
import { PrismaService } from "src/database/prisma.service"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
