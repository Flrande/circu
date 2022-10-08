import { Injectable } from "@nestjs/common"
import { randomBytes, scrypt, timingSafeEqual } from "crypto"
import { Buffer } from "buffer"
import { AuthExceptionCode } from "./auth.constant"
import { CommonException } from "src/exception/common.exception"
import { Request } from "express"
import { PrismaService } from "src/database/prisma.service"

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 用于散列密码以用于存储的函数, 传入的 password 字符串应经过 String.prototype.normalize() 处理, 或限制其可用字符
   *
   * https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#using-strings-as-inputs-to-cryptographic-apis
   *
   * 产生的哈希值共有 80 字节, 其中前 16 个字节为盐
   */
  async hashPassword(password: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16)
      const passwordBuffer = Buffer.from(password)

      scrypt(passwordBuffer, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(
            new CommonException({
              code: AuthExceptionCode.SCRYPT_PASSWORD_ERROR,
              message: `${err.name}: ${err.message}`,
            })
          )
        }

        resolve(Buffer.concat([salt, derivedKey]))
      })
    })
  }

  /**
   * 用于验证密码的函数
   */
  async comparePassword(password: string, hash: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = [hash.subarray(0, 16), hash.subarray(16)]
      const passwordBuffer = Buffer.from(password)

      scrypt(passwordBuffer, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(
            new CommonException({
              code: AuthExceptionCode.COMPARE_PASSWORD_ERROR,
              message: `${err.name}: ${err.message}`,
            })
          )
        }
        resolve(timingSafeEqual(key, derivedKey))
      })
    })
  }

  /**
   * 用于登录的函数, 接受用户输入的用户名及密码和当前的请求对象, 校验通过后持久化会话信息
   */
  async signIn(
    payload: {
      username: string
      password: string
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
      throw new CommonException({
        code: AuthExceptionCode.SIGN_IN_NO_USER,
        message: `未能找到用户名为${payload.username}的用户`,
        isFiltered: false,
      })
    }

    const result = await this.comparePassword(payload.password, user.password)

    if (!result) {
      throw new CommonException({
        code: AuthExceptionCode.SIGN_IN_PASSWORD_NOT_MATCH,
        message: "密码错误",
        isFiltered: false,
      })
    }

    req.session.userid = user.id
  }
}
