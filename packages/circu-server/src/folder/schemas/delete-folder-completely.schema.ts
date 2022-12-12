import { z } from "zod"

// 输入
const tobeDeletedFolderId = z.string()

export const DeleteFolderCompletelyParams = z.object({
  tobeDeletedFolderId,
})

export type DeleteFolderCompletelyParams = z.infer<typeof DeleteFolderCompletelyParams>

// 输出
export const DeleteFolderCompletelyOutput = z.object({})

export type DeleteFolderCompletelyOutput = z.infer<typeof DeleteFolderCompletelyOutput>
