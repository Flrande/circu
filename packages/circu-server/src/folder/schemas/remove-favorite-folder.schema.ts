import { z } from "zod"

// 输入
const tobeRemovedFolderId = z.string()

export const RemoveFavoriteFolderParams = z.object({
  tobeRemovedFolderId,
})

export type RemoveFavoriteFolderParams = z.infer<typeof RemoveFavoriteFolderParams>

// 输出
export const RemoveFavoriteFolderOutput = z.object({})

export type RemoveFavoriteFolderOutput = z.infer<typeof RemoveFavoriteFolderOutput>
