import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "The Treeman — Field Ops",
        short_name: "Treeman",
        description: "Job, quote, hazard, incident and crew management for The Treeman arborist crew.",
        theme_color: "#0d1508",
        background_color: "#0d1508",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        // Cache the app shell + the gallery images from thetreeman.co.nz for offline use.
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(www\.)?thetreeman\.co\.nz\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "treeman-images",
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ]
});
