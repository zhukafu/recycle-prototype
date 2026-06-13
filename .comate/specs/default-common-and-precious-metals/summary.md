# Summary: Default Common Products and Precious Metals Only in Quotes Config

## Completed Tasks

### Task 1: 给 contacts.js 前 10 个产品添加 common: true
- **File**: `public/data/contacts.js`
- **Changes**: Added `common: true` to product objects c1 through c10 (lines 34-91)
- **Result**: These 10 products will now appear in the "常见型号" section on `contactors.html` on initial load

### Task 2: 修改 quotes.js 默认配置只展示贵金属
- **File**: `public/data/quotes.js`
- **Changes**: Changed `DEFAULT_CONFIG.displayMetals` from `[]` (show all) to `['q-au', 'q-ag', 'q-pt', 'q-pd', 'q-rh', 'q-ru']` (only precious metals)
- **Result**: On first visit or after config reset, only precious metals (黄金, 白银, 铂金, 钯金, 铑金, 钌) will be displayed in the mini-program quote pages

### Task 3: 修改 system.html 行情面板初始化默认只勾选贵金属
- **File**: `admin/system.html`
- **Changes**: In `buildQuotesPanelContent()`, changed the checkbox default from always `checked` to only checked when `it.category === 'precious'`
- **Result**: The admin settings panel for "行情刷新" now defaults to only precious metals selected, matching the quotes.js DEFAULT_CONFIG behavior

## Files Modified
1. `/Users/zhudb/Desktop/recycle-prototype/public/data/contacts.js` - 10 edits (one per product)
2. `/Users/zhudb/Desktop/recycle-prototype/public/data/quotes.js` - 1 edit (DEFAULT_CONFIG)
3. `/Users/zhudb/Desktop/recycle-prototype/admin/system.html` - 1 edit (checkbox generation logic)

## Notes
- Existing localStorage data takes precedence over defaults, so users who have already customized their settings will not be affected
- The admin panel's "全选/取消" button still works normally, allowing admins to select additional metals if desired
