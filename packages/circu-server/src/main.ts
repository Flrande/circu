import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import session from "express-session"
import { ConfigService } from "@nestjs/config"
import connectRedis from "connect-redis"
import { SessionAdapter } from "./ws/session-adapter"

const Redis = require("ioredis")
const RedisStore = connectRedis(session)

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_URL ? process.env.CLIENT_URL : "http://localhost:5000",
      credentials: true,
    },
  })

  const configService = app.get(ConfigService)
  const redisClient = new Redis(process.env.REDIS_URL ? process.env.REDIS_URL : undefined)

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

  app.use(sessionMiddleware)

  app.useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app))

  await app.listen(configService.getOrThrow<string>("PORT"))
}
bootstrap()
