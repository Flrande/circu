import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { UserAuthGuard } from "src/guards/user-auth.guard"
import { BodyZodSchema, ParamsZodSchema } from "src/interceptor/zod/set-zod-schema.decorator"
import { FOLDER_ROUTE } from "./folder.constant"
import { FolderService } from "./folder.service"
import { AddFastAccessFolderOutput, AddFastAccessFolderParams } from "./schemas/add-fast-access-folder.schema"
import { AddFavoriteFolderOutput, AddFavoriteFolderParams } from "./schemas/add-favorite-folder.schema"
import { CreateFolderBody, CreateFolderOutput } from "./schemas/create-folder.schema"
import { DeleteFolderCompletelyOutput, DeleteFolderCompletelyParams } from "./schemas/delete-folder-completely.schema"
import { DeleteFolderOutput, DeleteFolderParams } from "./schemas/delete-folder.schema"
import { GetDeletedFoldersOutput } from "./schemas/get-deleted-folders.schema"
import { GetFastAccessFoldersOutput } from "./schemas/get-fast-access-folders.schema"
import { GetFavoriteFoldersOutput } from "./schemas/get-favorite-folders.schema"
import { GetFolderInfoOutput, GetFolderInfoParams } from "./schemas/get-folder-info.schema"
import { GetTopFoldersOutput } from "./schemas/get-top-folders"
import { RemoveFastAccessFolderOutput, RemoveFastAccessFolderParams } from "./schemas/remove-fast-access-folder.schema"
import { RemoveFavoriteFolderOutput, RemoveFavoriteFolderParams } from "./schemas/remove-favorite-folder.schema"
import { RevertFolderOutput, RevertFolderParams } from "./schemas/revert-folder.schema"

@Controller(FOLDER_ROUTE)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  /**
   * 根据 id 获取文件夹信息
   */
  @Get("data/:id")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(GetFolderInfoParams)
  async getFolderInfo(@Param() params: GetFolderInfoParams, @Req() req: Request): Promise<GetFolderInfoOutput> {
    const result = await this.folderService.getFolderInfo(req.session.userid!, params.folderId)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取被删除的但仍可回收的文件夹
   */
  @Get("deleted")
  @UseGuards(UserAuthGuard)
  async getDeletedFolders(@Req() req: Request): Promise<GetDeletedFoldersOutput> {
    const result = await this.folderService.getDeletedFolders(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取当前登录用户个人空间的顶部文件夹
   */
  @Get("top")
  @UseGuards(UserAuthGuard)
  async getTopFolders(@Req() req: Request): Promise<GetTopFoldersOutput> {
    const result = await this.folderService.getTopFolders(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取当前登录用户主页中快速访问的文件夹
   */
  @Get("fast_access")
  @UseGuards(UserAuthGuard)
  async getFastAccessFolders(@Req() req: Request): Promise<GetFastAccessFoldersOutput> {
    const result = await this.folderService.getFastAccessFolders(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 获取当前登录用户收藏的文件夹
   */
  @Get("favorite")
  @UseGuards(UserAuthGuard)
  async getFavoriteFolders(@Req() req: Request): Promise<GetFavoriteFoldersOutput> {
    const result = await this.folderService.getFavoriteFolders(req.session.userid!)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 创建新文件夹
   */
  @Post("create")
  @UseGuards(UserAuthGuard)
  @BodyZodSchema(CreateFolderBody)
  async createFolder(@Body() body: CreateFolderBody, @Req() req: Request): Promise<CreateFolderOutput> {
    const createPayload = {
      title: body.createPayload.title,
      description: body.createPayload.description ? body.createPayload.description : null,
      parentFolderId: body.createPayload.parentFolderId ? body.createPayload.parentFolderId : null,
    }
    const result = await this.folderService.createFolder(req.session.userid!, createPayload)

    return {
      code: 0,
      message: "创建成功",
      data: result,
    }
  }

  /**
   * 添加新的快速访问文件夹
   */
  @Post("fast_access/:id/add")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(AddFastAccessFolderParams)
  async addFastAccessFolder(
    @Param() params: AddFastAccessFolderParams,
    @Req() req: Request
  ): Promise<AddFastAccessFolderOutput> {
    await this.folderService.addFastAccessFolder(req.session.userid!, params.newFastAccessFolderId)

    return {
      code: 0,
      message: "添加成功",
      data: {},
    }
  }

  /**
   * 添加新的收藏文件夹
   */
  @Post("favorite/:id/add")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(AddFavoriteFolderParams)
  async addFavoriteFolder(
    @Param() params: AddFavoriteFolderParams,
    @Req() req: Request
  ): Promise<AddFavoriteFolderOutput> {
    await this.folderService.addFavoriteFolder(req.session.userid!, params.newFavoriteFolderId)

    return {
      code: 0,
      message: "添加成功",
      data: {},
    }
  }

  /**
   * 移除快速访问文件夹
   */
  @Post("fast_access/:id/remove")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(RemoveFastAccessFolderParams)
  async removeFastAccessFolder(
    @Param() params: RemoveFastAccessFolderParams,
    @Req() req: Request
  ): Promise<RemoveFastAccessFolderOutput> {
    await this.folderService.removeFastAccessFolder(req.session.userid!, params.tobeRemovedFolderId)

    return {
      code: 0,
      message: "移除成功",
      data: {},
    }
  }

  /**
   * 移除收藏文件夹
   */
  @Post("favorite/:id/remove")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(RemoveFavoriteFolderParams)
  async removeFavoriteFolder(
    @Param() params: RemoveFastAccessFolderParams,
    @Req() req: Request
  ): Promise<RemoveFavoriteFolderOutput> {
    await this.folderService.removeFavoriteFolder(req.session.userid!, params.tobeRemovedFolderId)

    return {
      code: 0,
      message: "移除成功",
      data: {},
    }
  }

  /**
   * 删除文件夹, 需要登录
   */
  @Delete("delete/:id")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(DeleteFolderParams)
  async deleteFolder(@Param() params: DeleteFolderParams, @Req() req: Request): Promise<DeleteFolderOutput> {
    await this.folderService.deleteFolder(req.session.userid!, params.tobeDeletedFolderId, "soft")

    return {
      code: 0,
      message: "删除成功",
      data: {},
    }
  }

  /**
   * 彻底删除文件夹, 需要登录
   */
  @Delete("delete_completely/:id")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(DeleteFolderCompletelyParams)
  async deleteFolderCompletely(
    @Param() params: DeleteFolderCompletelyParams,
    @Req() req: Request
  ): Promise<DeleteFolderCompletelyOutput> {
    await this.folderService.deleteFolder(req.session.userid!, params.tobeDeletedFolderId, "hard")

    return {
      code: 0,
      message: "删除成功",
      data: {},
    }
  }

  /**
   * 恢复未彻底删除的文件夹
   */
  @Post("revert_delete/:id")
  @UseGuards(UserAuthGuard)
  @ParamsZodSchema(RevertFolderParams)
  async revertFolder(@Param() params: RevertFolderParams, @Req() req: Request): Promise<RevertFolderOutput> {
    await this.folderService.revertFolder(req.session.userid!, params.tobeRevertedFolderId)

    return {
      code: 0,
      message: "恢复成功",
      data: {},
    }
  }
}
