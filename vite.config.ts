import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  optimizeDeps: {
    exclude: ['express']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@controllers': path.resolve(__dirname, './src/api/controllers'),
      '@routes': path.resolve(__dirname, './src/api/routes'),
      '@db': path.resolve(__dirname, './src/db'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
      '@services': path.resolve(__dirname, './src/services'),
      '@academic': path.resolve(__dirname, './src/services/academic'),
      '@campus': path.resolve(__dirname, './src/services/campus'),
      '@integration': path.resolve(__dirname, './src/services/integration'),
      '@session': path.resolve(__dirname, './src/services/session'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config')
    }
  }
})
