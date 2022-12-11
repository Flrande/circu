export const GLOBAL_ROUTE = "/api"

export enum GlobalExceptionCode {
  // 每个异常都有对应的错误码, 但除了是前端需要处理的异常, 返回时统一使用一个错误码
  COMMON_EXCEPTION_CODE = 1,
}
