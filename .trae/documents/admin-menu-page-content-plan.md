# 基于小程序付费信息规划后台菜单与页面内容实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 `/Users/zhudb/Desktop/recycle-prototype/admin/` 的菜单和页面内容准确承接 `/Users/zhudb/Desktop/recycle-prototype/miniprogram/` 的前台内容，重点管理型号、分类、回收价、金属含量、单位重量等付费信息字段。

**Architecture:** 保留现有后台 5 个一级导航：首页、业务管理、数据运营、系统、我的；不再规划“询价/客资转化”功能。后台二级菜单围绕“型号与产品、回收价与行情、付费信息、内容运营、用户与权限、站点配置”组织。缺少独立付费信息页面时，优先通过现有 `catalog-list.html`、`catalog-edit.html`、`quote-list.html`、`quote-edit.html`、`user-list.html` 承接，不新增 HTML 页面。

**Tech Stack:** 静态 HTML 原型、Tailwind CDN、原生 JavaScript、现有公共组件 `/src/components/admin-topbar.js` 与 `/src/components/admin-bottom-nav.js`。

---

## Summary

本计划基于只读探索和最新澄清，将后台规划从“询价/客资”调整为“付费信息设置与管理”：

- 小程序首页 `miniprogram/index.html` 聚合了搜索、查型号、看报价、学技术、行情与联系入口。
- 小程序分类与产品页 `miniprogram/category.html`、`miniprogram/product.html` 是后台管理重点，需要管理型号、分类、品牌、图片、回收价、单位重量、金属含量等字段。
- 小程序产品详情中的 VIP 锁区是核心付费内容，包括银点铜回收价、单位重量、金属含量、产品说明等。
- 小程序行情页 `miniprogram/quote-list.html` 需要后台管理贵金属、有色金属、稀有金属、黑色金属、废料等行情分类。
- 小程序技术交流 `miniprogram/tecexc.html` 与资讯详情/列表需要后台管理行业资讯、回收知识、公告、关于内容。
- 不规划询价功能；现有 `admin/inquiry-list.html` 与 `admin/inquiry-detail.html` 不作为后台主菜单重点入口。

---

## Current State Analysis

### 小程序当前业务结构

1. `miniprogram/index.html`
   - 页面标题为“今日行情”。
   - 包含品牌介绍、首页搜索、三个功能入口：查型号、看报价、学技术。
   - 搜索跳转 `search-results.html`。
   - 功能入口分别跳转：`contactors.html`、`category.html`、`tecexc.html`。
   - 包含技术文章预览、今日行情、联系我们内容。

2. `miniprogram/category.html`
   - 左侧是品牌/品类分类：富士、三菱、士林、伊顿、国产接触器、断路器、熔断器、银触点、正泰、德力西、施耐德、西门子等。
   - 右侧动态渲染产品列表，产品跳转 `product.html?id=...`。
   - 后台需要承接品牌、品类、标签、型号、图片、上下架、排序。

3. `miniprogram/product.html`
   - 产品详情包含产品图、型号、品牌规格、关键参数。
   - 付费/VIP 锁区包括：
     - 银点铜回收价
     - 单位重量
     - 金属含量
     - 产品说明或拆解价值信息
   - 后台需要承接产品基础字段和付费字段的可见性配置。

4. `miniprogram/quote-list.html`
   - 金属行情分类为：贵金属、有色金属、稀有金属、黑色金属、废料。
   - 每条行情包含名称、编码、单位、价格、涨跌、百分比、备注、更新时间。
   - 后台报价管理需要与这些字段对齐。

5. `miniprogram/tecexc.html`
   - 技术交流入口包含公告、关于铝老板、行业资讯、回收知识。
   - 内容列表/详情通过文章数据驱动。
   - 后台需要承接文章类型、公告、推荐、热门、浏览/评论/点赞展示字段。

6. `miniprogram/contacts.html`
   - 当前页面虽然展示表单样式，但本轮不规划询价/提交审核功能。
   - 后台只需承接联系信息展示配置，例如电话、微信、地址、地图、客服入口文案。

### 后台当前结构

1. `admin/manage.html`
   - 当前是后台首页/仪表盘。
   - 顶部 Tab 包含：首页、型号管理、报价管理、技术教程、行情数据、用户管理。
   - 已有统计卡片、快捷入口、访问趋势、模块使用占比。
   - 需要补充“付费字段浏览 / VIP 解锁 / 回收价更新”等指标文案。

2. `admin/business.html`
   - 当前是业务管理总入口。
   - 入口平铺：型号管理、报价管理、分类管理、资讯管理、询价管理、公告管理、账号管理。
   - 需要移除或弱化“询价管理”，改成按业务对象分组：型号与产品、回收价与行情、付费信息、内容运营、用户与权限、站点配置。

3. `admin/data.html`
   - 当前包含询价、报价、型号查询、活跃用户、白银走势、询价占比、今日行情、数据明细。
   - 需要去掉询价口径，改为：搜索、型号点击、报价浏览、付费信息点击、VIP 解锁/开通、内容阅读。

4. `admin/system.html`
   - 当前包含基础设置、安全设置、数据管理、危险操作。
   - 需要明确承接站点信息、联系方式、小程序首页配置、付费字段开关说明。

5. `admin/mine.html`
   - 当前作为个人中心和快捷入口。
   - 探索发现“系统设置”入口应链接 `system.html`，不应与退出登录一样跳 `index.html`。
   - 需要与业务管理入口保持一致，避免出现“询价管理”等不符合业务现状的入口。

6. `src/components/admin-bottom-nav.js`
   - 当前一级导航为：首页、业务管理、数据运营、系统、我的。
   - 该结构可保留，不建议在本轮拆分一级导航。

---

## Proposed Changes

### Task 1: 保留后台一级导航，只校准二级菜单命名

**Files:**
- Review only: `/Users/zhudb/Desktop/recycle-prototype/src/components/admin-bottom-nav.js`

**Decision:**
- 不修改一级导航结构。
- 保留：`首页`、`业务管理`、`数据运营`、`系统`、`我的`。
- 后台二级分组统一为：
  - 型号与产品
  - 回收价与行情
  - 付费信息
  - 内容运营
  - 用户与权限
  - 站点配置

- [ ] **Step 1: 确认无需修改组件**
  - 检查 `ITEMS` 仍为：
    - `home -> manage.html`
    - `business -> business.html`
    - `data -> data.html`
    - `system -> system.html`
    - `mine -> mine.html`
  - 不改动该文件。

### Task 2: 重组业务管理页为“付费信息管理”导向的菜单总入口

**Files:**
- Modify: `/Users/zhudb/Desktop/recycle-prototype/admin/business.html`

**What:**
将当前平铺入口改为分组式菜单，移除“询价管理”的主入口位置，突出回收价、含量、单位重量等付费信息设置。

**Why:**
用户明确当前没有询价功能，核心后台能力应围绕付费信息字段的设置与管理。

**How:**

- [ ] **Step 1: 修改顶部说明文案**
  - 标题保留“业务管理”。
  - 描述改为：`管理小程序核心内容：型号库、回收价、含量/重量等付费信息、行情与技术内容。`
  - 顶部统计建议改为：
    - 型号总数 128
    - 付费字段 4 类
    - 行情报价 42

- [ ] **Step 2: 将入口列表改为 6 个业务分组**

  1. 型号与产品
     - `型号管理` -> `catalog-list.html`
       - 说明：接触器型号库、产品详情、图片、上下架
     - `分类管理` -> `category-list.html`
       - 说明：品牌、品类、标签、首页分类筛选

  2. 回收价与行情
     - `报价管理` -> `quote-list.html`
       - 说明：金属行情、废料行情、产品回收价

  3. 付费信息
     - `付费字段设置` -> `catalog-list.html`
       - 说明：银点铜回收价、单位重量、金属含量、说明内容
     - `付费权限用户` -> `user-list.html`
       - 说明：会员状态、到期时间、查看权限

  4. 内容运营
     - `资讯管理` -> `article-list.html`
       - 说明：行业资讯、回收知识、关于铝老板
     - `公告管理` -> `announcement-list.html`
       - 说明：首页通知、技术交流公告、置顶内容

  5. 用户与权限
     - `账号管理` -> `user-list.html`
       - 说明：管理员账号、普通用户、会员权限

  6. 站点配置
     - `联系方式配置` -> `system.html`
       - 说明：电话、微信、地址、地图、客服入口
     - `首页配置` -> `announcement-list.html`
       - 说明：首页通知、推荐内容、行情展示入口

- [ ] **Step 3: 处理现有询价入口**
  - 不在 `business.html` 的主菜单中展示 `询价管理`。
  - 如果保留 `admin/inquiry-list.html` 文件，不删除文件，只是不作为当前业务主入口。

- [ ] **Step 4: 保持页面现有视觉风格**
  - 继续使用现有 Tailwind 类、白色卡片、圆角、图标。
  - 不引入新依赖。
  - 不新增文件。

### Task 3: 调整后台首页仪表盘内容

**Files:**
- Modify: `/Users/zhudb/Desktop/recycle-prototype/admin/manage.html`

**What:**
让仪表盘指标、Tab、快捷入口与“型号 + 回收价 + 付费信息 + 内容”对齐。

**Why:**
`manage.html` 当前指标偏通用，且存在可能被理解为询价/客资的统计，应改为付费信息运营指标。

**How:**

- [ ] **Step 1: 调整顶部 Tab 文案**
  - `技术教程` 改为 `内容运营`，仍链接 `article-list.html`。
  - `报价管理` 保留，链接 `quote-list.html`。
  - `行情数据` 可保留，链接 `data.html`。
  - `用户管理` 可保留，链接 `user-list.html`。

- [ ] **Step 2: 调整统计卡片**
  - 保留 4 张卡片布局。
  - 建议卡片改为：
    1. 今日访问量
    2. 型号查询量
    3. 回收价浏览量
    4. 付费信息点击

- [ ] **Step 3: 调整快捷入口**
  - 快捷入口应覆盖：
    - 型号管理 -> `catalog-list.html`
    - 回收价管理 -> `quote-list.html`
    - 分类管理 -> `category-list.html`
    - 付费字段 -> `catalog-list.html`
    - 内容运营 -> `article-list.html`
    - 公告配置 -> `announcement-list.html`
    - 用户权限 -> `user-list.html`
    - 站点配置 -> `system.html`

- [ ] **Step 4: 调整图表/模块占比文案**
  - 模块使用占比建议显示：
    - 查型号
    - 看回收价
    - 查看含量
    - 查看单位重量
    - 技术交流

### Task 4: 扩展数据运营页指标口径，移除询价概念

**Files:**
- Modify: `/Users/zhudb/Desktop/recycle-prototype/admin/data.html`

**What:**
将当前数据运营页从“询价 + 报价”调整为“搜索 + 型号 + 回收价 + 付费信息 + 内容”。

**Why:**
当前没有询价功能，数据运营应围绕付费内容消费链路。

**How:**

- [ ] **Step 1: 调整核心指标卡片**
  - 当前 4 张核心指标改为：
    1. 今日搜索量
    2. 回收价浏览量
    3. 型号查询量
    4. 付费信息点击

- [ ] **Step 2: 保留白银走势图，但改为“回收价近30日走势”**
  - 标题从 `白银价格近30日走势` 改为 `回收价近30日走势`。
  - 下拉选项可保留近 7/30/90 日。

- [ ] **Step 3: 将“各品类询价占比”改为“付费内容访问占比”**
  - 占比项建议为：
    - 银点铜回收价
    - 单位重量
    - 金属含量
    - 产品说明

- [ ] **Step 4: 扩展数据明细入口**
  - 保留：报价数据 -> `quote-list.html`
  - 将：询价记录 -> 改为 `付费字段`，链接 `catalog-list.html`
  - 增加：内容数据 -> `article-list.html`
  - 增加：用户权限 -> `user-list.html`

### Task 5: 扩展系统设置页承接站点配置与付费开关说明

**Files:**
- Modify: `/Users/zhudb/Desktop/recycle-prototype/admin/system.html`

**What:**
在系统设置中明确展示站点信息、联系方式、小程序配置、付费信息展示规则。

**Why:**
小程序首页、联系我们入口和产品详情 VIP 锁区需要后台配置说明。

**How:**

- [ ] **Step 1: 调整基础设置分组**
  - 保留 `站点信息`。
  - 将 `邮件通知` 调整为 `联系方式`。
  - 将 `定时任务` 调整为 `行情刷新`。
  - 将 `小程序配置` 的说明扩展为首页入口和付费信息展示规则。

- [ ] **Step 2: 增加或修改说明文字**
  - `站点信息` 状态：`品牌/首页文案`
  - `联系方式` 状态：`电话/微信/地址`
  - `行情刷新` 状态：`报价定时更新`
  - `小程序配置` 状态：`首页入口/付费锁区`

- [ ] **Step 3: 保持链接策略**
  - 若无对应配置详情页，链接保持 `#`。
  - 不新增配置页面。

### Task 6: 校准我的页快捷入口与错误链接

**Files:**
- Modify: `/Users/zhudb/Desktop/recycle-prototype/admin/mine.html`

**What:**
修正系统设置入口链接，并让我的页快捷入口与业务管理保持一致。

**Why:**
我的页不应出现与业务现状不符的“询价”重点入口；系统设置应跳转 `system.html`，退出登录才跳登录页 `index.html`。

**How:**

- [ ] **Step 1: 修正系统设置链接**
  - 将“系统设置”入口 href 从 `index.html` 改为 `system.html`。

- [ ] **Step 2: 保留退出登录链接**
  - “退出登录”继续链接 `index.html`。

- [ ] **Step 3: 调整快捷入口命名**
  - 若页面中存在业务入口，命名统一为：
    - 型号与产品
    - 回收价与行情
    - 付费信息
    - 内容运营
    - 用户与权限
    - 系统设置

### Task 7: 校准报价、型号、分类、内容相关列表页文案

**Files:**
- Modify if necessary: `/Users/zhudb/Desktop/recycle-prototype/admin/quote-list.html`
- Modify if necessary: `/Users/zhudb/Desktop/recycle-prototype/admin/catalog-list.html`
- Modify if necessary: `/Users/zhudb/Desktop/recycle-prototype/admin/catalog-edit.html`
- Modify if necessary: `/Users/zhudb/Desktop/recycle-prototype/admin/category-list.html`
- Modify if necessary: `/Users/zhudb/Desktop/recycle-prototype/admin/article-list.html`
- Modify if necessary: `/Users/zhudb/Desktop/recycle-prototype/admin/announcement-list.html`

**What:**
对已有列表页的标题、说明、筛选项做轻量校准，使其与前台字段一致。

**Why:**
小程序产品详情的付费字段是核心，后台列表和编辑页需要明确体现这些字段。

**How:**

- [ ] **Step 1: 报价管理页校准**
  - 应体现行情分类：贵金属、有色金属、稀有金属、黑色金属、废料。
  - 应体现字段：名称、编码、单位、价格、涨跌、更新时间、备注。
  - 文案使用“回收价/行情”，不使用“询价”。

- [ ] **Step 2: 型号管理页校准**
  - 应体现字段：品牌、品类、标签、型号、产品图、上架状态、VIP 字段。
  - 付费字段包括：银点铜回收价、单位重量、金属含量、产品说明。

- [ ] **Step 3: 型号编辑页校准**
  - 编辑表单应优先规划以下字段：
    - 基础信息：型号、品牌、分类、规格、标签、产品图
    - 回收价：普通展示价、银点铜回收价
    - 付费信息：单位重量、金属含量、拆解说明
    - 权限设置：是否会员可见、是否上架、排序

- [ ] **Step 4: 分类管理页校准**
  - 应体现小程序左侧分类：品牌接触器、开关、断路器、熔断器、银触点价格等。

- [ ] **Step 5: 内容管理页校准**
  - 应体现内容类型：行业资讯、回收知识、关于铝老板、公告。
  - 应体现运营字段：推荐、热门、浏览、评论、点赞。

- [ ] **Step 6: 公告管理页校准**
  - 应体现：首页通知、技术交流通知、置顶公告。

---

## Assumptions & Decisions

1. 本轮只规划并调整后台已有页面，不新增 HTML 文件。
2. 明确不规划询价功能，不把 `inquiry-list.html` 作为主业务入口。
3. 付费信息的主承接页面为 `catalog-list.html` / `catalog-edit.html`，因为付费字段依附于具体型号/产品。
4. 回收价和行情的主承接页面为 `quote-list.html` / `quote-edit.html`。
5. 会员/权限的主承接页面为 `user-list.html`，不新增会员订单页面。
6. 后台一级导航保持不变，避免影响所有页面的公共导航组件。
7. 页面仍保持移动端优先的静态原型风格，继续使用 Tailwind CDN 与现有 SVG 图标。
8. 不接入真实后端，不新增数据接口；所有数值仍为原型展示数据。

---

## Verification Steps

执行完成后按以下步骤检查：

1. 打开 `admin/business.html`
   - 确认业务菜单已按 6 个业务分组展示。
   - 确认主菜单不再突出“询价管理”。
   - 确认存在“付费信息”分组，且包含银点铜回收价、单位重量、金属含量等说明。
   - 点击已有链接，应跳到对应后台页面。

2. 打开 `admin/manage.html`
   - 确认顶部 Tab 中“技术教程”已调整为“内容运营”。
   - 确认统计卡片和快捷入口覆盖型号、回收价、付费字段、内容、用户权限、系统配置。
   - 确认没有“询价/客资”作为核心指标。

3. 打开 `admin/data.html`
   - 确认指标覆盖搜索、回收价、型号、付费信息点击。
   - 确认“各品类询价占比”已调整为“付费内容访问占比”。
   - 确认数据明细入口不再出现“询价记录”作为主入口。

4. 打开 `admin/system.html`
   - 确认基础设置明确包含站点信息、联系方式、行情刷新、小程序配置。
   - 确认小程序配置说明包含“付费锁区”。

5. 打开 `admin/mine.html`
   - 确认“系统设置”跳转 `system.html`。
   - 确认“退出登录”仍跳转 `index.html`。
   - 确认快捷入口不突出“询价”。

6. 检查后台公共底部导航
   - 首页、业务管理、数据运营、系统、我的均可访问。
   - 当前激活态不受影响。

7. 静态验证
   - 页面无明显 HTML 结构破损。
   - 无控制台模块导入错误。
   - 移动端底部导航不遮挡主要内容。
