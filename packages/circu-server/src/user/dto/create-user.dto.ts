import { User } from "@prisma/client"
import { IsAlphanumeric, IsByteLength, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto implements Pick<User, "username" | "nickname" | "password"> {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(4, 20)
  username: string

  @IsNotEmpty()
  @IsString()
  @IsByteLength(1, 20)
  nickname: string

  @IsNotEmpty()
  @IsString()
  @IsByteLength(6, 30)
  password: string
}
