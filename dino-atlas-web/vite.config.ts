import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No GitHub Pages o site fica em /dino-atlas/; localmente, na raiz
  base: process.env.VITE_BASE ?? '/',
  server: { port: 5173 },
})
