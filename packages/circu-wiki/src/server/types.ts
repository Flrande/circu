export type SuccessResponse<D = object> = {
  code: 0
  message: string
  data: D
}

export type CommonException<D = object, C extends number = number> = {
  code: C
  message: string
  data: D
}
