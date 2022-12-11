import { SetMetadata } from "@nestjs/common"
import { ZodType } from "zod"

export const PARAMS_ZOD_SCHEMA = "PARAMS_ZOD_SCHEMA"
export const BODY_ZOD_SCHEMA = "BODY_ZOD_SCHEMA"
export const QUERY_ZOD_SCHEMA = "QUERY_ZOD_SCHEMA"

export const ParamsZodSchema = (schema: ZodType) => SetMetadata(PARAMS_ZOD_SCHEMA, schema)

export const BodyZodSchema = (schema: ZodType) => SetMetadata(BODY_ZOD_SCHEMA, schema)

export const QueryZodSchema = (schema: ZodType) => SetMetadata(QUERY_ZOD_SCHEMA, schema)
