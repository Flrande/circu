import { Controller, Get, Post, Body, Req, Param } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"
import { AuthService } from "src/auth/auth.service"
import { ISuccessResponse } from "src/interfaces/response"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserIdQueryDto } from "./dto/get-user.dto"
import { UserSignInDto } from "./dto/sign-in.dto"
import { UserService } from "./user.service"

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  /**
   * 注册新用户, 需提供用户名, 用户昵称, 用户密码
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
   */
  @Get("data/:id")
  async getUserById(
    @Param() params: UserIdQueryDto
  ): Promise<ISuccessResponse<Pick<User, "id" | "username" | "nickname">>> {
    const result = await this.userService.findUserById(params.id)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 登录, 并将用户会话信息持久化到内存数据库中
   */
  @Post("signin")
  async signIn(@Body() body: UserSignInDto, @Req() req: Request): Promise<ISuccessResponse<{}>> {
    await this.authService.signIn(body, req)

    return {
      code: 0,
      message: "登录成功",
      data: {},
    }
  }
}
