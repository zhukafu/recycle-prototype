import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// 自动发现 admin/ 下所有 HTML 入口
const input = readdirSync('admin')
  .filter(f => f.endsWith('.html'))
  .reduce((acc, f) => {
    acc[f.replace('.html', '')] = resolve(__dirname, 'admin', f)
    return acc
  }, {})

export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist-admin',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: { input }
  }
})
