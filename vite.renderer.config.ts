import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: "src/renderer",
  build: {
    outDir: "../../.vite/renderer/main_window",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      external: ["fs"]
    }
  }
});
