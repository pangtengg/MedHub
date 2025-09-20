import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: process.env.VITE_DEV_SERVER_HOST || 'localhost',
    port: Number(process.env.VITE_DEV_SERVER_PORT) || 5173,
    strictPort: true, // if 5173 is taken, don’t auto-increment
  },
})
