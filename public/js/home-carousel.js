/**
 * 首页文章轮播图组件
 * 从 _AL_ARTICLES.getCarouselArticles() 获取后台配置的轮播文章，
 * 渲染为左文右图的滑动轮播，支持触摸滑动、自动播放、指示器点击。
 *
 * 依赖：
 *   - /data/articles.js（需在此脚本之前加载，提供 window._AL_ARTICLES）
 *   - 页面中需存在 #articleCarousel > [data-carousel-track] + [data-carousel-dots]
 */
(function () {
  // ---- HTML 转义工具 ----
  var ESC = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
  function esc(s) { return String(s).replace(/[<>&]/g, function (c) { return ESC[c]; }); }

  var carousel = document.getElementById('articleCarousel');
  if (!carousel) return;
  var track = carousel.querySelector('[data-carousel-track]');
  var dotsWrap = document.querySelector('[data-carousel-dots]');
  if (!track) return;

  // 获取后台配置的轮播文章（v2.0：从 displayConfig.carouselIds 解析）
  var pool = [];
  if (window._AL_ARTICLES && typeof window._AL_ARTICLES.getCarouselArticles === 'function') {
    pool = window._AL_ARTICLES.getCarouselArticles();
  } else if (window._AL_ARTICLES && typeof window._AL_ARTICLES.getList === 'function') {
    var allArticles = (typeof window._AL_ARTICLES.getAllArticles === 'function')
      ? window._AL_ARTICLES.getAllArticles()
      : [].concat(window._AL_ARTICLES.getList('news') || []).concat(window._AL_ARTICLES.getList('knowledge') || []);
    pool = allArticles.filter(function (a) { return a && a.showInCarousel && a.title && (a.cover || a.coverMode === 'gradient'); });
    pool.sort(function (a, b) { return (a.sortOrder || 999) - (b.sortOrder || 999); });
  }

  if (!pool.length) {
    var section = carousel.closest('.slide-up');
    if (section) section.style.display = 'none';
    return;
  }

  // 标签颜色循环
  var tagColors = [
    'bg-green-surface text-green-dark',
    'bg-orange-surface text-orange-dark',
    'bg-blue-50 text-blue-700'
  ];

  // 构建 slide HTML
  var slidesHtml = pool.map(function (it, i) {
    var tagBg = tagColors[i % tagColors.length];
    var safeTitle = esc(it.title);
    var safeSummary = esc(it.summary || '');
    var defaultTag = (it.section === 'knowledge') ? '回收知识' : '行业资讯';
    var rawTag = it.tag || (it.tags && it.tags.length ? it.tags[0] : '') || defaultTag;
    var safeTag = esc(rawTag);
    var onErr = "this.style.display='none'";

    var isGradient = (it.coverMode === 'gradient') || !it.cover;
    var displayTitle = isGradient ? (it.coverTitle || it.title) : it.title;

    // 右侧区域
    var rightArea;
    if (isGradient) {
      rightArea = ''
        + '<div class="absolute right-0 top-0 bottom-0 w-[44%] bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center overflow-hidden">'
        +   '<span class="text-white text-[15px] font-black text-center px-3 leading-tight drop-shadow">' + esc(displayTitle) + '</span>'
        + '</div>';
    } else {
      rightArea = ''
        + '<div class="absolute right-0 top-0 bottom-0 w-[44%] bg-gray-bg overflow-hidden">'
        +   '<img src="' + it.cover + '" alt="' + safeTitle + '" class="w-full h-full object-cover" onerror="' + onErr + '">'
        + '</div>';
    }

    return ''
      + '<a href="info-detail.html?id=' + it.id + '" class="block w-full flex-shrink-0 bg-white relative overflow-hidden no-underline" aria-label="\u67E5\u770B\u6587\u7AE0\uFF1A' + safeTitle + '">'
      +   rightArea
      +   '<div class="relative z-10 p-4 pr-[44%] min-h-[120px] flex flex-col justify-center">'
      +     '<div class="mb-2">'
      +       '<span class="inline-block ' + tagBg + ' text-[10px] font-bold px-2 py-0.5 rounded-full">' + safeTag + '</span>'
      +     '</div>'
      +     '<h3 class="text-green-dark text-[17px] font-black mb-1.5 leading-snug line-clamp-2">' + safeTitle + '</h3>'
      +     '<p class="text-gray-500 text-[12px] leading-relaxed line-clamp-2">' + safeSummary + '</p>'
      +   '</div>'
      + '</a>';
  }).join('');

  track.innerHTML = slidesHtml;

  // 指示器 HTML
  if (dotsWrap) {
    var dotsHtml = pool.map(function (_, i) {
      return '<div class="h-1.5 rounded-full transition-all duration-300 cursor-pointer" data-carousel-dot="' + i + '"></div>';
    }).join('');
    dotsWrap.innerHTML = dotsHtml;
  }

  var slides = track.children;
  var dots = dotsWrap ? dotsWrap.querySelectorAll('[data-carousel-dot]') : [];
  if (!slides.length) return;

  // 轮播控制
  var index = 0;
  var total = slides.length;
  var timer = null;
  var INTERVAL = 4000;

  function go(i) {
    index = ((i % total) + total) % total;
    if (track) track.style.transform = 'translateX(-' + (index * 100) + '%)';
    for (var k = 0; k < dots.length; k++) {
      dots[k].style.width = (k === index) ? '20px' : '6px';
      dots[k].style.background = (k === index) ? '#10B981' : '#D6D3D1';
    }
  }

  function start() {
    stop();
    timer = setInterval(function () { go(index + 1); }, INTERVAL);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // 指示器点击
  for (var di = 0; di < dots.length; di++) {
    (function (d, k) {
      d.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        go(k);
        start();
      });
    })(dots[di], di);
  }

  // 触摸滑动支持
  var startX = 0, dx = 0, isTouching = false;
  carousel.addEventListener('touchstart', function (e) {
    isTouching = true;
    startX = e.touches[0].clientX;
    dx = 0;
    stop();
  }, { passive: true });
  carousel.addEventListener('touchmove', function (e) {
    if (!isTouching) return;
    dx = e.touches[0].clientX - startX;
  }, { passive: true });
  carousel.addEventListener('touchend', function () {
    if (!isTouching) return;
    isTouching = false;
    if (Math.abs(dx) > 40) {
      go(dx < 0 ? index + 1 : index - 1);
    }
    start();
  });

  // 页面可见性切换时控制自动播放
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { start(); }
  });

  go(0);
  start();
})();
