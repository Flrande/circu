import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common"
import { Doc } from "@prisma/client"
import { Request } from "express"
import { UserAuthGuard } from "src/guards/user-auth.guard"
import { BodyZodSchema, ParamsZodSchema } from "src/interceptor/zod/set-zod-schema.decorator"
import { DOC_ROUTE } from "./doc.constant"
import { DocService } from "./doc.service"
import { AddFastAccessDocOutput, AddFastAccessDocParams } from "./schemas/add-fast-access-doc.schema"
import { AddFavoriteDocOutput, AddFavoriteDocParams } from "./schemas/add-favorite-doc.schema"
import { CreateDocBody, CreateDocOutput } from "./schemas/create-doc.schema"
import { DeleteDocCompletelyOutput, DeleteDocCompletelyParams } from "./schemas/delete-doc-completely.schema"
import { DeleteDocOutput, DeleteDocParams } from "./schemas/delete-doc.schema"
import { GetDeletedDocsOutput } from "./schemas/get-deleted-docs.schema"
import { GetDocMetaInfoOutput, GetDocMetaInfoParams } from "./schemas/get-doc-meta-info.schema"
import { GetFastAccessDocsOutput } from "./schemas/get-fast-access-docs.schema"
import { GetFavoriteDocsOutput } from "./schemas/get-favorite-docs.schema"
import { GetTopDocsOutput } from "./schemas/get-top-docs"
import { RemoveFastAccessDocOutput, RemoveFastAccessDocParams } from "./schemas/remove-fast-access-doc.schema"
import { RemoveFavoriteDocOutput, RemoveFavoriteDocParams } from "./schemas/remove-favorite-doc.schema"
import { RevertDocOutput, RevertDocParams } from "./schemas/revert-doc.schema"

@Controller(DOC_ROUTE)
export class DocController {
  constructor(private readonly docService: DocService) {}

  /**
   * 根据 id 获取文档元信息
   */
  @Get("data/:id")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(GetDocMetaInfoParams)
  async getDocMetaInfo(@Param() params: GetDocMetaInfoParams, @Req() req: Request): Promise<GetDocMetaInfoOutput> {
    const result = await this.docService.getDocMetaInfo(req.session.userid!, params.docId)

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
  async getDeletedDocs(@Req() req: Request): Promise<GetDeletedDocsOutput> {
    const result = await this.docService.getDeletedDocs(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取当前登录用户个人空间的顶部文档
   */
  @Get("top")
  @UseGuards(UserAuthGuard)
  async getTopDocs(@Req() req: Request): Promise<GetTopDocsOutput> {
    const result = await this.docService.getTopDocs(req.session.userid!)

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
  async getFastAccessDocs(@Req() req: Request): Promise<GetFastAccessDocsOutput> {
    const result = await this.docService.getFastAccessDocs(req.session.userid!)

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
  async getFavoriteDocs(@Req() req: Request): Promise<GetFavoriteDocsOutput> {
    const result = await this.docService.getFavoriteDocs(req.session.userid!)

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
  @BodyZodSchema(CreateDocBody)
  async createDoc(@Body() body: CreateDocBody, @Req() req: Request): Promise<CreateDocOutput> {
    const createPayload = {
      title: body.createPayload.title ? body.createPayload.title : "未命名文档",
      parentFolderId: body.createPayload.parentFolderId ? body.createPayload.parentFolderId : null,
      authorId: req.session.userid!,
    }
    const result = await this.docService.createDoc(req.session.userid!, createPayload)

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
  @ParamsZodSchema(AddFastAccessDocParams)
  async addFastAccessDoc(
    @Param() params: AddFastAccessDocParams,
    @Req() req: Request
  ): Promise<AddFastAccessDocOutput> {
    await this.docService.addFastAccessDoc(req.session.userid!, params.newFastAccessDocId)

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
  @ParamsZodSchema(RemoveFastAccessDocParams)
  async removeFastAccessDoc(
    @Param() params: RemoveFastAccessDocParams,
    @Req() req: Request
  ): Promise<RemoveFastAccessDocOutput> {
    await this.docService.removeFastAccessDoc(req.session.userid!, params.tobeRemovedDocId)

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
  @ParamsZodSchema(AddFavoriteDocParams)
  async addFavoriteDoc(@Param() params: AddFavoriteDocParams, @Req() req: Request): Promise<AddFavoriteDocOutput> {
    await this.docService.addFavoriteDoc(req.session.userid!, params.newFavoriteDocId)

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
  @ParamsZodSchema(RemoveFavoriteDocParams)
  async removeFavoriteDoc(
    @Param() params: RemoveFavoriteDocParams,
    @Req() req: Request
  ): Promise<RemoveFavoriteDocOutput> {
    await this.docService.removeFavoriteDoc(req.session.userid!, params.tobeRemovedDocId)

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
  @ParamsZodSchema(DeleteDocParams)
  async deleteDoc(@Param() params: DeleteDocParams, @Req() req: Request): Promise<DeleteDocOutput> {
    await this.docService.deleteDoc(req.session.userid!, params.tobeDeletedDocId, "soft")

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
  @ParamsZodSchema(DeleteDocCompletelyParams)
  async deleteDocCompletely(
    @Param() params: DeleteDocCompletelyParams,
    @Req() req: Request
  ): Promise<DeleteDocCompletelyOutput> {
    await this.docService.deleteDoc(req.session.userid!, params.tobeDeletedDocId, "hard")

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
  @ParamsZodSchema(RevertDocParams)
  async revertDoc(@Param() params: RevertDocParams, @Req() req: Request): Promise<RevertDocOutput> {
    await this.docService.revertDoc(req.session.userid!, params.tobeRevertedDocId)

    return {
      code: 0,
      message: "恢复成功",
      data: {},
    }
  }
}
