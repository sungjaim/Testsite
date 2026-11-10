/* 공통: 헤더/푸터, 언어 전환, 페이드 */
(function () {
  var SITE = { insta: 'https://instagram.com/loveurskating', instaName: '@loveurskating', tel: '010-4342-8908' };
  var lang = 'ko';
  try { lang = localStorage.getItem('ls-lang') || 'ko'; } catch (e) {}
  if (!window.LS_TEXT[lang]) lang = 'ko';

  function t(key) { return (window.LS_TEXT[lang] || {})[key] || key; }
  window.LS = { t: t, site: SITE, getLang: function () { return lang; } };

  var page = location.pathname.split('/').pop() || 'index.html';
  document.getElementById('site-header').innerHTML =
    '<header class="site-header"><div class="inner">' +
    '<a class="logo" href="index.html" aria-label="LS">' +
    '<img src="images/logo.png" alt="LS" onerror="this.outerHTML=\'<span class=&quot;logo-fallback&quot;>LS</span>\'"></a>' +
    '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Menu">' +
    '<span></span><span></span></button>' +
    '</div>' +
    '<nav class="menu" id="site-menu" hidden><div class="menu-inner">' +
    '<a href="dresses.html"' + (page === 'dresses.html' ? ' aria-current="page"' : '') + ' data-i18n="nav.dresses"></a>' +
    '<a href="guide.html"' + (page === 'guide.html' ? ' aria-current="page"' : '') + ' data-i18n="nav.guide"></a>' +
    '<button class="lang" type="button" data-i18n="lang.toggle"></button>' +
    '</div></nav></header>';

  document.getElementById('site-footer').innerHTML =
    '<footer class="site-footer"><div class="inner">' +
    '<div><div class="brand">LS</div>' +
    '<div data-i18n="footer.inquiry"></div></div>' +
    '<div>Instagram <a href="' + SITE.insta + '" target="_blank" rel="noopener">' + SITE.instaName + '</a><br>' +
    'Tel <a href="tel:' + SITE.tel.replace(/-/g, '') + '">' + SITE.tel + '</a></div>' +
    '</div></footer>';

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
  }
  apply();

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

  var els = document.querySelectorAll('.fade');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }
})();
