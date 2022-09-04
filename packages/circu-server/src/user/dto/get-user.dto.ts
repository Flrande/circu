import { IsAlphanumeric, IsString } from "class-validator"

export class UserIdQuery {
  @IsString()
  @IsAlphanumeric()
  id: string
}
