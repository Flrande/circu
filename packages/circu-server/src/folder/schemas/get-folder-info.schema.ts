import { successResponseSchemaFactory } from "src/interfaces/response"
import { z } from "zod"

// 输入
const folderId = z.string()

export const GetFolderInfoParams = z.object({
  folderId,
})

export type GetFolderInfoParams = z.infer<typeof GetFolderInfoParams>

// 输出
export const GetFolderInfoOutput = successResponseSchemaFactory(
  z.object({
    id: z.string(),
    lastModified: z.date(),
    title: z.string(),
    description: z.string().nullable(),
    lastDeleted: z.date().nullable(),
    authorId: z.string(),
    parentFolderId: z.string().nullable(),
  })
)

export type GetFolderInfoOutput = z.infer<typeof GetFolderInfoOutput>
