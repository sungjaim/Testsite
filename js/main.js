/* 공통: 헤더/푸터, 언어 전환, 메뉴, 페이드, 드레스 카드 */
(function () {
  // 연락처: 바뀌면 여기만 고치세요.
  var SITE = { insta: 'https://instagram.com/loveurskating', instaName: '@loveurskating', tel: '010-4342-8908' };
  var lang = 'ko';
  try { lang = localStorage.getItem('ls-lang') || 'ko'; } catch (e) {}
  if (!window.LS_TEXT[lang]) lang = 'ko';

  function t(key, vars) {
    var s = (window.LS_TEXT[lang] || {})[key] || key;
    if (vars) for (var k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function colorName(key) { var c = (window.LS_COLORS || {})[key]; return c ? c[lang] : (key || t('d.tbd')); }
  // 상태가 비어 있으면 '대여 가능'으로 봐요
  function statusKey(d) { return (window.LS_STATUS || {})[d.status] ? d.status : 'available'; }
  function statusName(key) { var s = (window.LS_STATUS || {})[key]; return s ? s[lang] : key; }
  function statusTag(d) { var k = statusKey(d); return '<span class="status s-' + k + '">' + esc(statusName(k)) + '</span>'; }
  function sizeText(d) { return d.size || t('d.tbd'); }
  function priceText(d) {
    if (typeof d.price !== 'number') return t('d.tbd');
    return t('d.won', { n: d.price.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US') });
  }
  function photo(src, alt) {
    return src
      ? '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" data-ph="' + esc(t('photo.soon')) + '" onerror="var s=document.createElement(\'span\');s.className=\'ph-label\';s.textContent=this.getAttribute(\'data-ph\');this.replaceWith(s)">'
      : '<span class="ph-label">' + t('photo.soon') + '</span>';
  }
  // 목록·추천에 쓰는 드레스 카드
  function card(d) {
    return '<a class="card" href="dress.html#' + esc(d.id) + '">' +
      '<div class="mat mat-sm"><div class="frame ph">' + photo(d.photos[0], d.name) + '</div></div>' +
      '<div class="card-meta"><span class="card-no">No. ' + esc(d.number) + '</span>' +
      '<span class="card-name">' + esc(d.name) + '</span>' +
      '<span class="card-sub">' + esc([d.size, d.color && colorName(d.color)].filter(Boolean).join(' · ')) + '</span>' +
      statusTag(d) + '</div></a>';
  }

  window.LS = {
    t: t, esc: esc, site: SITE, getLang: function () { return lang; },
    colorName: colorName, statusKey: statusKey, statusName: statusName, statusTag: statusTag, sizeText: sizeText, priceText: priceText, photo: photo, card: card,
    dresses: window.LS_DRESSES || []
  };

  // ── 드레스 데이터 불러오기 ──
  // js/config.js 의 LS_SHEET_URL 이 있으면 구글 시트에서, 없거나 실패하면 data/dresses.js 에서 가져와요.
  var ready = false, waiting = [];
  window.LS.whenReady = function (fn) { if (ready) fn(); else waiting.push(fn); };
  function done() {
    if (ready) return;
    ready = true;
    document.documentElement.classList.remove('is-loading');
    waiting.splice(0).forEach(function (f) { f(); });
  }
  var CACHE_KEY = 'ls-sheet-cache';
  function fromSheet(url) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, window.LS_SHEET_TIMEOUT || 5000);
    return fetch(url, ctl ? { signal: ctl.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (text) {
        clearTimeout(timer);
        var list = LS_SHEET.toDresses(LS_SHEET.parseCSV(text), window.LS_STATUS || {}, window.LS_COLORS || {});
        if (!list.length) throw new Error('empty sheet');
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch (e) {}
        return list;
      });
  }
  if (window.LS_SHEET_URL && window.LS_SHEET) {
    document.documentElement.classList.add('is-loading');
    fromSheet(window.LS_SHEET_URL).then(function (list) { window.LS.dresses = list; }, function () {
      // 시트를 못 읽으면: 마지막으로 읽은 시트 → data/dresses.js 순서로 대신 보여 줘요
      try { var c = JSON.parse(localStorage.getItem(CACHE_KEY)); if (c && c.length) window.LS.dresses = c; } catch (e) {}
    }).then(done);
  } else done();

  var page = location.pathname.split('/').pop() || 'index.html';
  function cur(p) { return page === p || (p === 'dresses.html' && page === 'dress.html') ? ' aria-current="page"' : ''; }
  document.getElementById('site-header').innerHTML =
    '<header class="site-header"><div class="inner">' +
    '<a class="logo" href="index.html" aria-label="LS">' +
    '<img src="images/logo.png" alt="LS" onerror="this.outerHTML=\'<span class=&quot;logo-fallback&quot;>LS</span>\'"></a>' +
    '<div class="head-right">' +
    '<button class="lang" type="button" aria-label="Language" data-i18n="lang.toggle"></button>' +
    '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Menu">' +
    '<span></span><span></span></button></div>' +
    '</div>' +
    '<nav class="menu" id="site-menu" hidden><div class="menu-inner">' +
    '<a href="index.html"' + cur('index.html') + ' data-i18n="nav.home"></a>' +
    '<a href="dresses.html"' + cur('dresses.html') + ' data-i18n="nav.dresses"></a>' +
    '<a href="guide.html"' + cur('guide.html') + ' data-i18n="nav.guide"></a>' +
    '<a href="directions.html"' + cur('directions.html') + ' data-i18n="nav.directions"></a>' +
    '<div class="menu-contact"><p data-i18n="menu.contact"></p>' +
    '<a class="js-insta" href="#">Instagram ' + SITE.instaName + '</a>' +
    '<a class="js-tel" href="#">Tel ' + SITE.tel + '</a></div>' +
    '</div></nav></header>';

  document.getElementById('site-footer').innerHTML =
    '<footer class="site-footer"><div class="inner">' +
    '<div><div class="brand">LS</div>' +
    '<div data-i18n="footer.inquiry"></div>' +
    '<div class="foot-addr" data-i18n="footer.addr"></div>' +
    '<nav class="foot-nav"><a href="dresses.html" data-i18n="nav.dresses"></a><a href="guide.html" data-i18n="nav.guide"></a><a href="directions.html" data-i18n="nav.directions"></a></nav></div>' +
    '<div>Instagram <a href="' + SITE.insta + '" target="_blank" rel="noopener">' + SITE.instaName + '</a><br>' +
    'Tel <a href="tel:' + SITE.tel.replace(/-/g, '') + '">' + SITE.tel + '</a></div>' +
    '</div></footer>';

  // 문의 버튼(.js-insta, .js-tel)에 연락처 연결
  document.querySelectorAll('.js-insta').forEach(function (a) { a.href = SITE.insta; a.target = '_blank'; a.rel = 'noopener'; });
  document.querySelectorAll('.js-tel').forEach(function (a) { a.href = 'tel:' + SITE.tel.replace(/-/g, ''); });

  // "주소 복사" 버튼
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var text = b.getAttribute('data-copy'), label = b.textContent;
    function ok() { b.textContent = b.getAttribute('data-done'); setTimeout(function () { b.textContent = label; }, 1600); }
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (x) {} document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
  });

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    // guide.html 처럼 한국어/영어 본문이 따로 있는 곳
    document.querySelectorAll('[data-lang]').forEach(function (el) { el.hidden = el.getAttribute('data-lang') !== lang; });
    document.dispatchEvent(new Event('ls:lang'));
  }

  // 오른쪽 위 메뉴 열기/닫기
  var header = document.querySelector('.site-header');
  var btn = header.querySelector('.menu-btn');
  var menu = header.querySelector('.menu');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    header.classList.toggle('open', open);
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('show'); }); }
    else { menu.classList.remove('show'); setTimeout(function () { if (!header.classList.contains('open')) menu.hidden = true; }, 250); }
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('click', function (e) { if (!header.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  document.querySelector('.lang').addEventListener('click', function () {
    lang = lang === 'ko' ? 'en' : 'ko';
    try { localStorage.setItem('ls-lang', lang); } catch (e) {}
    apply();
  });

  // 페이지별 스크립트가 먼저 그릴 수 있도록 문서를 다 읽은 뒤 적용
  function start() {
    apply();
    var io = 'IntersectionObserver' in window && new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    if (io) document.querySelectorAll('.fade').forEach(function (el) { io.observe(el); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);
})();
