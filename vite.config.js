import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ['proacademy', 'prostaracademy'],
    proxy: {
      '/api': {
        target: 'https://proacademy-api.loca.lt',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
