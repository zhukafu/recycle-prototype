# 修复 admin/business.html 页面记录数显示问题

- [x] Task 1: 为 business.html 添加动态计数逻辑
    - 1.1: 在现有 `<script type="module">` 中的 recycle-count 逻辑之后，添加填充 `#summary-model-count` 和 `#catalog-count` 的逻辑（读取 `window._AL_PRODUCTS.length`）
    - 1.2: 添加填充 `#category-count` 的逻辑（读取 `window._AL_CATS.getVisible().length`）
    - 1.3: 添加填充 `#summary-quote-count` 和 `#quote-count` 的逻辑（读取 `window._AL_QUOTES.getAllQuotes().length`）
    - 1.4: 添加填充 `#article-count` 的逻辑（读取 `window._AL_ARTICLES.getAllArticles().length`）
    - 1.5: 保护所有计数填充代码不被未加载的数据源影响（使用 `if (window.xxx)` 判断）
