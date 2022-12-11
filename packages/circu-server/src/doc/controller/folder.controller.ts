import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common"
import { Folder } from "@prisma/client"
import { Request } from "express"
import { UserAuthGuard } from "src/guards/user-auth.guard"
import { CreateFolderDto } from "../dto/create-folder.dto"
import { IdDto } from "../dto/id.dto"
import { FolderService } from "../service/folder.service"

@Controller("api/folder")
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  /**
   * 根据 id 获取文件夹信息
   */
  @Get("data/:id")
  @UseGuards(UserAuthGuard)
  async getFolderById(
    @Param() params: IdDto,
    @Req() req: Request
  ): Promise<
    ISuccessResponse<
      Pick<Folder, "id" | "lastModify" | "title" | "description" | "lastDeleted" | "authorId" | "parentFolderId">
    >
  > {
    const result = await this.folderService.getFolderById(req.session.userid!, params.id)

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
  async getDeletedFolders(
    @Req() req: Request
  ): Promise<
    ISuccessResponse<
      Pick<Folder, "id" | "lastModify" | "title" | "description" | "authorId" | "lastDeleted" | "parentFolderId">[]
    >
  > {
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
  @Get("personal")
  @UseGuards(UserAuthGuard)
  async getPersonalTopFolders(
    @Req() req: Request
  ): Promise<
    ISuccessResponse<Pick<Folder, "id" | "lastModify" | "title" | "description" | "authorId" | "parentFolderId">[]>
  > {
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
  async getFastAccessFolders(
    @Req() req: Request
  ): Promise<
    ISuccessResponse<Pick<Folder, "id" | "lastModify" | "title" | "description" | "authorId" | "parentFolderId">[]>
  > {
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
  async getFavoriteFolders(
    @Req() req: Request
  ): Promise<
    ISuccessResponse<Pick<Folder, "id" | "lastModify" | "title" | "description" | "authorId" | "parentFolderId">[]>
  > {
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
  async createFolder(
    @Body() createFolderDto: CreateFolderDto,
    @Req() req: Request
  ): Promise<
    ISuccessResponse<Pick<Folder, "id" | "lastModify" | "title" | "description" | "authorId" | "parentFolderId">>
  > {
    const createPayload = {
      title: createFolderDto.title,
      description: createFolderDto.description ? createFolderDto.description : null,
      parentFolderId: createFolderDto.parentFolderId ? createFolderDto.parentFolderId : null,
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
  async addFastAccessFolder(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.addFastAccessFolder(req.session.userid!, params.id)

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
  async addFavoriteFolder(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.addFavoriteFolder(req.session.userid!, params.id)

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
  async removeFastAccessFolder(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.removeFastAccessFolder(req.session.userid!, params.id)

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
  async removeFavoriteFolder(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.removeFavoriteFolder(req.session.userid!, params.id)

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
  async deleteFolder(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.deleteFolder(req.session.userid!, params.id, "soft")

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
  async deleteFolderCompletely(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.deleteFolder(req.session.userid!, params.id, "hard")

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
  async revertFolder(@Param() params: IdDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.revertFolder(req.session.userid!, params.id)

    return {
      code: 0,
      message: "恢复成功",
      data: {},
    }
  }
}
