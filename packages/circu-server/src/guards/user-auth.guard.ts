import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Request } from "express"
import { PrismaService } from "src/database/prisma.service"

/**
 * 一个用于判断请求是否在内存数据库中有对应会话的守卫组件
 */
@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const userid = request.session.userid

    if (!userid) {
      return false
    }

    const result = await this.prismaService.user.findUnique({
      where: {
        id: userid,
      },
      select: {
        id: true,
      },
    })

    if (!result) {
      return false
    }

    return true
  }
}
