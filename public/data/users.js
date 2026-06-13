/* ===========================================================
 *  用户数据缓存（window._AL_USERS）
 *  - 通过 <script src="/data/users.js"> 引入
 *  - 初始化：localStorage 无数据时从本文件硬编码写入；有数据时读 localStorage
 *  - 所有后台用户管理操作读写 localStorage
 *  =========================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'al_users';

  // ── 硬编码初始用户数据 ──────────────────────────────────
  var SEED = [
    {
      id: 'u1', name: '张老板', phone: '13812348888',
      avatarChar: '张', avatarGradient: 'from-amber-400 to-amber-500',
      vip: '全品类高级一年', expire: '2026-12-31', regDate: '2026-01-15',
      paid: true, disabled: false
    },
    {
      id: 'u2', name: '李工', phone: '13912345678',
      avatarChar: '李', avatarGradient: 'from-blue-400 to-blue-500',
      vip: '全品类高级 30 天', expire: '2026-09-15', regDate: '2026-02-20',
      paid: true, disabled: false
    },
    {
      id: 'u3', name: '王姐', phone: '18612349012',
      avatarChar: '王', avatarGradient: 'from-purple-400 to-purple-500',
      vip: '全品类初级', expire: '2026-07-10', regDate: '2026-03-05',
      paid: true, disabled: false
    },
    {
      id: 'u4', name: '陈师傅', phone: '13712343456',
      avatarChar: '陈', avatarGradient: 'from-cyan-400 to-cyan-500',
      vip: '无', expire: '-', regDate: '2026-04-18',
      paid: false, disabled: false
    },
    {
      id: 'u5', name: '赵先生', phone: '15812347777',
      avatarChar: '赵', avatarGradient: 'from-rose-400 to-rose-500',
      vip: '无', expire: '-', regDate: '2026-05-02',
      paid: false, disabled: false
    },
    {
      id: 'u6', name: '旧账号', phone: '13512340000',
      avatarChar: '旧', avatarGradient: 'from-metal-300 to-metal-400',
      vip: '无', expire: '-', regDate: '2026-01-10',
      paid: false, disabled: true
    }
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
    return load();
  }

  function getById(id) {
    return getAll().find(function (u) { return u.id === id; }) || null;
  }

  function getPaid() {
    return getAll().filter(function (u) { return u.paid === true; });
  }

  function getDisabled() {
    return getAll().filter(function (u) { return u.disabled === true; });
  }

  function add(user) {
    var list = getAll();
    if (!user.id) user.id = 'u' + Date.now();
    list.push(user);
    save(list);
    return list;
  }

  function update(id, patch) {
    var list = getAll();
    var item = list.find(function (u) { return u.id === id; });
    if (item) {
      Object.keys(patch).forEach(function (k) { item[k] = patch[k]; });
      save(list);
    }
    return item;
  }

  function toggleDisabled(id) {
    var list = getAll();
    var item = list.find(function (u) { return u.id === id; });
    if (item) {
      item.disabled = !item.disabled;
      save(list);
    }
    return item;
  }

  function remove(id) {
    var list = getAll().filter(function (u) { return u.id !== id; });
    save(list);
    return list;
  }

  function getSummary() {
    var all = getAll();
    return {
      total: all.length,
      paidCount: all.filter(function (u) { return u.paid; }).length,
      disabledCount: all.filter(function (u) { return u.disabled; }).length
    };
  }

  function reset() {
    save(SEED);
    return SEED.slice();
  }

  // ── 暴露全局数据和方法 ──────────────────────────────────
  window._AL_USERS = {
    getAll: getAll,
    getById: getById,
    getPaid: getPaid,
    getDisabled: getDisabled,
    add: add,
    update: update,
    toggleDisabled: toggleDisabled,
    remove: remove,
    getSummary: getSummary,
    reset: reset,
    SEED: SEED
  };
})();
