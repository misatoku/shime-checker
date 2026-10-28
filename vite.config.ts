/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: { host: "0.0.0.0", port: 5174, strictPort: true },
  preview: { host: "0.0.0.0", port: 4173, strictPort: true },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "〆チェッカー",
        short_name: "〆チェッカー",
        description: "締め作業チェックリスト",
        theme_color: "#fcfaf5",
        background_color: "#fcfaf5",
        display: "standalone",
        start_url: "/",
        lang: "ja",
        icons: [
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: true,
  },
});
