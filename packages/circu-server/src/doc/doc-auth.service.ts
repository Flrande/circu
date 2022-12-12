import { Injectable } from "@nestjs/common"
import { Doc, RoleType, User } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"

@Injectable()
export class DocAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 校验用户对某个文档(general doc)是否有读权限
   */
  async verifyUserReadGeneralDoc(userId: User["id"], docId: Doc["id"]): Promise<boolean> {
    // 递归查询该文档阅读者角色从属的所有角色, 并查找其中是否有用户拥有的角色
    const queryResult = await this.prismaService.$queryRaw<
      Array<{
        id: string
        doc_id: string
        folder_id: string
        role_type: string
        user_id: string
      }>
    >`
    with recursive traverse(id,
      doc_id,
      folder_id,
      role_type
      ) as
            (
      select
        id,
        doc_id,
        folder_id,
        role_type
      from
        role
      where
        role.doc_id = ${docId}
        and role.role_type = ${RoleType.READER}::"RoleType"
      union
      select
        role.id,
        role.doc_id,
        role.folder_id,
        role.role_type
      from
        traverse
      join _parent_roles_to_child_roles on
        traverse.id = _parent_roles_to_child_roles."B"
      join role on
        _parent_roles_to_child_roles."A" = role.id 
        )
            select
        id,
        doc_id,
        folder_id,
        role_type,
        _roles_to_users."B" as user_id
      from
        traverse,
        _roles_to_users
      where
        _roles_to_users."A" = traverse.id
        and _roles_to_users."B" = ${userId}
      ;
    `

    return queryResult.length !== 0
  }

  /**
   * 校验用户对某个文档(general doc)是否有写权限
   */
  async verifyUserWriteGeneralDoc(userId: User["id"], docId: Doc["id"]): Promise<boolean> {
    // 递归查询该文档协作者角色从属的所有角色, 并查找其中是否有用户拥有的角色
    const queryResult = await this.prismaService.$queryRaw<
      Array<{
        id: string
        doc_id: string
        folder_id: string
        role_type: string
        user_id: string
      }>
    >`
    with recursive traverse(id,
      doc_id,
      folder_id,
      role_type
      ) as
            (
      select
        id,
        doc_id,
        folder_id,
        role_type
      from
        role
      where
        role.doc_id = ${docId}
        and role.role_type = ${RoleType.COLLABORATOR}::"RoleType"
      union
      select
        role.id,
        role.doc_id,
        role.folder_id,
        role.role_type
      from
        traverse
      join _parent_roles_to_child_roles on
        traverse.id = _parent_roles_to_child_roles."B"
      join role on
        _parent_roles_to_child_roles."A" = role.id 
        )
            select
        id,
        doc_id,
        folder_id,
        role_type,
        _roles_to_users."B" as user_id
      from
        traverse,
        _roles_to_users
      where
        _roles_to_users."A" = traverse.id
        and _roles_to_users."B" = ${userId}
      ;
    `

    return queryResult.length !== 0
  }

  /**
   * 校验用户对某个文档(general doc)是否有管理权限
   */
  async verifyUserAdministerGeneralDoc(userId: User["id"], docId: Doc["id"]): Promise<boolean> {
    // 递归查询该文档管理者角色从属的所有角色, 并查找其中是否有用户拥有的角色
    const queryResult = await this.prismaService.$queryRaw<
      Array<{
        id: string
        doc_id: string
        folder_id: string
        role_type: string
        user_id: string
      }>
    >`
    with recursive traverse(id,
      doc_id,
      folder_id,
      role_type
      ) as
            (
      select
        id,
        doc_id,
        folder_id,
        role_type
      from
        role
      where
        role.doc_id = ${docId}
        and role.role_type = ${RoleType.ADMINISTRATOR}::"RoleType"
      union
      select
        role.id,
        role.doc_id,
        role.folder_id,
        role.role_type
      from
        traverse
      join _parent_roles_to_child_roles on
        traverse.id = _parent_roles_to_child_roles."B"
      join role on
        _parent_roles_to_child_roles."A" = role.id 
        )
            select
        id,
        doc_id,
        folder_id,
        role_type,
        _roles_to_users."B" as user_id
      from
        traverse,
        _roles_to_users
      where
        _roles_to_users."A" = traverse.id
        and _roles_to_users."B" = ${userId}
      ;
    `

    return queryResult.length !== 0
  }
}
