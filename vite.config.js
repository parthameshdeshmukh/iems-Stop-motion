import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three_ecosystem: ['three', '@react-three/fiber', '@react-three/drei'],
          animation_engine: ['gsap', 'lenis'],
        }
      }
    }
  }
})
