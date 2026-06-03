import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Served from a GitHub Pages project sub-path, so base must be that path for
// the service-worker scope and manifest URLs to resolve correctly.
export default defineConfig({
  base: '/IAHO-field-scanner/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // pick up new deploys automatically
      includeAssets: ['favicon.svg', 'apple-touch-icon-180.png'],
      manifest: {
        name: 'IAHO Field Scanner',
        short_name: 'IAHO Scanner',
        description: 'IAHO field audit scanner — offline-capable prop.',
        theme_color: '#05070a',
        background_color: '#05070a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the whole app shell so it runs fully offline after first load.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
