import { Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { UserExceptionCode } from "./user.constants"

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    data: Pick<User, "username" | "nickname" | "password">
  ): Promise<Pick<User, "id" | "nickname" | "username">> {
    // 查询用户名是否重复
    const existingUser = await this.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    })
    if (existingUser) {
      throw new CommonException({
        code: UserExceptionCode.USER_IS_EXISTING,
        message: "用户名已存在",
        isFiltered: false,
      })
    }

    const result = await this.prisma.user.create({
      data,
      select: {
        id: true,
        username: true,
        nickname: true,
      },
    })

    return result
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
