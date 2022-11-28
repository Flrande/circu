import ky from "ky"
import type { CommonException, SuccessResponse } from "./types"

export type LoginData = void
//TODO: 异常类型错误码
export type LoginError = CommonException | "登录失败, 请重试"
export type LoginProps = {
  username: string
  password: string
  options: {
    ifCarrySession: boolean
  }
}

export type LoginRes = SuccessResponse<LoginData>

export type Login = (
  username: string,
  password: string,
  options: {
    ifCarrySession: boolean
  }
) => Promise<void>

export const login: Login = async (username, password, options) => {
  const loginRes: LoginRes = await ky
    .post(import.meta.env.VITE_CIRCU_SERVER_URL, {
      json: {
        username,
        password,
        ifCarrySession: options.ifCarrySession,
      },
    })
    .json()

  if (loginRes.code !== 0) {
    //TODO: 根据错误码抛出登录错误信息

    throw "登录失败, 请重试"
  }
}
