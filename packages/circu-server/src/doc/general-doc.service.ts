import { Injectable } from "@nestjs/common"
import { GeneralDoc, Prisma, SurvivalStatus, User } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { DocExceptionCode } from "./doc.constants"
import { GeneralDocAuthService } from "./general-doc-auth.service"

@Injectable()
export class GeneralDocService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly generalDocAuthService: GeneralDocAuthService
  ) {}

  /**
   * 根据 id 查询文档元信息, 不包含文档内容
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限获得文档信息
   */
  async findDocMetaById(
    userId: User["id"],
    docId: GeneralDoc["id"]
  ): Promise<Pick<GeneralDoc, "id" | "lastModify" | "title" | "authorId" | "parentFolderId">> {
    // 校验权限
    const flag = await this.generalDocAuthService.verifyUserReadDoc(userId, docId)
    if (!flag) {
      throw new CommonException({
        code: DocExceptionCode.CURRENT_USER_CAN_NOT_READ_THIS_GENERAL_DOC,
        message: `当前用户无权阅读文档(id: ${docId})`,
      })
    }

    const result = await this.prismaService.generalDoc.findUnique({
      where: {
        id: docId,
      },
      select: {
        id: true,
        lastModify: true,
        title: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    if (!result) {
      throw new CommonException({
        code: DocExceptionCode.GENERAL_DOC_NOT_FOUND,
        message: `未能找到文档信息(id: ${docId})`,
      })
    }

    return result
  }

  /**
   * 创建新的文档, 不需要提供新文档的值
   *
   * 需要操作者的用户 id, 用于判断操作者是否有权限在该文件夹上新建文档
   */
  async createDoc(
    userId: User["id"],
    data: Pick<GeneralDoc, "title" | "authorId" | "parentFolderId">
  ): Promise<Pick<GeneralDoc, "id" | "lastModify" | "title" | "authorId" | "parentFolderId">> {
    // 校验权限
    const flag = data.parentFolderId
      ? await this.generalDocAuthService.verifyUserWriteFolder(userId, data.parentFolderId)
      : true
    if (!flag) {
      throw new CommonException({
        code: DocExceptionCode.CURRENT_USER_CAN_NOT_WRITE_THIS_FOLDER,
        message: `当前用户无权写文件夹(id: ${data.parentFolderId})`,
      })
    }

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
        id: data.authorId,
      },
      select: {
        id: true,
      },
    })

    if (!author) {
      throw new CommonException({
        code: DocExceptionCode.GENERAL_DOC_CREATE_BUT_NOT_FOUND_USER,
        message: `未找到用户信息(id: ${data.authorId})`,
      })
    }

    const createPayload: Prisma.GeneralDocCreateInput = {
      lastModify: new Date(),
      title: data.title,
      value: initialValue,
      survivalStatus: SurvivalStatus.ALIVE,
      author: {
        connect: author,
      },
      administrators: {
        connect: author,
      },
      readers: {
        connect: author,
      },
      collaborators: {
        connect: author,
      },
    }

    if (data.parentFolderId) {
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

      createPayload.parentFolder = {
        connect: folder,
      }
    }

    const result = await this.prismaService.generalDoc.create({
      data: createPayload,
      select: {
        id: true,
        lastModify: true,
        title: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    return result
  }
}
