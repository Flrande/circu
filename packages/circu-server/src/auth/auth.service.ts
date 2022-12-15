import { HttpStatus, Injectable } from "@nestjs/common"
import { randomBytes, scrypt, timingSafeEqual } from "crypto"
import { Buffer } from "buffer"
import { AuthExceptionCode } from "./auth.constant"
import { ControllerOrModulePrefix } from "../exception"
import { CommonException } from "../exception/common.exception"

@Injectable()
export class AuthService {
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
            new CommonException(
              {
                code: `${AuthExceptionCode.HASH_PASSWORD_ERROR}_${ControllerOrModulePrefix.Auth}`,
                message: `${err.name}: ${err.message}`,
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            )
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
            new CommonException(
              {
                code: `${AuthExceptionCode.COMPARE_PASSWORD_ERROR}_${ControllerOrModulePrefix.Auth}`,
                message: `${err.name}: ${err.message}`,
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            )
          )
        }
        resolve(timingSafeEqual(key, derivedKey))
      })
    })
  }
}
