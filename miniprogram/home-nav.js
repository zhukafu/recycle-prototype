/**
 * 首页底部导航栏挂载（ES Module）
 */
import { mountBottomNav } from '/src/components/bottom-nav.js';

var slot = document.getElementById('app-bottom-nav');
if (slot) {
  mountBottomNav(slot, { active: slot.dataset.activeNav || 'quotes' });
}
