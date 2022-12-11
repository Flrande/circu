import { successResponseSchemaFactory } from "src/interfaces/response/response"
import { z } from "zod"

// 输入
const userInfo = z.object({
  username: z.string().min(1).max(20),
  nickname: z.string().min(1).max(20),
  password: z.string().min(6).max(20),
})

export const RegisterBody = z.object({
  userInfo,
})

export type RegisterBody = z.infer<typeof RegisterBody>

// 输出
export const RegisterOutput = successResponseSchemaFactory(
  z.object({
    id: z.string(),
    username: z.string(),
    nickname: z.string(),
  })
)

export type RegisterOutput = z.infer<typeof RegisterOutput>
