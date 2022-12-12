import { z } from "zod"

// 输入
const tobeRevertedDocId = z.string()

export const RevertDocParams = z.object({
  tobeRevertedDocId,
})

export type RevertDocParams = z.infer<typeof RevertDocParams>

// 输出
export const RevertDocOutput = z.object({})

export type RevertDocOutput = z.infer<typeof RevertDocOutput>
