import { successResponseSchemaFactory } from "src/interfaces/response"
import { z } from "zod"

// 输入
const createPayload = z.object({
  title: z.string().optional(),
  parentFolderId: z.string().optional(),
})

export const CreateDocBody = z.object({
  createPayload,
})

export type CreateDocBody = z.infer<typeof CreateDocBody>

// 输出
export const CreateDocOutput = successResponseSchemaFactory(
  z.object({
    id: z.string(),
    lastModified: z.date(),
    authorId: z.string(),
    parentFolderId: z.string().nullable(),
  })
)

export type CreateDocOutput = z.infer<typeof CreateDocOutput>
