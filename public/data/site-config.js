/* ===========================================================
 *  站点全局配置 & 通用工具
 *  - 在每个使用联系方式的 HTML 中通过 <script src="data/site-config.js"> 引入
 *  - 暴露：
 *    1) window._AL_SITE              联系方式等站点级配置（单一数据源）
 *    2) window._AL_telLink(p?)       返回 tel: 链接
 *    3) window._AL_openWechat(id?)   唤起微信客服（移动端 deeplink + 桌面端弹层）
 *    4) window._AL_navigate(url)     平滑跳转（View Transitions API + 降级）
 *    5) window._AL_toast(msg, ms?)   顶部居中 toast
 *    6) window._AL_copyToClipboard(t) 剪贴板复制（含老浏览器降级）
 *  =========================================================== */
(function () {
  'use strict';

  /* ========== 1. 站点配置（联系方式等） ========== */
  window._AL_SITE = Object.assign(window._AL_SITE || {}, {
    brandName: '铝老板金属网',
    phone:    '13217121000',  // ← 与 index.html 联系我们 / 底部浮窗 / 文章 body 统一
    wechat:   '13217121000',  // ← 微信号（同号）
    address:  '湖北省孝感市天下循环经济产业园',
    amapCoord:'113.9268,30.9264',
  });

  /* ========== 1.5 用户态 & 权限检查 ========== */
  // 未登录、未会员：价格 / 含银量等敏感数据全部隐藏，显示「开通会员查看」
  // 后续对接真实登录态时，把 isLoggedIn / isMember 改成从后端接口 / URL token 读取
  window._AL_USER = Object.assign(window._AL_USER || {}, {
    isLoggedIn:        false,
    isMember:          false,
    nickname:          '',         // 用户昵称（localStorage 持久化）
    avatar:            '',         // 用户头像 base64 / URL
    loginAt:           0,          // 登录时间戳
    memberPackage:     '',         // 套餐 id
    memberPackageName: '',         // 套餐名
    memberExpireAt:    0,          // 会员到期时间戳（0 = 永久）
  });

  // 资料用 localStorage（关浏览器不丢，模拟真实登录态）
  // 会话标志用 sessionStorage（关浏览器即重置，避免残留）
  try {
    const profile = localStorage.getItem('_AL_USER_PROFILE');
    if (profile) {
      const obj = JSON.parse(profile);
      if (obj && typeof obj === 'object') {
        window._AL_USER = Object.assign(window._AL_USER, obj);
      }
    }

    // 从后台用户数据库（al_users）同步 VIP 信息，确保后台修改在前台生效
    if (window._AL_USER && window._AL_USER.isLoggedIn && window._AL_USER.nickname) {
      var alUsersRaw = localStorage.getItem('al_users');
      if (alUsersRaw) {
        var alUsers = JSON.parse(alUsersRaw);
        if (Array.isArray(alUsers)) {
          var matched = alUsers.find(function (u) {
            return u.name === window._AL_USER.nickname ||
                   (window._AL_USER._phone && u.phone === window._AL_USER._phone);
          });
          if (matched) {
            // 根据 al_users 中的 paid + vip + expire 同步到 _AL_USER
            window._AL_USER.isMember = matched.paid === true;
            window._AL_USER.memberPackageName = matched.vip || '';
            // 计算 memberPackage
            var pkgMap = { '体验版': 'trial', '全品类初级': 'basic', '全品类高级 30 天': 'std30', '全品类高级一年': 'std1y', '初级年会员': 'basic1y' };
            window._AL_USER.memberPackage = pkgMap[matched.vip] || '';
            // 计算会员到期时间戳
            if (matched.paid && matched.expire && matched.expire !== '-') {
              var d = new Date(matched.expire);
              if (!isNaN(d.getTime())) {
                window._AL_USER.memberExpireAt = d.getTime() + 24 * 60 * 60 * 1000; // 到期日 23:59:59
              }
            } else if (!matched.paid) {
              window._AL_USER.memberExpireAt = 0;
            }
            // 写回 _AL_USER_PROFILE 持久化
            window._AL_saveProfile();
          }
        }
      }
    }
  } catch (e) { /* localStorage 不可用或 al_users 同步失败 */ }

  // 权限检查
  //   level: 'public'（默认）| 'login'（需登录）| 'member'（需开通会员）| 'premium'（需高级会员，tag=STD）
  window._AL_canView = function (level) {
    if (!level || level === 'public') return true;
    if (level === 'login')  return !!window._AL_USER.isLoggedIn;
    if (level === 'member') return !!(window._AL_USER.isLoggedIn && window._AL_USER.isMember && (window._AL_USER.memberExpireAt === 0 || window._AL_USER.memberExpireAt > Date.now()));
    if (level === 'premium') {
      if (!window._AL_canView('member')) return false;
      const pkg = window._AL_getPackage ? window._AL_getPackage(window._AL_USER.memberPackage) : null;
      return !!(pkg && pkg.tag === 'STD');
    }
    return true;
  };

  /* ========== 1.6 登录守卫 ========== */
  // 智能跳转：
  //   - 未登录 → login.html?return=<current>
  //   - 已登录但未会员 → vip-center.html
  //   - 已会员 → 留在原页
  window._AL_requireMember = function (returnUrl) {
    const _dir = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    const _vipTarget = _dir + 'vip-center.html';
    if (!window._AL_USER.isLoggedIn) {
      const ret = returnUrl || (location.pathname + location.search);
      const url = 'login.html?return=' + encodeURIComponent(ret) + '&target=' + encodeURIComponent(_vipTarget);
      if (window._AL_navigate) window._AL_navigate(url);
      else location.href = url;
      return false;
    }
    if (!window._AL_canView('member')) {
      if (window._AL_navigate) window._AL_navigate('vip-center.html?return=' + encodeURIComponent(returnUrl || location.pathname + location.search));
      else location.href = 'vip-center.html?return=' + encodeURIComponent(returnUrl || location.pathname + location.search);
      return false;
    }
    return true;
  };

  // 锁标点击的统一处理：
  //   - 未登录   → login.html?return=<当前页>&target=vip-center.html
  //   - 已登录未会员 → vip-center.html?return=<当前页>（订阅完直接回到原页）
  //   - 已会员    → 留在原页（理论上不会出现）
  // target 链：login.html (注册/登录) → target=vip-center.html (订阅) → return=<原页> (返回)
  // 循环防护：进入 login 流程前打 sessionStorage 标记，避免「vip-center 返回 → login 自动跳回 vip-center」死循环
  window._AL_lockClick = function (e, productId) {
    // 统计付费信息点击
    if (window._AL_TRACK_PAID_CLICK) window._AL_TRACK_PAID_CLICK();
    e && e.preventDefault();
    e && e.stopPropagation();
    const ret = (location.pathname + location.search) || 'index.html';
    // 动态提取当前目录前缀，确保 target 路径与 return 路径一致
    const _dir = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    const _vipTarget = _dir + 'vip-center.html';
    if (!window._AL_USER || !window._AL_USER.isLoggedIn) {
      try { sessionStorage.setItem('_AL_loginAutoRedirected', '1'); } catch (err) {}
      const url = 'login.html?return=' + encodeURIComponent(ret) + '&target=' + encodeURIComponent(_vipTarget);
      if (window._AL_navigate) window._AL_navigate(url);
      else location.href = url;
    } else if (!window._AL_canView('member')) {
      const url = 'vip-center.html?return=' + encodeURIComponent(ret);
      if (window._AL_navigate) window._AL_navigate(url);
      else location.href = url;
    }
    // 已会员 → 不做任何事（让外层 <a> / 业务逻辑自行处理）
  };

  // 「开通会员查看」徽章 HTML（全站统一，低调锁标样式）
  //   size:     'sm' | 'md'   默认 sm
  //   iconOnly: true            只显示锁标图标（不显示文字），用于狭窄单元格
  // 设计：淡橙底 + 橙色字 + 锁图标，柔和不抢戏，但点击有响应反馈
  // 内置点击拦截：阻止冒泡到外层 <a>，调用 _AL_lockClick 智能跳转（未登录→login，已登录→vip-center）
  window._AL_lockBadge = function (text, size, iconOnly) {
    const t = text || '开通会员查看';
    const isSm = size !== 'md';
    const pad   = iconOnly ? 'p-1.5' : (isSm ? 'px-2.5 py-1.5' : 'px-3 py-2');
    const iconC = isSm ? 'w-3 h-3'       : 'w-3.5 h-3.5';
    const txtC  = isSm ? 'text-xs'       : 'text-sm';
    const wrapCls = iconOnly
      ? 'inline-flex items-center justify-center bg-al-orange-light rounded-lg cursor-pointer active:scale-95 transition ' + pad
      : 'inline-flex items-center gap-1.5 bg-al-orange-light rounded-lg cursor-pointer hover:bg-al-orange-light/80 active:scale-95 transition ' + pad;
    return (
      '<span class="' + wrapCls + '" ' +
              'onclick="event.preventDefault();event.stopPropagation();window._AL_lockClick&&_AL_lockClick(event)" ' +
              'title="点击登录 / 开通会员">' +
        '<i class="fas fa-lock text-al-orange ' + iconC + ' inline-flex items-center justify-center flex-shrink-0 leading-none"></i>' +
        (iconOnly ? '' : '<span class="' + txtC + ' text-al-orange font-medium leading-none whitespace-nowrap">' + t + '</span>') +
      '</span>'
    );
  };

  // 调试用：手动切换登录态（开发期间在 DevTools console 调用）
  //   _AL_login(false)   登录但未开通会员
  //   _AL_login(true)    登录 + 会员
  //   _AL_logout()       退出
  window._AL_login = function (asMember) {
    window._AL_USER.isLoggedIn = true;
    window._AL_USER.isMember   = !!asMember;
    if (asMember && !window._AL_USER.memberExpireAt) {
      window._AL_USER.memberExpireAt = Date.now() + 30 * 24 * 60 * 60 * 1000;  // 默认 30 天
    }
    window._AL_saveProfile();
    if (window._AL_toast) _AL_toast(asMember ? '已登录，已开通会员' : '已登录，未开通会员', 1500);
  };
  window._AL_logout = function () {
    window._AL_USER.isLoggedIn     = false;
    window._AL_USER.isMember       = false;
    window._AL_USER.nickname       = '';
    window._AL_USER.avatar         = '';
    window._AL_USER.loginAt        = 0;
    window._AL_USER.memberPackage  = '';
    window._AL_USER.memberExpireAt = 0;
    try { localStorage.removeItem('_AL_USER_PROFILE'); } catch (e) {}
    try { sessionStorage.removeItem('_AL_USER'); } catch (e) {}
    if (window._AL_toast) _AL_toast('已退出登录', 1200);
  };

  // 持久化用户资料到 localStorage
  window._AL_saveProfile = function () {
    try {
      const toSave = {
        isLoggedIn:        window._AL_USER.isLoggedIn,
        isMember:          window._AL_USER.isMember,
        nickname:          window._AL_USER.nickname,
        avatar:            window._AL_USER.avatar,
        loginAt:           window._AL_USER.loginAt,
        memberPackage:     window._AL_USER.memberPackage,
        memberPackageName: window._AL_USER.memberPackageName,
        memberExpireAt:    window._AL_USER.memberExpireAt,
        _phone:            window._AL_USER._phone || '',
      };
      localStorage.setItem('_AL_USER_PROFILE', JSON.stringify(toSave));
    } catch (e) { /* localStorage 不可用 */ }
  };

  // 会员套餐定义（vip-center.html 和 wechat-pay.html 共享）
  window._AL_PACKAGES = [
    { id: 'trial',  name: '体验版',              desc: '基础报价权益',         days: 1,    price: '6.60',   tag: 'TRIAL' },
    { id: 'basic',  name: '全品类初级',          desc: '基础报价权益',         days: 30,   price: '68.00',  tag: 'BASIC', featured: false },
    { id: 'std30',  name: '全品类高级 30 天',    desc: '尊享全部特权',         days: 30,   price: '328.00', tag: 'STD'    },
    { id: 'std1y',  name: '全品类高级一年',      desc: '送 2 个月，可看拆解数据', days: 365,  price: '1688.00', tag: 'STD', featured: true },
    { id: 'basic1y',name: '初级年会员',          desc: '只能看报价',           days: 365,  price: '488.00', tag: 'BASIC'  }
  ];
  window._AL_getPackage = function (id) {
    return (window._AL_PACKAGES || []).find(p => p.id === id) || null;
  };

  /* ========== 1.7 站点访问统计数据 ========== */
  // 所有统计数据持久化到 localStorage，每次进入网站时初始化
  window._AL_STATS = {
    today:                  '',
    todayPageViews:         0,
    todayModelQueries:      0,
    todayPriceViews:        0,
    todayUnitWeightViews:   0,
    todayPaidClicks:        0,
    yesterdayPageViews:     0,
    yesterdayModelQueries:  0,
    yesterdayPriceViews:    0,
    yesterdayUnitWeightViews: 0,
    yesterdayPaidClicks:    0,
    pageViewsHistory:       [],   // [{date, count}] 近7天
    cumulativePageViews:    0,
    cumulativeModelQueries: 0,
    cumulativePriceViews:   0,
    cumulativeUnitWeightViews: 0,
  };

  // 从 localStorage 恢复 & 跨日重置
  function _AL_initStats() {
    try {
      var raw = localStorage.getItem('_AL_STATS_DATA');
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') {
          window._AL_STATS = Object.assign(window._AL_STATS, saved);
        }
      }
    } catch (e) { /* localStorage 不可用，使用默认值 */ }

    var now = new Date();
    var todayStr = now.toDateString();

    // 跨日检测
    if (window._AL_STATS.today !== todayStr) {
      if (window._AL_STATS.today && window._AL_STATS.today !== todayStr) {
        // 将今日数据移到昨日
        window._AL_STATS.yesterdayPageViews       = window._AL_STATS.todayPageViews;
        window._AL_STATS.yesterdayModelQueries    = window._AL_STATS.todayModelQueries;
        window._AL_STATS.yesterdayPriceViews      = window._AL_STATS.todayPriceViews;
        window._AL_STATS.yesterdayUnitWeightViews = window._AL_STATS.todayUnitWeightViews;
        window._AL_STATS.yesterdayPaidClicks      = window._AL_STATS.todayPaidClicks;
        // 更新 pageViewsHistory：将昨天的数据写入历史
        var hist = window._AL_STATS.pageViewsHistory || [];
        var oldToday = window._AL_STATS.today;
        var foundOld = false;
        for (var hi = 0; hi < hist.length; hi++) {
          if (hist[hi].date === oldToday) {
            hist[hi].count = window._AL_STATS.yesterdayPageViews;
            foundOld = true;
            break;
          }
        }
        if (!foundOld && window._AL_STATS.yesterdayPageViews > 0) {
          hist.push({ date: oldToday, count: window._AL_STATS.yesterdayPageViews });
        }
        // 今日归零
        window._AL_STATS.todayPageViews       = 0;
        window._AL_STATS.todayModelQueries    = 0;
        window._AL_STATS.todayPriceViews      = 0;
        window._AL_STATS.todayUnitWeightViews = 0;
        window._AL_STATS.todayPaidClicks      = 0;
        // 添加今日占位到历史
        var foundToday = false;
        for (var hj = 0; hj < hist.length; hj++) {
          if (hist[hj].date === todayStr) { foundToday = true; break; }
        }
        if (!foundToday) {
          hist.push({ date: todayStr, count: 0 });
        }
        // 按日期排序
        hist.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
        // 保留最近 7 天
        if (hist.length > 7) hist = hist.slice(hist.length - 7);
        window._AL_STATS.pageViewsHistory = hist;
      }
      window._AL_STATS.today = todayStr;
      _AL_saveStats();
    }

    // 数据一致性修复：如果今日访问量为 0 但有历史数据，对齐
    var hist2 = window._AL_STATS.pageViewsHistory;
    if (hist2 && hist2.length > 0) {
      var lastDay = hist2[hist2.length - 1];
      if (lastDay.date === todayStr && window._AL_STATS.todayPageViews > 0 && lastDay.count < window._AL_STATS.todayPageViews) {
        lastDay.count = window._AL_STATS.todayPageViews;
        _AL_saveStats();
      } else if (lastDay.date === todayStr && window._AL_STATS.todayPageViews < lastDay.count) {
        window._AL_STATS.todayPageViews = lastDay.count;
        _AL_saveStats();
      }
    }

    // 首次使用无历史数据时，生成演示数据（仅用于原型展示曲线和功能占比）
    if (!window._AL_STATS.pageViewsHistory || window._AL_STATS.pageViewsHistory.length === 0) {
      var demoHistory = [];
      var demoNow = new Date();
      for (var d = 6; d >= 0; d--) {
        var day = new Date(demoNow);
        day.setDate(day.getDate() - d);
        demoHistory.push({
          date: day.toDateString(),
          count: Math.floor(Math.random() * 40) + 5  // 5~44 随机数
        });
      }
      window._AL_STATS.pageViewsHistory = demoHistory;
      window._AL_STATS.cumulativePageViews = demoHistory.reduce(function (s, item) { return s + item.count; }, 0);
      // 今日访问量对齐历史最新一天
      window._AL_STATS.todayPageViews = demoHistory[demoHistory.length - 1].count;
      window._AL_STATS.today = todayStr;
      // 昨日访问量对齐历史倒数第二天
      if (demoHistory.length >= 2) {
        window._AL_STATS.yesterdayPageViews = demoHistory[demoHistory.length - 2].count;
      } else {
        window._AL_STATS.yesterdayPageViews = 0;
      }
      // 其他昨日数据也给演示值，让增长率有显示
      window._AL_STATS.yesterdayModelQueries    = Math.floor(Math.random() * 15) + 3;
      window._AL_STATS.yesterdayPriceViews      = Math.floor(Math.random() * 12) + 2;
      window._AL_STATS.yesterdayUnitWeightViews = Math.floor(Math.random() * 8) + 1;
      window._AL_STATS.yesterdayPaidClicks      = Math.floor(Math.random() * 5) + 1;
      // 三项功能模块的演示数据
      window._AL_STATS.cumulativeModelQueries    = Math.floor(Math.random() * 80) + 20;   // 20~99
      window._AL_STATS.cumulativePriceViews      = Math.floor(Math.random() * 60) + 10;   // 10~69
      window._AL_STATS.cumulativeUnitWeightViews = Math.floor(Math.random() * 40) + 5;    // 5~44
      _AL_saveStats();
    }
  }

  // 持久化
  function _AL_saveStats() {
    try {
      localStorage.setItem('_AL_STATS_DATA', JSON.stringify(window._AL_STATS));
    } catch (e) { /* localStorage 不可用 */ }
  }

  // 获取完整统计数据
  window._AL_GET_STATS = function () {
    return window._AL_STATS;
  };

  // ===== 跟踪函数 =====

  // 页面访问
  window._AL_TRACK_PAGE_VIEW = function () {
    window._AL_STATS.todayPageViews = (window._AL_STATS.todayPageViews || 0) + 1;
    window._AL_STATS.cumulativePageViews = (window._AL_STATS.cumulativePageViews || 0) + 1;
    // 更新历史趋势
    var now = new Date();
    var todayStr2 = now.toDateString();
    var history = window._AL_STATS.pageViewsHistory || [];
    var found = false;
    for (var i = 0; i < history.length; i++) {
      if (history[i].date === todayStr2) {
        history[i].count = (history[i].count || 0) + 1;
        found = true;
        break;
      }
    }
    if (!found) {
      history.push({ date: todayStr2, count: 1 });
    }
    // 只保留最近 7 天
    if (history.length > 7) {
      history = history.slice(history.length - 7);
    }
    window._AL_STATS.pageViewsHistory = history;
    _AL_saveStats();
  };

  // 型号查询
  window._AL_TRACK_MODEL_QUERY = function () {
    window._AL_STATS.todayModelQueries = (window._AL_STATS.todayModelQueries || 0) + 1;
    window._AL_STATS.cumulativeModelQueries = (window._AL_STATS.cumulativeModelQueries || 0) + 1;
    _AL_saveStats();
  };

  // 回收价浏览
  window._AL_TRACK_PRICE_VIEW = function () {
    window._AL_STATS.todayPriceViews = (window._AL_STATS.todayPriceViews || 0) + 1;
    window._AL_STATS.cumulativePriceViews = (window._AL_STATS.cumulativePriceViews || 0) + 1;
    _AL_saveStats();
  };

  // 单位重量浏览
  window._AL_TRACK_UNIT_WEIGHT_VIEW = function () {
    window._AL_STATS.todayUnitWeightViews = (window._AL_STATS.todayUnitWeightViews || 0) + 1;
    window._AL_STATS.cumulativeUnitWeightViews = (window._AL_STATS.cumulativeUnitWeightViews || 0) + 1;
    _AL_saveStats();
  };

  // 付费信息点击
  window._AL_TRACK_PAID_CLICK = function () {
    window._AL_STATS.todayPaidClicks = (window._AL_STATS.todayPaidClicks || 0) + 1;
    _AL_saveStats();
  };

  // 立即初始化统计
  _AL_initStats();

  /* ========== 2. tel: 链接 ========== */
  window._AL_telLink = function (phone) {
    return 'tel:' + (phone || window._AL_SITE.phone);
  };

  /* ========== 3. 唤起微信客服 ========== */
  window._AL_openWechat = function (wechatId) {
    const id = wechatId || window._AL_SITE.wechat;
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const isInWechat = /MicroMessenger/i.test(ua);

    // 1. 已经在微信里：直接跳到 wechat-cs.html 承载页（带"复制微信号"提示）
    if (isInWechat) {
      if (window._AL_navigate) window._AL_navigate('wechat-cs.html');
      else window.location.href = 'wechat-cs.html';
      return;
    }

    // 2. 移动端：先尝试 weixin:// 唤起，失败则跳 wechat-cs.html
    if (isMobile) {
      _AL_toast('正在打开微信…', 1500);
      const t0 = Date.now();
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;opacity:0;';
      iframe.src = 'weixin://';
      document.body.appendChild(iframe);
      setTimeout(function () {
        iframe.remove();
        // 唤起成功时浏览器已经离开页面；未离开则跳承载页
        if (Date.now() - t0 < 1500 && document.visibilityState === 'visible') {
          if (window._AL_navigate) window._AL_navigate('wechat-cs.html');
          else window.location.href = 'wechat-cs.html';
        }
      }, 800);
    } else {
      // 3. 桌面端：直接跳承载页
      if (window._AL_navigate) window._AL_navigate('wechat-cs.html');
      else window.location.href = 'wechat-cs.html';
    }
  };

  /* ========== 4. 平滑跳转（跨页导航，不使用 View Transitions API） ========== */
  // 注意：document.startViewTransition 仅适用于同页 DOM 切换（SPA 场景），
  //       跨页 location.href 放入其回调会导致部分浏览器静默失败（点击无反应）。
  //       此处用简单的淡出过渡 + 直接跳转替代。
  window._AL_navigate = function (url) {
    try {
      // 简单淡出效果
      document.body.style.transition = 'opacity 0.15s ease';
      document.body.style.opacity = '0';
      setTimeout(function () {
        window.location.href = url;
      }, 150);
    } catch (e) {
      window.location.href = url;
    }
  };

  /* ========== 5. Toast（顶部居中，自动消失） ========== */
  window._AL_toast = function (message, duration) {
    duration = duration || 2000;
    let toast = document.getElementById('_AL_toast_el');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = '_AL_toast_el';
      toast.style.cssText = [
        'position:fixed', 'top:84px', 'left:50%', 'transform:translateX(-50%) translateY(-8px)',
        'z-index:300', 'background:rgba(17,24,39,0.92)', 'color:#fff',
        'font-size:13px', 'font-weight:500', 'line-height:1.4',
        'padding:9px 18px', 'border-radius:9999px',
        'box-shadow:0 6px 24px rgba(0,0,0,0.18)',
        'backdrop-filter:blur(8px)', '-webkit-backdrop-filter:blur(8px)',
        'opacity:0', 'transition:opacity .2s ease, transform .25s ease',
        'pointer-events:none', 'max-width:80vw', 'text-align:center',
        'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis'
      ].join(';');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-8px)';
    }, duration);
  };

  /* ========== 6. 复制到剪贴板（带降级） ========== */
  window._AL_copyToClipboard = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return _AL_fallbackCopy(text);
      });
    }
    return Promise.resolve(_AL_fallbackCopy(text));
  };
  function _AL_fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ========== 内部：微信 ID 弹层（移动唤起失败 / 桌面端使用） ========== */
  function _AL_showWechatModal(wechatId) {
    // 防止重复创建
    let modal = document.getElementById('_AL_wechat_modal');
    if (modal) {
      modal.querySelector('[data-id]').textContent = wechatId;
      modal.style.display = 'flex';
      return;
    }
    modal = document.createElement('div');
    modal.id = '_AL_wechat_modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:250;display:flex;align-items:center;justify-content:center;padding:24px;';
    modal.innerHTML =
      '<div data-overlay style="position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);"></div>' +
      '<div data-card style="position:relative;background:#fff;border-radius:20px;padding:24px 22px;width:100%;max-width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.25);">' +
        '<div style="text-align:center;margin-bottom:16px;">' +
          '<div style="width:56px;height:56px;margin:0 auto 12px;background:linear-gradient(135deg,#10B981 0%,#059669 100%);border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(16,185,129,0.3);">' +
            '<svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 4C4.5 4 1 6.7 1 10.2c0 1.9 1 3.6 2.7 4.8L3 17l2.5-1.3c.7.2 1.5.3 2.3.3.3 0 .5 0 .8-.1-.2-.6-.3-1.2-.3-1.8 0-3.4 3.3-6.1 7.4-6.1.3 0 .6 0 .9.1C16 5.6 12.5 4 8.5 4zM6 8.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm5 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/><path d="M23 16.5c0-2.9-2.9-5.2-6.5-5.2-3.7 0-6.5 2.3-6.5 5.2 0 2.9 2.8 5.2 6.5 5.2.7 0 1.4-.1 2.1-.3L20.5 22l-.5-1.6c1.8-1 3-2.6 3-3.9zm-8.5-1.4c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm4 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"/></svg>' +
          '</div>' +
          '<h3 style="font-size:17px;font-weight:800;color:#1F2937;margin:0 0 4px;">添加微信客服</h3>' +
          '<p style="font-size:12px;color:#6B7280;margin:0;line-height:1.5;">复制下方微信号<br>粘贴到微信中搜索添加</p>' +
        '</div>' +
        '<div style="background:#F3F4F6;border-radius:12px;padding:12px 14px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
          '<span data-id style="font-family:ui-monospace,Menlo,monospace;font-size:15px;font-weight:700;color:#1F2937;letter-spacing:0.5px;">' + wechatId + '</span>' +
          '<button data-copy style="background:#10B981;color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:8px;border:none;cursor:pointer;flex-shrink:0;transition:opacity .15s;">复制</button>' +
        '</div>' +
        '<button data-close style="width:100%;height:40px;background:#F3F4F6;color:#6B7280;font-size:13px;font-weight:600;border-radius:12px;border:none;cursor:pointer;transition:background .15s;">关闭</button>' +
      '</div>';
    document.body.appendChild(modal);

    function close() { modal.style.display = 'none'; }
    function copy() {
      _AL_copyToClipboard(wechatId);
      const btn = modal.querySelector('[data-copy]');
      const orig = btn.textContent;
      btn.textContent = '已复制';
      btn.style.opacity = '0.75';
      setTimeout(function () { btn.textContent = orig; btn.style.opacity = '1'; }, 1500);
      _AL_toast('已复制微信号', 1500);
    }
    modal.querySelector('[data-overlay]').addEventListener('click', close);
    modal.querySelector('[data-close]').addEventListener('click', close);
    modal.querySelector('[data-copy]').addEventListener('click', copy);
  }

  /* ========== 7. 自动统计页面访问 ========== */
  // 检测当前页面是否属于 mini-program 目录，若是则自动统计一次访问量
  try {
    var _path = location.pathname || '';
    if (_path.indexOf('/miniprogram/') >= 0 || /^\/?(index\.html)?$/.test(_path)) {
      setTimeout(function () {
        if (window._AL_TRACK_PAGE_VIEW) window._AL_TRACK_PAGE_VIEW();
      }, 200);
    }
  } catch (e) { /* 页面访问统计失败，不影响其他功能 */ }

})();
