# Default Common Products and Precious Metals Only in Quotes Config

## Requirements

### Requirement 1: 前十个产品默认标记 common=true
The first 10 products in the `PRODUCTS` array (in `contacts.js`) should have `common: true` set by default in the seed data, so they appear as "常见型号" on the contactors.html page without requiring manual toggling in the admin panel.

### Requirement 2: 行情刷新设置默认只展示贵金属
The default `displayMetals` config in the quotes module should default to only showing precious metals (黄金, 白银, 铂金, 钯金, 铑金, 钌), instead of the current behavior where an empty array means "show all metals".

## Architecture & Technical Approach

### Requirement 1 - contacts.js
Simply add `common: true` to the first 10 product objects in the `PRODUCTS` array in `/Users/zhudb/Desktop/recycle-prototype/public/data/contacts.js`. The products are already ordered in the array, and the first 10 are `c1` through `c10` (lines 34-91, the category.html contactor cards + the first three contactors.html "最新上架" cards).

### Requirement 2 - quotes.js
Modify `DEFAULT_CONFIG` in `/Users/zhudb/Desktop/recycle-prototype/public/data/quotes.js` to set `displayMetals` to an array containing the IDs of all precious metal quotes (`q-au`, `q-ag`, `q-pt`, `q-pd`, `q-rh`, `q-ru`). Additionally, update the `buildQuotesPanelContent` function in `/Users/zhudb/Desktop/recycle-prototype/admin/system.html` so that when the settings panel opens without a saved config, only the precious metals checkboxes default to checked.

## Affected Files

| File | Modification | Details |
|------|-------------|---------|
| `/Users/zhudb/Desktop/recycle-prototype/public/data/contacts.js` | Modify seed data | Add `common: true` to first 10 products (c1-c10, lines 34-91) |
| `/Users/zhudb/Desktop/recycle-prototype/public/data/quotes.js` | Modify DEFAULT_CONFIG | Change `displayMetals` from `[]` to `['q-au','q-ag','q-pt','q-pd','q-rh','q-ru']` |
| `/Users/zhudb/Desktop/recycle-prototype/admin/system.html` | Update panel initialization | When loading quotes panel with no saved config, only precious metals should be pre-checked |

## Implementation Details

### contacts.js changes
For each of the 10 products (c1 through c10, lines 34-91), add `common: true` to the object literal. Example:

```javascript
// Before:
{ id: 'c1', cat: 'contactor', model: '【老款】CJX2-9511', brand: '正泰', spec: 'AC380V 95A 老款设计', ... }

// After:
{ id: 'c1', cat: 'contactor', model: '【老款】CJX2-9511', brand: '正泰', spec: 'AC380V 95A 老款设计', common: true, ... }
```

The 10 products are:
- c1 (line 34-38)
- c2 (line 39-43)
- c3 (line 44-48)
- c4 (line 49-53)
- c5 (line 54-58)
- c6 (line 59-63)
- c7 (line 64-68)
- c8 (line 71-77)
- c9 (line 78-84)
- c10 (line 85-91)

### quotes.js changes

Change the DEFAULT_CONFIG:

```javascript
// Before:
var DEFAULT_CONFIG = {
    refreshInterval: 900,
    displayMetals: [],      // 空数组表示全部展示
    displayStyle: 'list'
};

// After:
var DEFAULT_CONFIG = {
    refreshInterval: 900,
    displayMetals: ['q-au', 'q-ag', 'q-pt', 'q-pd', 'q-rh', 'q-ru'],  // 默认只展示贵金属
    displayStyle: 'list'
};
```

### system.html changes

In the `buildQuotesPanelContent()` function (around line 148), the metal checkboxes currently all default to `checked`. When there's no saved config, we should only check the precious metal checkboxes.

The simplest approach: in the panel HTML generation, check if the item's category is `precious` and only set `checked` for those items. Since `buildQuotesPanelContent()` generates the initial HTML without any saved config context, we can conditionally set `checked` only for precious metals.

```javascript
// Before (line 177):
'<input type="checkbox" class="metal-checkbox w-3.5 h-3.5 rounded ..." data-metal-id="' + it.id + '" checked>'

// After:
'<input type="checkbox" class="metal-checkbox w-3.5 h-3.5 rounded ..." data-metal-id="' + it.id + '"' + (it.category === 'precious' ? ' checked' : '') + '>'
```

## Data Flow

### Requirement 1 Flow:
1. Contacts.js loads → PRODUCTS array with common:true on first 10 items
2. Merge with localStorage → any user modifications are preserved
3. contactors.html renders "常见型号" section → `filter(p => p.common === true)` picks up the 10 items

### Requirement 2 Flow:
1. Quotes.js initializes → DEFAULT_CONFIG has precious metal IDs in displayMetals
2. When system.html opens "行情刷新" panel → buildQuotesPanelContent() generates checkboxes, only precious metals checked by default
3. Config is saved to localStorage → subsequent opens use saved config
4. Miniprogram pages (index.html, quote-list.html) read the config → only precious metals shown

## Boundary Conditions & Exception Handling

- If user has previously saved config with different metals, that takes precedence over default
- If user deletes all precious metal quotes via admin, displayMetals will reference non-existent IDs → the filtering code handles gracefully (no matches → empty display)
- localStorage merge handles the common flag correctly: user modifications (via admin catalog-list) persist in localStorage and take priority

## Expected Outcomes

1. The "常见型号" section on contactors.html displays the first 10 products immediately after initial data load
2. The "行情刷新" settings panel defaults to only precious metals checked
3. The miniprogram quote pages default to showing only precious metals
4. All existing functionality (user toggling common flag, saving custom display metals config) continues to work
