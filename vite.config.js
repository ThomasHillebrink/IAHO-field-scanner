import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so the build works on GitHub Pages
// regardless of the repository sub-path it is served from.
export default defineConfig({
  base: './',
  plugins: [react()],
})
