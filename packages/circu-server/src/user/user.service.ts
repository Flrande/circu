import { HttpStatus, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"
import { AuthService } from "src/auth/auth.service"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { ControllerPrefix } from "src/exception/types"
import { UserExceptionCode } from "./user.constant"

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
      throw new CommonException(
        {
          code: `${UserExceptionCode.REGISTER_USERNAME_REPEAT}_${ControllerPrefix.USER}`,
          message: "用户名已存在",
          isFiltered: false,
        },
        HttpStatus.BAD_REQUEST
      )
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

  async getUserInfo(id: User["id"]): Promise<Pick<User, "id" | "nickname" | "username">> {
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
      throw new CommonException(
        {
          code: `${UserExceptionCode.USER_NOT_FOUND}_${ControllerPrefix.USER}`,
          message: `未能找到用户信息(id: ${id})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    return result
  }

  /**
   * 用于登录的函数, 接受用户输入的用户名及密码和当前的请求对象, 校验通过后持久化会话信息
   *
   * @param payload.ifCarrySession 若为真, 将用户会话保存7天
   *
   */
  async login(
    payload: {
      username: string
      password: string
      ifCarrySession: boolean
    },
    req: Request
  ): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: payload.username,
      },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user) {
      throw new CommonException(
        {
          code: `${UserExceptionCode.USER_NOT_FOUND}_${ControllerPrefix.USER}`,
          message: `未能找到用户信息(username: ${payload.username})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    const result = await this.authService.comparePassword(payload.password, user.password)

    if (!result) {
      throw new CommonException(
        {
          code: `${UserExceptionCode.LOGIN_PASSWORD_ERROR}_${ControllerPrefix.USER}`,
          message: "密码错误",
          isFiltered: false,
        },
        HttpStatus.BAD_REQUEST
      )
    }

    req.session.userid = user.id

    if (payload.ifCarrySession) {
      // 7天
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7
    }
  }
}
