import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from a subdirectory, so use the repo name as base path
export default defineConfig({
  plugins: [react()],
  base: '/hhs-analytics-command-center/',
})
