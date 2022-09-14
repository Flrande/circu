import { Injectable } from "@nestjs/common"
import { User, GeneralDoc, Folder } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"

@Injectable()
export class GeneralDocAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 校验用户对某个文档是否有读权限
   */
  async verifyUserReadDoc(userId: User["id"], docId: GeneralDoc["id"]): Promise<boolean> {
    const result = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        canReadGeneralDocs: {
          where: {
            id: docId,
          },
        },
      },
    })

    if (!result || result.canReadGeneralDocs.length === 0) {
      return false
    }

    return true
  }

  /**
   * 校验用户对某个文件夹是否有写权限
   */
  async verifyUserWriteFolder(userId: User["id"], folderId: Folder["id"]): Promise<boolean> {
    const result = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        canWriteFolders: {
          where: {
            id: folderId,
          },
        },
      },
    })

    if (!result || result.canWriteFolders.length === 0) {
      return false
    }

    return true
  }
}
