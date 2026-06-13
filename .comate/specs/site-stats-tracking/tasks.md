# 站点统计数据埋点与展示 - 任务计划

- [x] Task 1: 在 site-config.js 中新增 `_AL_STATS` 统计数据定义与存储
- [x] Task 2: 在 site-config.js 中的 `_AL_lockClick` 埋入付费点击统计
- [x] Task 3: 在 site-config.js 末尾添加 mini-program 页面自动访问量统计
- [x] Task 4: 在 search-results.html 中埋入型号查询统计
- [x] Task 5: 在 product.html 中埋入回收价和单位重量浏览统计
- [x] Task 6: 改造 admin/manage.html 从 localStorage 动态读取统计数据
    - 6.1: 在现有 script 内从 `localStorage.getItem('_AL_STATS_DATA')` 读取数据
    - 6.2: 用动态数据替换 4 个统计卡片中的硬编码数字（今日访问量、型号查询量、回收价浏览量、付费信息点击）
    - 6.3: 计算各个指标的增长率（与昨日对比），若无昨日数据则显示 `--`
    - 6.4: 移除"查看含量"条目及相关 SVG 圆环段
    - 6.5: 调整功能模块使用占比圆环为 3 段（查型号、看回收价、查看单位重量），重新计算 stroke-dasharray 和 stroke-dashoffset
    - 6.6: 更新总交互数和各功能百分比基于累计统计值计算
