import { z } from "zod"
import { successResponseSchemaFactory } from "../../interfaces/response"

// 输入
const docId = z.string()
const updatePayload = z.object({
  value: z.array(z.object({})),
  authorId: z.string().optional(),
})

export const UpdateDocBody = z.object({
  docId,
  updatePayload,
})

export type UpdateDocBody = z.infer<typeof UpdateDocBody>

// 输出
export const UpdateDocOutput = successResponseSchemaFactory(
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

export type UpdateDocOutput = z.infer<typeof UpdateDocOutput>
