/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WATCHER_BASE_URL: string
  readonly VITE_WATCHER_TOKEN: string
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
