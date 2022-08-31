import { Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { UserExceptionCode } from "./user.constants"

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Omit<Prisma.UserCreateInput, "id">): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async findUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<Pick<User, "id" | "nickname" | "username"> | null> {
    const result = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        username: true,
        nickname: true,
      },
    })

    if (!result) {
      throw new CommonException({
        code: UserExceptionCode.USER_NOT_FOUND,
        message: "未能找到对应用户",
      })
    }

    return result
  }
}
