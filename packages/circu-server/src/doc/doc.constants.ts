// doc 相关错误范围 1400-1699
export const DocExceptionCode = {
  /**
   * 未找到 general-doc 信息
   */
  GENERAL_DOC_NOT_FOUND: 1400,
  /**
   * 新建 general-doc 时未能找到作者信息
   */
  GENERAL_DOC_CREATE_BUT_NOT_FOUND_USER: 1401,
  /**
   * 新建 general-doc 时未能找到父文件夹信息
   */
  GENERAL_DOC_CREATE_BUT_NOT_FOUND_PARENT_FOLDER: 1402,
  /**
   * 当前登录的用户没有读取该 general-doc 的权限
   */
  CURRENT_USER_CAN_NOT_READ_THIS_GENERAL_DOC: 1403,
  /**
   * 当前登录的用户没有修改该 general-doc 的权限
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_GENERAL_DOC: 1404,
  /**
   * 当前登录的用户没有管理该 general-doc 的权限
   */
  CURRENT_USER_CAN_NOT_MANAGE_THIS_GENERAL_DOC: 1405,
  /**
   * 未能找到该 general-doc 的管理者角色
   */
  GENERAL_DOC_ADMINISTRATOR_ROLE_NOT_FOUND: 1406,
  /**
   * 未能找到该 general-doc 的协作者角色
   */
  GENERAL_DOC_COLLABORATOR_ROLE_NOT_FOUND: 1407,
  /**
   * 未能找到该 general-doc 的阅读者角色
   */
  GENERAL_DOC_READER_ROLE_NOT_FOUND: 1408,

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
   * 当前登录的用户没有读取该 wiki-doc 的权限
   */
  CURRENT_USER_CAN_NOT_READ_THIS_WIKI_DOC: 1453,
  /**
   * 当前登录的用户没有修改该 wiki-doc 的权限
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_WIKI_DOC: 1454,
  /**
   * 当前登录的用户没有管理该 wiki-doc 的权限
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

  /**
   * 未找到文件夹信息
   */
  FOLDER_NOT_FOUND: 1500,
  /**
   * 新建文件夹时未能找到作者信息
   */
  FOLDER_CREATE_BUT_NOT_FOUND_USER: 1501,
  /**
   * 新建文件夹时未能找到父文件夹信息
   */
  FOLDER_CREATE_BUT_NOT_FOUND_PARENT_FOLDER: 1502,
  /**
   * 当前登录的用户没有读取该文件夹的权限
   */
  CURRENT_USER_CAN_NOT_READ_THIS_FOLDER: 1503,
  /**
   * 当前登录的用户没有修改该文件夹的权限
   */
  CURRENT_USER_CAN_NOT_WRITE_THIS_FOLDER: 1504,
  /**
   * 当前登录的用户没有管理该文件夹的权限
   */
  CURRENT_USER_CAN_NOT_MANAGE_THIS_FOLDER: 1505,
  /**
   * 未能找到该文件夹的管理者角色
   */
  FOLDER_ADMINISTRATOR_ROLE_NOT_FOUND: 1506,
  /**
   * 未能找到该文件夹的协作者角色
   */
  FOLDER_COLLABORATOR_ROLE_NOT_FOUND: 1507,
  /**
   * 未能找到该文件夹的阅读者角色
   */
  FOLDER_READER_ROLE_NOT_FOUND: 1508,
} as const
