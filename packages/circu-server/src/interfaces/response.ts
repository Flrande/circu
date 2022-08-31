export interface ISuccessResponse<T = object> {
  code: 0
  message: string
  data: T
}
