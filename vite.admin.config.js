import { defineConfig } from 'vite'

// 管理后台 - 启动命令: npm run dev:admin
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5174,
    open: '/管理后台/index.html'
  }
})
