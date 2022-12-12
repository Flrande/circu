import { z } from "zod"

// 输入
const tobeRevertedFolderId = z.string()

export const RevertFolderParams = z.object({
  tobeRevertedFolderId,
})

export type RevertFolderParams = z.infer<typeof RevertFolderParams>

// 输出
export const RevertFolderOutput = z.object({})

export type RevertFolderOutput = z.infer<typeof RevertFolderOutput>
