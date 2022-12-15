// 1. 校验输入载荷, 保证载荷的合法性, 并通过 Reflection 优雅得到异常编号
// 2. 校验输出结果, 保证敏感信息不泄露
// 利用 zod 建立每个端点的 schema, 校验输出结果

import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { map, Observable } from "rxjs"
import { ZodType } from "zod"
import { CONTROLLER_META } from "../../decorators/set-controller-meta.decorator"
import { ControllerOrModulePrefix } from "../../exception"
import { CommonException } from "../../exception/common.exception"
import { OUTPUT_ZOD_SCHEMA } from "./set-handler-output.decorator"
import { BODY_ZOD_SCHEMA, PARAMS_ZOD_SCHEMA, QUERY_ZOD_SCHEMA } from "./set-zod-schema.decorator"

@Injectable()
export class ZodIntercepter implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const type = context.getType()
    if (type === "http") {
      const httpContext = context.switchToHttp()
      const request = httpContext.getRequest()

      const handler = context.getHandler()
      const controller = context.getClass()

      const paramsSchema = this.reflector.get<ZodType>(PARAMS_ZOD_SCHEMA, handler)
      const bodySchema = this.reflector.get<ZodType>(BODY_ZOD_SCHEMA, handler)
      const querySchema = this.reflector.get<ZodType>(QUERY_ZOD_SCHEMA, handler)

      const ControllerOrModulePrefix = this.reflector.get<ControllerOrModulePrefix>(CONTROLLER_META, controller)

      // 校验输入载荷
      const params = request.params
      if (paramsSchema) {
        const paramsResult = paramsSchema.safeParse(params)
        if (!paramsResult.success) {
          throw new CommonException(
            {
              code: `${0}_${ControllerOrModulePrefix}`,
              isFiltered: false,
            },
            HttpStatus.BAD_REQUEST
          )
        }
      }
      if (bodySchema) {
        const body = request.body
        const bodyResult = bodySchema.safeParse(body)
        if (!bodyResult.success) {
          throw new CommonException(
            {
              code: `${0}_${ControllerOrModulePrefix}`,
              isFiltered: false,
            },
            HttpStatus.BAD_REQUEST
          )
        }
      }
      if (querySchema) {
        const query = request.query
        const queryResult = querySchema.safeParse(query)
        if (!queryResult.success) {
          throw new CommonException(
            {
              code: `${0}_${ControllerOrModulePrefix}`,
              isFiltered: false,
            },
            HttpStatus.BAD_REQUEST
          )
        }
      }

      // 校验输出结果
      const outputSchema = this.reflector.get<ZodType>(OUTPUT_ZOD_SCHEMA, handler)
      return next.handle().pipe(
        map((data) => {
          if (outputSchema) {
            const result = outputSchema.safeParse(data)
            if (!result.success) {
              throw new CommonException(
                {
                  code: `${0}_${ControllerOrModulePrefix}`,
                  isFiltered: true,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
              )
            }
          }

          return data
        })
      )
    }

    return next.handle()
  }
}
