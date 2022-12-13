import { successResponseSchemaFactory } from "src/interfaces/response"
import { z } from "zod"

// 无输入
// 输出
export const GetFavoriteDocsOutput = successResponseSchemaFactory(
  z.array(
    z.object({
      id: z.string(),
      lastModified: z.date(),
      authorId: z.string(),
      parentFolderId: z.string().nullable(),
    })
  )
)

export type GetFavoriteDocsOutput = z.infer<typeof GetFavoriteDocsOutput>
