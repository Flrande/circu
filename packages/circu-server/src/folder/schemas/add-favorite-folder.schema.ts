import { z } from "zod"

// 输入
const newFavoriteFolderId = z.string()

export const AddFavoriteFolderParams = z.object({
  newFavoriteFolderId,
})

export type AddFavoriteFolderParams = z.infer<typeof AddFavoriteFolderParams>

// 输出
export const AddFavoriteFolderOutput = z.object({})

export type AddFavoriteFolderOutput = z.infer<typeof AddFavoriteFolderOutput>
