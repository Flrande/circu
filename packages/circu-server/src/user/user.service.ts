import { Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import { PrismaService } from "src/database/prisma.service"

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Omit<Prisma.UserCreateInput, "id">): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async findUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }
}
