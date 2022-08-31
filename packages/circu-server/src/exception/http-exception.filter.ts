import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common"
import { Response } from "express"
import { GlobalExceptionCode } from "src/app.constants"
import { ICommonException } from "./common.exception"

/**
 * 全局异常过滤器, 识别不应暴露的异常并返回统一的响应
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const expRes = host.switchToHttp().getResponse<Response>()
    const excRes = exception.getResponse() as ICommonException

    if (excRes.isFiltered) {
      const newRes: ICommonException = {
        code: GlobalExceptionCode.COMMON_EXCEPTION_CODE,
        message: "Error",
        data: {},
        isFiltered: true,
      }
      expRes.status(HttpStatus.OK).json(newRes)
    } else {
      expRes.status(HttpStatus.OK).json(excRes)
    }
  }
}
