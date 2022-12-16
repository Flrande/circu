/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CIRCU_SERVER_URL?: string
  readonly VITE_CIRCU_SERVER_WS_URL?: string
  readonly VITE_TEST_DOC_ID?: string
  readonly VITE_TEST_USER_NAME?: string
  readonly VITE_TEST_USER_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
