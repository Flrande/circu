import { z } from "zod"

// 输入
const tobeDeletedDocId = z.string()

export const DeleteDocCompletelyParams = z.object({
  tobeDeletedDocId,
})

export type DeleteDocCompletelyParams = z.infer<typeof DeleteDocCompletelyParams>

// 输出
export const DeleteDocCompletelyOutput = z.object({})

export type DeleteDocCompletelyOutput = z.infer<typeof DeleteDocCompletelyOutput>
