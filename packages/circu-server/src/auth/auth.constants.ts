// auth 相关错误范围 1200-1399
export enum AuthExceptionCode {
  SCRYPT_PASSWORD_ERROR = 1200,
  COMPARE_PASSWORD_ERROR = 1201,
  SIGN_IN_NO_USER = 1202,
  SIGN_IN_PASSWORD_NOT_MATCH = 1203,
}
