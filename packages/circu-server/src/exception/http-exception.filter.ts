import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Response } from "express"
import { GlobalExceptionCode } from "src/app.constant"
import { CommonExceptionResponse } from "./common.exception"
import { ControllerOrModulePrefix } from "./types"

/**
 * 全局异常过滤器, 识别不应暴露的异常并返回统一的响应
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const expressRes = host.switchToHttp().getResponse<Response>()
    const exceptionRes = exception.getResponse() as CommonExceptionResponse

    // 开发环境下不过滤
    if (exceptionRes.isFiltered && this.configService.get<string>("NODE_ENV") !== "DEV") {
      const newRes: Omit<CommonExceptionResponse, "isFiltered"> = {
        code: `${GlobalExceptionCode.COMMON_EXCEPTION_CODE}_${ControllerOrModulePrefix.GLOBAL}`,
        message: "Error",
        data: {},
      }
      expressRes.status(exception.getStatus()).json(newRes)
    } else {
      expressRes.status(exception.getStatus()).json(exceptionRes)
    }
  }
}
