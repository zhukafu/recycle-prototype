# doc.md — 创建用户数据层并接入业务管理动态计数

## 需求概述

1. 在 `public/data/` 下新建 `users.js`，初始化用户数据到 localStorage
2. `admin/business.html` 的账号管理数量改为从该数据源动态读取
3. `admin/user-list.html` 的所有用户操作（编辑、禁用）改为基于 localStorage 数据层进行

## 架构设计

与其他数据文件（`categories.js`、`quotes.js`、`articles.js`）采用相同的 IIFE 模式：
- 自执行函数初始化 localStorage 默认数据
- 暴露 `window._AL_USERS` API 对象给全局
- 所有变更操作读写 localStorage

## 数据格式

每个用户对象结构：

```js
{
  id: string,          // 唯一标识
  name: string,        // 昵称
  phone: string,       // 手机号
  avatarChar: string,  // 头像显示文字
  avatarGradient: string, // 头像渐变色
  vip: string,         // 会员类型："无" | "体验版" | "全品类初级" | "全品类高级 30 天" | "全品类高级一年" | "初级年会员"
  expire: string,      // 会员到期日，付费用户有值
  regDate: string,     // 注册日期
  paid: boolean,       // 是否付费
  disabled: boolean    // 是否禁用
}
```

初始数据共 6 个用户，与现有 `user-list.html` 的硬编码数据一致。

## 受影响文件

### 1. 新建 `public/data/users.js`

**路径**: `/Users/zhudb/Desktop/recycle-prototype/public/data/users.js`

暴露的 API 方法：

| 方法 | 说明 |
|------|------|
| `getAll()` | 获取所有用户 |
| `getById(id)` | 按 ID 获取用户 |
| `getPaid()` | 获取付费用户 |
| `getDisabled()` | 获取已禁用用户 |
| `add(user)` | 新增用户 |
| `update(id, patch)` | 更新用户字段 |
| `toggleDisabled(id)` | 切换禁用/启用状态 |
| `remove(id)` | 删除用户（保留） |
| `getSummary()` | 返回 `{ total, paidCount, disabledCount }` |
| `reset()` | 重置为初始数据 |

### 2. 修改 `admin/business.html`

- 在 `<head>` 中添加 `<script src="/data/users.js"></script>`
- 在脚本中将 `#user-count` 的硬编码 `12` 改为读取 `_AL_USERS.getSummary().total`

### 3. 修改 `admin/user-list.html`

- 在 `<head>` 中添加 `<script src="/data/users.js"></script>`
- **移除** HTML 中硬编码的 6 个 `.user-card`（约第 80-195 行）
- **新增** JS 渲染函数 `renderUserList()`，从 `_AL_USERS.getAll()` 循环生成卡片
- **改造** 所有操作（禁用/解除禁用、编辑保存）同时同步到 `_AL_USERS` API
- 保留 tab 切换、搜索过滤、操作弹窗、编辑弹窗的 UI 行为不变

渲染函数的核心逻辑：

```js
function renderUserList(users) {
  const container = document.getElementById('user-list');
  container.innerHTML = '';
  users.forEach(u => {
    const card = buildUserCard(u);
    container.appendChild(card);
  });
  // 重新绑定 more-btn 事件
  bindMoreButtons();
}
```

禁用/启用操作时，在修改 DOM 后同步调用 `_AL_USERS.toggleDisabled(id)`。

编辑保存时，在修改 DOM 后同步调用 `_AL_USERS.update(id, patch)`。

## 边界条件

- 所有数据文件未加载时，通过 `if (window._AL_USERS)` 保护
- localStorage 数据为空或损坏时自动回退到默认数据
- 编辑弹窗中保存失败时不影响 DOM 状态

## 预期效果

| 场景 | 效果 |
|------|------|
| 业务管理页加载 | 账号管理显示 `6`（实际用户数） |
| user-list.html 禁用用户 | 页面更新 + localStorage 持久化 |
| user-list.html 编辑用户 | 页面更新 + localStorage 持久化 |
| 刷新页面前后的数据一致性 | 数据从 localStorage 恢复 |
