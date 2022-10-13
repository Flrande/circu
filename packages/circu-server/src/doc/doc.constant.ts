// doc 相关错误范围 1400-1699
export const DocExceptionCode = {
  // general-doc

  /**
   * 未找到文档信息
   */
  GENERAL_DOC_READ_BUT_DOC_NOT_FOUND: 1400,

  /**
   * 查找的文档已被删除 [不过滤]
   */
  GENERAL_DOC_READ_BUT_DOC_DELETED: 1401,

  /**
   * 查找用户主页快速访问的文档时未能找到用户信息
   */
  GENERAL_DOC_READ_FAST_ACCESS_BUT_USER_NOT_FOUND: 1402,

  /**
   * 查找用户主页收藏的文档时未能找到用户信息
   */
  GENERAL_DOC_READ_FAVORITE_BUT_USER_NOT_FOUND: 1403,

  /**
   * 新建文档时未能找到作者信息
   */
  GENERAL_DOC_CREATE_BUT_USER_NOT_FOUND: 1404,

  /**
   * 新建文档时未能找到父文件夹信息
   */
  GENERAL_DOC_CREATE_BUT_PARENT_FOLDER_NOT_FOUND: 1405,

  /**
   * 为用户添加快速访问的文档时未能找到文档
   */
  GENERAL_DOC_CREATE_FAST_ACCESS_BUT_DOC_NOT_FOUND: 1406,

  /**
   * 为用户添加快速访问的文档时文档已被删除 [不过滤]
   */
  GENERAL_DOC_CREATE_FAST_ACCESS_BUT_DOC_DELETED: 1407,

  /**
   * 为用户添加收藏文档时未能找到文档
   */
  GENERAL_DOC_CREATE_FAVORITE_BUT_DOC_NOT_FOUND: 1408,

  /**
   * 为用户添加收藏文档时文档已被删除 [不过滤]
   */
  GENERAL_DOC_CREATE_FAVORITE_BUT_DOC_DELETED: 1409,

  /**
   * 删除文档时未能找到文档信息
   */
  GENERAL_DOC_DELETE_BUT_DOC_NOT_FOUND: 1410,

  /**
   * 恢复被删除的文档时未能找到文档信息
   */
  GENERAL_DOC_DELETE_REVERT_BUT_DOC_NOT_FOUND: 1411,

  /**
   * 用户想要恢复的文档已过期 [不过滤]
   */
  GENERAL_DOC_DELETE_REVERT_TOO_LATE: 1412,

  /**
   * 用户想要恢复的文档已被彻底删除 [不过滤]
   */
  GENERAL_DOC_DELETE_REVERT_FAIL: 1413,

  /**
   * 当前登录的用户没有读取该文档的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_READ_THIS_GENERAL_DOC: 1414,

  /**
   * 当前登录的用户没有修改该文档的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_GENERAL_DOC: 1415,

  /**
   * 当前登录的用户没有管理该文档的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_MANAGE_THIS_GENERAL_DOC: 1416,

  /**
   * 未能找到该文档的管理者角色
   */
  GENERAL_DOC_ADMINISTRATOR_ROLE_NOT_FOUND: 1417,

  /**
   * 未能找到该文档的协作者角色
   */
  GENERAL_DOC_COLLABORATOR_ROLE_NOT_FOUND: 1418,

  /**
   * 未能找到该文档的阅读者角色
   */
  GENERAL_DOC_READER_ROLE_NOT_FOUND: 1419,

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
   * 查找用户主页快速访问的文件夹时未能找到用户信息
   */
  FOLDER_READ_FAST_ACCESS_BUT_USER_NOT_FOUND: 1502,

  /**
   * 查找用户收藏的文件夹时未能找到用户信息
   */
  FOLDER_READ_FAVORITE_BUT_USER_NOT_FOUND: 1503,

  /**
   * 新建文件夹时未能找到作者信息
   */
  FOLDER_CREATE_BUT_USER_NOT_FOUND: 1504,

  /**
   * 新建文件夹时未能找到父文件夹信息
   */
  FOLDER_CREATE_BUT_PARENT_FOLDER_NOT_FOUND: 1505,

  /**
   * 为用户添加快速访问的文件夹时未能找到文件夹
   */
  FOLDER_CREATE_FAST_ACCESS_BUT_FOLDER_NOT_FOUND: 1506,

  /**
   * 为用户添加快速访问的文件夹时文件夹已被删除 [不过滤]
   */
  FOLDER_CREATE_FAST_ACCESS_BUT_FOLDER_DELETED: 1507,

  /**
   * 为用户添加收藏的文件夹时未能找到文件夹
   */
  FOLDER_CREATE_FAVORITE_BUT_FOLDER_NOT_FOUND: 1508,

  /**
   * 为用户添加快速访问的文件夹时文件夹已被删除 [不过滤]
   */
  FOLDER_CREATE_FAVORITE_BUT_FOLDER_DELETED: 1509,

  /**
   * 删除文件夹时未能找到文件夹信息
   */
  FOLDER_DELETE_BUT_FOLDER_NOT_FOUND: 1508,

  /**
   * 恢复文件夹时未能找到文件夹信息
   */
  FOLDER_DELETE_REVERT_BUT_FOLDER_NOT_FOUND: 1509,

  /**
   * 用户想要恢复的文件夹已过期 [不过滤]
   */
  FOLDER_DELETE_REVERT_TOO_LATE: 1510,

  /**
   * 用户想要恢复的文件夹已被彻底删除 [不过滤]
   */
  FOLDER_DELETE_REVERT_FAIL: 1511,

  /**
   * 当前登录的用户没有读取该文件夹的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_READ_THIS_FOLDER: 1512,

  /**
   * 当前登录的用户没有修改该文件夹的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_FOLDER: 1513,

  /**
   * 当前登录的用户没有管理该文件夹的权限 [不过滤]
   */
  CURRENT_USER_CAN_NOT_MANAGE_THIS_FOLDER: 1514,

  /**
   * 未能找到该文件夹的管理者角色
   */
  FOLDER_ADMINISTRATOR_ROLE_NOT_FOUND: 1515,

  /**
   * 未能找到该文件夹的协作者角色
   */
  FOLDER_COLLABORATOR_ROLE_NOT_FOUND: 1516,

  /**
   * 未能找到该文件夹的阅读者角色
   */
  FOLDER_READER_ROLE_NOT_FOUND: 1517,
} as const

// 删除的过期时间
export const DELETE_EXPIRE_DAY_TIME = 30
