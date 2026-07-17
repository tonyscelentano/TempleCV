import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node22",
    lib: {
      entry: "src/main/main.ts",
      fileName: "main",
      formats: ["es"]
    }
  }
});
