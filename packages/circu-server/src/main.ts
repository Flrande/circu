import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import session from "express-session"
import { ConfigService } from "@nestjs/config"
import connectRedis from "connect-redis"
import { SessionAdapter } from "./ws/session-adapter"

const Redis = require("ioredis")
const RedisStore = connectRedis(session)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const redisClient = new Redis()
  const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: configService.getOrThrow("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      //TODO: HTTPS 支持
      // secure: true
    },
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: configService.getOrThrow("NODE_ENV") === "DEV" ? false : true,
      dismissDefaultMessages: configService.getOrThrow("NODE_ENV") === "DEV" ? false : true,
    })
  )

  app.use(sessionMiddleware)

  app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app))

  await app.listen(6000)
}
bootstrap()
