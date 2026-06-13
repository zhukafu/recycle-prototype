# 站点统计数据埋点与展示

## 概述

实现站点访问统计、型号查询统计、回收价/单位重量浏览统计、付费信息点击统计的完整数据链路：数据定义 → 存储初始化 → 前端埋点 → 管理后台展示。

## 需求拆解 & 处理逻辑

### R1: 统计数据定义与初始化

在 `public/data/site-config.js` 中增加 `_AL_STATS` 全局对象，包含以下字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| `today` | string | 当前日期（用于跨日自动重置） |
| `todayPageViews` | number | 今日访问量 |
| `todayModelQueries` | number | 今日型号查询量 |
| `todayPriceViews` | number | 今日回收价浏览（进入产品详情页） |
| `todayUnitWeightViews` | number | 今日单位重量浏览（进入产品详情页） |
| `todayPaidClicks` | number | 今日付费信息点击数 |
| `yesterdayPageViews` | number | 昨日访问量（用于增长率计算） |
| `yesterdayModelQueries` | number | 昨日型号查询量 |
| `yesterdayPriceViews` | number | 昨日回收价浏览 |
| `yesterdayUnitWeightViews` | number | 昨日单位重量浏览 |
| `yesterdayPaidClicks` | number | 昨日付费信息点击 |
| `pageViewsHistory` | array | 近7日访问量历史 `[{date, count}]` |
| `cumulativeModelQueries` | number | 累计型号查询（功能占比用） |
| `cumulativePriceViews` | number | 累计回收价浏览 |
| `cumulativeUnitWeightViews` | number | 累计单位重量浏览 |

**初始化逻辑**（在 site-config.js IIFE 中）：
1. 定义 `_AL_STATS` 默认值
2. 从 `localStorage.getItem('_AL_STATS_DATA')` 恢复
3. 跨日检测：若 `today` 不等于当天 → 将今日数据移至昨日，重置今日数据，保留历史趋势和累计数据
4. 暴露 `_AL_SAVE_STATS()` 持久化函数
5. 暴露跟踪函数：`_AL_TRACK_PAGE_VIEW`, `_AL_TRACK_MODEL_QUERY`, `_AL_TRACK_PRICE_VIEW`, `_AL_TRACK_UNIT_WEIGHT_VIEW`, `_AL_TRACK_PAID_CLICK`
6. 暴露 `_AL_GET_STATS()` 获取完整数据

### R2: 页面访问量埋点

**策略**：在 site-config.js 的 IIFE 末尾，自动检测当前页面是否属于 `miniprogram/` 目录，若是则延迟 200ms 后调用 `_AL_TRACK_PAGE_VIEW()`。

这样所有 mini-program 页面在加载时自动统计访问量，无需逐个页面手动添加 `_AL_TRACK_PAGE_VIEW()` 调用。

受影响的文件：
- `public/data/site-config.js`（新增自动检测逻辑）

### R3: 型号查询埋点

**触发点**：用户在搜索页面提交查询时。

受影响文件：`miniprogram/search-results.html`

修改位置：
1. `onSearchSubmit()` 函数中：当 `q` 不为空时，调用 `_AL_TRACK_MODEL_QUERY()`
2. 页面初始化渲染时（首次加载 URL 有 `?q=` 参数），调用 `_AL_TRACK_MODEL_QUERY()`

### R4: 回收价浏览 & 单位重量浏览埋点

**触发点**：用户进入型号产品详情页时（`product.html` 成功加载产品数据后）。

受影响文件：`miniprogram/product.html`

修改位置：在产品数据渲染完成处（找到产品 `it` 后），调用：
- `_AL_TRACK_PRICE_VIEW()`
- `_AL_TRACK_UNIT_WEIGHT_VIEW()`

### R5: 付费信息点击埋点

**触发点**：用户点击"开通会员查看"锁标时。

受影响文件：`public/data/site-config.js`

修改位置：在 `_AL_lockClick()` 函数体中，在最前面（redirect 逻辑之前）调用 `_AL_TRACK_PAID_CLICK()`。

这样所有通过 `_AL_lockBadge` 生成的锁标以及手动绑定的 `onclick="_AL_lockClick(event)"` 点击都会被统计。

### R6: 管理后台动态展示

受影响文件：`admin/manage.html`

修改内容：
1. 在页面加载时从 `localStorage` 读取 `_AL_STATS_DATA` 数据
2. 用动态数据替换四个统计卡片的硬编码数字
3. 计算增长率（与昨日对比）
4. **移除"查看含量"** 功能模块使用占比中的条目和对应的 SVG 圆环段
5. 调整功能模块使用占比圆环为 3 段（查型号、看回收价、查看单位重量）

注意：admin/manage.html 未引用 site-config.js，因此需在 manage.html 的 `<script>` 中直接读取 localStorage。

## 架构与技术方案

### 数据流

```
site-config.js (定义 _AL_STATS + 初始化 localStorage)
    │
    ├─ auto (page view) ──────────────────────→ localStorage.setItem('_AL_STATS_DATA')
    │
    ├─ search-results.html (_AL_TRACK_MODEL_QUERY) → localStorage
    │
    ├─ product.html (_AL_TRACK_PRICE_VIEW + UNIT_WEIGHT_VIEW) → localStorage
    │
    └─ _AL_lockClick (_AL_TRACK_PAID_CLICK) → localStorage
                                                    │
                                                    ▼
                                        admin/manage.html (读取 localStorage → 动态渲染)
```

### 跨日重置策略

- 每次 site-config.js 加载时检查 `_AL_STATS.today` 是否等于 `new Date().toDateString()`
- 不等则表示新的一天：当前数据作为昨日数据存档，当日数据归零
- `pageViewsHistory` 保留最近 7 天记录，超出的丢弃

## 受影响文件清单

| 文件路径 | 修改类型 | 修改内容 |
|---|---|---|
| `public/data/site-config.js` | 新增代码 | 新增 `_AL_STATS` 初始化、localStorage 恢复/跨日重置、5 个跟踪函数、`_AL_GET_STATS()`；在 `_AL_lockClick` 中插入付费点击统计；末尾新增 mini-program 页面自动访问量统计 |
| `miniprogram/search-results.html` | 新增调用 | 在 `onSearchSubmit()` 和首次渲染处调用 `_AL_TRACK_MODEL_QUERY()` |
| `miniprogram/product.html` | 新增调用 | 在加载到产品 `it` 后调用 `_AL_TRACK_PRICE_VIEW()` 和 `_AL_TRACK_UNIT_WEIGHT_VIEW()` |
| `admin/manage.html` | 修改动态数据 | 4 个统计卡片改为从 localStorage 动态读取；移除"查看含量"条目；调整功能模块使用占比圆环为 3 段 |

## 边界条件与异常处理

- localStorage 不可用时（隐私模式等），所有 try-catch 静默降级
- 跨日首次访问时，yesterday 数据可能为 0，增长率显示为 `-` 或 `--`
- 历史数据不足 7 天时，图表只显示已有数据
- 累计数据无限增长，不做清理（用于功能占比计算）
- 多人共享同一浏览器时统计数据会混叠（原型阶段可接受）

## 预期效果

1. 用户访问 mini-program 任一页面 → 今日访问量+1
2. 用户搜索型号 → 型号查询量+1，累计型号查询+1
3. 用户进入产品详情页 → 回收价浏览+1，单位重量浏览+1
4. 用户点击"开通会员查看"锁标 → 付费信息点击+1
5. 管理员打开后台首页 → 看到实时更新的统计数据
6. 功能模块使用占比中不再显示"查看含量"
