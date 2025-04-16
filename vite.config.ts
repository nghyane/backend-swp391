import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    exclude: ['express'] // để đảm bảo express không bị optimize
  }
})
