/**
 * 底部固定导航栏组件
 * 用法：
 *   <div id="app-bottom-nav"></div>
 *   <script type="module">
 *     import { mountBottomNav } from '/src/components/bottom-nav.js';
 *     mountBottomNav('#app-bottom-nav', { active: 'quotes' });
 *   </script>
 *
 * active 可选值：'quotes'（今日行情） | 'forum'（技术交流） | 'contact'（联系我们）
 */
const STYLES = `
.app-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: #ffffff;
  border-top: 1px solid #F3F4F6;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
}
.app-bottom-nav__inner {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  height: 56px;
}
.app-bottom-nav__item {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #6B7280;
  text-decoration: none;
  transition: transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}
.app-bottom-nav__item:active {
  transform: scale(0.95);
}
.app-bottom-nav__item svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: block;
}
.app-bottom-nav__item-label {
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;
  display: block;
  /* 防御性兜底：避免被任何外部样式覆盖 */
  visibility: visible;
  opacity: 1;
  color: inherit;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
.app-bottom-nav__item--active {
  color: #10B981;
}
.app-bottom-nav__item--active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 22px;
  height: 3px;
  background: #10B981;
  border-radius: 2px 2px 0 0;
}
`;

const ICONS = {
  quotes: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"></path>`,
  forum: `<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"></path>`,
  contact: `<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>`,
};

const ITEMS = [
  { key: 'quotes', label: '今日行情', href: 'index.html' },
  { key: 'forum', label: '技术交流', href: 'tecexc.html' },
  { key: 'contact', label: '联系我们', href: 'contacts.html' },
];

function ensureStyles() {
  if (document.getElementById('app-bottom-nav-style')) return;
  const style = document.createElement('style');
  style.id = 'app-bottom-nav-style';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function buildItem(item, isActive) {
  const iconColor = isActive ? '#10B981' : '#6B7280';
  return `
    <a href="${item.href}"
       class="app-bottom-nav__item${isActive ? ' app-bottom-nav__item--active' : ''}"
       data-nav-key="${item.key}"
       aria-current="${isActive ? 'page' : 'false'}">
      <svg width="22" height="22" fill="none" stroke="${iconColor}" stroke-width="2" viewBox="0 0 24 24" style="display:block;flex-shrink:0;">
        ${ICONS[item.key]}
      </svg>
      <span class="app-bottom-nav__item-label"
            style="display:block;font-size:12px;font-weight:600;line-height:1;color:${iconColor};visibility:visible;opacity:1;-webkit-font-smoothing:antialiased;">${item.label}</span>
    </a>
  `;
}

export function mountBottomNav(target, options = {}) {
  const { active = 'quotes' } = options;
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) {
    console.warn('[bottom-nav] container not found:', target);
    return;
  }
  ensureStyles();
  container.innerHTML = `
    <nav class="app-bottom-nav" role="navigation" aria-label="主导航">
      <div class="app-bottom-nav__inner">
        ${ITEMS.map(item => buildItem(item, item.key === active)).join('')}
      </div>
    </nav>
  `;
}

export function setActiveNav(target, activeKey) {
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) return;
  container.querySelectorAll('.app-bottom-nav__item').forEach(el => {
    const isActive = el.dataset.navKey === activeKey;
    el.classList.toggle('app-bottom-nav__item--active', isActive);
    el.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}
