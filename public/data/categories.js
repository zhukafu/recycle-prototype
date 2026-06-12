/* ===========================================================
 *  分类数据缓存（window._AL_CATEGORIES + window._AL_CATS）
 *  - 品牌 × 产品类型 组合维度的一级分类
 *  - 通过 <script src="/data/categories.js"> 引入
 *  - 初始化：localStorage 无数据时从本文件硬编码写入；有数据时读 localStorage
 *  - 清除缓存后刷新页面 → 重新从本文件初始化
 *  =========================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'al_categories';

  // ── 硬编码初始分类数据 ──────────────────────────────────
  var SEED = [
    // 正泰
    { id: 'cat_zt_contactor', name: '正泰接触器',   brand: '正泰',     type: 'contactor', icon: '正', gradient: 'gradient-red',    visible: true, sort: 1  },
    { id: 'cat_zt_breaker',   name: '正泰断路器',   brand: '正泰',     type: 'breaker',   icon: '正', gradient: 'gradient-red',    visible: true, sort: 2  },
    { id: 'cat_zt_switch',    name: '正泰开关',     brand: '正泰',     type: 'switch',    icon: '正', gradient: 'gradient-red',    visible: true, sort: 3  },
    { id: 'cat_zt_relay',     name: '正泰继电器',   brand: '正泰',     type: 'relay',     icon: '正', gradient: 'gradient-red',    visible: false, sort: 31 },
    // 德力西
    { id: 'cat_dlx_contactor', name: '德力西接触器', brand: '德力西',   type: 'contactor', icon: '德', gradient: 'gradient-orange', visible: true, sort: 4  },
    { id: 'cat_dlx_breaker',   name: '德力西断路器', brand: '德力西',   type: 'breaker',   icon: '德', gradient: 'gradient-orange', visible: true, sort: 5  },
    { id: 'cat_dlx_switch',    name: '德力西开关',   brand: '德力西',   type: 'switch',    icon: '德', gradient: 'gradient-orange', visible: true, sort: 6  },
    // 施耐德
    { id: 'cat_snd_contactor', name: '施耐德接触器', brand: '施耐德',   type: 'contactor', icon: '施', gradient: 'gradient-green',  visible: true, sort: 7  },
    { id: 'cat_snd_breaker',   name: '施耐德断路器', brand: '施耐德',   type: 'breaker',   icon: '施', gradient: 'gradient-green',  visible: true, sort: 8  },
    { id: 'cat_snd_switch',    name: '施耐德开关',   brand: '施耐德',   type: 'switch',    icon: '施', gradient: 'gradient-green',  visible: true, sort: 9  },
    // 西门子
    { id: 'cat_xmz_contactor', name: '西门子接触器', brand: '西门子',   type: 'contactor', icon: '西', gradient: 'gradient-teal',   visible: true, sort: 10 },
    // 富士
    { id: 'cat_fs_contactor',  name: '富士接触器',   brand: '富士',     type: 'contactor', icon: '富', gradient: 'gradient-purple', visible: true, sort: 11 },
    // 三菱
    { id: 'cat_sl_contactor',  name: '三菱接触器',   brand: '三菱',     type: 'contactor', icon: '三', gradient: 'gradient-blue',   visible: true, sort: 12 },
    // 伊顿
    { id: 'cat_yd_contactor',  name: '伊顿接触器',   brand: '伊顿',     type: 'contactor', icon: '伊', gradient: 'gradient-red',    visible: true, sort: 13 },
    // 人民电器
    { id: 'cat_rm_contactor', name: '人民电器接触器', brand: '人民电器', type: 'contactor', icon: '人', gradient: 'gradient-orange', visible: true, sort: 14 },
    { id: 'cat_rm_breaker',   name: '人民电器断路器', brand: '人民电器', type: 'breaker',   icon: '人', gradient: 'gradient-orange', visible: true, sort: 15 },
    { id: 'cat_rm_relay',     name: '人民电器继电器', brand: '人民电器', type: 'relay',     icon: '人', gradient: 'gradient-orange', visible: false, sort: 32 },
    // 常熟
    { id: 'cat_cs_breaker',   name: '常熟断路器',    brand: '常熟',     type: 'breaker',   icon: '常', gradient: 'gradient-teal',   visible: true, sort: 16 },
    // 士林
    { id: 'cat_sl2_contactor', name: '士林接触器',   brand: '士林',     type: 'contactor', icon: '士', gradient: 'gradient-yellow', visible: true, sort: 17 },
    // 产电 (LS)
    { id: 'cat_cd_contactor',  name: '产电接触器',   brand: '产电',     type: 'contactor', icon: '产', gradient: 'gradient-blue',   visible: true, sort: 18 },
    // 欧姆龙
    { id: 'cat_oml_relay',    name: '欧姆龙继电器',  brand: '欧姆龙',   type: 'relay',     icon: '欧', gradient: 'gradient-blue',   visible: false, sort: 33 },
    // 特殊分类（基于 tag 聚合）
    { id: 'cat_tag_yindian',   name: '银触点价格',   brand: '',         type: '',          icon: '银', gradient: 'gradient-yellow', visible: true, sort: 20, tagMatch: '银触点价格' },
    { id: 'cat_tag_rongduan',  name: '熔断器',       brand: '',         type: 'breaker',   icon: '熔', gradient: 'gradient-red',    visible: true, sort: 21, tagMatch: '熔断器' },
    { id: 'cat_tag_wanneng',   name: '万能断路器',   brand: '',         type: 'breaker',   icon: '万', gradient: 'gradient-purple', visible: true, sort: 22, tagMatch: '万能断路器' }
  ];

  // ── 初始化逻辑 ──────────────────────────────────────────
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { return JSON.parse(raw); }
    } catch (e) { /* ignore */ }
    // 首次：写入 localStorage
    save(SEED);
    return SEED.slice();
  }

  function save(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getAll() {
    return load().sort(function (a, b) { return (a.sort || 999) - (b.sort || 999); });
  }

  function getVisible() {
    return getAll().filter(function (c) { return c.visible !== false; });
  }

  function getById(id) {
    return getAll().find(function (c) { return c.id === id; }) || null;
  }

  function toggleVisible(id) {
    var list = load();
    var item = list.find(function (c) { return c.id === id; });
    if (item) {
      item.visible = !item.visible;
      save(list);
    }
    return item;
  }

  function remove(id) {
    var list = load().filter(function (c) { return c.id !== id; });
    save(list);
    return list;
  }

  function add(cat) {
    var list = load();
    list.push(cat);
    save(list);
    return list;
  }

  function update(id, patch) {
    var list = load();
    var item = list.find(function (c) { return c.id === id; });
    if (item) {
      Object.keys(patch).forEach(function (k) { item[k] = patch[k]; });
      save(list);
    }
    return item;
  }

  function reset() {
    save(SEED);
    return SEED.slice();
  }

  // ── 暴露全局数据和工具方法 ──────────────────────────────
  window._AL_CATEGORIES = load();
  window._AL_CATS = {
    getAll: getAll,
    getVisible: getVisible,
    getById: getById,
    toggleVisible: toggleVisible,
    save: save,
    reset: reset,
    remove: remove,
    add: add,
    update: update,
    SEED: SEED
  };
})();
