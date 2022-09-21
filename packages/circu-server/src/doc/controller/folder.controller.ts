import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common"
import { Folder } from "@prisma/client"
import { Request } from "express"
import { UserAuthGuard } from "src/guards/user-auth.guard"
import { ISuccessResponse } from "src/interfaces/response"
import { CreateFolderDto } from "../dto/create-folder.dto"
import { IdQueryDto } from "../dto/id.dto"
import { FolderService } from "../service/folder.service"

@Controller("api/folder")
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  async getFolderById(
    @Query() query: IdQueryDto,
    @Req() req: Request
  ): Promise<
    ISuccessResponse<Pick<Folder, "id" | "lastModify" | "title" | "description" | "authorId" | "parentFolderId">>
  > {
    const result = await this.folderService.findFolderById(req.session.userid!, query.id)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

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
   * 删除文件夹, 需要登录
   */
  @Get("delete")
  @UseGuards(UserAuthGuard)
  async deleteFolder(@Query() query: IdQueryDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.folderService.deleteFolder(req.session.userid!, query.id)

    return {
      code: 0,
      message: "删除成功",
      data: {},
    }
  }
}
