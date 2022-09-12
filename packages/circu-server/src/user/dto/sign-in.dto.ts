import { IsNotEmpty, IsString, IsAlphanumeric, IsByteLength } from "class-validator"

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(4, 20)
  username: string

  @IsNotEmpty()
  @IsString()
  password: string
}
