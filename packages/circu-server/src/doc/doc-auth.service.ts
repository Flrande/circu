import { Injectable } from "@nestjs/common"
import { User, Folder, Doc, Prisma, Role } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"

@Injectable()
export class DocAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 校验用户对某个文档(general doc)是否有读权限
   */
  async verifyUserReadGeneralDoc(userId: User["id"], docId: Doc["id"]): Promise<boolean> {
    // 查询该文档阅读者角色从属的所有角色
    const tmpRoles = await this.prismaService.$queryRaw<Role[]>(Prisma.sql`
      WITH RECURSIVE traverse(id, doc_id, role_type) AS
      (SELECT id,
            doc_id,
            role_type
      FROM ROLE
      WHERE role.doc_id = ${docId}
      AND role.role_type = RoleType.READER
      UNION ALL SELECT A, B
      FROM traverse
      JOIN _role_parent ON traverse.id = _role_parent.B
      JOIN ROLE ON _role_parent.A = role.id)
      SELECT *
      FROM traverse;
    `)

    console.log(tmpRoles, userId)

    return true
  }

  /**
   * 校验用户对某个文件夹是否有写权限
   */
  async verifyUserWriteFolder(userId: User["id"], folderId: Folder["id"]): Promise<boolean> {
    console.log(userId, folderId)

    return true
  }
}
