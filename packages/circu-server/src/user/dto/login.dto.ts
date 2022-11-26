import { IsNotEmpty, IsString, IsAlphanumeric, IsByteLength, IsBoolean } from "class-validator"

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(4, 20)
  username: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsBoolean()
  ifCarrySession: boolean
}
