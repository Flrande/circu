import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_FILTER } from "@nestjs/core"
import { DocModule } from "./doc/doc.module"
import { HttpExceptionFilter } from "./exception/http-exception.filter"
import { UserModule } from "./user/user.module"
import { WsModule } from "./ws/ws.module"

@Module({
  imports: [
    UserModule,
    DocModule,
    WsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
