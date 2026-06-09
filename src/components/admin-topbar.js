/**
 * 管理后台顶栏组件
 *
 * 布局：[back 按钮（可选）] [标题（居中）] [三点 + 头像圆环（靠右，使用 page-actions 组件）]
 *
 * 用法：
 *   <div id="admin-topbar"></div>
 *   <script type="module">
 *     import { mountAdminTopbar } from '/src/components/admin-topbar.js';
 *     mountAdminTopbar('#admin-topbar', {
 *       title: '首页',          // 必填，中间标题
 *       back: false,           // 可选，true 时显示返回按钮（默认走 history.back()，可传 onBack 自定义）
 *       onMenu: () => {},      // 可选，三点菜单点击
 *       onAvatar: () => {},    // 可选，头像圆环点击
 *     });
 *   </script>
 *
 * 菜单层级约定：
 *   - 一级 / 二级菜单：back: false（不显示返回按钮）
 *   - 三级菜单：back: true（显示返回按钮）
 *
 * 注意：本组件本身不做 position: sticky，由调用方放在 .admin-sticky-header 之类的
 * 粘性容器里，便于把 Tab 栏等也一起粘在顶部。
 */
import { mountPageActions } from '/src/components/page-actions.js';

const STYLES = `
.admin-topbar {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #F3F4F6;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
}
.admin-topbar__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}
.admin-topbar__left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;
}
.admin-topbar__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #334155;
  padding: 0;
  font-family: inherit;
  transition: background-color 0.15s ease, transform 0.1s ease;
  -webkit-tap-highlight-color: transparent;
}
.admin-topbar__back:hover { background: #F1F5F9; }
.admin-topbar__back:active { transform: scale(0.92); }
.admin-topbar__title {
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  white-space: nowrap;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.admin-topbar__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;  /* 关键：保证三点 + 头像靠右 */
  gap: 2px;
  min-width: 0;
}
`;

function ensureStyles() {
  if (document.getElementById('admin-topbar-style')) return;
  const style = document.createElement('style');
  style.id = 'admin-topbar-style';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

const BACK_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;

export function mountAdminTopbar(target, options = {}) {
  const { title = '', back = false, onBack, onMenu, onAvatar } = options;
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) {
    console.warn('[admin-topbar] container not found:', target);
    return;
  }
  ensureStyles();

  container.innerHTML = `
    <div class="admin-topbar" role="banner">
      <div class="admin-topbar__inner">
        <div class="admin-topbar__left">
          ${back ? `<button type="button" class="admin-topbar__back" data-action="back" aria-label="返回">${BACK_ICON}</button>` : ''}
        </div>
        <h2 class="admin-topbar__title">${title}</h2>
        <div class="admin-topbar__actions" data-admin-topbar-actions></div>
      </div>
    </div>
  `;

  // 右侧三个点 + 头像圆环，复用 page-actions 组件，与小程序保持一致
  const actionsSlot = container.querySelector('[data-admin-topbar-actions]');
  if (actionsSlot) {
    mountPageActions(actionsSlot, { onMenu, onAvatar });
  }

  const backBtn = container.querySelector('[data-action="back"]');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      if (typeof onBack === 'function') onBack(e);
      else if (window.history.length > 1) window.history.back();
    });
  }
}
