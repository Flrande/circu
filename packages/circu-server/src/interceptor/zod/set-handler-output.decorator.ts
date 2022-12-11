import { SetMetadata } from "@nestjs/common"
import { ZodType } from "zod"

export const OUTPUT_ZOD_SCHEMA = "OUTPUT_ZOD_SCHEMA"

export const OutputZodSchema = (schemaMap: ZodType) => SetMetadata(OUTPUT_ZOD_SCHEMA, schemaMap)
