import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { ISuccessResponse } from "src/interfaces/response"
import { User } from "@prisma/client"

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 注册新用户, 需提供用户名, 用户昵称, 用户密码
   * //TODO: 限制用户名字符
   * //TODO: 用户密码哈希存储
   * //TODO: 验证载荷字段是否合法及有缺失
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
   * @param id
   */
  @Get()
  async getUserById(@Query("id") id: string) {
    const result = await this.userService.findUser({ id })
  }
}
