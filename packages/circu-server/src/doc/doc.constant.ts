export const DOC_ROUTE = "/doc"

export enum DocExceptionCode {
  // 权限相关
  // 当前用户没有该文档的管理员权限
  AUTH_ADMINISTRATOR_DENIED = 1,
  // 当前用户无权修改该文档
  AUTH_MODIFY_DENIED,
  // 当前用户无权访问该文档
  AUTH_ACCESS_DENIED,
  // 未找到父文档对应的管理员角色
  PARENT_ADMINISTRATOR_ROLE_NOT_FOUND,
  // 未找到父文档对应的协作者角色
  PARENT_COLLABORATOR_ROLE_NOT_FOUND,
  // 未找到父文档对应的阅读者角色
  PARENT_READER_ROLE_NOT_FOUND,

  // 文档相关
  // 未找到文档
  DOC_NOT_FOUND,
  // 文档已被删除
  DOC_DELETED,
  // 被删除的文档已过期
  DOC_DELETED_EXPIRED,
  // 文档已经被彻底删除
  DOC_PERMANENTLY_DELETED,
  // 未能找到父文档
  DOC_PARENT_NOT_FOUND,

  // 用户相关
  // 未找到用户
  USER_NOT_FOUND,
}

// 文档的删除过期时间 - 30天
export const DOC_DELETE_EXPIRE_DAY_TIME = 30
