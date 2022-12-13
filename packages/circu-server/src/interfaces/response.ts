import { z, ZodArray, ZodLiteral, ZodObject, ZodString } from "zod"

type SuccessResponseSchema<T extends ZodObject<{}> | ZodArray<ZodObject<{}>> = ZodObject<{}>> = ZodObject<{
  code: ZodLiteral<0>
  message: ZodString
  data: T
}>

export type SuccessResponse<T extends ZodObject<{}> | ZodArray<ZodObject<{}>> = ZodObject<{}>> = z.infer<
  SuccessResponseSchema<T>
>

export const successResponseSchemaFactory = <T extends ZodObject<{}> | ZodArray<ZodObject<{}>>>(
  schema: T
): SuccessResponseSchema<T> =>
  z.object({
    code: z.literal(0),
    message: z.string(),
    data: schema,
  })
