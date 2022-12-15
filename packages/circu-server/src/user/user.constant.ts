export const USER_ROUTE = "/api/user"

export enum UserExceptionCode {
  // 用户名已存在
  REGISTER_USERNAME_REPEAT = 1,
  // 未能找到用户信息
  USER_NOT_FOUND,
  // 密码错误
  LOGIN_PASSWORD_ERROR,
}
