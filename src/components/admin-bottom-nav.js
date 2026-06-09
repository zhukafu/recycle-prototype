/**
 * 管理后台导航组件（移动端固定底栏 + 桌面端左侧栏，自适应布局）
 *
 * 用法：
 *   <div id="admin-bottom-nav"></div>
 *   <script type="module">
 *     import { mountAdminBottomNav } from '/src/components/admin-bottom-nav.js';
 *     mountAdminBottomNav('#admin-bottom-nav', { active: 'home' });
 *   </script>
 *
 * active 可选值：'home'（首页） | 'business'（业务管理） | 'data'（数据运营） | 'system'（系统） | 'mine'（我的）
 */
const STYLES = `
.admin-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: #ffffff;
  border-top: 1px solid #F1F5F9;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
}
.admin-bottom-nav__inner {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  height: 56px;
  max-width: 1200px;
  margin: 0 auto;
}
.admin-bottom-nav__item {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #94A3B8;
  text-decoration: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  padding: 0 8px;
  transition: transform 0.15s ease, color 0.15s ease, background-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}
.admin-bottom-nav__item:active {
  transform: scale(0.95);
}
.admin-bottom-nav__item svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: block;
}
.admin-bottom-nav__item-label {
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: inherit;
  white-space: nowrap;
  display: block;
  visibility: visible;
  opacity: 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
.admin-bottom-nav__item--active {
  color: #22C55E;
}
.admin-bottom-nav__item--active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 22px;
  height: 3px;
  background: #22C55E;
  border-radius: 2px 2px 0 0;
}

/* 桌面端：底部固定栏，拉满整宽（与小程序的底部导航条风格一致） */
@media (min-width: 1024px) {
  .admin-bottom-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    width: auto;
    border-top: 1px solid #F1F5F9;
    border-right: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
    background: #ffffff;
    z-index: 50;
    overflow-y: visible;
  }
  .admin-bottom-nav__inner {
    flex-direction: row;
    align-items: stretch;
    justify-content: space-around;
    height: 56px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0;
    gap: 0;
  }
  .admin-bottom-nav__item {
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    padding: 0 8px;
    height: 56px;
    border-radius: 0;
  }
  .admin-bottom-nav__item:hover {
    background: transparent;
    color: #94A3B8;
  }
  .admin-bottom-nav__item--active {
    color: #22C55E;
    background: transparent;
  }
  .admin-bottom-nav__item--active::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 22px;
    height: 3px;
    background: #22C55E;
    border-radius: 2px 2px 0 0;
  }
  .admin-bottom-nav__item-label {
    font-size: 11px;
    font-weight: 600;
  }
}
`;

const ICONS = {
  home: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>`,
  business: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  data: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  system: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  mine: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
};

const ITEMS = [
  { key: 'home', label: '首页', href: 'manage.html' },
  { key: 'business', label: '业务管理', href: '#' },
  { key: 'data', label: '数据运营', href: '#' },
  { key: 'system', label: '系统', href: '#' },
  { key: 'mine', label: '我的', href: 'mine.html' },
];

function ensureStyles() {
  if (document.getElementById('admin-bottom-nav-style')) return;
  const style = document.createElement('style');
  style.id = 'admin-bottom-nav-style';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function buildItem(item, isActive) {
  const iconColor = isActive ? '#22C55E' : '#94A3B8';
  return `
    <a href="${item.href}"
       class="admin-bottom-nav__item${isActive ? ' admin-bottom-nav__item--active' : ''}"
       data-nav-key="${item.key}"
       aria-current="${isActive ? 'page' : 'false'}">
      <svg width="22" height="22" fill="none" stroke="${iconColor}" stroke-width="2" viewBox="0 0 24 24" style="display:block;flex-shrink:0;">
        ${ICONS[item.key]}
      </svg>
      <span class="admin-bottom-nav__item-label"
            style="display:block;font-size:11px;font-weight:600;line-height:1;color:${iconColor};visibility:visible;opacity:1;-webkit-font-smoothing:antialiased;">${item.label}</span>
    </a>
  `;
}

export function mountAdminBottomNav(target, options = {}) {
  const { active = 'home' } = options;
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) {
    console.warn('[admin-bottom-nav] container not found:', target);
    return;
  }
  ensureStyles();
  container.innerHTML = `
    <nav class="admin-bottom-nav" role="navigation" aria-label="后台导航">
      <div class="admin-bottom-nav__inner">
        ${ITEMS.map(item => buildItem(item, item.key === active)).join('')}
      </div>
    </nav>
  `;

  // 占位项（href="#"）阻止默认跳转，避免滚动到页顶
  container.addEventListener('click', (e) => {
    const item = e.target.closest('.admin-bottom-nav__item');
    if (!item) return;
    const href = item.getAttribute('href');
    if (!href || href === '#' || href.trim() === '') {
      e.preventDefault();
    }
  });
}

export function setActiveAdminNav(target, activeKey) {
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) return;
  container.querySelectorAll('.admin-bottom-nav__item').forEach(el => {
    const isActive = el.dataset.navKey === activeKey;
    el.classList.toggle('admin-bottom-nav__item--active', isActive);
    el.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}
