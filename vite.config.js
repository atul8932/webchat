import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,   // boolean true = allow ALL hosts (ngrok, tunnels, etc.)
    host: '0.0.0.0',      // listen on all interfaces so ngrok can reach it
    port: 5173,           // always use 5173 — matches ngrok
    strictPort: false,    // if 5173 is busy, try next port
  },
})
