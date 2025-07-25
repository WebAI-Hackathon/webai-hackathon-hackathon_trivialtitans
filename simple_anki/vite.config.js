import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Tell Vue to ignore VOIX custom elements
          isCustomElement: (tag) => ['tool', 'prop', 'context', 'array', 'dict'].includes(tag)
        }
      }
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: 'webai-hackathon-hackathon_trivialtitans',
  build: {
    outDir: '../docs'
  }
})
