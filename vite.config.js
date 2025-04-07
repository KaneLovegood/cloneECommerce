const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

// https://vite.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 5175
  }
})
