export const FOLDER_ROUTE = "/api/folder"

export enum FolderExceptionCode {
  // 权限相关
  // 当前用户没有该文件夹的管理员权限
  AUTH_ADMINISTRATOR_DENIED = 1,
  // 当前用户无权修改该文件夹
  AUTH_MODIFY_DENIED,
  // 当前用户无权访问该文件夹
  AUTH_ACCESS_DENIED,
  // 未找到父文件夹对应的管理员角色
  PARENT_ADMINISTRATOR_ROLE_NOT_FOUND,
  // 未找到父文件夹对应的协作者角色
  PARENT_COLLABORATOR_ROLE_NOT_FOUND,
  // 未找到父文件夹对应的阅读者角色
  PARENT_READER_ROLE_NOT_FOUND,

  // 文件夹相关
  // 未找到文件夹
  FOLDER_NOT_FOUND,
  // 文件夹已被删除
  FOLDER_DELETED,
  // 被删除的文件夹已过期
  FOLDER_DELETED_EXPIRED,
  // 文件夹已经被彻底删除
  FOLDER_PERMANENTLY_DELETED,
  // 未能找到父文件夹
  FOLDER_PARENT_NOT_FOUND,

  // 用户相关
  // 未找到用户
  USER_NOT_FOUND,
}

// 文件夹的删除过期时间 - 30天
export const FOLDER_DELETE_EXPIRE_DAY_TIME = 30
