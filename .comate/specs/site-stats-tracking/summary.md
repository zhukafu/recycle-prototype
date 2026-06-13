# 站点统计数据埋点与展示 - 执行总结

## 完成情况

所有 6 个任务已全部完成。

### 任务 1-3: `public/data/site-config.js`

- 新增 `window._AL_STATS` 统计数据定义，包含今日/昨日 5 类指标（访问量、型号查询、回收价浏览、单位重量浏览、付费信息点击）
- 新增 `pageViewsHistory` 近 7 天趋势数据及 `cumulative*` 累计统计
- 实现 `_AL_initStats()` 从 localStorage 恢复并跨日自动重置
- 暴露 5 个跟踪函数：`_AL_TRACK_PAGE_VIEW`、`_AL_TRACK_MODEL_QUERY`、`_AL_TRACK_PRICE_VIEW`、`_AL_TRACK_UNIT_WEIGHT_VIEW`、`_AL_TRACK_PAID_CLICK`
- 在 `_AL_lockClick` 中埋入付费点击统计
- 末尾自动检测 mini-program 页面并统计访问量

### 任务 4: `miniprogram/search-results.html`

- 首次加载 URL 携带 `?q=` 时调用 `_AL_TRACK_MODEL_QUERY()`
- `onSearchSubmit()` 提交搜索时调用 `_AL_TRACK_MODEL_QUERY()`

### 任务 5: `miniprogram/product.html`

- 产品数据加载完成时调用 `_AL_TRACK_PRICE_VIEW()` 和 `_AL_TRACK_UNIT_WEIGHT_VIEW()`

### 任务 6: `admin/manage.html`

- 4 个统计卡片改为从 `localStorage.getItem('_AL_STATS_DATA')` 动态读取
- 自动计算各指标增长率并与昨日对比
- 移除了"查看含量"条目（蓝色圆环段 + 文字行）
- 功能模块占比圆环从 4 段改为 3 段（查型号/看回收价/查看单位重量）
- 各百分比和总交互数基于累计统计值动态计算
