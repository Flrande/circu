import { z } from "zod"

// 输入
const tobeRemovedDocId = z.string()

export const RemoveFavoriteDocParams = z.object({
  tobeRemovedDocId,
})

export type RemoveFavoriteDocParams = z.infer<typeof RemoveFavoriteDocParams>

// 输出
export const RemoveFavoriteDocOutput = z.object({})

export type RemoveFavoriteDocOutput = z.infer<typeof RemoveFavoriteDocOutput>
