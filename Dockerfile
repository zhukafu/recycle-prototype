# 铝老板金属网 - Docker 多阶段构建（合并服务）
# 访问路径：
#   - 介绍页（根路径）: http://localhost:8080/
#   - 小程序（miniprogram）: http://localhost:8080/miniprogram/index.html
#   - 管理后台（admin）    : http://localhost:8080/admin/index.html

# ========== 阶段 1：使用 Node 镜像执行 Vite 构建 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 优先复制 package 文件以利用 Docker 缓存
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# 复制源码
COPY . .

# 执行一次构建，同时产出 miniprogram + admin + 根介绍页
RUN npx vite build

# ========== 阶段 2：使用轻量级 Nginx 镜像托管静态文件 ==========
FROM nginx:1.27-alpine

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物到 nginx 默认站点目录
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 健康检查：访问介绍页应返回 200
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
