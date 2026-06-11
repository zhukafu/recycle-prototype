import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

const mpInputs = readdirSync('miniprogram')
  .filter(f => f.endsWith('.html'))
  .reduce((acc, f) => {
    acc['miniprogram/' + f.replace('.html', '')] = resolve(__dirname, 'miniprogram', f)
    return acc
  }, {})

const adminInputs = readdirSync('admin')
  .filter(f => f.endsWith('.html'))
  .reduce((acc, f) => {
    acc['admin/' + f.replace('.html', '')] = resolve(__dirname, 'admin', f)
    return acc
  }, {})

export default defineConfig({
  base: '/',
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: '/index.html'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: Object.assign({
        index: resolve(__dirname, 'index.html')
      }, mpInputs, adminInputs)
    }
  }
})
