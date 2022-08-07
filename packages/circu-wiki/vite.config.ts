import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import vitePluginForArco from "@arco-plugins/vite-react"

export default defineConfig({
  plugins: [react(), vitePluginForArco({ style: "css" })],
  server: {
    port: 5000,
  },
})
