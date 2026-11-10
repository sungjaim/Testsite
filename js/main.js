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
  function sizeText(d) { return d.size || t('d.tbd'); }
  function priceText(d) {
    if (typeof d.price !== 'number') return t('d.tbd');
    return t('d.won', { n: d.price.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US') });
  }
  function photo(src, alt) {
    return src
      ? '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy">'
      : '<span class="ph-label">' + t('photo.soon') + '</span>';
  }
  // 목록·추천에 쓰는 드레스 카드
  function card(d) {
    return '<a class="card" href="dress.html#' + esc(d.id) + '">' +
      '<div class="mat mat-sm"><div class="frame ph">' + photo(d.photos[0], d.name) + '</div></div>' +
      '<div class="card-meta"><span class="card-no">No. ' + esc(d.number) + '</span>' +
      '<span class="card-name">' + esc(d.name) + '</span>' +
      '<span class="card-sub">' + esc(sizeText(d)) + ' · ' + esc(colorName(d.color)) + '</span></div></a>';
  }

  window.LS = {
    t: t, esc: esc, site: SITE, getLang: function () { return lang; },
    colorName: colorName, sizeText: sizeText, priceText: priceText, photo: photo, card: card,
    dresses: window.LS_DRESSES || []
  };

  var page = location.pathname.split('/').pop() || 'index.html';
  function cur(p) { return page === p || (p === 'dresses.html' && page === 'dress.html') ? ' aria-current="page"' : ''; }
  document.getElementById('site-header').innerHTML =
    '<header class="site-header"><div class="inner">' +
    '<a class="logo" href="index.html" aria-label="LS">' +
    '<img src="images/logo.png" alt="LS" onerror="this.outerHTML=\'<span class=&quot;logo-fallback&quot;>LS</span>\'"></a>' +
    '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Menu">' +
    '<span></span><span></span></button>' +
    '</div>' +
    '<nav class="menu" id="site-menu" hidden><div class="menu-inner">' +
    '<a href="dresses.html"' + cur('dresses.html') + ' data-i18n="nav.dresses"></a>' +
    '<a href="guide.html"' + cur('guide.html') + ' data-i18n="nav.guide"></a>' +
    '<button class="lang" type="button" data-i18n="lang.toggle"></button>' +
    '</div></nav></header>';

  document.getElementById('site-footer').innerHTML =
    '<footer class="site-footer"><div class="inner">' +
    '<div><div class="brand">LS</div>' +
    '<div data-i18n="footer.inquiry"></div></div>' +
    '<div>Instagram <a href="' + SITE.insta + '" target="_blank" rel="noopener">' + SITE.instaName + '</a><br>' +
    'Tel <a href="tel:' + SITE.tel.replace(/-/g, '') + '">' + SITE.tel + '</a></div>' +
    '</div></footer>';

  // 문의 버튼(.js-insta, .js-tel)에 연락처 연결
  document.querySelectorAll('.js-insta').forEach(function (a) { a.href = SITE.insta; a.target = '_blank'; a.rel = 'noopener'; });
  document.querySelectorAll('.js-tel').forEach(function (a) { a.href = 'tel:' + SITE.tel.replace(/-/g, ''); });

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
