import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, cpSync, existsSync } from 'fs'

// 自动发现 miniprogram/ 下所有 HTML 入口
const input = readdirSync('miniprogram')
  .filter(f => f.endsWith('.html'))
  .reduce((acc, f) => {
    acc[f.replace('.html', '')] = resolve(__dirname, 'miniprogram', f)
    return acc
  }, {})

// 把 miniprogram/data/ 整体复制到 dist-mp/miniprogram/data/
// 原因：HTML 里用的是相对路径 <script src="data/articles.js">，
//       Vite 的 publicDir 只覆盖 public/，miniprogram/data/ 不会被默认复制。
function copyMiniprogramDataPlugin() {
  return {
    name: 'copy-miniprogram-data',
    closeBundle() {
      const src = resolve(__dirname, 'miniprogram/data')
      const dest = resolve(__dirname, 'dist-mp/miniprogram/data')
      if (existsSync(src)) {
        cpSync(src, dest, { recursive: true })
      }
    }
  }
}

export default defineConfig({
  publicDir: 'public',
  plugins: [copyMiniprogramDataPlugin()],
  build: {
    outDir: 'dist-mp',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: { input }
  }
})
