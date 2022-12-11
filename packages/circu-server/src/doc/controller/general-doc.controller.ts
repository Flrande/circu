import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common"
import { Doc } from "@prisma/client"
import { Request } from "express"
import { UserAuthGuard } from "src/guards/user-auth.guard"
import { ISuccessResponse } from "src/interfaces/response/response"
import { CreateGeneralDocDto } from "../dto/create-doc.dto"
import { IdDto } from "../dto/id.dto"
import { GeneralDocService } from "../service/general-doc.service"

@Controller("api/doc/general")
export class GeneralDocController {
  constructor(private readonly generalDocService: GeneralDocService) {}

  /**
   * 根据 id 获取文档信息
   */
  @Get("data/:id")
  @UseGuards(UserAuthGuard)
  async getDocById(
    @Param() params: IdDto,
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "lastDeleted" | "authorId" | "parentFolderId">>> {
    const result = await this.generalDocService.getDocMetaDataById(req.session.userid!, params.id)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取被删除的但仍可回收的文档
   */
  @Get("deleted")
  @UseGuards(UserAuthGuard)
  async getDeletedDocs(
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "lastDeleted" | "authorId" | "parentFolderId">[]>> {
    const result = await this.generalDocService.getDeletedDocs(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取当前登录用户个人空间的顶部文档
   */
  @Get("personal")
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
   * 获取当前登录用户主页中快速访问的文档
   */
  @Get("fast_access")
  @UseGuards(UserAuthGuard)
  async getFastAccessDocs(
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "authorId" | "parentFolderId">[]>> {
    const result = await this.generalDocService.getFastAccessDocs(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取当前登录用户收藏的文档
   */
  @Get("favorite")
  @UseGuards(UserAuthGuard)
  async getFavoriteDocs(
    @Req() req: Request
  ): Promise<ISuccessResponse<Pick<Doc, "id" | "lastModify" | "authorId" | "parentFolderId">[]>> {
    const result = await this.generalDocService.getFavoriteDocs(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 创建新文档
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
   * 添加新的快速访问文档
   */
  @Post("fast_access/:id/add")
  @UseGuards(UserAuthGuard)
  async addFastAccessDoc(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.addFastAccessDoc(req.session.userid!, params.id)

    return {
      code: 0,
      message: "添加成功",
      data: {},
    }
  }

  /**
   * 移除快速访问文档
   */
  @Post("fast_access/:id/remove")
  @UseGuards(UserAuthGuard)
  async removeFastAccessDoc(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.removeFastAccessDoc(req.session.userid!, params.id)

    return {
      code: 0,
      message: "移除成功",
      data: {},
    }
  }

  /**
   * 添加新的收藏文档
   */
  @Post("favorite/:id/add")
  @UseGuards(UserAuthGuard)
  async addFavoriteDoc(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.addFavoriteDoc(req.session.userid!, params.id)

    return {
      code: 0,
      message: "添加成功",
      data: {},
    }
  }

  /**
   * 移除收藏文档
   */
  @Post("favorite/:id/remove")
  @UseGuards(UserAuthGuard)
  async removeFavoriteDoc(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.removeFavoriteDoc(req.session.userid!, params.id)

    return {
      code: 0,
      message: "移除成功",
      data: {},
    }
  }

  /**
   * 删除文档
   */
  @Delete("delete/:id")
  @UseGuards(UserAuthGuard)
  async deleteDoc(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.deleteDoc(req.session.userid!, params.id, "soft")

    return {
      code: 0,
      message: "删除成功",
      data: {},
    }
  }

  /**
   * 彻底删除文档
   */
  @Delete("delete_completely/:id")
  @UseGuards(UserAuthGuard)
  async deleteDocCompletely(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.deleteDoc(req.session.userid!, params.id, "hard")

    return {
      code: 0,
      message: "删除成功",
      data: {},
    }
  }

  /**
   * 恢复未彻底删除的文档
   */
  @Post("revert_delete/:id")
  @UseGuards(UserAuthGuard)
  async revertDoc(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.generalDocService.revertDoc(req.session.userid!, params.id)

    return {
      code: 0,
      message: "恢复成功",
      data: {},
    }
  }
}
