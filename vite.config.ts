import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { qrcode } from "vite-plugin-qrcode"
import rune from "vite-plugin-rune"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative
  plugins: [
    qrcode(), // only applies in dev mode
    svelte(),
    rune({
      logicPath: path.resolve("./src/logic.ts"),
      minifyLogic: false, // This flag can be used if your logic reaches the allowed limit. However, it will make it significantly more difficult to detect validation issues
      ignoredDependencies: [],
    }),
  ],
})
