import * as Y from "yjs"
import { HttpStatus, Injectable } from "@nestjs/common"
import { Doc, DocType, Prisma, RoleType, SurvivalStatus, User } from "@prisma/client"
import { slateNodesToInsertDelta, yTextToSlateElement } from "@slate-yjs/core"
import { DocAuthService } from "./doc-auth.service"
import { DocExceptionCode, DOC_DELETE_EXPIRE_DAY_TIME } from "./doc.constant"
import { PrismaService } from "../database/prisma.service"
import { ControllerOrModulePrefix } from "../exception"
import { CommonException } from "../exception/common.exception"
import { FolderAuthService } from "../folder/folder-auth.service"
import { SLATE_VALUE_YDOC_KEY } from "../ws/crdt/constants"
import { Element, Node } from "slate"
import { Optional } from "../types/utils"

@Injectable()
export class DocService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly docAuthService: DocAuthService,
    private readonly folderAuthService: FolderAuthService
  ) {}

  /**
   * 根据 id 查询文档元信息, 不包含文档内容
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文档信息
   */
  async getDocMetaInfo(
    userId: User["id"],
    docId: Doc["id"]
  ): Promise<Pick<Doc, "id" | "lastModified" | "lastDeleted" | "authorId" | "parentFolderId">> {
    // 校验权限
    const flag = await this.docAuthService.verifyUserReadGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户无权访问该文件(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    const result = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
      select: {
        id: true,
        lastModified: true,
        lastDeleted: true,
        survivalStatus: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    if (!result) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到文件信息(文件id: ${docId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (result.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_DELETED}_${ControllerOrModulePrefix.DOC}`,
          message: `该文件已被删除(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.NOT_FOUND
      )
    }

    return {
      id: result.id,
      lastModified: result.lastModified,
      lastDeleted: result.lastDeleted,
      authorId: result.authorId,
      parentFolderId: result.parentFolderId,
    }
  }

  /**
   * 根据 id 查询文档信息, 包含文档内容
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文档信息
   */
  async getDocInfo(
    userId: User["id"],
    docId: Doc["id"]
  ): Promise<
    Pick<Doc, "id" | "lastModified" | "lastDeleted" | "authorId" | "parentFolderId"> & {
      value: Element
    }
  > {
    // 校验权限
    const flag = await this.docAuthService.verifyUserReadGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户无权访问该文件(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    const result = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
      select: {
        id: true,
        lastModified: true,
        value: true,
        lastDeleted: true,
        survivalStatus: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    if (!result) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到文件信息(文件id: ${docId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (result.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_DELETED}_${ControllerOrModulePrefix.DOC}`,
          message: `该文件已被删除(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.NOT_FOUND
      )
    }

    // 将 value 字段的值转换为 json
    const YDoc = new Y.Doc()
    Y.applyUpdate(YDoc, result.value)
    const YDocXmlText = YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText
    const JsonValue = yTextToSlateElement(YDocXmlText)

    return {
      id: result.id,
      lastModified: result.lastModified,
      value: JsonValue,
      lastDeleted: result.lastDeleted,
      authorId: result.authorId,
      parentFolderId: result.parentFolderId,
    }
  }

  /**
   * 接受用户 id, 返回该用户个人空间的顶部文档
   */
  async getTopDocs(userId: User["id"]): Promise<Pick<Doc, "id" | "lastModified" | "authorId" | "parentFolderId">[]> {
    const result = await this.prismaService.doc.findMany({
      where: {
        authorId: userId,
        parentFolder: null,
        docType: DocType.GENERAL,
        survivalStatus: SurvivalStatus.ALIVE,
      },
      select: {
        id: true,
        lastModified: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    return result
  }

  /**
   * 接受用户 id, 返回该用户主页快速访问的文档
   */
  async getFastAccessDocs(
    userId: User["id"]
  ): Promise<Pick<Doc, "id" | "lastModified" | "authorId" | "parentFolderId">[]> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        fastAccessDocs: {
          select: {
            id: true,
            lastModified: true,
            authorId: true,
            parentFolderId: true,
          },
        },
      },
    })

    if (!user) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到用户信息(用户id: ${userId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    return user.fastAccessDocs
  }

  /**
   * 接受用户 id, 返回该用户收藏的文档
   */
  async getFavoriteDocs(
    userId: User["id"]
  ): Promise<Pick<Doc, "id" | "lastModified" | "authorId" | "parentFolderId">[]> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favoriteDocs: {
          select: {
            id: true,
            lastModified: true,
            authorId: true,
            parentFolderId: true,
          },
        },
      },
    })

    if (!user) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到用户信息(用户id: ${userId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    return user.favoriteDocs
  }

  /**
   * 接受用户 id, 返回该用户可回收的文档
   */
  async getDeletedDocs(
    userId: User["id"]
  ): Promise<Pick<Doc, "id" | "lastModified" | "lastDeleted" | "authorId" | "parentFolderId">[]> {
    const result = await this.prismaService.doc.findMany({
      where: {
        authorId: userId,
        docType: DocType.GENERAL,
        survivalStatus: SurvivalStatus.DELETED,
      },
      select: {
        id: true,
        lastModified: true,
        lastDeleted: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    return result
  }

  /**
   * 创建新的文档, 不需要提供新文档的值
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限在该文件夹上新建文档
   */
  async createDoc(
    userId: User["id"],
    data: Pick<Doc, "parentFolderId">
  ): Promise<Pick<Doc, "id" | "lastModified" | "authorId" | "parentFolderId">> {
    // 校验权限
    const flag = data.parentFolderId
      ? await this.folderAuthService.verifyUserWriteFolder(userId, data.parentFolderId)
      : true
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_MODIFY_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户无权修改该文件(文件id: ${data.parentFolderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    // 文档初始值
    const initialValue = [
      {
        type: "title",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]
    const YDoc = new Y.Doc()
    const YDocXmlText = YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText
    const initialDelta = slateNodesToInsertDelta(initialValue)
    YDoc.transact(() => {
      YDocXmlText.applyDelta(initialDelta)
    }, userId)
    const initialBuffer = Buffer.from(Y.encodeStateAsUpdate(YDoc))

    const author = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    })

    if (!author) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到用户信息(用户id: ${userId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    const createPayload: Prisma.DocCreateInput = {
      lastModified: new Date(),
      value: initialBuffer,
      docType: DocType.GENERAL,
      author: {
        connect: {
          id: author.id,
        },
      },
    }

    if (data.parentFolderId) {
      // 查询父文件夹信息
      const folder = await this.prismaService.folder.findUnique({
        where: {
          id: data.parentFolderId,
        },
        select: {
          id: true,
        },
      })

      if (!folder) {
        throw new CommonException(
          {
            code: `${DocExceptionCode.DOC_PARENT_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
            message: `未找到父文件夹信息(父文件夹id: ${data.parentFolderId})`,
          },
          HttpStatus.NOT_FOUND
        )
      }

      const folderAdministratorRole = await this.prismaService.role.findFirst({
        where: {
          folder,
          roleType: RoleType.ADMINISTRATOR,
        },
      })

      if (!folderAdministratorRole) {
        throw new CommonException(
          {
            code: `${DocExceptionCode.PARENT_ADMINISTRATOR_ROLE_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
            message: `未找到父文件夹对应的管理员角色(父文件夹id: ${data.parentFolderId})`,
          },
          HttpStatus.NOT_FOUND
        )
      }

      const folderCollaboratorRole = await this.prismaService.role.findFirst({
        where: {
          folder,
          roleType: RoleType.COLLABORATOR,
        },
      })

      if (!folderCollaboratorRole) {
        throw new CommonException(
          {
            code: `${DocExceptionCode.PARENT_COLLABORATOR_ROLE_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
            message: `未找到父文件夹对应的编辑者角色(父文件夹id: ${data.parentFolderId})`,
          },
          HttpStatus.NOT_FOUND
        )
      }

      const folderReaderRole = await this.prismaService.role.findFirst({
        where: {
          folder,
          roleType: RoleType.READER,
        },
      })

      if (!folderReaderRole) {
        throw new CommonException(
          {
            code: `${DocExceptionCode.PARENT_READER_ROLE_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
            message: `未找到父文件夹对应的阅读者权限(父文件夹id: ${data.parentFolderId})`,
          },
          HttpStatus.NOT_FOUND
        )
      }

      // 将新文档与父文件夹关联
      createPayload.parentFolder = {
        connect: {
          id: folder.id,
        },
      }

      // 新建文档
      const createdDocResult = await this.prismaService.doc.create({
        data: createPayload,
        select: {
          id: true,
          lastModified: true,
          authorId: true,
          parentFolderId: true,
        },
      })

      // 添加新文档的三个角色
      // 管理者角色
      const createdAdministratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.ADMINISTRATOR,
          doc: {
            connect: {
              id: createdDocResult.id,
            },
          },
          parentRoles: {
            connect: {
              id: folderAdministratorRole.id,
            },
          },
          // 将新文档的管理者角色和新文档作者相关联
          users: {
            connect: {
              id: author.id,
            },
          },
        },
      })
      // 协作者角色
      const createdCollaboratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.COLLABORATOR,
          doc: {
            connect: {
              id: createdDocResult.id,
            },
          },
          parentRoles: {
            connect: [{ id: folderCollaboratorRole.id }, { id: createdAdministratorRoleResult.id }],
          },
        },
      })
      // 阅读者角色
      await this.prismaService.role.create({
        data: {
          roleType: RoleType.READER,
          doc: {
            connect: {
              id: createdDocResult.id,
            },
          },
          parentRoles: {
            connect: [{ id: folderReaderRole.id }, { id: createdCollaboratorRoleResult.id }],
          },
        },
      })

      return createdDocResult
    } else {
      // 新建文档
      const createDocResult = await this.prismaService.doc.create({
        data: createPayload,
        select: {
          id: true,
          lastModified: true,
          authorId: true,
          parentFolderId: true,
        },
      })

      // 添加新文档的三个角色
      // 管理者角色
      const createdAdministratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.ADMINISTRATOR,
          doc: {
            connect: { id: createDocResult.id },
          },
          // 将新文档的管理者角色和新文档作者相关联
          users: {
            connect: {
              id: author.id,
            },
          },
        },
      })
      // 协作者角色
      const createdCollaboratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.COLLABORATOR,
          doc: {
            connect: {
              id: createDocResult.id,
            },
          },
          parentRoles: {
            connect: {
              id: createdAdministratorRoleResult.id,
            },
          },
        },
      })
      // 阅读者角色
      await this.prismaService.role.create({
        data: {
          roleType: RoleType.READER,
          doc: {
            connect: {
              id: createDocResult.id,
            },
          },
          parentRoles: {
            connect: {
              id: createdCollaboratorRoleResult.id,
            },
          },
        },
      })

      return createDocResult
    }
  }

  /**
   * 更新文档
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限更新文档
   */
  async updateDoc(
    userId: User["id"],
    docId: Doc["id"],
    newData: Optional<Pick<Doc, "authorId"> & { value: Record<string, unknown>[] }>
  ): Promise<
    Pick<Doc, "id" | "lastModified" | "lastDeleted" | "authorId" | "parentFolderId"> & {
      value: Element
    }
  > {
    // 校验是否有写权限
    const flag = await this.docAuthService.verifyUserWriteGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户无权更新该文件(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    let newDocData: Prisma.DocUpdateInput = {}
    // 检测新的作者是否存在
    if (newData.authorId) {
      const newAuthor = await this.prismaService.user.findUnique({
        where: {
          id: newData.authorId,
        },
      })
      if (!newAuthor) {
        throw new CommonException(
          {
            code: `${DocExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
            message: `新的作者不存在(用户id: ${newData.authorId})`,
            isFiltered: false,
          },
          HttpStatus.BAD_REQUEST
        )
      }
      newDocData = { author: { connect: { id: newData.authorId } } }
    }

    if (newData.value) {
      if (newData.value.every((node) => Node.isNode(node))) {
        const YDoc = new Y.Doc()
        const YDocXmlText = YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText
        const initialDelta = slateNodesToInsertDelta(newData.value as unknown as Node[])
        YDoc.transact(() => {
          YDocXmlText.applyDelta(initialDelta)
        }, userId)
        const newBuffer = Buffer.from(Y.encodeStateAsUpdate(YDoc))
        newDocData = { ...newDocData, value: newBuffer }
      } else {
        throw new CommonException(
          {
            code: `${DocExceptionCode.DOC_VALUE_UPDATE_INVALID}_${ControllerOrModulePrefix.DOC}`,
            message: `文档内容不合法`,
            isFiltered: false,
          },
          HttpStatus.BAD_REQUEST
        )
      }
    }

    // 更新文档
    const updateDocResult = await this.prismaService.doc.update({
      where: {
        id: docId,
      },
      data: newDocData,
      select: {
        id: true,
        lastModified: true,
        value: true,
        lastDeleted: true,
        survivalStatus: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    const YDoc = new Y.Doc()
    Y.applyUpdate(YDoc, updateDocResult.value)
    const YDocXmlText = YDoc.get(SLATE_VALUE_YDOC_KEY, Y.XmlText) as Y.XmlText
    const JsonValue = yTextToSlateElement(YDocXmlText)

    return {
      id: updateDocResult.id,
      lastModified: updateDocResult.lastModified,
      value: JsonValue,
      lastDeleted: updateDocResult.lastDeleted,
      authorId: updateDocResult.authorId,
      parentFolderId: updateDocResult.parentFolderId,
    }
  }

  /**
   * 为用户添加新的快速访问文档
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文档信息
   */
  async addFastAccessDoc(userId: User["id"], docId: Doc["id"]): Promise<void> {
    // 校验是否有读权限
    const flag = await this.docAuthService.verifyUserReadGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户无权访问该文件(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    const doc = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
    })

    if (!doc) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到文件信息(文件id: ${docId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (doc.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_DELETED}_${ControllerOrModulePrefix.DOC}`,
          message: `文件已被删除(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.NOT_FOUND
      )
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        fastAccessDocs: {
          connect: {
            id: docId,
          },
        },
      },
    })
  }

  /**
   * 为用户添加新的收藏文档
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文档信息
   */
  async addFavoriteDoc(userId: User["id"], docId: Doc["id"]): Promise<void> {
    // 校验是否有读权限
    const flag = await this.docAuthService.verifyUserReadGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户无权访问该文件(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    const doc = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
    })

    if (!doc) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到文件信息(文件id: ${docId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (doc.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_DELETED}_${ControllerOrModulePrefix.DOC}`,
          message: `文件已被删除(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.NOT_FOUND
      )
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteDocs: {
          connect: {
            id: docId,
          },
        },
      },
    })
  }

  /**
   * 移除快速访问文档
   */
  async removeFastAccessDoc(userId: User["id"], docId: Doc["id"]): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        fastAccessDocs: {
          disconnect: {
            id: docId,
          },
        },
      },
    })
  }

  /**
   * 移除收藏文档
   */
  async removeFavoriteDoc(userId: User["id"], docId: Doc["id"]): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteDocs: {
          disconnect: {
            id: docId,
          },
        },
      },
    })
  }

  /**
   * 根据 id 将文档删除, 传入的 type 决定是可回收的删除还是彻底删除, soft 是可回收的删除, hard 是彻底删除
   *
   * 需要操作者的用户 id, 用于判断操作者是否有文档的管理权限
   */
  async deleteDoc(userId: User["id"], docId: Doc["id"], type: "soft" | "hard"): Promise<void> {
    const docData = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
    })

    if (!docData) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到文件信息(id: ${docId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    // 校验权限
    const flag = await this.docAuthService.verifyUserAdministerGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_ADMINISTRATOR_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户没有该文件的管理员权限(文件夹id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    await this.prismaService.doc.update({
      where: {
        id: docId,
      },
      data: {
        survivalStatus: type === "soft" ? SurvivalStatus.DELETED : SurvivalStatus.COMPLETELY_DELETED,
        lastDeleted: new Date(),
      },
    })
  }

  /**
   * 根据 id 将已删除的文档恢复, 若已彻底删除, 不可恢复
   *
   * 需要操作者的用户 id, 用于判断操作者是否有文档的管理权限
   */
  async revertDoc(userId: User["id"], docId: Doc["id"]): Promise<void> {
    const docData = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
    })

    if (!docData) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_NOT_FOUND}_${ControllerOrModulePrefix.DOC}`,
          message: `未能找到文件信息(文件id: ${docId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    // 校验权限
    const flag = await this.docAuthService.verifyUserAdministerGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.AUTH_ADMINISTRATOR_DENIED}_${ControllerOrModulePrefix.DOC}`,
          message: `当前用户没有该文件的管理员权限(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    // 判断是否已彻底删除
    if (docData.survivalStatus === SurvivalStatus.COMPLETELY_DELETED) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_PERMANENTLY_DELETED}_${ControllerOrModulePrefix.DOC}`,
          message: `文件已被彻底删除(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    // 判断是否已过期
    const currentTime = new Date()
    if (
      docData.lastDeleted &&
      (currentTime.getTime() - docData.lastDeleted.getTime()) / (1000 * 3600 * 24) > DOC_DELETE_EXPIRE_DAY_TIME
    ) {
      throw new CommonException(
        {
          code: `${DocExceptionCode.DOC_DELETED_EXPIRED}_${ControllerOrModulePrefix.DOC}`,
          message: `被删除的文件已过期(文件id: ${docId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    await this.prismaService.doc.update({
      where: {
        id: docId,
      },
      data: {
        survivalStatus: SurvivalStatus.ALIVE,
        lastDeleted: null,
      },
    })
  }
}
