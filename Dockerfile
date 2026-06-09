# 铝老板金属网 - Docker 多阶段构建
# 通过 TARGET 构建参数选择产物：mp（小程序）| admin（管理后台）

# ========== 阶段 1：使用 Node 镜像执行 Vite 构建 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 优先复制 package 文件以利用 Docker 缓存
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# 复制源码
COPY . .

# 构建参数：mp 或 admin（默认 mp）
ARG TARGET=mp
ENV TARGET=${TARGET}

# 根据 TARGET 选择不同的构建配置
RUN if [ "$TARGET" = "admin" ]; then \
      npx vite build --config vite.admin.build.config.js; \
    else \
      npx vite build --config vite.mp.build.config.js; \
    fi

# ========== 阶段 2：使用轻量级 Nginx 镜像托管静态文件 ==========
FROM nginx:1.27-alpine

ARG TARGET=mp

# 复制 nginx 配置（包含 SPA fallback、gzip、缓存策略）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物到 nginx 默认站点目录
COPY --from=builder /app/dist-${TARGET} /usr/share/nginx/html

EXPOSE 80

# 健康检查：访问首页应返回 200
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
