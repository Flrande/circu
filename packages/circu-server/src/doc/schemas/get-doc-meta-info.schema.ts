import { successResponseSchemaFactory } from "src/interfaces/response"
import { z } from "zod"

// 输入
const docId = z.string()

export const GetDocMetaInfoParams = z.object({
  docId,
})

export type GetDocMetaInfoParams = z.infer<typeof GetDocMetaInfoParams>

// 输出
export const GetDocMetaInfoOutput = successResponseSchemaFactory(
  z.object({
    id: z.string(),
    lastModified: z.date(),
    lastDeleted: z.date().nullable(),
    authorId: z.string(),
    parentFolderId: z.string().nullable(),
  })
)

export type GetDocMetaInfoOutput = z.infer<typeof GetDocMetaInfoOutput>
