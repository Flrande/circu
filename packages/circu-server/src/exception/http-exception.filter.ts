import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Response } from "express"
import { GlobalExceptionCode } from "src/app.constants"
import { ICommonException } from "./common.exception"

/**
 * 全局异常过滤器, 识别不应暴露的异常并返回统一的响应
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const expRes = host.switchToHttp().getResponse<Response>()
    const excRes = exception.getResponse() as ICommonException

    // 开发环境下不过滤
    if (excRes.isFiltered && this.configService.get<string>("NODE_ENV") !== "DEV") {
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
