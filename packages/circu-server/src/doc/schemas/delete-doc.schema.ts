import { z } from "zod"

// 输入
const tobeDeletedDocId = z.string()

export const DeleteDocParams = z.object({
  tobeDeletedDocId,
})

export type DeleteDocParams = z.infer<typeof DeleteDocParams>

// 输出
export const DeleteDocOutput = z.object({})

export type DeleteDocOutput = z.infer<typeof DeleteDocOutput>
