import { z } from "zod"

// 输入
const tobeRemovedFolderId = z.string()

export const RemoveFastAccessFolderParams = z.object({
  tobeRemovedFolderId,
})

export type RemoveFastAccessFolderParams = z.infer<typeof RemoveFastAccessFolderParams>

// 输出
export const RemoveFastAccessFolderOutput = z.object({})

export type RemoveFastAccessFolderOutput = z.infer<typeof RemoveFastAccessFolderOutput>
