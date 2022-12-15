import { z } from "zod"
import { successResponseSchemaFactory } from "../../interfaces/response"

// 输入
const docId = z.string()

export const GetDocInfoParams = z.object({
  docId,
})

export type GetDocInfoParams = z.infer<typeof GetDocInfoParams>

// 输出
export const GetDocInfoOutput = successResponseSchemaFactory(
  z.object({
    id: z.string(),
    lastModified: z.date(),
    value: z.object({
      children: z.unknown(),
    }),
    lastDeleted: z.date().nullable(),
    authorId: z.string(),
    parentFolderId: z.string().nullable(),
  })
)

export type GetDocInfoOutput = z.infer<typeof GetDocInfoOutput>
