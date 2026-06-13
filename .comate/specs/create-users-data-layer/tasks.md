# 创建用户数据层并接入业务管理动态计数

- [✓] Task 1: 创建 `public/data/users.js` 数据文件
    - 1.1: 定义 6 个初始用户数据（与现有 user-list.html 硬编码一致）
    - 1.2: 实现 `getAll()`、`getById()`、`getPaid()`、`getDisabled()` 查询方法
    - 1.3: 实现 `add()`、`update()`、`toggleDisabled()`、`remove()` 变更方法
    - 1.4: 实现 `getSummary()` 和 `reset()` 方法
    - 1.5: 暴露 `window._AL_USERS` API 对象，自动初始化 localStorage

- [✓] Task 2: 更新 `admin/business.html` 账号管理计数为动态
    - 2.1: 在 `<head>` 中添加 `<script src="/data/users.js"></script>`
    - 2.2: 将 `#user-count` 从硬编码 `12` 改为读取 `_AL_USERS.getAll().length`

- [✓] Task 3: 重构 `admin/user-list.html` 为数据驱动渲染
    - 3.1: 在 `<head>` 中添加 `<script src="/data/users.js"></script>`
    - 3.2: 移除 HTML 中硬编码的 6 个 `.user-card` 卡片
    - 3.3: 实现 `buildUserCard(user)` 函数，根据用户数据生成卡片 DOM
    - 3.4: 实现 `renderUserList(users)` 函数，渲染整个列表并绑定 more-btn 事件
    - 3.5: 改造禁用/解除禁用操作，同步调用 `_AL_USERS.toggleDisabled(id)`
    - 3.6: 改造编辑保存操作，同步调用 `_AL_USERS.update(id, patch)`
    - 3.7: 页面初始化时调用 `renderUserList(_AL_USERS.getAll())`
