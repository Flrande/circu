import { successResponseSchemaFactory } from "src/interfaces/response/response"
import { z } from "zod"

// 无输入
// 输出
export const GetDeletedDocsOutput = successResponseSchemaFactory(
  z.array(
    z.object({
      id: z.string(),
      lastModified: z.date(),
      lastDeleted: z.date().nullable(),
      authorId: z.string(),
      parentFolderId: z.string().nullable(),
    })
  )
)

export type GetDeletedDocsOutput = z.infer<typeof GetDeletedDocsOutput>
