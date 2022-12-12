import { z } from "zod"

// 输入
const tobeRemovedDocId = z.string()

export const RemoveFastAccessDocParams = z.object({
  tobeRemovedDocId,
})

export type RemoveFastAccessDocParams = z.infer<typeof RemoveFastAccessDocParams>

// 输出
export const RemoveFastAccessDocOutput = z.object({})

export type RemoveFastAccessDocOutput = z.infer<typeof RemoveFastAccessDocOutput>
