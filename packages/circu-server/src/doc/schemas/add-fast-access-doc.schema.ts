import { z } from "zod"

// 输入
const newFastAccessDocId = z.string()

export const AddFastAccessDocParams = z.object({
  newFastAccessDocId,
})

export type AddFastAccessDocParams = z.infer<typeof AddFastAccessDocParams>

// 输出
export const AddFastAccessDocOutput = z.object({})

export type AddFastAccessDocOutput = z.infer<typeof AddFastAccessDocOutput>
