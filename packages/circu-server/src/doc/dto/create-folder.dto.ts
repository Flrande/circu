import { IsOptional, IsString } from "class-validator"

export class CreateFolderDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  parentFolderId?: string
}
