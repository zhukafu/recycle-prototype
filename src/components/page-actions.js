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
    parts.push(`<button type="button" class="app-page-actions__btn" data-action="avatar" aria-label="个人中心">${ICONS.avatar}</button>`);
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
  menuBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    onMenu?.(e);
  });
  avatarBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    onAvatar?.(e);
  });
}
