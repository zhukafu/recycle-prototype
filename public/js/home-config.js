/**
 * 首页站点配置同步脚本
 * 从 localStorage 读取 _AL_SITE_CONFIG，覆盖页面上的品牌名、描述、Logo、联系信息等。
 * 需在 /data/site-config.js 之后加载。
 */
(function () {
  try {
    var saved = localStorage.getItem('_AL_SITE_CONFIG');
    if (!saved) return;

    var config = JSON.parse(saved);

    // 更新页面标题
    if (config.brandName) document.title = config.brandName;

    // 更新站点名称
    var siteNameTitle = document.getElementById('siteNameTitle');
    if (siteNameTitle && config.brandName) {
      siteNameTitle.textContent = config.brandName;
    }

    // 更新站点描述
    var siteDescText = document.getElementById('siteDescText');
    if (siteDescText && config.siteDescription) {
      siteDescText.textContent = config.siteDescription;
    }

    // 更新 Logo
    var siteLogoContainer = document.getElementById('siteLogoContainer');
    if (siteLogoContainer && config.logo) {
      siteLogoContainer.innerHTML = '<img src="' + config.logo + '" alt="' + (config.brandName || 'Logo') + '" class="w-full h-full object-cover rounded-lg">';
      siteLogoContainer.className = 'w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-green-brand/20';
    }

    // 同步 _AL_SITE 全局对象
    if (window._AL_SITE) {
      if (config.brandName) window._AL_SITE.brandName = config.brandName;
      if (config.phone) window._AL_SITE.phone = config.phone;
      if (config.wechat) window._AL_SITE.wechat = config.wechat;
      if (config.address) window._AL_SITE.address = config.address;
      if (config.amapCoord) window._AL_SITE.amapCoord = config.amapCoord;
    }
  } catch (e) {
    console.warn('[home-config] \u52A0\u8F7D\u7AD9\u70B9\u914D\u7F6E5931\u8D25:', e);
  }
})();
