/**
 * ═══════════════════════════════════════════════════════════════
 *  铝老板金属网 — 金属报价数据接口 v1.0
 * ═══════════════════════════════════════════════════════════════
 *
 * 【接口概览】
 *
 *  数据结构：
 *    ┌─────────────────────────────────────────┐
 *    │  quotes: {                              │
 *    │    precious:  QuoteItem[]   贵金属      │
 *    │    nonferrous: QuoteItem[]  有色金属    │
 *    │    rare:       QuoteItem[]  稀有金属    │
 *    │    ferrous:    QuoteItem[]  黑色金属    │
 *    │    scrap:      QuoteItem[]  废料        │
 *    │  }                                      │
 *    │  meta: {                                │
 *    │    updatedAt: string   最后更新时间      │
 *    │    updater: string     更新人           │
 *    │  }                                      │
 *    └─────────────────────────────────────────┘
 *
 *  QuoteItem 字段：
 *    id, name, code, unit, price, change, pct,
 *    up (boolean), color, note, category
 *
 * 【API 方法】
 *    getData()                  → 获取完整原始数据对象
 *    getQuotes(category)        → 按分类获取报价列表
 *    getAllQuotes()              → 获取全部报价（扁平数组）
 *    getDetail(id)              → 按 ID 获取单条报价详情
 *    saveData(data)             → 写入 localStorage
 *    updateQuote(id, updates)   → 更新报价
 *    addQuote(quote)            → 新增报价
 *    deleteQuote(id)            → 删除报价
 *    getCategories()            → 获取分类列表
 *    getSummary()               → 获取行情汇总信息
 *
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
    var STORAGE_KEY = '_AL_QUOTES';

    // ================================================================
    //  分类定义
    // ================================================================
    var CATEGORIES = [
        { key: 'precious',   label: '贵金属' },
        { key: 'nonferrous', label: '有色金属' },
        { key: 'rare',       label: '稀有金属' },
        { key: 'ferrous',    label: '黑色金属' },
        { key: 'scrap',      label: '废料' }
    ];

    // ================================================================
    //  默认数据
    // ================================================================
    var DEFAULT_DATA = {
        meta: {
            updatedAt: '2026-06-09 14:32:00',
            updater: '系统初始化'
        },
        quotes: {
            precious: [
                { id: 'q-au', name: '黄金', code: 'Au', unit: '元/克', price: '558.30', change: '+1.78', pct: '+0.32%', up: true, color: 'amber', note: '国际金价震荡', category: 'precious' },
                { id: 'q-ag', name: '白银', code: 'Ag', unit: '元/克', price: '7.36', change: '+0.13', pct: '+1.80%', up: true, color: 'slate', note: '工业需求强劲', category: 'precious' },
                { id: 'q-pt', name: '铂金', code: 'Pt', unit: '元/克', price: '226.80', change: '-1.02', pct: '-0.45%', up: false, color: 'cyan', note: '汽车催化需求疲软', category: 'precious' },
                { id: 'q-pd', name: '钯金', code: 'Pd', unit: '元/克', price: '248.50', change: '+2.12', pct: '+0.86%', up: true, color: 'fuchsia', note: '供应紧张', category: 'precious' },
                { id: 'q-rh', name: '铑金', code: 'Rh', unit: '元/克', price: '986.00', change: '-15.50', pct: '-1.55%', up: false, color: 'rose', note: '高位回调', category: 'precious' },
                { id: 'q-ru', name: '钌', code: 'Ru', unit: '元/克', price: '88.20', change: '+0.65', pct: '+0.74%', up: true, color: 'indigo', note: '电子工业需求', category: 'precious' }
            ],
            nonferrous: [
                { id: 'q-cu', name: '紫铜', code: 'Cu', unit: '元/吨', price: '73,200', change: '+450', pct: '+0.62%', up: true, color: 'orange', note: '宏观利好', category: 'nonferrous' },
                { id: 'q-cuzn', name: '黄铜', code: 'CuZn', unit: '元/吨', price: '52,800', change: '+220', pct: '+0.42%', up: true, color: 'amber', note: '跟随铜价', category: 'nonferrous' },
                { id: 'q-al', name: '铝', code: 'Al', unit: '元/吨', price: '20,650', change: '-85', pct: '-0.41%', up: false, color: 'slate', note: '库存累积', category: 'nonferrous' },
                { id: 'q-zn', name: '锌', code: 'Zn', unit: '元/吨', price: '23,180', change: '+95', pct: '+0.41%', up: true, color: 'cyan', note: '冶炼端限产', category: 'nonferrous' },
                { id: 'q-pb', name: '铅', code: 'Pb', unit: '元/吨', price: '16,950', change: '-30', pct: '-0.18%', up: false, color: 'gray', note: '需求平淡', category: 'nonferrous' },
                { id: 'q-sn', name: '锡', code: 'Sn', unit: '元/吨', price: '265,800', change: '+1,200', pct: '+0.45%', up: true, color: 'fuchsia', note: '电子焊料需求', category: 'nonferrous' }
            ],
            rare: [
                { id: 'q-w', name: '钨', code: 'W', unit: '元/吨', price: '132,500', change: '+800', pct: '+0.61%', up: true, color: 'amber', note: '硬质合金需求', category: 'rare' },
                { id: 'q-mo', name: '钼', code: 'Mo', unit: '元/吨', price: '358,000', change: '-1,500', pct: '-0.42%', up: false, color: 'orange', note: '钢厂招标价走低', category: 'rare' },
                { id: 'q-li', name: '锂', code: 'Li', unit: '万元/吨', price: '89.50', change: '-0.85', pct: '-0.94%', up: false, color: 'green', note: '新能源需求放缓', category: 'rare' },
                { id: 'q-co', name: '钴', code: 'Co', unit: '元/吨', price: '186,000', change: '+1,200', pct: '+0.65%', up: true, color: 'cyan', note: '动力电池回暖', category: 'rare' },
                { id: 'q-in', name: '铟', code: 'In', unit: '元/kg', price: '2,580', change: '+45', pct: '+1.78%', up: true, color: 'indigo', note: 'ITO靶材需求', category: 'rare' },
                { id: 'q-ge', name: '锗', code: 'Ge', unit: '元/kg', price: '13,200', change: '-120', pct: '-0.90%', up: false, color: 'rose', note: '出口管制影响', category: 'rare' }
            ],
            ferrous: [
                { id: 'q-rb', name: '螺纹钢', code: 'RB', unit: '元/吨', price: '3,580', change: '+12', pct: '+0.34%', up: true, color: 'slate', note: '需求季节性回暖', category: 'ferrous' },
                { id: 'q-hc', name: '热卷', code: 'HC', unit: '元/吨', price: '3,720', change: '-8', pct: '-0.21%', up: false, color: 'gray', note: '库存压力', category: 'ferrous' },
                { id: 'q-i', name: '铁矿石', code: 'I', unit: '元/吨', price: '825', change: '+5', pct: '+0.61%', up: true, color: 'amber', note: '澳洲发货减少', category: 'ferrous' },
                { id: 'q-fs', name: '废钢', code: 'FS', unit: '元/吨', price: '2,580', change: '+18', pct: '+0.70%', up: true, color: 'orange', note: '电炉钢厂复产', category: 'ferrous' }
            ],
            scrap: [
                { id: 'q-cu-s', name: '废铜', code: 'Cu-S', unit: '元/吨', price: '68,500', change: '+300', pct: '+0.44%', up: true, color: 'orange', note: '光亮铜线参考价', category: 'scrap' },
                { id: 'q-al-s', name: '废铝', code: 'Al-S', unit: '元/吨', price: '16,200', change: '-50', pct: '-0.31%', up: false, color: 'slate', note: '生铝易拉罐参考', category: 'scrap' },
                { id: 'q-ss-s', name: '废不锈钢', code: 'SS-S', unit: '元/吨', price: '11,800', change: '+80', pct: '+0.68%', up: true, color: 'cyan', note: '304边角料参考', category: 'scrap' },
                { id: 'q-ag-s', name: '含银废料', code: 'Ag-S', unit: '元/kg', price: '6.85', change: '+0.11', pct: '+1.63%', up: true, color: 'slate', note: '接触器触点参考', category: 'scrap' }
            ]
        }
    };


    // ================================================================
    //  数据持久化
    // ================================================================
    function initData() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
                console.log('[quotes.js] 默认数据已初始化到 localStorage');
            }
        } catch (e) {
            console.warn('[quotes.js] localStorage 初始化失败', e);
        }
    }

    /** 获取完整原始数据对象 */
    function getData() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return DEFAULT_DATA;
    }

    /** 写入数据到 localStorage */
    function saveData(data) {
        try {
            data = data || {};
            data.meta = data.meta || {};
            data.meta.updatedAt = formatNow();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('[quotes.js] localStorage 保存失败', e);
            return false;
        }
    }

    function formatNow() {
        var d = new Date();
        var pad = function (n) { return n.toString().padStart(2, '0'); };
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
            ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }


    // ================================================================
    //  报价查询 API
    // ================================================================

    /**
     * 按分类获取报价列表
     * @param {string} category - precious|nonferrous|rare|ferrous|scrap
     * @returns {QuoteItem[]}
     */
    function getQuotes(category) {
        var data = getData();
        if (category && data.quotes && data.quotes[category]) {
            return data.quotes[category];
        }
        return [];
    }

    /** 获取全部报价（扁平数组） */
    function getAllQuotes() {
        var data = getData();
        var all = [];
        if (data.quotes) {
            Object.keys(data.quotes).forEach(function (cat) {
                all = all.concat(data.quotes[cat] || []);
            });
        }
        return all;
    }

    /** 按 ID 获取单条报价 */
    function getDetail(id) {
        var all = getAllQuotes();
        for (var i = 0; i < all.length; i++) {
            if (all[i].id === id) return all[i];
        }
        return null;
    }

    /** 获取分类列表 */
    function getCategories() {
        return CATEGORIES.slice();
    }

    /** 获取行情汇总（上涨品种数 / 总品种数） */
    function getSummary() {
        var all = getAllQuotes();
        var total = all.length;
        var upCount = 0;
        all.forEach(function (it) { if (it.up) upCount++; });
        var data = getData();
        return {
            total: total,
            upCount: upCount,
            updatedAt: (data.meta && data.meta.updatedAt) || ''
        };
    }


    // ================================================================
    //  报价增删改 API
    // ================================================================

    /** 新增报价 */
    function addQuote(quote) {
        var data = getData();
        if (!data.quotes) data.quotes = {};
        var cat = quote.category || 'scrap';
        if (!data.quotes[cat]) data.quotes[cat] = [];
        if (!quote.id) quote.id = 'q-' + Date.now();
        data.quotes[cat].push(quote);
        return saveData(data);
    }

    /** 根据 ID 更新报价 */
    function updateQuote(id, updates) {
        var data = getData();
        if (!data.quotes) return false;
        var cats = Object.keys(data.quotes);
        for (var c = 0; c < cats.length; c++) {
            var list = data.quotes[cats[c]];
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    // 如果分类变更，需要迁移
                    if (updates.category && updates.category !== cats[c]) {
                        var item = list.splice(i, 1)[0];
                        Object.assign(item, updates);
                        if (!data.quotes[updates.category]) data.quotes[updates.category] = [];
                        data.quotes[updates.category].push(item);
                    } else {
                        Object.assign(list[i], updates);
                    }
                    return saveData(data);
                }
            }
        }
        return false;
    }

    /** 根据 ID 删除报价 */
    function deleteQuote(id) {
        var data = getData();
        if (!data.quotes) return false;
        var found = false;
        Object.keys(data.quotes).forEach(function (cat) {
            var before = data.quotes[cat].length;
            data.quotes[cat] = data.quotes[cat].filter(function (q) { return q.id !== id; });
            if (data.quotes[cat].length < before) found = true;
        });
        if (found) return saveData(data);
        return false;
    }

    /** 重置为默认数据 */
    function resetData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
            console.log('[quotes.js] 数据已重置为默认值');
            return true;
        } catch (e) {
            console.warn('[quotes.js] 重置失败', e);
            return false;
        }
    }


    // ================================================================
    //  行情配置 API（刷新频率、展示金属等）
    // ================================================================
    var CONFIG_KEY = '_AL_QUOTES_CONFIG';

    var DEFAULT_CONFIG = {
        refreshInterval: 900,   // 默认 15 分钟（秒）
        displayMetals: [],      // 空数组表示全部展示
        displayStyle: 'list'    // list | grid | banner
    };

    /** 获取行情配置 */
    function getConfig() {
        try {
            var stored = localStorage.getItem(CONFIG_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        return Object.assign({}, DEFAULT_CONFIG);
    }

    /** 保存行情配置 */
    function saveConfig(config) {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
            return true;
        } catch (e) {
            console.warn('[quotes.js] 配置保存失败', e);
            return false;
        }
    }

    /** 获取刷新间隔（秒），返回 0 表示手动刷新 */
    function getRefreshInterval() {
        var config = getConfig();
        var val = parseInt(config.refreshInterval, 10);
        return isNaN(val) ? 900 : val;
    }


    // ================================================================
    //  向外暴露
    // ================================================================
    var api = {
        // 核心数据
        getData: getData,
        saveData: saveData,

        // 查询
        getQuotes: getQuotes,
        getAllQuotes: getAllQuotes,
        getDetail: getDetail,
        getCategories: getCategories,
        getSummary: getSummary,

        // 增删改
        addQuote: addQuote,
        updateQuote: updateQuote,
        deleteQuote: deleteQuote,
        resetData: resetData,

        // 行情配置
        getConfig: getConfig,
        saveConfig: saveConfig,
        getRefreshInterval: getRefreshInterval
    };

    window._AL_QUOTES = api;

    // 自动初始化
    initData();
})();
