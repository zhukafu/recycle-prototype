import { defineConfig } from 'vite'

// 小程序原型 - 启动命令: npm run dev:mp
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: '/miniprogram/index.html'
  }
})
