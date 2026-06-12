/**
 * 页面顶部右侧操作按钮组件（3点菜单 + 头像入口）
 * 用法：
 *   <div id="page-actions" data-show-menu="true" data-show-avatar="true"></div>
 *   <script type="module">
 *     import { mountPageActions } from '/src/components/page-actions.js';
 *     mountPageActions('#page-actions', {
 *       onMenu: () => console.log('menu clicked'),
 *       onAvatar: () => console.log('avatar clicked'),
 *     });
 *   </script>
 *
 * options:
 *   - showMenu    是否显示 3 点菜单按钮（默认 true）
 *   - showAvatar  是否显示头像入口（默认 true）
 *   - color       前景色（默认 #1F2937）
 *   - size        按钮尺寸（默认 40，单位 px）
 *   - onMenu      3 点菜单点击回调
 *   - onAvatar    头像点击回调
 */
const STYLES = `
.app-page-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
}
.app-page-actions__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: inherit;
  transition: background-color 0.15s ease, transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}
.app-page-actions__btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.app-page-actions__btn:active {
  transform: scale(0.92);
}
.app-page-actions__btn:focus-visible {
  outline: 2px solid #10B981;
  outline-offset: 2px;
}
.app-page-actions__dots {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.app-page-actions__dot {
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: currentColor;
}
.app-page-actions__avatar-ring {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 2px solid currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.app-page-actions__avatar-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: currentColor;
}
.app-page-actions__popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 6px 0;
  min-width: 140px;
  z-index: 9999;
  animation: app-pa-fade-in 0.15s ease;
}
@keyframes app-pa-fade-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.app-page-actions__popup-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s;
}
.app-page-actions__popup-item:hover {
  background: #f3f4f6;
}
.app-page-actions__popup-item--danger {
  color: #ef4444;
}
.app-page-actions__popup-item--danger:hover {
  background: #fef2f2;
}
.app-page-actions__popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
}
`;

const ICONS = {
  menu: `<span class="app-page-actions__dots" aria-hidden="true">
    <span class="app-page-actions__dot"></span>
    <span class="app-page-actions__dot"></span>
    <span class="app-page-actions__dot"></span>
  </span>`,
  avatar: `<span class="app-page-actions__avatar-ring" aria-hidden="true">
    <span class="app-page-actions__avatar-dot"></span>
  </span>`,
};

function ensureStyles() {
  if (document.getElementById('app-page-actions-style')) return;
  const style = document.createElement('style');
  style.id = 'app-page-actions-style';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function build(opts) {
  const { showMenu, showAvatar, color } = opts;
  const parts = [];
  if (showMenu) {
    parts.push(`<button type="button" class="app-page-actions__btn" data-action="menu" aria-label="更多操作">${ICONS.menu}</button>`);
  }
  if (showAvatar) {
    parts.push(`<button type="button" class="app-page-actions__btn" data-action="avatar" aria-label="回到首页">${ICONS.avatar}</button>`);
  }
  return `<div class="app-page-actions" style="color:${color};" role="toolbar" aria-label="页面操作">${parts.join('')}</div>`;
}

export function mountPageActions(target, options = {}) {
  const {
    showMenu = true,
    showAvatar = true,
    color = '#1F2937',
    size = 40,
    onMenu,
    onAvatar,
  } = options;

  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) {
    console.warn('[page-actions] container not found:', target);
    return;
  }
  ensureStyles();
  container.innerHTML = build({ showMenu, showAvatar, color });

  // 动态调整按钮尺寸
  if (size !== 40) {
    container.querySelectorAll('.app-page-actions__btn').forEach(btn => {
      btn.style.width = `${size}px`;
      btn.style.height = `${size}px`;
    });
  }

  // 事件绑定
  const menuBtn = container.querySelector('[data-action="menu"]');
  const avatarBtn = container.querySelector('[data-action="avatar"]');

  // 关闭弹出菜单辅助函数
  function closePopup() {
    const existing = container.querySelector('.app-page-actions__popup');
    const overlay = container.querySelector('.app-page-actions__popup-overlay');
    if (existing) existing.remove();
    if (overlay) overlay.remove();
  }

  // 菜单按钮：点击弹出操作菜单
  menuBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 如果已有弹窗则关闭
    if (container.querySelector('.app-page-actions__popup')) {
      closePopup();
      return;
    }

    // 如果外部提供了 onMenu 回调，优先执行
    if (typeof onMenu === 'function') {
      onMenu(e);
      return;
    }

    // 默认行为：弹出菜单
    const overlay = document.createElement('div');
    overlay.className = 'app-page-actions__popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'app-page-actions__popup';
    popup.innerHTML = `
      <button type="button" class="app-page-actions__popup-item app-page-actions__popup-item--danger" data-popup-action="clear-cache">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        </svg>
        清除缓存
      </button>
    `;

    // 点击遮罩关闭
    overlay.addEventListener('click', closePopup);

    // 点击弹出菜单项
    popup.addEventListener('click', (ev) => {
      const item = ev.target.closest('[data-popup-action]');
      if (!item) return;
      const action = item.dataset.popupAction;
      if (action === 'clear-cache') {
        // 清除 localStorage
        try {
          localStorage.clear();
          console.log('[page-actions] localStorage 已清除');
        } catch (err) {
          console.warn('[page-actions] localStorage 清除失败', err);
        }
        // 清除 Cookie
        document.cookie.split(';').forEach(function (c) {
          const name = c.split('=')[0].trim();
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
        });
        console.log('[page-actions] Cookie 已清除');
        closePopup();
        // 提示用户
        alert('缓存已清除，页面将刷新');
        location.reload();
      }
    });

    container.appendChild(overlay);
    container.appendChild(popup);
  });

  // 头像按钮：点击回到首页
  avatarBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onAvatar === 'function') {
      onAvatar(e);
    } else {
      // 默认行为：根据当前路径判断首页位置
      const isAdmin = location.pathname.includes('/admin/');
      location.href = isAdmin ? '/admin/manage.html' : '/miniprogram/index.html';
    }
  });
}
