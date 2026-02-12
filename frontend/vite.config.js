import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // sockjs-client ссылается на global (есть в Node, в браузере — globalThis)
    global: 'globalThis',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.warn('Proxy error (возможно, бэкенд не запущен на :8080):', err.message)
          })
        },
      },
      '/ws': {
        target: 'http://127.0.0.1:8080',
        ws: true,
      },
    },
  },
})
