import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/gsc-builder.js',
        chunkFileNames: 'assets/gsc-builder-[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? ''
          if (name.endsWith('.css')) {
            return 'assets/gsc-builder.css'
          }
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
