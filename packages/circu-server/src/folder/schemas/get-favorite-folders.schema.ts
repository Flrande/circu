import { successResponseSchemaFactory } from "src/interfaces/response/response"
import { z } from "zod"

// 无输入
// 输出
export const GetFavoriteFoldersOutput = successResponseSchemaFactory(
  z.array(
    z.object({
      id: z.string(),
      lastModified: z.date(),
      title: z.string(),
      description: z.string().nullable(),
      authorId: z.string(),
      parentFolderId: z.string().nullable(),
    })
  )
)

export type GetFavoriteFoldersOutput = z.infer<typeof GetFavoriteFoldersOutput>
