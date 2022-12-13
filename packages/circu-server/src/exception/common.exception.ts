import { HttpException, HttpStatus } from "@nestjs/common"
import { GlobalExceptionCode } from "src/app.constant"
import { ExceptionCode, ControllerOrModulePrefix } from "./types"

export type CommonExceptionResponse = {
  code: ExceptionCode
  message: string
  data: object
  isFiltered: boolean
}

// isFiltered 字段用于标识该异常是否暴露给前端, 若为真, 不暴露
export class CommonException extends HttpException {
  constructor(data: Partial<CommonExceptionResponse>, status: HttpStatus) {
    const baseData: CommonExceptionResponse = {
      code: `${GlobalExceptionCode.COMMON_EXCEPTION_CODE}_${ControllerOrModulePrefix.GLOBAL}`,
      message: "Error",
      data: {},
      isFiltered: true,
    }
    super({ ...baseData, ...data }, status)
  }
}
