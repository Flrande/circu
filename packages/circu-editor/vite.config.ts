import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import vitePluginForArco from "@arco-plugins/vite-react"

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin({ devStyleRuntime: "vanilla-extract" }), vitePluginForArco({ style: "css" })],
})
