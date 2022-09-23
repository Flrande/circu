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
  async getDocById(
    @Query() query: IdQueryDto,
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "lastDeleted" | "authorId" | "parentFolderId">>> {
    const result = await this.generalDocService.getDocMetaDataById(req.session.userid!, query.id)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取当前登录用户个人空间的顶部文档
   */
  @Get("top/personal")
  @UseGuards(UserAuthGuard)
  async getPersonalTopDocs(
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "authorId" | "parentFolderId">[]>> {
    const result = await this.generalDocService.getTopDocs(req.session.userid!)

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
  async createDoc(
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
  @Get("delete")
  @UseGuards(UserAuthGuard)
  async deleteDoc(@Query() query: IdQueryDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.deleteDoc(req.session.userid!, query.id, "soft")

    return {
      code: 0,
      message: "删除成功",
      data: {},
    }
  }

  /**
   * 彻底删除文档, 需要登录
   */
  @Get("delete_completely")
  @UseGuards(UserAuthGuard)
  async deleteDocCompletely(@Query() query: IdQueryDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.deleteDoc(req.session.userid!, query.id, "hard")

    return {
      code: 0,
      message: "删除成功",
      data: {},
    }
  }

  /**
   * 恢复未彻底删除的文档, 需要登录
   */
  @Get("revert_delete")
  @UseGuards(UserAuthGuard)
  async revertDoc(@Query() query: IdQueryDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.revertDoc(req.session.userid!, query.id)

    return {
      code: 0,
      message: "恢复成功",
      data: {},
    }
  }
}
