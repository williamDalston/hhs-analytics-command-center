import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get repo name from package.json or environment
const repoName = process.env.GITHUB_REPOSITORY 
  ? process.env.GITHUB_REPOSITORY.split('/')[1] 
  : 'senior-power-bi-develper'

// Use repo name as base path for GitHub Pages, relative paths for local dev
const base = process.env.GITHUB_PAGES === 'true' 
  ? `/${repoName}/` 
  : './'

export default defineConfig({
  plugins: [react()],
  base: base,
})
