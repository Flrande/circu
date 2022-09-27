import { IsAlphanumeric, IsString } from "class-validator"

export class IdDto {
  @IsString()
  @IsAlphanumeric()
  id: string
}
