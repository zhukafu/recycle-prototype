import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// 自动发现 miniprogram/ 下所有 HTML 入口
const input = readdirSync('miniprogram')
  .filter(f => f.endsWith('.html'))
  .reduce((acc, f) => {
    acc[f.replace('.html', '')] = resolve(__dirname, 'miniprogram', f)
    return acc
  }, {})

// 数据文件统一放在 public/data/，HTML 通过绝对路径 /data/xxx.js 引用
// Vite 的 publicDir: 'public' 会自动将 public/ 复制到构建根目录

export default defineConfig({
  publicDir: 'public',
  plugins: [],
  build: {
    outDir: 'dist-mp',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: { input }
  }
})
