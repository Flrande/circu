import { successResponseSchemaFactory } from "src/interfaces/response"
import { z } from "zod"

// 无输入
// 输出
export const GetFastAccessDocsOutput = successResponseSchemaFactory(
  z.array(
    z.object({
      id: z.string(),
      lastModified: z.date(),
      authorId: z.string(),
      parentFolderId: z.string().nullable(),
    })
  )
)

export type GetFastAccessDocsOutput = z.infer<typeof GetFastAccessDocsOutput>
