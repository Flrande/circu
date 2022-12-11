import { z, ZodLiteral, ZodObject, ZodString } from "zod"

type SuccessResponseSchema<T = ZodObject<{}>> = {
  code: ZodLiteral<0>
  message: ZodString
  data: T
}

export const successResponseSchemaFactory = <T extends ZodObject<{}>>(schema: T): ZodObject<SuccessResponseSchema<T>> =>
  z.object({
    code: z.literal(0),
    message: z.string(),
    data: schema,
  })
