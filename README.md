# 铝老板金属网

面向金属回收行业的 B2B 数字化服务平台原型项目，包含**小程序端**（面向终端客户/业务员）和**管理后台**（面向企业管理员）两套前端应用，共用同一工程、独立构建部署。

---

## 项目概述

铝老板金属网为金属废料回收行业提供以下核心能力：

- **型号查询**：接触器、断路器、继电器、隔离开关等全品类型号数据库
- **实时报价**：银触点含量、回收参考价等行情信息
- **技术交流**：行业技术文章、拆解指导
- **运营管理**：型号管理、报价管理、分类管理、资讯管理、询价管理、公告管理、账号管理等

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vite | ^5.4.10 | 开发服务器 & 构建工具 |
| Tailwind CSS (Play CDN) | 3.x | 原子化 CSS 框架（浏览器端 JIT） |
| Font Awesome | 6.4.0 / 6.5.1 | 图标库 |
| Google Fonts | — | Noto Sans SC、Noto Serif SC、JetBrains Mono 等 |
| Node.js | 20 (Alpine) | 构建环境 |
| Nginx | 1.27 (Alpine) | 生产环境静态文件托管 |
| Docker | 多阶段构建 | 容器化部署 |

> 所有外部 CDN 资源（Tailwind CSS、Font Awesome、Google Fonts 等）均已下载到 `public/lib/` 目录，优先从本地加载，无需依赖外部网络。

---

## 目录结构

```
recycle-prototype/
├── admin/                    # 管理后台页面
│   ├── index.html            # 登录页
│   ├── manage.html           # 管理首页
│   ├── mine.html             # 我的
│   ├── catalog-list.html     # 型号管理
│   ├── category-list.html    # 分类管理
│   ├── quote-list.html       # 报价管理
│   ├── article-list.html     # 资讯管理
│   ├── inquiry-list.html     # 询价管理
│   ├── announcement-list.html# 公告管理
│   ├── user-list.html        # 账号管理
│   └── ...
├── miniprogram/              # 小程序端页面
│   ├── index.html            # 首页
│   ├── contactors.html       # 接触器数据库
│   ├── category.html         # 分类详情页
│   ├── product.html          # 产品详情页
│   ├── search-results.html   # 搜索结果
│   ├── quote-list.html       # 报价列表
│   ├── tecexc.html           # 技术交流
│   ├── contacts.html         # 联系方式
│   └── data/contacts.js      # 产品数据源
├── public/                   # 静态资源（构建时自动复制到产物根目录）
│   ├── icons/                # SVG 图标
│   ├── images/               # 产品图片
│   ├── lib/                  # 本地化的第三方库
│   │   ├── tailwind/         # Tailwind CSS Play CDN
│   │   ├── font-awesome/     # Font Awesome 6.4.0 / 6.5.1
│   │   └── fonts/            # Google Fonts (woff2 + CSS)
│   └── data/                 # 共享数据文件
├── src/components/           # JS 组件
│   ├── admin-topbar.js       # 管理后台顶栏
│   ├── admin-bottom-nav.js   # 管理后台底部导航
│   ├── bottom-nav.js         # 小程序端底部导航
│   └── page-actions.js       # 页面操作按钮
├── vite.config.js            # 小程序开发配置
├── vite.admin.config.js      # 管理后台开发配置
├── vite.mp.build.config.js   # 小程序构建配置
├── vite.admin.build.config.js# 管理后台构建配置
├── Dockerfile                # 多阶段 Docker 构建
├── docker-compose.yaml       # 双服务编排
└── nginx.conf                # Nginx 配置
```

---

## 快速开始

### 环境要求

- Node.js >= 20
- npm

### 安装依赖

```bash
npm install
```

### 本地开发

**小程序端**（端口 5173）：

```bash
npm run dev:mp
```

**管理后台**（端口 5174）：

```bash
npm run dev:admin
```

### 构建

```bash
# 仅构建小程序端
npm run build:mp

# 仅构建管理后台
npm run build:admin

# 同时构建两端
npm run build
```

构建产物分别输出到 `dist-mp/` 和 `dist-admin/` 目录。

---

## Docker 部署

使用 Docker Compose 一键构建并启动两个容器：

```bash
docker compose up -d --build
```

| 服务 | 容器名 | 端口 |
|------|--------|------|
| 小程序端 | `alu-miniprogram` | http://localhost:8080 |
| 管理后台 | `alu-admin` | http://localhost:8081 |

常用命令：

```bash
# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

---

## 页面说明

### 小程序端

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/miniprogram/index.html` | 搜索入口、功能导航、资讯轮播 |
| 接触器数据库 | `/miniprogram/contactors.html` | 品牌分类浏览、最新上架 |
| 分类详情 | `/miniprogram/category.html` | 左侧品牌导航 + 右侧产品列表 |
| 产品详情 | `/miniprogram/product.html` | 型号参数、银触点含量、回收价 |
| 搜索结果 | `/miniprogram/search-results.html` | 关键词搜索、分类筛选 |
| 报价列表 | `/miniprogram/quote-list.html` | 行情报价表格 |
| 技术交流 | `/miniprogram/tecexc.html` | 技术文章、行业快讯 |
| 联系方式 | `/miniprogram/contacts.html` | 联系电话、微信、地址导航 |

### 管理后台

| 页面 | 路径 | 说明 |
|------|------|------|
| 登录 | `/admin/index.html` | 管理员登录 |
| 管理首页 | `/admin/manage.html` | 数据概览、快捷入口 |
| 我的 | `/admin/mine.html` | 个人信息、业务管理入口 |
| 型号管理 | `/admin/catalog-list.html` | 产品型号 CRUD |
| 分类管理 | `/admin/category-list.html` | 产品分类树管理 |
| 报价管理 | `/admin/quote-list.html` | 回收报价维护 |
| 资讯管理 | `/admin/article-list.html` | 文章发布与编辑 |
| 询价管理 | `/admin/inquiry-list.html` | 客户询价处理 |
| 公告管理 | `/admin/announcement-list.html` | 平台公告发布 |
| 账号管理 | `/admin/user-list.html` | 用户账号管理 |
| 数据统计 | `/admin/data.html` | 业务数据可视化 |
| 系统设置 | `/admin/system.html` | 系统参数配置 |

---

## 数据说明

产品数据存储在 `public/data/contacts.js` 中，通过 `window._AL_PRODUCTS` 全局变量供各页面共享。数据包含以下字段：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识 |
| `cat` | 分类（contactor / breaker / relay / button / switch） |
| `model` | 型号名称 |
| `brand` | 品牌 |
| `spec` | 规格参数 |
| `silver` | 银触点含量 |
| `price` | 回收参考价 |
| `stock` | 库存状态（现货 / 会员 / 询价 / 期货） |
| `img` | 产品图片路径 |
| `desc` | 产品描述 |

---

## 许可证

本项目为内部原型项目，未开源。
