import { IsAlphanumeric, IsString } from "class-validator"

export class IdQueryDto {
  @IsString()
  @IsAlphanumeric()
  id: string
}
