import { successResponseSchemaFactory } from "src/interfaces/response"
import { z } from "zod"

// 输入
const userId = z.string()

export const GetUserInfoParams = z.object({
  userId,
})

export type GetUserInfoParams = z.infer<typeof GetUserInfoParams>

// 输出
export const GetUserInfoOutput = successResponseSchemaFactory(
  z.object({
    id: z.string(),
    username: z.string(),
    nickname: z.string(),
  })
)

export type GetUserInfoOutput = z.infer<typeof GetUserInfoOutput>
