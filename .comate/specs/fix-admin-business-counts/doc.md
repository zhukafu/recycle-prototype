# doc.md — 修复 admin/business.html 页面记录数显示问题

## 问题描述

`admin/business.html` 页面上多个 item 的记录数显示不正确：

| 元素 ID | 当前显示 | 预期 | 问题 |
|---------|---------|------|------|
| `#summary-model-count` | `0` | 产品总数 | 未填充动态数据，显示初始假数据 `0` |
| `#summary-quote-count` | `0` | 报价总数 | 未填充动态数据，显示初始假数据 `0` |
| `#catalog-count` | `0` | 产品/型号总数 | 未填充动态数据，显示初始假数据 `0` |
| `#category-count` | `0` | 分类总数 | 未填充动态数据，显示初始假数据 `0` |
| `#quote-count` | `0` | 报价总数 | 未填充动态数据，显示初始假数据 `0` |
| `#article-count` | `0` | 文章总数 | 未填充动态数据，显示初始假数据 `0` |
| `#user-count` | `12` | 用户总数 | 硬编码假数据 `12` |

## 数据源分析

页面已通过 `<script>` 标签加载了 4 个数据文件：

```html
<script src="/data/contacts.js"></script>   <!-- window._AL_PRODUCTS -->
<script src="/data/categories.js"></script>  <!-- window._AL_CATS -->
<script src="/data/quotes.js"></script>      <!-- window._AL_QUOTES -->
<script src="/data/articles.js"></script>    <!-- window._AL_ARTICLES -->
```

各数据源提供的可用 API：

| 数据源 | 全局变量 | 获取总数的 API |
|--------|---------|---------------|
| contacts.js | `window._AL_PRODUCTS` | `_AL_PRODUCTS.length` |
| categories.js | `window._AL_CATS` | `_AL_CATS.getVisible().length` |
| quotes.js | `window._AL_QUOTES` | `_AL_QUOTES.getAllQuotes().length` |
| articles.js | `window._AL_ARTICLES` | `_AL_ARTICLES.getAllArticles().length` |

用户数据初始硬编码在 `user-list.html` 中，没有全局数据源。但 `admin/business.html` 未加载任何用户数据文件，**用户数据没有可供引用的全局变量**。

## 修复方案

在 `admin/business.html` 底部现有的 `<script type="module">` 中（第 125-145 行），增加动态填充各计数的逻辑。

### 受影响文件

- `/Users/zhudb/Desktop/recycle-prototype/admin/business.html`

### 具体修改

在当前 `try` 块的 `recycle-count` 逻辑之后，增加其他计数填充逻辑。

#### 修改后的脚本代码

```javascript
<script type="module">
    import { mountAdminTopbar } from '/src/components/admin-topbar.js';
    import { mountAdminBottomNav } from '/src/components/admin-bottom-nav.js';

    mountAdminTopbar('#admin-topbar', {
        title: '业务管理',
        back: false,
        onAvatar: () => location.href = '/admin/manage.html',
    });
    mountAdminBottomNav('#admin-bottom-nav', { active: 'business' });

    // 动态显示回收记录数
    try {
        const raw = localStorage.getItem('recycle_submissions') || '[]';
        const list = JSON.parse(raw);
        const el = document.getElementById('recycle-count');
        if (el) el.textContent = Array.isArray(list) ? list.length : 0;
    } catch (e) {
        const el = document.getElementById('recycle-count');
        if (el) el.textContent = 0;
    }

    // ==== 以下为新增：动态填充各统计数据 ====

    // 1. 型号/产品总数
    if (window._AL_PRODUCTS) {
        document.getElementById('summary-model-count').textContent = _AL_PRODUCTS.length;
        document.getElementById('catalog-count').textContent = _AL_PRODUCTS.length;
    }

    // 2. 分类总数（仅统计可见分类）
    if (window._AL_CATS) {
        document.getElementById('category-count').textContent = _AL_CATS.getVisible().length;
    }

    // 3. 行情报价总数
    if (window._AL_QUOTES) {
        const allQuotes = _AL_QUOTES.getAllQuotes();
        document.getElementById('summary-quote-count').textContent = allQuotes.length;
        document.getElementById('quote-count').textContent = allQuotes.length;
    }

    // 4. 文章总数
    if (window._AL_ARTICLES) {
        document.getElementById('article-count').textContent = _AL_ARTICLES.getAllArticles().length;
    }

    // 5. 用户总数 - user-list.html 中硬编码了 12 个用户，但没有全局数据源
    // 保持当前硬编码值 12，或后续添加用户数据源后再动态更新
</script>
```

### 边界条件与异常处理

- 所有数据源均通过 `if (window.xxx)` 保护，防止数据文件未加载时报错
- `getAllArticles()` 等方法内部已有 try-catch 保护
- 元素通过 `getElementById` 获取，若页面结构变更不存在时静默跳过

### 预期效果

页面加载后各计数正常显示：

| 元素 ID | 预期值 | 数据来源 |
|---------|--------|---------|
| `#summary-model-count` | 43 | `_AL_PRODUCTS.length`（contacts.js 中 43 条产品） |
| `#summary-quote-count` | 26 | `_AL_QUOTES.getAllQuotes().length` |
| `#catalog-count` | 43 | 同 `_AL_PRODUCTS.length` |
| `#category-count` | 25 | `_AL_CATS.getVisible().length`（25 个可见分类） |
| `#quote-count` | 26 | 同 `_AL_QUOTES.getAllQuotes().length` |
| `#article-count` | 46 | `_AL_ARTICLES.getAllArticles().length` |
| `#user-count` | 12 | 保持硬编码（无用户数据源） |
