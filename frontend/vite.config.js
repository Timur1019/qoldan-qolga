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
        timeout: 15000,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('[Vite proxy] /api -> 8080: бэкенд недоступен. Запустите: ./gradlew bootRun')
            if (res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ message: 'Backend unreachable. Start: ./gradlew bootRun' }))
            }
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (proxyRes.statusCode === 404) {
              console.warn('[Vite proxy] 404 от бэкенда:', req.method, req.url)
            }
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
