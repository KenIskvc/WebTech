import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173,
     proxy: {
      '/api': {
        target: 'https://localhost:7050',
        changeOrigin: true,
        secure: false
      }
    }
  }
})