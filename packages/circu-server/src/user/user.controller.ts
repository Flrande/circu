import { Controller, Get, Post, Body, Req, Param } from "@nestjs/common"
import { Request } from "express"
import { ControllerMeta } from "src/decorators/set-controller-meta.decorator"
import { ControllerOrModulePrefix } from "src/exception/types"
import { BodyZodSchema, ParamsZodSchema } from "src/interceptor/zod/set-zod-schema.decorator"
import { GetUserInfoOutput, GetUserInfoParams } from "./schemas/get-user-info.schema"
import { LoginBody, LoginOutput } from "./schemas/login.schema"
import { RegisterBody, RegisterOutput } from "./schemas/register.schema"
import { USER_ROUTE } from "./user.constant"
import { UserService } from "./user.service"

@Controller(USER_ROUTE)
@ControllerMeta(ControllerOrModulePrefix.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 注册新用户, 需提供用户名, 用户昵称, 用户密码
   */
  @Post("register")
  @BodyZodSchema(RegisterBody)
  async register(@Body() body: RegisterBody): Promise<RegisterOutput> {
    const result = await this.userService.createUser(body.userInfo)

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
  @ParamsZodSchema(GetUserInfoParams)
  async getUserInfo(@Param() params: GetUserInfoParams): Promise<GetUserInfoOutput> {
    const result = await this.userService.getUserInfo(params.userId)

    return {
      code: 0,
      message: "查询成功",
      data: result,
    }
  }

  /**
   * 登录, 并将用户会话信息持久化到内存数据库中
   */
  @Post("login")
  @BodyZodSchema(LoginBody)
  async login(@Body() body: LoginBody, @Req() req: Request): Promise<LoginOutput> {
    await this.userService.login(body.loginPayload, req)

    return {
      code: 0,
      message: "登录成功",
      data: {},
    }
  }
}
