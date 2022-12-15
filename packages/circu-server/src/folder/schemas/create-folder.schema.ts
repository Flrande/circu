import { z } from "zod"
import { successResponseSchemaFactory } from "../../interfaces/response"

// 输入
const createPayload = z.object({
  title: z.string(),
  description: z.string().optional(),
  parentFolderId: z.string().optional(),
})

export const CreateFolderBody = z.object({
  createPayload,
})

export type CreateFolderBody = z.infer<typeof CreateFolderBody>

// 输出
export const CreateFolderOutput = successResponseSchemaFactory(
  z.object({
    id: z.string(),
    lastModified: z.date(),
    title: z.string(),
    description: z.string().nullable(),
    authorId: z.string(),
    parentFolderId: z.string().nullable(),
  })
)

export type CreateFolderOutput = z.infer<typeof CreateFolderOutput>
