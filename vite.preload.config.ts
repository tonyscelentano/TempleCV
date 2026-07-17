import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node22",
    lib: {
      entry: "src/preload/preload.ts",
      formats: ["es"]
    }
  }
});
