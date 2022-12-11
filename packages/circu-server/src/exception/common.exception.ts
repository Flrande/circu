import { HttpException, HttpStatus } from "@nestjs/common"
import { GlobalExceptionCode } from "src/app.constant"
import { ExceptionCode, ControllerPrefix } from "./types"

export type ICommonException = {
  code: ExceptionCode
  message: string
  data: object
  isFiltered: boolean
}

// isFiltered 字段用于标识该异常是否暴露给前端, 若为真, 不暴露
export class CommonException extends HttpException {
  constructor(data: Partial<ICommonException>, status: HttpStatus) {
    const baseData: ICommonException = {
      code: `${GlobalExceptionCode.COMMON_EXCEPTION_CODE}_${ControllerPrefix.GLOBAL}`,
      message: "Error",
      data: {},
      isFiltered: true,
    }
    super({ ...baseData, ...data }, status)
  }
}
