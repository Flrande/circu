import { Controller, Get, Query } from "@nestjs/common"
import { GeneralDoc } from "@prisma/client"
import { DocService } from "./doc.service"
import { DocIdQueryDto } from "./dto/get-doc.dto"

@Controller("api/doc")
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Get("general")
  async getGeneralDocById(
    @Query() query: DocIdQueryDto
  ): Promise<Pick<GeneralDoc, "id" | "lastModify" | "title" | "authorId" | "parentFolderId">> {
    const result = await this.docService.findGeneralDocById(query.id)

    return result
  }
}
