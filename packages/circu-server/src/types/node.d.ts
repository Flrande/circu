declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL?: string
        REDIS_URL?: string
        NODE_ENV?: string
        SESSION_SECRET?: string
        PORT?: string
        CLIENT_URL?: string
        PRIVATE_PLAYGROUND_URL?: string
      }
    }
  }
}
