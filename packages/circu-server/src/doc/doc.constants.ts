// doc 相关错误范围 1400-1699
export const DocExceptionCode = {
  // general-doc
  /**
   * 未找到 general-doc 信息
   */
  GENERAL_DOC_READ_BUT_DOC_NOT_FOUND: 1400,
  /**
   * 查找的 general-doc 已被删除 [不过滤]
   */
  GENERAL_DOC_READ_BUT_DOC_DELETED: 1401,
  /**
   * 查找用户主页快速访问的 general-doc 时未能找到用户信息
   */
  GENERAL_DOC_READ_FAST_ACCESS_BUT_USER_NOT_FOUND: 1402,
  /**
   * 新建 general-doc 时未能找到作者信息
   */
  GENERAL_DOC_CREATE_BUT_USER_NOT_FOUND: 1403,
  /**
   * 新建 general-doc 时未能找到父文件夹信息
   */
  GENERAL_DOC_CREATE_BUT_PARENT_FOLDER_NOT_FOUND: 1404,
  /**
   * 为用户添加快速访问的文档时未能找到文档
   */
  GENERAL_DOC_CREATE_FAST_ACCESS_BUT_DOC_NOT_FOUND: 1405,
  /**
   * 为用户添加快速访问的文档时文档已被删除 [不过滤]
   */
  GENERAL_DOC_CREATE_FAST_ACCESS_BUT_DOC_DELETED: 1406,
  /**
   * 删除 general-doc 时未能找到文档信息
   */
  GENERAL_DOC_DELETE_BUT_DOC_NOT_FOUND: 1407,
  /**
   * 恢复 general-doc 时未能找到文档信息
   */
  GENERAL_DOC_DELETE_REVERT_BUT_DOC_NOT_FOUND: 1408,
  /**
   * 用户想要恢复的文档已过期 [不过滤]
   */
  GENERAL_DOC_DELETE_REVERT_TOO_LATE: 1409,
  /**
   * 用户想要恢复的文档已被彻底删除 [不过滤]
   */
  GENERAL_DOC_DELETE_REVERT_FAIL: 1410,
  /**
   * 当前登录的用户没有读取该 general-doc 的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_READ_THIS_GENERAL_DOC: 1411,
  /**
   * 当前登录的用户没有修改该 general-doc 的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_GENERAL_DOC: 1412,
  /**
   * 当前登录的用户没有管理该 general-doc 的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_MANAGE_THIS_GENERAL_DOC: 1413,
  /**
   * 未能找到该 general-doc 的管理者角色
   */
  GENERAL_DOC_ADMINISTRATOR_ROLE_NOT_FOUND: 1414,
  /**
   * 未能找到该 general-doc 的协作者角色
   */
  GENERAL_DOC_COLLABORATOR_ROLE_NOT_FOUND: 1415,
  /**
   * 未能找到该 general-doc 的阅读者角色
   */
  GENERAL_DOC_READER_ROLE_NOT_FOUND: 1416,

  // wiki-doc
  // --------------------------------------------------

  /**
   * 未找到 wiki-doc 信息
   */
  WIKI_DOC_NOT_FOUND: 1450,
  /**
   * 新建 wiki-doc 时未能找到作者信息
   */
  WIKI_DOC_CREATE_BUT_NOT_FOUND_USER: 1451,
  /**
   * 新建 wiki-doc 时未能找到父文档信息
   */
  WIKI_DOC_CREATE_BUT_NOT_FOUND_PARENT_DOC: 1452,
  /**
   * 当前登录的用户没有读取该 wiki-doc 的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_READ_THIS_WIKI_DOC: 1453,
  /**
   * 当前登录的用户没有修改该 wiki-doc 的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_WIKI_DOC: 1454,
  /**
   * 当前登录的用户没有管理该 wiki-doc 的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_MANAGE_THIS_WIKI_DOC: 1455,
  /**
   * 未能找到该 wiki-doc 的管理者角色
   */
  WIKI_DOC_ADMINISTRATOR_ROLE_NOT_FOUND: 1456,
  /**
   * 未能找到该 wiki-doc 的协作者角色
   */
  WIKI_DOC_COLLABORATOR_ROLE_NOT_FOUND: 1457,
  /**
   * 未能找到该 wiki-doc 的阅读者角色
   */
  WIKI_DOC_READER_ROLE_NOT_FOUND: 1458,

  // folder
  //--------------------------------------------------

  /**
   * 未找到文件夹信息
   */
  FOLDER_READ_BUT_FOLDER_NOT_FOUND: 1500,
  /**
   * 查找的文件夹已被删除 [不过滤]
   */
  FOLDER_READ_BUT_FOLDER_DELETED: 1501,
  /**
   * 新建文件夹时未能找到作者信息
   */
  FOLDER_CREATE_BUT_USER_NOT_FOUND: 1502,
  /**
   * 新建文件夹时未能找到父文件夹信息
   */
  FOLDER_CREATE_BUT_PARENT_FOLDER_NOT_FOUND: 1503,
  /**
   * 删除文件夹时未能找到文件夹信息
   */
  FOLDER_DELETE_BUT_FOLDER_NOT_FOUND: 1504,
  /**
   * 恢复文件夹时未能找到文件夹信息
   */
  FOLDER_DELETE_REVERT_BUT_FOLDER_NOT_FOUND: 1505,
  /**
   * 用户想要恢复的文件夹已过期 [不过滤]
   */
  FOLDER_DELETE_REVERT_TOO_LATE: 1506,
  /**
   * 用户想要恢复的文件夹已被彻底删除 [不过滤]
   */
  FOLDER_DELETE_REVERT_FAIL: 1507,
  /**
   * 当前登录的用户没有读取该文件夹的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_READ_THIS_FOLDER: 1508,
  /**
   * 当前登录的用户没有修改该文件夹的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_FOLDER: 1509,
  /**
   * 当前登录的用户没有管理该文件夹的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_MANAGE_THIS_FOLDER: 1510,
  /**
   * 未能找到该文件夹的管理者角色
   */
  FOLDER_ADMINISTRATOR_ROLE_NOT_FOUND: 1511,
  /**
   * 未能找到该文件夹的协作者角色
   */
  FOLDER_COLLABORATOR_ROLE_NOT_FOUND: 1512,
  /**
   * 未能找到该文件夹的阅读者角色
   */
  FOLDER_READER_ROLE_NOT_FOUND: 1513,
} as const

// 删除的过期时间
export const DELETE_EXPIRE_DAY_TIME = 30
