import ky from "ky"
import type { ServerResponse } from "./types"
import { ControllerOrModulePrefix, LoginOutput, UserExceptionCode } from "circu-server"

type Login = (arg: {
  username: string
  password: string
  options: {
    ifCarrySession: boolean
  }
}) => Promise<void>

export const login: Login = async ({ username, password, options }) => {
  const loginRes: ServerResponse<LoginOutput> = await ky
    .post(import.meta.env.VITE_CIRCU_SERVER_URL, {
      json: {
        username,
        password,
        ifCarrySession: options.ifCarrySession,
      },
    })
    .json()

  if (loginRes.code !== 0) {
    if (loginRes.code === `${UserExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.USER}`) {
      throw "用户不存在"
    }
    if (loginRes.code === `${UserExceptionCode.LOGIN_PASSWORD_ERROR}_${ControllerOrModulePrefix.USER}`) {
      throw "密码错误"
    }

    throw "登录失败, 请重试"
  }
}
