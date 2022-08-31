import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 注册新用户, 需提供用户名, 用户昵称, 用户密码
   * //TODO 用户名查询唯一性
   * //TODO 用户密码哈希存储
   *
   * @param createUserDto
   */
  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  /**
   * 根据用户 id 查询用户基本信息
   *
   * @param id
   */
  @Get()
  getUserById(@Query("id") id: string) {
    return this.userService.findUser({ id })
  }
}
