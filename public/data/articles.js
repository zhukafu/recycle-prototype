/**
 * ═══════════════════════════════════════════════════════════════
 *  铝老板金属网 — 技术交流文章数据接口 v2.0
 * ═══════════════════════════════════════════════════════════════
 *
 * 【接口概览】
 *
 *  数据结构分为两层：
 *    ┌─────────────────────────────────────────┐
 *    │  articles: Article[]                     │ ← 统一文章列表
 *    │    ├─ section: "news"     行业资讯       │
 *    │    ├─ section: "knowledge" 回收知识      │
 *    │    │                                      │
 *    │    ├─ displayRole: ""        普通文章    │
 *    │    ├─ displayRole: "notice"  通知公告    │ ← 从 news/knowledge 中指定
 *    │    └─ displayRole: "about"   关于铝老板  │ ← 从 news/knowledge 中指定
 *    │                                         │
 *    └─────────────────────────────────────────┘
 *    ┌─────────────────────────────────────────┐
 *    │  displayConfig: object                  │ ← 后台「公告管理」配置
 *    │    ├─ noticeIds: string[]               │ ← 顶部公告栏展示的文章ID列表
 *    │    ├─ carouselIds: string[]             │ ← 首页轮播图关联的文章ID列表
 *    │    └─ aboutId: string | null            │ ← 关于页关联的文章ID
 *    └─────────────────────────────────────────┘
 *
 * 【排序规则】
 *    列表按 weight（降序）→ sortOrder（升序）→ date（降序）排列。
 *    weight 越大越靠前；同 weight 时 sortOrder 小的排前面。
 *
 * 【API 方法】
 *    getData()              → 获取完整原始数据对象
 *    getArticles(section)   → 按板块获取文章列表 (news / knowledge)
 *    getAllArticles()       → 获取全部已发布文章（扁平数组，不含草稿）
 *    getDetail(id)          → 按 ID 获取单篇文章详情
 *    getNoticeArticles()    → 获取通知公告文章列表（从 displayConfig.noticeIds 解析）
 *    getCarouselArticles()  → 获取轮播图关联文章（从 displayConfig.carouselIds 解析）
 *    getAboutArticle()      → 获取关于铝老板文章（从 displayConfig.aboutId 解析）
 *    getList(cat)           → 兼容旧版接口（内部映射到新结构）
 *    saveData(data)         → 写入 localStorage
 *    updateArticle(id, updates) → 更新文章
 *    addArticle(article)    → 新增文章
 *    deleteArticle(id)      → 删除文章
 *
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
    const STORAGE_KEY = '_AL_ARTICLES';

    // ================================================================
    //  默认数据（v2.0 统一结构）
    // ================================================================
    const DEFAULT_DATA = {

        // ===== 统一文章列表 =====
        // 所有文章统一存储在 articles 数组中，通过 section 区分板块，
        // 通过 displayRole 标记特殊展示角色（通知公告 / 关于铝老板）
        articles: [

            // ─── 通知公告类文章（section=news, displayRole=notice） ───
            {
                id: 'notice-silver-price',
                section: 'news',
                displayRole: 'notice',
                title: '白银价格突破 8000 元/千克，行情组紧急上调参考报价',
                summary: '受全球避险情绪与工业需求双轮驱动，银价创 12 年新高，建议含银废料从业者加快周转...',
                cover: '/images/articles/n4-cover.jpg',
                author: '铝老板官方',
                tags: ['平台公告'],
                inlineImages: [
                    { url: '/images/articles/n4-inline.jpg', caption: '上海黄金交易所白银 T+D 实时行情', after: 0 }
                ],
                weight: 100,
                sortOrder: 1,
                status: 'published',
                date: '2026-06-09',
                createdAt: '2026-06-09T08:00:00Z',
                updatedAt: '2026-06-09T08:00:00Z',
                views: 2156,
                likes: 96,
                body: '尊敬的铝老板用户：\n\n伦敦金属交易所数据显示，6 月初白银现货价格突破 38 美元/盎司关口，刷新 2012 年以来新高，国内上海黄金交易所白银 T+D 报价同步上行至 8200 元/千克附近，较 5 月初涨幅超 8%。\n\n【本轮上涨核心驱动因素】\n\n① 美元指数持续走弱\n美联储降息预期升温，美元指数跌破 104 关口，避险资金大规模涌入贵金属市场，COMEX 白银期货持仓量创近三年新高。\n\n② 工业需求保持旺盛\n光伏产业对白银的需求占比已提升至全球总需求的 15% 以上，新能源汽车的电子元件镀银用量也在稳步增长。中国光伏装机量同比增加 42%，直接拉动白银消费。\n\n③ 库存端供应紧张\nLME 白银库存连续 6 周下滑，目前库存水平处于近五年低位。国内主要冶炼厂开工率受环保检查影响有所下降，现货市场货源偏紧。\n\n【平台响应措施】\n• 即时同步上调「接触器银触点」参考报价 6%；\n• 「含银焊料」「感光材料」类目报价上调 5%-8%；\n• 行情组 24 小时轮班监控国际大宗商品走势；\n• 每日 09:00、15:00 两次发布价格更新通知；\n• VIP 用户可享 1 对 1 出货时机咨询服务。\n\n【给从业者的操作建议】\n1. 手中持有高品质银触点（成色 ≥ 95%）的建议加快出货节奏；\n2. 含银废料收购时可适当提高收购价，抢占优质货源；\n3. 关注资金安全，避免高杠杆囤货操作；\n4. 密切关注美联储议息会议结果及美元走势。\n\n如需了解具体品类的最新参考报价，可进入「铝老板金属网」小程序首页查看「今日行情」，或拨打客服热线咨询。'
            },
            {
                id: 'notice-vip-rights',
                section: 'knowledge',
                displayRole: 'notice',
                title: '会员体系升级：VIP 会员可发布评论和置顶文章',
                summary: '6 月起，VIP 会员可在技术交流区发布评论、置顶自己的文章，享受更多互动权益与专属服务...',
                cover: '/images/articles/n5-cover.jpg',
                author: '铝老板官方',
                tags: ['会员权益'],
                inlineImages: [
                    { url: '/images/articles/n3-inline.jpg', caption: 'VIP 会员权益总览', after: 0 }
                ],
                weight: 90,
                sortOrder: 2,
                status: 'published',
                date: '2026-06-01',
                createdAt: '2026-06-01T10:00:00Z',
                updatedAt: '2026-06-01T10:00:00Z',
                views: 1843,
                likes: 78,
                body: '尊敬的铝老板用户：\n\n为了更好地服务广大金属回收从业者，提升平台互动体验与信息共享效率，平台将于 2026 年 6 月 1 日起正式升级会员体系。\n\n━━━━━━━━━━━━━━━━\n🌟 VIP 会员新增权益一览\n━━━━━━━━━━━━━━━━\n\n【互动权益】\n✅ 可在任何资讯或知识文章下方发布评论，参与行业讨论；\n✅ 可将自己的原创文章「置顶展示」24 小时，获得更多曝光；\n✅ 发布的文章优先展示在搜索结果前列；\n✅ 可创建并管理个人收藏夹，方便随时查阅重要行情信息。\n\n【信息服务】\n✅ 享受每日专属行情简报推送（含早间/晚间两期）；\n✅ 获取历史价格走势图表数据导出权限；\n✅ 提前 30 分钟接收平台重大调价通知；\n✅ 解锁全部回收知识库高级教程内容。\n\n【专属服务】\n✅ 专属客服 1 对 1 在线咨询（工作日 8:00-20:00）；\n✅ 享有新品类回收需求优先匹配权；\n✅ 年度线下行业交流会 VIP 门票优惠。\n\n━━━━━━━━━━━━━━━━\n💰 VIP 套餐价格\n━━━━━━━━━━━━━━━━\n\n🥇 年度 VIP —— 299 元/年\n   （日均不到 0.82 元）\n\n🥈 季度 VIP —— 89 元/季\n\n🥉 月度 VIP —— 35 元/月\n\n━━━━━━━━━━━━━━━━\n📱 如何开通 VIP\n━━━━━━━━━━━━━━━━\n\n第 1 步：打开「铝老板金属网」小程序 → 点击底部「我的」；\n第 2 步：进入「会员中心」页面；\n第 3 步：选择适合您的套餐 → 完成支付即可生效。\n\n💡 温馨提示：VIP 会员资格自购买即刻生效，有效期届满后需续费方可继续享用权益。如有疑问请通过小程序内「联系客服」与我们取得联系。\n\n感谢您一直以来对铝老板的支持与信任！'
            },

            // ─── 行业资讯板块（section=news, displayRole=""） ───
            {
                id: 'n1',
                section: 'news',
                displayRole: '',
                title: '白银价格突破 8000 元/千克，再创年内新高',
                summary: '受全球避险情绪与工业需求双轮驱动，伦敦银现价创 12 年新高，国内白银现货报价同步攀升至 8200 元/千克...',
                cover: '/images/articles/n1-cover.jpg',
                author: '铝老板行情组',
                tags: ['贵金属'],
                inlineImages: [
                    { url: '/images/articles/n1-inline.jpg', caption: '上海黄金交易所白银现货行情走势图', after: 0 }
                ],
                weight: 85,
                sortOrder: 3,
                status: 'published',
                date: '2026-06-09',
                createdAt: '2026-06-09T09:30:00Z',
                updatedAt: '2026-06-09T09:30:00Z',
                views: 1283,
                likes: 87,
                body: '【行情快讯】伦敦金属交易所（LME）最新数据显示，北京时间 6 月 9 日凌晨，国际白银现货价格强势突破 38 美元/盎司大关，最高触及 38.47 美元/盎司，刷新自 2012 年以来的 12 年新高纪录。\n\n国内方面，上海黄金交易所白银 T+D 主力合约同步上行，盘中报价一度突破 8200 元/整数关口，收盘报于 8185 元/千克，较 5 月初累计涨幅超过 8%。\n\n━━━━━━━━━━━━━━━━\n📊 三大上涨驱动力深度解析\n━━━━━━━━━━━━━━━━\n\n【驱动一：宏观面——美元走弱 + 避险升温】\n美国 5 月非农就业数据大幅低于预期，失业率上升至 4.1%，市场对美联储年内降息的预期显著增强。美元指数跌破 104 关口，创下近两个月新低。以美元计价的贵金属对非美投资者更加"便宜"，全球央行和机构资金加速配置黄金、白银等避险资产。\n\n【驱动二：基本面——工业需求爆发式增长】\n• 光伏产业：单 GW 光伏组件约消耗 25-30 吨白银，中国 2026 年 Q1 光伏新增装机量达 48GW，同比暴增 42%，直接拉动白银工业需求；\n• 新能源汽车：车载电子元件、ADAS 传感器中的镀银连接器用量持续走高，单车平均用银量较传统燃油车增长约 35%；\n• 5G 基建：高频电路板对导电银浆的需求保持两位数增速。\n\n【驱动三：供需面——库存连降 + 冶炼受限】\nLME 白银库存已从年初的 2.7 亿盎司降至目前的 2.3 亿盎司附近，降幅近 15%。与此同时，全球主要白银产国（墨西哥、秘鲁、中国）的矿山产量因矿石品位下降和环保政策收紧而出现负增长。国内多家大型冶炼厂因环保督察阶段性减产，现货市场货源持续偏紧。\n\n━━━━━━━━━━━━━━━━\n🔮 后市展望与操作建议\n━━━━━━━━━━━━━━━━\n\n多数机构分析师认为，在三季度传统消费旺季到来之前，白银价格仍有 5%-10% 的上行空间，目标价位看向 40-42 美元/盎司区间（对应国内约 8600-9000 元/千克）。\n\n对含银废料回收从业者的具体建议：\n1️⃣ 银触点、含银焊料等高价值品类——逢高分批出货，不宜过度惜售；\n2️⃣ 感光废料、定影液等低浓度品类——关注下游提炼厂收购价的联动涨幅；\n3️⃣ 新入行者——建议先从小批量入手积累经验，控制单笔投入风险；\n4️⃣ 所有人——密切关注每周四晚间的美国初请失业金数据和 CPI 数据发布。\n\n⚠️ 风险提示：贵金属价格波动剧烈，以上分析仅供参考，不构成投资建议。'
            },
            {
                id: 'n2',
                section: 'news',
                displayRole: '',
                title: '2026年Q2金属回收行情深度分析报告',
                summary: '白银领涨贵金属板块，铝铜稳中有升，废钢小幅回调。本季度各品种趋势详解与下半年预判...',
                cover: '/images/articles/n2-cover.jpg',
                author: '李老板',
                tags: ['行业资讯'],
                inlineImages: [
                    { url: '/images/articles/n2-inline.jpg', caption: '2026年Q2 主要有色金属价格环比变化', after: 0 }
                ],
                weight: 70,
                sortOrder: 4,
                status: 'published',
                date: '2026-06-05',
                createdAt: '2026-06-05T14:00:00Z',
                updatedAt: '2026-06-05T14:00:00Z',
                views: 856,
                likes: 32,
                body: '【季度回顾】2026 年第二季度（4-6 月），国内金属回收市场整体呈现"强弱分化、结构性机会突出"的特征。以下按品种逐一复盘。\n\n━━━━━━━━━━━━━━━━\n🥈 白银：全品类领涨，涨幅超 12%\n━━━━━━━━━━━━━━━━\n\nQ2 白银以绝对优势领跑整个有色板块：\n• 国际银价从 34 美元/盎司涨至 38 美元/盎司上方；\n• 国内现货银价从 7300 元/千克升至 8200 元/千克附近；\n• 含银废料综合回收价指数环比上涨 9%-14%（按品类成色不同而有差异）。\n\n涨幅最大的细分品类为高纯度银触点（99.9% 成色以上），回收价较 Q1 末上涨约 15%。感光废料和镀银件紧随其后，涨幅在 8%-11% 区间。\n\n━━━━━━━━━━━━━━━━\n🥉 铝系：稳中有升，差异化明显\n━━━━━━━━━━━━━━━━\n\n• 生铝（如拆车铝件）：Q2 均价环比上涨约 3.5%，受益于新能源汽车报废量增加；\n• 熟铝（如易拉罐料）：基本持平，波动幅度在 ±1% 以内；\n• 铝合金门窗型材：受房地产低迷影响，回收价微跌 1.5% 左右。\n\n值得关注的是，航空铝合金（2024/T6 系列）因军工和航空航天订单饱满，回收溢价持续走阔。\n\n━━━━━━━━━━━━━━━━\n📉 铜系：高位震荡，精废差收窄\n━━━━━━━━━━━━━━━━\n\n• 电解铜现货均价维持在 82,000-85,000 元/吨区间震荡；\n• 1# 光亮铜线回收价跟随波动，Q2 平均回收价约 66,500 元/吨，环比持平略升；\n• 精废价差（电解铜与再生铜价差）从 Q1 的 2,200 元/吨收窄至 1,600 元/吨左右，反映再生铜竞争力下降。\n\n电机铜、变压器铜等低品位铜料的回收利润空间受到挤压。\n\n━━━━━━━━━━━━━━━━\n🔧 废钢：小幅回调，需求疲软\n━━━━━━━━━━━━━━━━\n\n• 重废（≥6mm）平均回收价环比下跌约 2.8%；\n• 轻废/剪料跌幅更大，接近 4%；\n\n主因是下游钢材需求进入季节性淡季，叠加房地产市场持续低迷，钢厂采购意愿不强。不过，不锈钢废料因镍价坚挺而相对抗跌。\n\n━━━━━━━━━━━━━━━━\n🔮 下半年展望\n━━━━━━━━━━━━━━━━\n\n综合各方因素，我们对下半年的判断如下：\n\n| 品种 | 方向 | 核心逻辑 |\n|------|------|----------|\n| 白银 | 偏强 | 降息预期 + 工业需求 + 库存低位三重支撑 |\n| 铝 | 震荡偏强 | 新能源车报废潮 + 产能置换政策利好 |\n| 铜 | 高位震荡 | 供给扰动 vs 宏观不确定性博弈 |\n| 废钢 | 弱势震荡 | 房地产拖累短期难以扭转 |\n\n建议从业者根据自身主营品种灵活调整库存周期和资金配置策略。铝老板行情组将持续跟踪各品种动态，第一时间为您解读。'
            },

            // ─── 回收知识板块（section=knowledge, displayRole=""） ───
            {
                id: 'k1',
                section: 'knowledge',
                displayRole: '',
                title: '接触器银触点拆解完整流程：新手零基础入门指南',
                summary: '从工具准备到银触点分离提取，手把手图文讲解接触器拆解全过程，适合刚入行的回收新手快速上手...',
                cover: '/images/articles/k1-cover.jpg',
                author: '张师傅',
                tags: ['回收技巧'],
                inlineImages: [
                    { url: '/images/articles/k1-inline.jpg', caption: '常见交流接触器内部结构示意', after: 0 }
                ],
                weight: 80,
                sortOrder: 5,
                status: 'published',
                date: '2026-06-08',
                createdAt: '2026-06-08T11:00:00Z',
                updatedAt: '2026-06-08T11:00:00Z',
                views: 1200,
                likes: 45,
                body: '很多刚入行的新手朋友问我："接触器里的银触点到底怎么拆？拆出来值不值钱？"今天这篇文章就给大家做一个从零开始的完整拆解教程。\n\n━━━━━━━━━━━━━━━━\n🛠️ 第一部分：认识接触器和银触点\n━━━━━━━━━━━━━━━━\n\n什么是接触器？\n接触器是一种利用线圈流过电流产生磁场，使触头闭合以达到控制负载的电器。广泛应用于电动机控制、电力配电系统等领域。\n\n银触点在哪里？\n打开任何一款交流接触器的灭弧罩（外壳），你会看到内部的动静触头组件——那几块小小的、发亮白色/灰白色的金属片就是**银触点**（也叫银合金触头）。它们之所以用银做材料，是因为银具有极佳的导电性和耐电弧烧蚀能力。\n\n💡 一只普通 CJX2 系列接触器（32A 规格）通常含有 3 对（6 个）银触点，单个重量约 0.3-0.8 克不等，视品牌和规格而定。银含量一般在 85%-95% 之间。\n\n━━━━━━━━━━━━━━━━\n🔧 第二部分：工具准备清单\n━━━━━━━━━━━━━━━━\n\n必备工具：\n✅ 一字螺丝刀（中小号各一把）——用于撬开外壳卡扣；\n✅ 十字螺丝刀——拆卸固定螺丝；\n✅ 尖嘴钳——拔出触桥和弹簧；\n✅ 斜口钳——剪断多余引线；\n✅ 钳工锤/橡胶锤——轻敲松动卡死的零件；\n✅ 工作台垫板（木板或胶皮）——防止零件弹飞丢失。\n\n可选工具（提升效率）：\n🔹 电动螺丝刀——大批量拆解时省力神器；\n🔹 放大镜/手机微距模式——辨认触点成色和型号标识；\n🔹 电子秤（精度 0.01g）——称量银触点重量估算价值。\n\n━━━━━━━━━━━━━━━━\n📋 第三部分：标准拆解步骤\n━━━━━━━━━━━━━━━━\n\n步骤 1：拆除外部接线\n→ 用斜口钳剪除或用螺丝刀松开接线端子的固定螺丝，将电源线和控制线全部拆除。注意保留线圈引脚的绝缘套管（有些买家会要求带线圈整体回收）。\n\n步骤 2：取下灭弧罩（外盖）\n→ 大多数接触器的灭弧罩采用卡扣式固定。用一字螺丝刀轻轻插入卡扣缝隙，向外撬动即可取下。⚠️ 切忌用力过猛，老化的塑料罩容易碎裂。\n\n步骤 3：取出触头支架组件\n→ 灭弧罩取下后，可以看到内部的触头系统。通常有几颗十字沉头螺丝固定着静触头座，拧下后即可将整个触头支架取出。\n\n步骤 4：分离动触头（活动触桥）\n→ 动触头安装在触桥上，由弹簧压紧。用尖嘴钳夹住触桥两端，轻轻向上提起即可脱离。注意不要让弹簧弹飞！\n\n步骤 5：摘取银触点\n→ 这是最后也是最关键的一步。银触点一般通过铆接或钎焊方式固定在铜基座上：\n  • 铆接式：用小锤和冲子从背面轻轻顶出；\n  • 钎焊式：用电烙铁加热焊点后取下（注意通风，焊剂烟气有害健康）。\n\n💡 取下的银触点按成色分类存放：\n  🔸 A 类（表面光亮、磨损少）——回收单价最高；\n  🔸 B 类（轻微发黑、有电弧痕迹）——次之；\n  🔸 C 类（严重烧蚀、变形）——需折价处理。\n\n━━━━━━━━━━━━━━━━\n⚠️ 第四部分：注意事项 & 安全提醒\n━━━━━━━━━━━━━━━━\n\n1. ⚡ 拆解前务必确认接触器已完全断电！即使是废旧设备也可能残留电容电荷。\n2. 😷 拆解过程会产生粉尘，建议佩戴口罩作业，有条件的话配护目镜。\n3. 🔄 不同品牌/型号的接触器结构差异较大（施耐德、正泰、德力西等），第一次遇到新型号时先观察结构再动手。\n4. 📦 拆完的塑料壳、线圈、铁芯、弹簧等副产物也不要扔掉，可以分类出售给对应的回收渠道，"全身都是宝"才是高效回收的真谛。\n\n希望这篇教程能帮到刚入行的朋友。有任何问题欢迎在评论区留言交流！'
            },
            {
                id: 'k2',
                section: 'knowledge',
                displayRole: '',
                title: '含银废料回收利润最大化：从分类到议价的实战策略',
                summary: '银触点、镀银件、含银合金……不同类型含银废料的识别方法、分类标准和议价技巧全分享，帮你把每一克银子赚到位...',
                cover: '/images/articles/k2-cover.jpg',
                author: '王老板',
                tags: ['行情分析'],
                inlineImages: [
                    { url: '/images/articles/k2-inline.jpg', caption: '常见含银废料类型实物对比', after: 0 }
                ],
                weight: 75,
                sortOrder: 6,
                status: 'published',
                date: '2026-05-28',
                createdAt: '2026-05-28T16:00:00Z',
                updatedAt: '2026-05-28T16:00:00Z',
                views: 2300,
                likes: 89,
                body: '做了十来年的含银废料回收，最深的一点体会就是：**同样一堆货，会不会分、会不会谈，最终到手的利润可能差出一倍不止。** 今天把我这些年摸索出来的实战经验毫无保留地分享给大家。\n\n━━━━━━━━━━━━━━━━\n📚 第一步：精准识别——你手里的到底是什么？\n━━━━━━━━━━━━━━━━\n\n含银废料种类繁多，大致可以分为以下五大类：\n\n| 类型 | 常见来源 | 银含量范围 | 回收难度 | 收购价参考 |\n|------|----------|-----------|---------|----------|\n| 🥇 银触点 | 接触器、继电器、断路器 | 85%-95% | ★☆☆ | 最高 |\n| 🥈 含银焊料 | 电子元器件、珠宝接头 | 10%-40% | ★★☆ | 中高 |\n| 🥉 镀银件 | 导电汇流排、射频屏蔽罩、镀银铜线 | 1%-20 μm 镀层 | ★★★ | 中等 |\n| 🏅 感光/定影液 | X 光室、印刷厂废液 | 0.5-5 g/L | ★★★★ | 较低（量大另议）|\n| 🏅 含银合金 | 牙科材料、轴承合金 | 30%-70% | ★★☆ | 视合金成分而定 |\n\n💡 快速识别小技巧：\n• 用磁铁测试——纯银不吸磁（但银合金可能含少量铁磁性元素）；\n• 看颜色——银氧化后呈灰黑色（区别于铝的白亮色和锡的暗灰色）；\n• 称密度——银的密度约为 10.5 g/cm³，比铜(8.9) 重比铅(11.3) 轻；\n• 最靠谱的方法——买一套简易银含量检测试纸（成本几十块，能测个大概范围）。\n\n━━━━━━━━━━━━━━━━\n📦 第二步：精细分类——混装卖 = 亏钱\n━━━━━━━━━━━━━━━━\n\n这是新手最容易犯的错误——把所有东西一股脑儿打包卖给收货商。结果？人家按最低的那一类给你定价。\n\n正确的做法：\n\n✅ 按上表的五大类别分开存放；\n✅ 同一类别内再按成色细分（A/B/C 三档）；\n✅ 镀银件要区分镀层厚度（一般镀银 vs 厚镀银 >20μm）；\n✅ 银触点按规格大小大致分组（大功率接触器的小触点和继电器微触点价格差异很大）；\n✅ 感光废液要记录大致体积和来源（医院废液和印刷厂废液的含银量差别巨大）。\n\n📊 一个真实的案例：\n我见过一个同行收了 50kg 混合含银废料（银触点 + 镀银片 + 几根含银焊条），打包卖了 2800 元。如果当时分类开来的话——\n  • 银触点约 18kg × 180 元/kg = 3240 元\n  • 镀银片约 25kg × 15 元/kg = 375 元\n  • 含银焊条约 7kg × 65 元/kg = 455 元\n  合计 ≈ 4070 元\n  **白白亏了将近 1300 块钱！** 就因为懒得分一下。\n\n━━━━━━━━━━━━━━━━\n💬 第三步：议价技巧——让你多赚 10%-20%\n━━━━━━━━━━━━━━━━\n\n技巧 1：掌握当日基准价\n每次出货前先查当天上海黄金交易所的白银 T+D 报价（铝老板小程序首页就有）。知道大盘价，你心里才有底，不会被随意压价。\n\n技巧 2：货比三家（但别过度）\n同一片区至少联系 2-3 家买家询价。但注意——如果你每次都到处询价最后还不卖，口碑坏了以后没人给你报实价。\n\n技巧 3：用"量"换"价"\n如果你手上有稳定的大批量货源，可以直接跟买家谈长期合作价。一般来说，月供货量达到 50kg 以上的银触点，单价可以提高 5-8 个点。\n\n技巧 4：时机很重要\n银价大涨后的 3-5 天是出货的好窗口——买家库存见底急于补货，收购报价往往更给力。反之银价暴跌时不妨先捂一捂，等企稳了再出。\n\n技巧 5：包装和交付\n干净、分类清晰的货永远比脏乱混装的卖得上价。花 10 分钟把货分好装袋，贴上手写标签，买家一眼就能看出你是"内行"，自然不敢随便压你的价。\n\n━━━━━━━━━━━━━━━━\n🎯 总结\n━━━━━━━━━━━━━━━━\n\n含银废料回收这门生意，说简单也简单——低价收高价卖；说不难也不难——关键在于细节。\n记住这三句话：\n  ✅ 识货要准（知道是什么）；\n  ✅ 分类要细（别混在一起卖）；\n  ✅ 谈判要有底气（了解实时行情）。\n\n做到这三点，你的回收利润至少能比同行高出 15%-25%。祝各位老板生意兴隆！🙏'
            },
            {
                id: 'k3',
                section: 'knowledge',
                displayRole: '',
                title: 'T5荧光灯管拆解实战：从工具准备到汞银分离全程实录',
                summary: 'T5灯管是回收市场中常见的含汞含银废料之一。本文详细拆解全套流程，包含工具清单、拆解步骤和安全防护要点...',
                cover: '/images/articles/k3-cover.jpg',
                author: '张师傅',
                tags: ['新手入门'],
                inlineImages: [
                    { url: '/images/articles/k3-inline.jpg', caption: 'T5 荧光灯管内部结构与拆解要点标注', after: 0 }
                ],
                weight: 0,
                sortOrder: 7,
                status: 'draft',
                date: '2026-06-10',
                createdAt: '2026-06-10T09:00:00Z',
                updatedAt: '2026-06-10T09:00:00Z',
                views: 0,
                likes: 0,
                body: '[草稿] T5荧光灯管拆解实战教程正在编写中，以下是大纲和已完成的部分内容...\n\n━━━━━━━━━━━━━━━━\n⚠️ 重要安全提示（必读）\n━━━━━━━━━━━━━━━━\n\nT5 荧光灯管内含有**汞（水银）**，属于有毒有害物质。拆解过程中如果操作不当导致灯管破裂，汞蒸气泄漏会对人体神经系统和呼吸系统造成伤害。\n\n🚨 拆解前的必要准备：\n• 必须在通风良好的环境中作业（最好有排风扇）；\n• 佩戴防尘口罩（N95 及以上级别）；\n• 佩戴橡胶手套和护目镜；\n• 准备一个密闭容器用于收集碎玻璃和残留汞滴；\n• 地面上铺好厚塑料布，便于清理泼洒物。\n\n⚠️ 如果灯管意外破碎：\n1. 立即疏散人员并加强通风；\n2. 不要用扫帚扫（会扬起含汞粉尘）；\n3. 用硬纸板或胶带小心收集碎片和汞珠；\n4. 全部装入密封袋交由专业危废处置机构处理；\n5. 沾染的衣物需单独清洗。\n\n━━━━━━━━━━━━━━━━\n🔧 第一部分：T5灯管的回收价值在哪里？\n━━━━━━━━━━━━━━━━\n\n很多人以为废灯管就是垃圾，但其实 T5 荧光灯管中含有多种可回收资源：\n\n1. **汞（Hg）**：单支 T5 灯管含汞量约 3-5mg，大量集中后有专业提炼价值；\n2. **银粉/银浆**：灯管电极部位涂覆有含银电子发射材料（主要是氧化钡锶钙混合物掺银），虽然单支含量极低但规模化后有回收意义；\n3. **玻璃**：高硼硅玻璃可回炉再造；\n4. **铝帽/铜针**：灯管两端的金属针脚和铝制端帽可分类回收；\n5. **稀土荧光粉**：灯管内壁涂层含有铕、铽等稀土元素（此部分回收门槛较高，需要有资质的提炼厂配合）。\n\n对于个体回收户来说，最有实际价值的部分是：**分类收集铝帽、铜针和整支完好灯管（转卖给专业处理厂）**。\n\n━━━━━━━━━━━━━━━━\n📋 第二部分：标准拆解流程（待补充详细步骤图）\n━━━━━━━━━━━━━━━━\n\n步骤 1：筛选分类\n→ 将完好的 T5 灯管和已破损的分开存放。完好的直接打包交由有资质的电子废弃物处理企业（他们有专门的汞回收生产线）。破损的需要按下面的流程安全处置。\n\n步骤 2：移除端帽（待补充图文）\n→ 使用专用工具或钳子小心地将两端铝制端帽剥离...（后续内容编写中）\n\n步骤 3：电极处理（待补充图文）\n→ ...\n\n步骤 4：玻璃与荧光粉分离（待补充图文）\n→ ...\n\n步骤 5：分类存储与转运\n→ ...\n\n━━━━━━━━━━━━━━━━\n📝 待完成事项\n━━━━━━━━━━━━━━━━\n\n- [ ] 补充步骤 2-5 的详细图文说明\n- [ ] 添加拆解实操照片\n- [ ] 补充各类材料的当前收购价参考表\n- [ ] 整理合规处置渠道名录\n\n预计完成时间：2026 年 6 月中旬。敬请期待！'
            },

            // ─── 关于铝老板（section=knowledge, displayRole=about） ───
            {
                id: 'about',
                section: 'knowledge',
                displayRole: 'about',
                title: '关于铝老板：让含银废料回收更简单、更值钱',
                summary: '铝老板金属网是专业的金属废料回收信息服务平台，致力于为全国回收商、加工厂提供实时行情、知识分享与交易对接服务...',
                cover: '/images/articles/n3-cover.jpg',
                author: '铝老板官方',
                tags: ['平台介绍'],
                inlineImages: [
                    { url: '/images/articles/n3-inline.jpg', caption: '铝老板团队与服务网络', after: 0 }
                ],
                weight: 200,
                sortOrder: 0,
                status: 'published',
                date: '2026-06-10',
                createdAt: '2026-06-10T00:00:00Z',
                updatedAt: '2026-06-10T00:00:00Z',
                views: 3520,
                likes: 215,
                body: '━━━━━━━━━━━━━━━━\n🏢 关于我们\n━━━━━━━━━━━━━━━━\n\n铝老板金属网成立于 2024 年，是国内领先的**垂直领域金属废料回收信息服务平台**。我们专注于含银废料及周边有色金属回收赛道，致力于用数字化手段解决行业长期存在的信息不对称问题。\n\n我们的使命：让每一位回收从业者在交易中拥有更多信息优势。\n\n我们的愿景：成为中国金属回收行业最值得信赖的数据和服务平台。\n\n━━━━━━━━━━━━━━━━\n🎯 我们提供什么？\n━━━━━━━━━━━━━━━━\n\n📊 **实时行情数据**\n每日更新的白银、铜、铝等主要金属品种参考报价，覆盖银触点、含银焊料、镀银件等 20+ 细分品类。数据来源于 LME、上海黄金交易所及一线回收市场成交价，确保准确、及时。\n\n📰 **行业资讯速递**\n专业的行情分析团队为您解读国内外大宗商品走势、政策法规变动、行业前沿动态，帮助您把握市场脉搏。\n\n📚 **回收知识库**\n从入门指南到高阶技巧，涵盖接触器拆解、废料分类、议价策略、安全规范等实用内容，助力新人快速成长、老手持续精进。\n\n🤝 **供需对接服务**\n通过平台发布的供求信息功能，帮助卖家找到优质买家、买家锁定可靠货源，降低交易摩擦成本。\n\n💎 **VIP 会员体系**\n提供数据导出、专属客服、优先匹配、线下活动等多重增值服务（详见《会员权益升级》公告）。\n\n━━━━━━━━━━━━━━━━\n👥 我们的团队\n━━━━━━━━━━━━━━━━\n\n铝老板的核心团队成员来自金属贸易、金融科技和互联网三个领域：\n\n• **行情组**——由拥有 10 年以上大宗商品分析经验的资深分析师带队，追踪全球市场动态；\n• **技术团队**——负责平台开发、数据系统和用户体验优化；\n• **运营团队**——负责内容生产、用户服务和社区运营；\n• **顾问团**——邀请行业内资深回收商、冶炼工程师担任顾问，确保平台内容的专业性和实用性。\n\n━━━━━━━━━━━━━━━━\n📈 发展历程\n━━━━━━━━━━━━━━━━\n\n• 2024.Q1 —— 项目启动，完成产品原型设计\n• 2024.Q3 —— 小程序 1.0 版本上线，首批种子用户入驻\n• 2025.Q1 —— 用户数突破 5,000，推出 VIP 会员体系\n• 2025.Q3 —— 上线后台管理系统，开放文章管理和站点配置\n• 2026.Q1 —— 用户数突破 20,000，覆盖全国 28 个省市\n• 未来 —— 持续拓展品类覆盖，引入在线担保交易功能\n\n━━━━━━━━━━━━━━━━\n📞 联系我们\n━━━━━━━━━━━━━━━━\n\n• 官方小程序：搜索「铝老板金属网」\n• 客服热线：400-XXX-XXXX（周一至周六 8:00-20:00）\n• 商务合作：business@lubanboss.com\n• 地址：[您的公司地址]\n\n━━━━━━━━━━━━━━━━\n🙏 致谢\n━━━━━━━━━━━━━━━━\n\n感谢每一位用户的支持与信任。铝老板将继续秉持"透明、专业、共赢"的价值观，为推动中国金属回收行业的数字化升级贡献力量。\n\n如有任何问题或建议，欢迎通过小程序内的「意见反馈」功能联系我们。'
            }

        ],

        // ===== 展示配置 =====
        // 这些配置项在管理后台「公告管理」模块中进行设置，
        // 用于决定哪些文章出现在通知栏、轮播图、关于页等特殊位置。
        displayConfig: {
            /** 顶部「通知公告」区域展示的文章 ID 列表（按顺序显示） */
            noticeIds: ['notice-silver-price', 'notice-vip-rights'],

            /** 首页轮播图关联的文章 ID 列表（按顺序显示） */
            carouselIds: ['notice-silver-price', 'n1'],

            /** 「关于铝老板」页面关联的文章 ID */
            aboutId: 'about'
        }
    };


    // ================================================================
    //  排序辅助函数：weight 降序 → sortOrder 升序 → date 降序
    // ================================================================
    function sortArticles(list) {
        return list.slice().sort(function (a, b) {
            if (b.weight !== a.weight) return b.weight - a.weight;          // 权重大排前面
            if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder; // 同权重按序号
            return (b.date || '').localeCompare(a.date || '');              // 最后按日期
        });
    }


    // ================================================================
    //  数据持久化
    // ================================================================
    function initData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
                console.log('[articles.js] 默认数据已初始化到 localStorage');
            } else {
                // 已有旧格式数据 → 尝试迁移（首次加载时自动执行一次）
                migrateOldData(JSON.parse(stored));
            }
        } catch (e) {
            console.warn('[articles.js] localStorage 初始化失败', e);
        }
    }

    /**
     * 旧版数据迁移：{ notices[], news[], knowledge[], about{} }
     * → 新版：{ articles[], displayConfig{} }
     * 仅当检测到旧格式且无 articles 字段时执行
     */
    function migrateOldData(oldData) {
        if (oldData.articles && Array.isArray(oldData.articles)) return; // 已经是新格式

        console.log('[articles.js] 检测到旧版数据格式，正在迁移...');
        var migrated = {
            articles: [],
            displayConfig: {
                noticeIds: [],
                carouselIds: [],
                aboutId: null
            }
        };

        var catMap = { notices: 'news', news: 'news', knowledge: 'knowledge' };
        var roleMap = { notices: 'notice', news: '', knowledge: '' };
        var cats = ['notices', 'news', 'knowledge'];

        for (var ci = 0; ci < cats.length; ci++) {
            var arr = oldData[cats[ci]];
            if (!Array.isArray(arr)) continue;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var art = {
                    id: item.id || (cats[ci] + '-' + Date.now()),
                    section: item.section || catMap[cats[ci]] || 'knowledge',
                    displayRole: item.displayRole || '',
                    title: item.title || '',
                    summary: item.summary || '',
                    cover: item.cover || '',
                    body: item.body || '',
                    author: item.author || '',
                    tags: item.tag ? [item.tag] : (item.tags || []),
                    inlineImages: item.inlineImages || [],
                    weight: typeof item.weight === 'number' ? item.weight : (item.sortOrder ? 100 - item.sortOrder : 0),
                    sortOrder: item.sortOrder || 0,
                    status: item.status || 'published',
                    date: item.date || '',
                    createdAt: item.createdAt || '',
                    updatedAt: item.updatedAt || '',
                    views: item.views || 0,
                    likes: item.likes || 0
                };

                // 旧版 showInNotice / showInCarousel 映射
                if (item.showInNotice && art.id) {
                    migrated.displayConfig.noticeIds.push(art.id);
                    if (!art.displayRole) art.displayRole = 'notice';
                }
                if (item.showInCarousel && art.id) {
                    migrated.displayConfig.carouselIds.push(art.id);
                }
                // 旧版 about 单条
                if (cats[ci] === 'knowledge' && item.cat === 'about') {
                    art.displayRole = 'about';
                    migrated.displayConfig.aboutId = art.id;
                }

                migrated.articles.push(art);
            }
        }

        // 旧版 about 单独对象
        if (oldData.about && oldData.about.id) {
            var found = migrated.articles.find(function(a) { return a.id === oldData.about.id; });
            if (!found) {
                migrated.articles.push({
                    id: oldData.about.id,
                    section: 'knowledge',
                    displayRole: 'about',
                    title: oldData.about.title || '',
                    summary: oldData.about.summary || '',
                    cover: oldData.about.cover || '',
                    body: oldData.about.body || '',
                    author: oldData.about.author || '',
                    tags: oldData.about.tag ? [oldData.about.tag] : [],
                    inlineImages: oldData.about.inlineImages || [],
                    weight: 200, sortOrder: 0, status: 'published',
                    date: oldData.about.date || '',
                    createdAt: oldData.about.createdAt || '',
                    updatedAt: oldData.about.updatedAt || '',
                    views: oldData.about.views || 0,
                    likes: oldData.about.likes || 0
                });
            }
            migrated.displayConfig.aboutId = oldData.about.id;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            console.log('[articles.js] 旧版数据迁移完成，共迁移 ' + migrated.articles.length + ' 篇文章');
        } catch (e) {
            console.error('[articles.js] 迁移失败', e);
        }
    }


    // ================================================================
    //  核心 API
    // ================================================================

    /** 获取完整原始数据对象（含 articles + displayConfig） */
    function getData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return DEFAULT_DATA;
    }

    /** 写入数据到 localStorage */
    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('[articles.js] localStorage 保存失败', e);
            return false;
        }
    }


    // ================================================================
    //  文章查询 API
    // ================================================================

    /**
     * 按板块获取文章列表
     * @param {string} section - 'news' | 'knowledge'
     * @param {object} opts - { includeDraft?: boolean }
     * @returns {Article[]} 按 weight 排序后的文章列表
     */
    function getArticles(section, opts) {
        var data = getData();
        var list = (data.articles || []).filter(function (a) {
            if (a.section !== section) return false;
            if (!(opts && opts.includeDraft) && a.status === 'draft') return false;
            return true;
        });
        return sortArticles(list);
    }

    /**
     * 获取所有已发布文章（扁平数组，跨板块）
     * @returns {Article[]} 按 weight 排序
     */
    function getAllArticles() {
        var data = getData();
        return sortArticles((data.articles || []).filter(function (a) { return a.status !== 'draft'; }));
    }

    /**
     * 按 ID 获取单篇文章详情（包含草稿）
     * @param {string} id
     * @returns {Article|null}
     */
    function getDetail(id) {
        var data = getData();
        if (!data.articles) return null;
        for (var i = 0; i < data.articles.length; i++) {
            if (data.articles[i].id === id) return data.articles[i];
        }
        return null;
    }

    /**
     * 获取通知公告文章列表（从 displayConfig.noticeIds 解析，按配置顺序返回）
     * @returns {Article[]}
     */
    function getNoticeArticles() {
        var data = getData();
        var ids = (data.displayConfig && data.displayConfig.noticeIds) || [];
        var map = {};
        (data.articles || []).forEach(function (a) { if (a.status !== 'draft') map[a.id] = a; });
        return ids.filter(function (id) { return map[id]; }).map(function (id) { return map[id]; });
    }

    /**
     * 获取轮播图关联文章列表（从 displayConfig.carouselIds 解析）
     * @returns {Article[]}
     */
    function getCarouselArticles() {
        var data = getData();
        var ids = (data.displayConfig && data.displayConfig.carouselIds) || [];
        var map = {};
        (data.articles || []).forEach(function (a) { if (a.status !== 'draft') map[a.id] = a; });
        return ids.filter(function (id) { return map[id]; }).map(function (id) { return map[id]; });
    }

    /**
     * 获取关于铝老板文章
     * @returns {Article|null}
     */
    function getAboutArticle() {
        var data = getData();
        var aboutId = (data.displayConfig && data.displayConfig.aboutId) || null;
        // 先尝试从 displayConfig 取，必须是已发布状态
        if (aboutId) {
            var art = getDetail(aboutId);
            if (art && art.status !== 'draft') return art;
        }
        // 兜底：查找 id='about' 的文章（必须已发布）
        var fallback = getDetail('about');
        if (fallback && fallback.status !== 'draft') return fallback;
        return null;
    }


    // ================================================================
    //  兼容旧版接口：getList(cat)
    //  旧参数映射：
    //    'notice'    → 返回 getNoticeArticles()
    //    'news'      → 返回 getArticles('news')
    //    'knowledge' → 返回 getArticles('knowledge')
    //    'about'     → 返回 [getAboutArticle()] 或 []
    // ================================================================
    function getList(cat) {
        switch (cat) {
            case 'notice':    return getNoticeArticles();
            case 'news':      return getArticles('news');
            case 'knowledge': return getArticles('knowledge');
            case 'about':     { var a = getAboutArticle(); return a ? [a] : []; }
            default:          return getArticles(cat); // 兜底：尝试当作 section 处理
        }
    }


    // ================================================================
    //  文章增删改 API
    // ================================================================

    /** 新增文章（追加到 articles 数组末尾） */
    function addArticle(article) {
        var data = getData();
        if (!data.articles) data.articles = [];
        data.articles.push(article);
        saveData(data);
        return true;
    }

    /** 根据 ID 更新文章 */
    function updateArticle(id, updates) {
        var data = getData();
        if (!data.articles) return false;
        for (var i = 0; i < data.articles.length; i++) {
            if (data.articles[i].id === id) {
                Object.assign(data.articles[i], updates);
                data.articles[i].updatedAt = new Date().toISOString();
                saveData(data);
                return true;
            }
        }
        return false;
    }

    /** 根据 ID 删除文章 */
    function deleteArticle(id) {
        var data = getData();
        if (!data.articles) return false;
        var before = data.articles.length;
        data.articles = data.articles.filter(function (a) { return a.id !== id; });

        // 同时清理 displayConfig 中的引用
        if (data.displayConfig) {
            if (data.displayConfig.noticeIds) {
                data.displayConfig.noticeIds = data.displayConfig.noticeIds.filter(function (nid) { return nid !== id; });
            }
            if (data.displayConfig.carouselIds) {
                data.displayConfig.carouselIds = data.displayConfig.carouselIds.filter(function (cid) { return cid !== id; });
            }
            if (data.displayConfig.aboutId === id) {
                data.displayConfig.aboutId = null;
            }
        }

        saveData(data);
        return data.articles.length < before;
    }

    /** 评论预留 */
    function getComments(articleId) {
        try {
            var key = '_AL_COMMENTS_' + articleId;
            var stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }


    // ================================================================
    //  向外暴露
    // ================================================================
    const data = getData();

    const api = {
        // ---- 核心数据 ----
        getData,
        saveData,

        // ---- 文章查询（v2.0 推荐） ----
        getArticles,           // 按板块获取
        getAllArticles,         // 全部已发布
        getDetail,              // 按 ID 详情
        getNoticeArticles,      // 通知公告
        getCarouselArticles,    // 轮播图文章
        getAboutArticle,        // 关于页文章

        // ---- 兼容旧版 ----
        getList,                // 旧版 getList(cat)

        // ---- 增删改 ----
        updateArticle,
        addArticle,
        deleteArticle,
        getComments
    };

    window._AL_ARTICLES = api;

    // 兼容旧拼写变体
    window._AL_ARTICLE = api;

    // 旧格式兼容属性（直接访问 .news / .knowledge 等）
    // 注意：这些是快照值，修改后不会自动同步到 localStorage
    api.notices = getNoticeArticles();
    api.news = getArticles('news');
    api.knowledge = getArticles('knowledge');
    api.about = getAboutArticle();

    // 自动初始化
    initData();
})();
