import type { CommonExceptionResponse, SuccessResponse } from "circu-server"

export type ServerResponse<T extends SuccessResponse = SuccessResponse> = T | CommonExceptionResponse
