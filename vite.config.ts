import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "ScrollFire",
      fileName: "ScrollFire",
    },
    rollupOptions: {
      external: ["jQuery"],
      output: {
        globals: {
          jQuery: "jQuery",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "ScrollFire.css";
          }
          return assetInfo.name;
        },
      },
    },
  },
});
