import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core"
import { DocModule } from "./doc/doc.module"
import { HttpExceptionFilter } from "./exception/http-exception.filter"
import { ZodIntercepter } from "./interceptor/zod/zod.interceptor"
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodIntercepter,
    },
  ],
})
export class AppModule {}
