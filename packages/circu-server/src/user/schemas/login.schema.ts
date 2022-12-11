import { successResponseSchemaFactory } from "src/interfaces/response/response"
import { z } from "zod"

// 输入
const loginPayload = z.object({
  username: z.string().min(1).max(20),
  password: z.string().min(6).max(20),
  ifCarrySession: z.boolean(),
})

export const LoginBody = z.object({
  loginPayload,
})

export type LoginBody = z.infer<typeof LoginBody>

// 输出
export const LoginOutput = successResponseSchemaFactory(z.object({}))

export type LoginOutput = z.infer<typeof LoginOutput>
