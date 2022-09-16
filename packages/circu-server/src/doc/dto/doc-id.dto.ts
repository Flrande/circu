import { IsAlphanumeric, IsString } from "class-validator"

export class DocIdQueryDto {
  @IsString()
  @IsAlphanumeric()
  id: string
}
