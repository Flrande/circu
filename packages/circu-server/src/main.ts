import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import session from "express-session"
import { ConfigService } from "@nestjs/config"
import Redis from "ioredis"

const RedisStore = require("connect-redis")(session)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const redisClient = new Redis()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: true,
      dismissDefaultMessages: true,
    })
  )

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.getOrThrow("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
    })
  )

  await app.listen(6000)
}
bootstrap()
