import { Controller, Get, Post, Body, Param } from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @Get(":id")
  getUser(@Param() params: { id: string }) {
    return this.userService.findUser({ id: params.id })
  }
}
