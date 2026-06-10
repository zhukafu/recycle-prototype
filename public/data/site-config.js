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

    // 已经在微信里：直接复制 + 提示用户去搜索
    if (isInWechat) {
      _AL_copyToClipboard(id).then(function () {
        _AL_toast('微信号已复制，请到微信中搜索', 2200);
      });
      return;
    }

    // 移动端：尝试 weixin:// 唤起，800ms 内未离开则降级为弹层
    if (isMobile) {
      _AL_toast('正在打开微信…', 1500);
      const t0 = Date.now();
      // 用隐藏 iframe 唤起（部分浏览器拦截 location.href 的 deeplink）
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;opacity:0;';
      iframe.src = 'weixin://';
      document.body.appendChild(iframe);
      setTimeout(function () {
        iframe.remove();
        // 浏览器支持时已经离开了页面；没离开说明唤起失败
        if (Date.now() - t0 < 1500) {
          _AL_showWechatModal(id);
        }
      }, 800);
      // 兜底：1500ms 后强制弹层（防止 iframe 唤起成功但页面未跳转）
      setTimeout(function () {
        if (Date.now() - t0 < 1700 && document.visibilityState === 'visible') {
          _AL_showWechatModal(id);
        }
      }, 1500);
    } else {
      // 桌面端：直接弹层
      _AL_showWechatModal(id);
    }
  };

  /* ========== 4. 平滑跳转 ========== */
  window._AL_navigate = function (url) {
    if (typeof document.startViewTransition === 'function') {
      try {
        document.startViewTransition(function () {
          window.location.href = url;
        });
        return;
      } catch (e) { /* 降级 */ }
    }
    window.location.href = url;
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
})();
