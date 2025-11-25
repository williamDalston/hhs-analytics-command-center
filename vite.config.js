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

  // Build optimizations for better performance
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2015',

    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ai-vendor': ['@google/generative-ai', 'openai'],
        },
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 600,

    // Enable CSS code splitting
    cssCodeSplit: true,
  },

  // Development server optimizations
  server: {
    // Enable compression
    compress: true,
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
