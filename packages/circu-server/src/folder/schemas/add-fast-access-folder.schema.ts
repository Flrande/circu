import { z } from "zod"

// 输入
const newFastAccessFolderId = z.string()

export const AddFastAccessFolderParams = z.object({
  newFastAccessFolderId,
})

export type AddFastAccessFolderParams = z.infer<typeof AddFastAccessFolderParams>

// 输出
export const AddFastAccessFolderOutput = z.object({})

export type AddFastAccessFolderOutput = z.infer<typeof AddFastAccessFolderOutput>
