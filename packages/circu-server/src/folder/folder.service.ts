import { HttpStatus, Injectable } from "@nestjs/common"
import { Folder, Prisma, RoleType, SurvivalStatus, User } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { ControllerOrModulePrefix } from "src/exception/types"
import { FolderAuthService } from "./folder-auth.service"
import { FolderExceptionCode, FOLDER_DELETE_EXPIRE_DAY_TIME } from "./folder.constant"

@Injectable()
export class FolderService {
  constructor(private readonly prismaService: PrismaService, private readonly folderAuthService: FolderAuthService) {}

  /**
   * 根据 id 查询文件夹信息
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文件夹信息
   */
  async getFolderInfo(
    userId: User["id"],
    folderId: Folder["id"]
  ): Promise<
    Pick<Folder, "id" | "lastModified" | "title" | "description" | "lastDeleted" | "authorId" | "parentFolderId">
  > {
    // 校验权限
    const flag = await this.folderAuthService.verifyUserReadFolder(userId, folderId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `当前用户无权访问该文件夹(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    const result = await this.prismaService.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        id: true,
        lastModified: true,
        title: true,
        description: true,
        lastDeleted: true,
        survivalStatus: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    if (!result) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到文件夹信息(文件夹id: ${folderId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (result.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_DELETED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `该文件夹已被删除(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.NOT_FOUND
      )
    }

    return {
      id: result.id,
      lastModified: result.lastModified,
      title: result.title,
      description: result.authorId,
      lastDeleted: result.lastDeleted,
      authorId: result.authorId,
      parentFolderId: result.parentFolderId,
    }
  }

  /**
   * 接受用户 id, 返回该用户个人空间的顶部文件夹
   */
  async getTopFolders(
    userId: User["id"]
  ): Promise<Pick<Folder, "id" | "lastModified" | "title" | "description" | "authorId" | "parentFolderId">[]> {
    const result = await this.prismaService.folder.findMany({
      where: {
        authorId: userId,
        parentFolder: null,
        survivalStatus: SurvivalStatus.ALIVE,
      },
      select: {
        id: true,
        lastModified: true,
        title: true,
        description: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    return result
  }

  /**
   * 接受用户 id, 返回该用户主页快速访问的文件夹
   */
  async getFastAccessFolders(
    userId: User["id"]
  ): Promise<Pick<Folder, "id" | "lastModified" | "title" | "description" | "authorId" | "parentFolderId">[]> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        fastAccessFolders: {
          select: {
            id: true,
            lastModified: true,
            title: true,
            description: true,
            authorId: true,
            parentFolderId: true,
          },
        },
      },
    })

    if (!user) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到用户信息(用户id: ${userId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    return user.fastAccessFolders
  }

  /**
   * 接受用户 id, 返回该用户收藏的文件夹
   */
  async getFavoriteFolders(
    userId: User["id"]
  ): Promise<Pick<Folder, "id" | "lastModified" | "title" | "description" | "authorId" | "parentFolderId">[]> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favoriteFolders: {
          select: {
            id: true,
            lastModified: true,
            title: true,
            description: true,
            authorId: true,
            parentFolderId: true,
          },
        },
      },
    })

    if (!user) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到用户信息(用户id: ${userId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    return user.favoriteFolders
  }

  /**
   * 接受用户 id, 返回该用户可回收的文件夹
   */
  async getDeletedFolders(
    userId: User["id"]
  ): Promise<
    Pick<Folder, "id" | "lastModified" | "title" | "description" | "authorId" | "lastDeleted" | "parentFolderId">[]
  > {
    const result = await this.prismaService.folder.findMany({
      where: {
        authorId: userId,
        survivalStatus: SurvivalStatus.DELETED,
      },
      select: {
        id: true,
        lastModified: true,
        title: true,
        description: true,
        authorId: true,
        lastDeleted: true,
        parentFolderId: true,
      },
    })

    return result
  }

  /**
   * 创建新的文件夹
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限在该文件夹上新建文件夹
   */
  async createFolder(
    userId: User["id"],
    data: Pick<Folder, "title" | "description" | "parentFolderId">
  ): Promise<Pick<Folder, "id" | "lastModified" | "title" | "description" | "authorId" | "parentFolderId">> {
    // 校验权限
    const flag = data.parentFolderId
      ? await this.folderAuthService.verifyUserWriteFolder(userId, data.parentFolderId)
      : true
    if (!flag) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.AUTH_MODIFY_DENIED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `当前用户无权修改该文件夹(文件夹id: ${data.parentFolderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

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
          code: `${FolderExceptionCode.USER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到用户信息(用户id: ${userId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    const createPayload: Prisma.FolderCreateInput = {
      lastModified: new Date(),
      title: data.title,
      description: data.description,
      author: {
        connect: author,
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
            code: `${FolderExceptionCode.FOLDER_PARENT_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
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
            code: `${FolderExceptionCode.PARENT_ADMINISTRATOR_ROLE_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
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
            code: `${FolderExceptionCode.PARENT_COLLABORATOR_ROLE_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
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
            code: `${FolderExceptionCode.PARENT_READER_ROLE_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
            message: `未找到父文件夹对应的阅读者权限(父文件夹id: ${data.parentFolderId})`,
          },
          HttpStatus.NOT_FOUND
        )
      }

      // 将新文件夹与父文件夹关联
      createPayload.parentFolder = {
        connect: {
          id: folder.id,
        },
      }

      // 新建文件夹
      const createdFolderResult = await this.prismaService.folder.create({
        data: createPayload,
        select: {
          id: true,
          lastModified: true,
          title: true,
          description: true,
          authorId: true,
          parentFolderId: true,
        },
      })

      // 添加新文件夹的三个角色
      // 管理者角色
      const createdAdministratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.ADMINISTRATOR,
          folder: {
            connect: {
              id: createdFolderResult.id,
            },
          },
          parentRoles: {
            connect: {
              id: folderAdministratorRole.id,
            },
          },
          // 将新文件夹的管理者角色和新文件夹作者相关联
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
          folder: {
            connect: {
              id: createdFolderResult.id,
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
          folder: {
            connect: {
              id: createdFolderResult.id,
            },
          },
          parentRoles: {
            connect: [{ id: folderReaderRole.id }, { id: createdCollaboratorRoleResult.id }],
          },
        },
      })

      return createdFolderResult
    } else {
      const createdFolderResult = await this.prismaService.folder.create({
        data: createPayload,
        select: {
          id: true,
          lastModified: true,
          title: true,
          description: true,
          authorId: true,
          parentFolderId: true,
        },
      })

      // 添加新文件夹的三个角色
      // 管理者角色
      const createdAdministratorRoleResult = await this.prismaService.role.create({
        data: {
          roleType: RoleType.ADMINISTRATOR,
          folder: {
            connect: {
              id: createdFolderResult.id,
            },
          },
          // 将新文件夹的管理者角色和新文件夹作者相关联
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
          folder: {
            connect: {
              id: createdFolderResult.id,
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
          folder: {
            connect: {
              id: createdFolderResult.id,
            },
          },
          parentRoles: {
            connect: {
              id: createdCollaboratorRoleResult.id,
            },
          },
        },
      })

      return createdFolderResult
    }
  }

  /**
   * 为用户添加新的快速访问文件夹
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文件夹信息
   */
  async addFastAccessFolder(userId: User["id"], folderId: Folder["id"]): Promise<void> {
    // 校验是否有读权限
    const flag = await this.folderAuthService.verifyUserReadFolder(userId, folderId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `当前用户无权访问该文件夹(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    const folder = await this.prismaService.folder.findUnique({
      where: {
        id: folderId,
      },
    })

    if (!folder) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到文件夹信息(文件夹id: ${folderId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (folder.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_DELETED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `文件夹已被删除(文件夹id: ${folderId})`,
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
        fastAccessFolders: {
          connect: {
            id: folderId,
          },
        },
      },
    })
  }

  /**
   * 为用户添加新的收藏文件夹
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文件夹信息
   */
  async addFavoriteFolder(userId: User["id"], folderId: Folder["id"]): Promise<void> {
    // 校验是否有读权限
    const flag = await this.folderAuthService.verifyUserReadFolder(userId, folderId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.AUTH_ACCESS_DENIED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `当前用户无权访问该文件夹(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    const folder = await this.prismaService.folder.findUnique({
      where: {
        id: folderId,
      },
    })

    if (!folder) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到文件夹信息(文件夹id: ${folderId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (folder.survivalStatus !== SurvivalStatus.ALIVE) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_DELETED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `文件夹已被删除(文件夹id: ${folderId})`,
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
        favoriteFolders: {
          connect: {
            id: folderId,
          },
        },
      },
    })
  }

  /**
   * 移除快速访问文件夹
   */
  async removeFastAccessFolder(userId: User["id"], folderId: Folder["id"]): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        fastAccessFolders: {
          disconnect: {
            id: folderId,
          },
        },
      },
    })
  }

  /**
   * 移除收藏文件夹
   */
  async removeFavoriteFolder(userId: User["id"], folderId: Folder["id"]): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteFolders: {
          disconnect: {
            id: folderId,
          },
        },
      },
    })
  }

  /**
   * 根据 id 将文件夹删除, 传入的 type 决定是可回收的删除还是彻底删除, soft 是可回收的删除, hard 是彻底删除
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限删除文件夹
   */
  async deleteFolder(userId: User["id"], folderId: Folder["id"], type: "soft" | "hard"): Promise<void> {
    const folderData = await this.prismaService.folder.findUnique({
      where: {
        id: folderId,
      },
    })

    if (!folderData) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到文件夹信息(id: ${folderId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    // 校验权限
    const flag = await this.folderAuthService.verifyUserAdministerFolder(userId, folderId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.AUTH_ADMINISTRATOR_DENIED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `当前用户没有该文件夹的管理员权限(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    // 删除文件夹时要连同文件夹下的所有子项删除
    await this.prismaService.$transaction([
      this.prismaService.$executeRaw`create temporary table tmp_table_for_delete_folder on
      commit drop as
      with recursive folder_traverse(
      id,
      parent_folder_id,
      survival_status
      ) as (
      with recursive doc_traverse(
      id,
      parent_folder_id,
      survival_status
      ) as
            (
      select
        id,
        parent_folder_id,
        survival_status
      from
        folder
      where
        folder.id = ${folderId}
      union
      select
        doc.id,
        doc.parent_folder_id,
        doc.survival_status
      from
        doc
      join doc_traverse on
        doc_traverse.id = doc.parent_folder_id
      where
        doc.survival_status <> 'COMPLETELY_DELETED'::"SurvivalStatus"
        )
      select
        id,
        parent_folder_id,
        survival_status
      from
        doc_traverse
      union
      select
        folder.id,
        folder.parent_folder_id,
        folder.survival_status
      from
        folder
      join folder_traverse on
        folder_traverse.id = folder.parent_folder_id
      where
        folder.survival_status <> 'COMPLETELY_DELETED'::"SurvivalStatus"
        )
        select
        *
      from
        folder_traverse;`,
      this.prismaService.$executeRaw`update folder
        set survival_status = ${
          type === "soft" ? SurvivalStatus.DELETED : SurvivalStatus.COMPLETELY_DELETED
        }::"SurvivalStatus",
          last_deleted = current_timestamp(3)
        from tmp_table_for_delete_folder
        where tmp_table_for_delete_folder.id = folder.id;`,
      this.prismaService.$executeRaw`update doc
        set survival_status = ${
          type === "soft" ? SurvivalStatus.DELETED : SurvivalStatus.COMPLETELY_DELETED
        }::"SurvivalStatus",
          last_deleted = current_timestamp(3)
        from tmp_table_for_delete_folder
        where tmp_table_for_delete_folder.id = doc.id;`,
    ])
  }

  /**
   * 根据 id 将已删除的文件夹恢复, 若已彻底删除, 不可恢复
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限恢复文件夹
   */
  async revertFolder(userId: User["id"], folderId: Folder["id"]): Promise<void> {
    const folderData = await this.prismaService.folder.findUnique({
      where: {
        id: folderId,
      },
    })

    if (!folderData) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_NOT_FOUND}_${ControllerOrModulePrefix.FOLDER}`,
          message: `未能找到文件夹信息(文件夹id: ${folderId})`,
        },
        HttpStatus.NOT_FOUND
      )
    }

    // 校验权限
    const flag = await this.folderAuthService.verifyUserAdministerFolder(userId, folderId)
    if (!flag) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.AUTH_ADMINISTRATOR_DENIED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `当前用户没有该文件夹的管理员权限(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    // 判断是否彻底删除
    if (folderData.survivalStatus === SurvivalStatus.COMPLETELY_DELETED) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_PERMANENTLY_DELETED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `文件夹已被彻底删除(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    // 判断是否已过期
    const currentTime = new Date()
    if (
      folderData.lastDeleted &&
      (currentTime.getTime() - folderData.lastDeleted.getTime()) / (1000 * 3600 * 24) > FOLDER_DELETE_EXPIRE_DAY_TIME
    ) {
      throw new CommonException(
        {
          code: `${FolderExceptionCode.FOLDER_DELETED_EXPIRED}_${ControllerOrModulePrefix.FOLDER}`,
          message: `被删除的文件夹已过期(文件夹id: ${folderId})`,
          isFiltered: false,
        },
        HttpStatus.FORBIDDEN
      )
    }

    // 恢复文件夹时要连同文件夹下的所有子项恢复
    await this.prismaService.$transaction([
      this.prismaService.$executeRaw`create temporary table tmp_table_for_delete_folder on
      commit drop as
      with recursive folder_traverse(
      id,
      parent_folder_id,
      survival_status
      ) as (
      with recursive doc_traverse(
      id,
      parent_folder_id,
      survival_status
      ) as
            (
      select
        id,
        parent_folder_id,
        survival_status
      from
        folder
      where
        folder.id = ${folderId}
      union
      select
        doc.id,
        doc.parent_folder_id,
        doc.survival_status
      from
        doc
      join doc_traverse on
        doc_traverse.id = doc.parent_folder_id
      where
        doc.survival_status = 'DELETED'::"SurvivalStatus"
        )
      select
        id,
        parent_folder_id,
        survival_status
      from
        doc_traverse
      union
      select
        folder.id,
        folder.parent_folder_id,
        folder.survival_status
      from
        folder
      join folder_traverse on
        folder_traverse.id = folder.parent_folder_id
      where
        folder.survival_status = 'DELETED'::"SurvivalStatus"
        )
        select
        *
      from
        folder_traverse;`,
      this.prismaService.$executeRaw`update folder
        set survival_status = 'ALIVE'::"SurvivalStatus",
          last_deleted = null
        from tmp_table_for_delete_folder
        where tmp_table_for_delete_folder.id = folder.id;`,
      this.prismaService.$executeRaw`update doc
        set survival_status = 'ALIVE'::"SurvivalStatus",
          last_deleted = null
        from tmp_table_for_delete_folder
        where tmp_table_for_delete_folder.id = doc.id;`,
    ])
  }
}
