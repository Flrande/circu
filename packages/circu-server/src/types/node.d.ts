declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL?: string
        NODE_ENV?: string
        SESSION_SECRET?: string
        PORT?: string
        WS_PORT?: string
        CLIENT_URL?: string
        COLLABORATE_TEST_DOC_ID?: string
        COLLABORATE_TEST_USER_ID?: string
      }
    }
  }
}
