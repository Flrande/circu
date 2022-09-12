import { IsAlphanumeric, IsString } from "class-validator"

export class UserIdQueryDto {
  @IsString()
  @IsAlphanumeric()
  id: string
}
