import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative paths for GitHub Pages compatibility
// This works whether the site is at root or in a subdirectory
export default defineConfig({
  plugins: [react()],
  base: './',
})
