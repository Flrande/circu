import { IsOptional, IsString } from "class-validator"

export class CreateGeneralDocDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  parentFolderId?: string
}
