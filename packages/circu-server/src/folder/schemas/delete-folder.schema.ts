import { z } from "zod"

// 输入
const tobeDeletedFolderId = z.string()

export const DeleteFolderParams = z.object({
  tobeDeletedFolderId,
})

export type DeleteFolderParams = z.infer<typeof DeleteFolderParams>

// 输出
export const DeleteFolderOutput = z.object({})

export type DeleteFolderOutput = z.infer<typeof DeleteFolderOutput>
