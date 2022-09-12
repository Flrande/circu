import { Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { AuthService } from "src/auth/auth.service"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { UserExceptionCode } from "./user.constants"

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly authService: AuthService) {}

  async createUser(data: {
    username: string
    nickname: string
    password: string
  }): Promise<Pick<User, "id" | "nickname" | "username">> {
    // 查询用户名是否重复
    const existingUser = await this.prismaService.user.findFirst({
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

    const hashPassword = await this.authService.hashPassword(data.password)
    const createPayload: Pick<User, "username" | "nickname" | "password"> = {
      username: data.username,
      nickname: data.nickname,
      password: hashPassword,
    }

    const result = await this.prismaService.user.create({
      data: createPayload,
      select: {
        id: true,
        username: true,
        nickname: true,
      },
    })

    return result
  }

  async findUserById(id: User["id"]): Promise<Pick<User, "id" | "nickname" | "username">> {
    const result = await this.prismaService.user.findUnique({
      where: {
        id,
      },
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
