import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import vitePluginForArco from "@arco-plugins/vite-react"
import vitePluginImportus from "vite-plugin-importus"
import FullReload from "vite-plugin-full-reload"

export default defineConfig({
  plugins: [
    react(),
    vitePluginForArco({ style: "css" }),
    vitePluginImportus([
      {
        libraryName: "@icon-park/react",
        customName: (name: string) => `@icon-park/react/es/icons/${name}`,
        camel2DashComponentName: false,
      },
    ]),
    FullReload(["./src/page/doc/*.tsx", "./src/crdt/*.ts"]),
  ],
  server: {
    port: 5000,
  },
  optimizeDeps: {
    exclude: ["slate-react", "cache-manager"],
  },
})
