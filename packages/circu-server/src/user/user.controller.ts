import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { User } from "@prisma/client"
import { ISuccessResponse } from "src/interfaces/response"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserIdQuery } from "./dto/get-user.dto"
import { UserService } from "./user.service"

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 注册新用户, 需提供用户名, 用户昵称, 用户密码
   *
   * //TODO: 用户密码哈希存储
   *
   * @param createUserDto
   */
  @Post("register")
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<ISuccessResponse<Pick<User, "id" | "username" | "nickname">>> {
    const result = await this.userService.createUser(createUserDto)

    return {
      code: 0,
      message: "注册成功",
      data: result,
    }
  }

  /**
   * 根据用户 id 查询用户基本信息
   *
   * @param query
   */
  @Get()
  async getUserById(@Query() query: UserIdQuery) {
    const result = await this.userService.findUserById(query.id)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }
}
