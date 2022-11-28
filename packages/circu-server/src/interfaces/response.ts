export type ISuccessResponse<T = object> = {
  code: 0
  message: string
  data: T
}
