import { Injectable } from "@nestjs/common"
import { Doc, DocType, Prisma, RoleType, SurvivalStatus, User } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { DocExceptionCode } from "../doc.constants"
import { FolderAuthService } from "./auth/folder-auth.service"
import { GeneralDocAuthService } from "./auth/general-doc-auth.service"

@Injectable()
export class GeneralDocService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly generalDocAuthService: GeneralDocAuthService,
    private readonly folderAuthService: FolderAuthService
  ) {}

  /**
   * 根据 id 查询文档元信息, 不包含文档内容
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文档信息
   */
  async findDocMetaDataById(
    userId: User["id"],
    docId: Doc["id"]
  ): Promise<Pick<Doc, "id" | "lastModify" | "lastDeleted" | "authorId" | "parentFolderId">> {
    // 校验权限
    const flag = await this.generalDocAuthService.verifyUserReadGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException({
        code: DocExceptionCode.CURRENT_USER_CAN_NOT_READ_THIS_GENERAL_DOC,
        message: `当前用户无权阅读文档(文档id: ${docId})`,
        isFiltered: false,
      })
    }

    const result = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
      select: {
        id: true,
        lastModify: true,
        lastDeleted: true,
        survivalStatus: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    if (!result) {
      throw new CommonException({
        code: DocExceptionCode.GENERAL_DOC_READ_BUT_DOC_NOT_FOUND,
        message: `未能找到文档信息(文档id: ${docId})`,
      })
    }

    if (result.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException({
        code: DocExceptionCode.GENERAL_DOC_READ_BUT_DOC_DELETED,
        message: `该文档已被删除(文档id: ${docId})`,
        isFiltered: false,
      })
    }

    return {
      id: result.id,
      lastModify: result.lastModify,
      lastDeleted: result.lastDeleted,
      authorId: result.authorId,
      parentFolderId: result.parentFolderId,
    }
  }

  /**
   * 接受用户 id, 返回该用户个人空间的顶部文档
   */
  async findTopDocs(userId: User["id"]): Promise<Pick<Doc, "id" | "lastModify" | "authorId" | "parentFolderId">[]> {
    const result = await this.prismaService.doc.findMany({
      where: {
        authorId: userId,
        parentFolder: null,
        docType: DocType.GENERAL,
      },
      select: {
        id: true,
        lastModify: true,
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
  ): Promise<Pick<Doc, "id" | "lastModify" | "authorId" | "parentFolderId">> {
    // 校验权限
    const flag = data.parentFolderId
      ? await this.folderAuthService.verifyUserWriteFolder(userId, data.parentFolderId)
      : true
    if (!flag) {
      throw new CommonException({
        code: DocExceptionCode.CURRENT_USER_CAN_NOT_WRITE_THIS_FOLDER,
        message: `当前用户无权写文件夹(文件夹id: ${data.parentFolderId})`,
        isFiltered: false,
      })
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
    ]

    const author = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    })

    if (!author) {
      throw new CommonException({
        code: DocExceptionCode.GENERAL_DOC_CREATE_BUT_NOT_FOUND_USER,
        message: `未找到用户信息(id: ${userId})`,
      })
    }

    const createPayload: Prisma.DocCreateInput = {
      lastModify: new Date(),
      value: initialValue,
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
        throw new CommonException({
          code: DocExceptionCode.GENERAL_DOC_CREATE_BUT_NOT_FOUND_PARENT_FOLDER,
          message: `未找到父文件夹信息(id: ${data.parentFolderId})`,
        })
      }

      const folderAdministratorRole = await this.prismaService.role.findFirst({
        where: {
          folder,
          roleType: RoleType.ADMINISTRATOR,
        },
      })

      if (!folderAdministratorRole) {
        throw new CommonException({
          code: DocExceptionCode.FOLDER_ADMINISTRATOR_ROLE_NOT_FOUND,
          message: `未找到父文件夹对应的管理员权限(父文件夹id: ${data.parentFolderId})`,
        })
      }

      const folderCollaboratorRole = await this.prismaService.role.findFirst({
        where: {
          folder,
          roleType: RoleType.COLLABORATOR,
        },
      })

      if (!folderCollaboratorRole) {
        throw new CommonException({
          code: DocExceptionCode.FOLDER_COLLABORATOR_ROLE_NOT_FOUND,
          message: `未找到父文件夹对应的协作者权限(父文件夹id: ${data.parentFolderId})`,
        })
      }

      const folderReaderRole = await this.prismaService.role.findFirst({
        where: {
          folder,
          roleType: RoleType.READER,
        },
      })

      if (!folderReaderRole) {
        throw new CommonException({
          code: DocExceptionCode.FOLDER_READER_ROLE_NOT_FOUND,
          message: `未找到父文件夹对应的阅读者权限(父文件夹id: ${data.parentFolderId})`,
        })
      }

      // 将新文档与父文件夹关联
      createPayload.parentFolder = {
        connect: {
          id: folder.id,
        },
      }

      // 新建文档
      const createDocResult = await this.prismaService.doc.create({
        data: createPayload,
        select: {
          id: true,
          lastModify: true,
          authorId: true,
          parentFolderId: true,
        },
      })

      // 添加新文档的三个角色
      // 管理者角色
      const createAdministratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.ADMINISTRATOR,
          doc: {
            connect: {
              id: createDocResult.id,
            },
          },
          parentRoles: {
            connect: {
              id: folderAdministratorRole.id,
            },
          },
          // 将新文档的管理者角色和新文档作者相关联
          user: {
            connect: {
              id: author.id,
            },
          },
        },
      })
      // 协作者角色
      const createCollaboratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.COLLABORATOR,
          doc: {
            connect: {
              id: createDocResult.id,
            },
          },
          parentRoles: {
            connect: [{ id: folderCollaboratorRole.id }, { id: createAdministratorRoleResult.id }],
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
            connect: [{ id: folderReaderRole.id }, { id: createCollaboratorRoleResult.id }],
          },
        },
      })

      return createDocResult
    } else {
      // 新建文档
      const createDocResult = await this.prismaService.doc.create({
        data: createPayload,
        select: {
          id: true,
          lastModify: true,
          authorId: true,
          parentFolderId: true,
        },
      })

      // 添加新文档的三个角色
      // 管理者角色
      const createAdministratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.ADMINISTRATOR,
          doc: {
            connect: { id: createDocResult.id },
          },
          // 将新文档的管理者角色和新文档作者相关联
          user: {
            connect: {
              id: author.id,
            },
          },
        },
      })
      // 协作者角色
      const createCollaboratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.COLLABORATOR,
          doc: {
            connect: {
              id: createDocResult.id,
            },
          },
          parentRoles: {
            connect: {
              id: createAdministratorRoleResult.id,
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
              id: createCollaboratorRoleResult.id,
            },
          },
        },
      })

      return createDocResult
    }
  }

  /**
   * 根据 id 将文档删除, 传入的 type 决定是可回收的删除还是彻底删除, soft 是可回收的删除, hard 是彻底删除
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限删除文档
   *
   */
  async deleteDoc(userId: User["id"], docId: Doc["id"], type: "soft" | "hard"): Promise<void> {
    const docData = await this.prismaService.doc.findUnique({
      where: {
        id: docId,
      },
    })

    if (!docData) {
      throw new CommonException({
        code: DocExceptionCode.GENERAL_DOC_DELETE_BUT_NOT_FOUND_DOC,
        message: `未能找到文档信息(文档id: ${docId})`,
        isFiltered: false,
      })
    }

    // 校验权限
    const flag = await this.generalDocAuthService.verifyUserAdministerGeneralDoc(userId, docId)
    if (!flag) {
      throw new CommonException({
        code: DocExceptionCode.CURRENT_USER_CAN_NOT_MANAGE_THIS_GENERAL_DOC,
        message: `当前用户没有该文档的管理权限(文档id: ${docId})`,
        isFiltered: false,
      })
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
}
