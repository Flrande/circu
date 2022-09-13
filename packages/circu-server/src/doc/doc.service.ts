import { Injectable } from "@nestjs/common"
import { GeneralDoc, Prisma, SurvivalStatus } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"
import { CommonException } from "src/exception/common.exception"
import { DocExceptionCode } from "./doc.constants"

@Injectable()
export class DocService {
  constructor(private readonly prismaService: PrismaService) {}

  async findGeneralDocById(
    id: GeneralDoc["id"]
  ): Promise<Pick<GeneralDoc, "id" | "lastModify" | "title" | "authorId" | "parentFolderId">> {
    const result = await this.prismaService.generalDoc.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        lastModify: true,
        title: true,
        value: true,
        authorId: true,
        parentFolderId: true,
      },
    })

    if (!result) {
      throw new CommonException({
        code: DocExceptionCode.GENERAL_DOC_NOT_FOUND,
        message: "未能找到对应文档",
      })
    }

    return result
  }

  async createGeneralDoc(
    data: Pick<GeneralDoc, "title" | "authorId" | "parentFolderId">
  ): Promise<Pick<GeneralDoc, "id" | "lastModify" | "title" | "authorId" | "parentFolderId">> {
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
        message: "未找到作者信息",
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
          message: "未找到父文件夹信息",
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
