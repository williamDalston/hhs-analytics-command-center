import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dynamically determine base path for GitHub Pages
// If GITHUB_REPOSITORY is set (during GitHub Actions build), use it
// Otherwise, use the repo name from the remote URL or fallback
const getBasePath = () => {
  // During GitHub Actions build
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    return `/${repoName}/`
  }
  // Local development - use repo name from git remote
  return '/hhs-analytics-command-center/'
}

export default defineConfig({
  plugins: [react()],
  base: getBasePath(),
})
