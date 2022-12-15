import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { PrismaService } from "../database/prisma.service"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
