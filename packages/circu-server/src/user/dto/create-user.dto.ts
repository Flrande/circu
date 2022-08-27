import { User } from "@prisma/client"

export class CreateUserDto implements Pick<User, "username" | "nickname" | "password"> {
  username: string
  nickname: string
  password: string
}
