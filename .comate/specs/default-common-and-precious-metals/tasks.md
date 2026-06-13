# Default common flag for first 10 products & precious metals only in quotes config

- [✓] Task 1: 给 contacts.js 前 10 个产品添加 common: true
    - 1.1: 在 c1-c7 产品对象中添加 common: true
    - 1.2: 在 c8-c10 产品对象中添加 common: true

- [✓] Task 2: 修改 quotes.js 默认配置只展示贵金属
    - 2.1: 将 DEFAULT_CONFIG.displayMetals 从空数组改为贵金属 ID 列表

- [✓] Task 3: 修改 system.html 行情面板初始化默认只勾选贵金属
    - 3.1: 在 buildQuotesPanelContent() 中将 checkbox checked 条件改为仅 precious 分类
