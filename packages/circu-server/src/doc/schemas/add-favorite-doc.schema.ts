import { z } from "zod"

// 输入
const newFavoriteDocId = z.string()

export const AddFavoriteDocParams = z.object({
  newFavoriteDocId,
})

export type AddFavoriteDocParams = z.infer<typeof AddFavoriteDocParams>

// 输出
export const AddFavoriteDocOutput = z.object({})

export type AddFavoriteDocOutput = z.infer<typeof AddFavoriteDocOutput>
