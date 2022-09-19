import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common"
import { Doc } from "@prisma/client"
import { Request } from "express"
import { UserAuthGuard } from "src/guards/user-auth.guard"
import { ISuccessResponse } from "src/interfaces/response"
import { CreateGeneralDocDto } from "../dto/create-doc.dto"
import { IdQueryDto } from "../dto/id.dto"
import { GeneralDocService } from "../service/general-doc.service"

@Controller("api/doc/general")
export class GeneralDocController {
  constructor(private readonly generalDocService: GeneralDocService) {}

  /**
   * 根据 id 获取文档信息, 需要登录
   */
  @Get()
  @UseGuards(UserAuthGuard)
  async getGeneralDocById(
    @Query() query: IdQueryDto,
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "authorId" | "parentFolderId">>> {
    const result = await this.generalDocService.findDocMetaById(req.session.userid!, query.id)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 创建新文档, 需要登录
   */
  @Post("create")
  @UseGuards(UserAuthGuard)
  async createGeneralDoc(
    @Body() createGeneralDocDto: CreateGeneralDocDto,
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "authorId" | "parentFolderId">>> {
    const createPayload = {
      title: createGeneralDocDto.title ? createGeneralDocDto.title : "未命名文档",
      parentFolderId: createGeneralDocDto.parentFolderId ? createGeneralDocDto.parentFolderId : null,
      authorId: req.session.userid!,
    }
    const result = await this.generalDocService.createDoc(req.session.userid!, createPayload)

    return {
      code: 0,
      message: "创建成功",
      data: result,
    }
  }

  /**
   * 删除文档, 需要登录
   */
  // @Get("delete")
  // @UseGuards(UserAuthGuard)
  // async deleteGeneralDoc(@Query() query: DocIdQueryDto, @Req() req: Request) {

  // }
}
