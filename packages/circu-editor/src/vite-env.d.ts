/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INITIAL_VALUE_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
