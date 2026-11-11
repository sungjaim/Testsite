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
  // ── 날짜와 예약 ──
  var BEFORE = window.LS_BLOCK_BEFORE == null ? 3 : +window.LS_BLOCK_BEFORE;   // 공연일 앞으로 막는 날 수
  var AFTER = window.LS_BLOCK_AFTER == null ? 5 : +window.LS_BLOCK_AFTER;      // 공연일 뒤로 막는 날 수
  function pad(n) { return ('0' + n).slice(-2); }
  function toDate(s) { var m = String(s || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/); return m ? new Date(+m[1], m[2] - 1, +m[3]) : null; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function dayDiff(a, b) { return Math.round((a - b) / 86400000); }
  var EN_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(v) {                                   // "12월 20일" / "Dec 20"
    var d = v instanceof Date ? v : toDate(v); if (!d) return '';
    return lang === 'ko' ? (d.getMonth() + 1) + '월 ' + d.getDate() + '일' : EN_MON[d.getMonth()] + ' ' + d.getDate();
  }
  function dot(d) { return pad(d.getMonth() + 1) + '.' + pad(d.getDate()); }   // "12.20"

  // 오늘 이후(오늘 포함)의 대회만, 날짜순으로
  function upcomingEvents() {
    var t = today();
    return (window.LS.events || []).filter(function (e) { var d = toDate(e.date); return d && d >= t; })
      .sort(function (a, b) { return toDate(a.date) - toDate(b.date); });
  }
  function eventDate(e, short) { var d = toDate(e.date); return d ? (short ? dot(d) : d.getFullYear() + '.' + dot(d)) : ''; }

  // 드레스의 "예약 불가 기간" 목록 (아직 끝나지 않은 것만, 날짜순). 예약 현황을 모르면 null
  function blockedRanges(d) {
    var list = window.LS.bookings; if (!list) return null;
    var t = today();
    return list.filter(function (b) { return b.dress === d.number; })
      .map(function (b) { var y = toDate(b.date); return y && { from: addDays(y, -BEFORE), to: addDays(y, AFTER) }; })
      .filter(function (r) { return r && r.to >= t; })
      .sort(function (a, b) { return a.from - b.from; });
  }
  /* 그 날짜 공연으로 예약할 수 있는지: true / false / null(예약 현황을 몰라서 확인 불가)
     새 예약의 기간(공연일 앞 3일 ~ 뒤 5일)이 기존 예약의 기간과 겹치면 안 돼요 → 두 공연일이 8일 이내면 불가 */
  function availableOn(d, dateStr) {
    var x = toDate(dateStr); if (!x) return true;
    if (statusKey(d) !== 'available') return false;
    var list = window.LS.bookings; if (!list) return null;
    return !list.some(function (b) { var y = b.dress === d.number && toDate(b.date); return y && Math.abs(dayDiff(x, y)) <= BEFORE + AFTER; });
  }
  // 손님이 고른 공연 날짜 (페이지를 옮겨도 유지, 지난 날짜는 버려요)
  function getDate() {
    var v = ''; try { v = sessionStorage.getItem('ls-date') || ''; } catch (e) {}
    var d = toDate(v); return d && d >= today() ? iso(d) : '';
  }
  function setDate(v) { try { if (v) sessionStorage.setItem('ls-date', v); else sessionStorage.removeItem('ls-date'); } catch (e) {} }

  /* 카드의 상태 표시: 날짜를 고르기 전에는 "대여 가능"을 보여 주지 않아요 (언제 가능한지 알 수 없어서).
     "준비 중"은 지금 대여를 쉬는 중이라 항상 보여 주고, 날짜를 골랐을 때만 "예약 가능"을 보여 줘요. */
  function cardBadge(d) {
    if (statusKey(d) !== 'available') return statusTag(d);
    var date = getDate();
    return date && availableOn(d, date) === true ? '<span class="status s-available">' + esc(t('av.yes')) + '</span>' : '';
  }

  // 목록·추천에 쓰는 드레스 카드
  function card(d) {
    return '<a class="card" href="dress.html#' + esc(d.id) + '">' +
      '<div class="mat mat-sm"><div class="frame ph">' + photo(d.photos[0], d.name) + '</div></div>' +
      '<div class="card-meta"><span class="card-no">No. ' + esc(d.number) + '</span>' +
      '<span class="card-name">' + esc(d.name) + '</span>' +
      '<span class="card-sub">' + esc([d.size, d.color && colorName(d.color)].filter(Boolean).join(' · ')) + '</span>' +
      cardBadge(d) + '</div></a>';
  }

  var useSheet = !!(window.LS_SHEET_URL && window.LS_SHEET);
  window.LS = {
    t: t, esc: esc, site: SITE, getLang: function () { return lang; },
    colorName: colorName, statusKey: statusKey, statusName: statusName, statusTag: statusTag, sizeText: sizeText, priceText: priceText, photo: photo, card: card,
    dresses: window.LS_DRESSES || [],
    // 시트를 쓰면 시트의 예약·대회 탭이 기준이에요. 못 읽으면 예약은 null(확인 불가), 대회는 빈 목록
    bookings: useSheet ? null : (window.LS_BOOKINGS || []),
    events: useSheet ? [] : (window.LS_EVENTS || []),
    rule: { before: BEFORE, after: AFTER },
    upcomingEvents: upcomingEvents, eventDate: eventDate, fmtDate: fmtDate, dot: dot, toDate: toDate, iso: iso, today: today,
    blockedRanges: blockedRanges, availableOn: availableOn, getDate: getDate, setDate: setDate
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
  var CACHE_KEY = 'ls-sheet-cache-v3';
  function fetchCSV(url) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, window.LS_SHEET_TIMEOUT || 5000);
    return fetch(url, ctl ? { signal: ctl.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (text) {
        clearTimeout(timer);
        if (/^\s*</.test(text)) throw new Error('not csv');      // 게시되지 않은 탭은 CSV 대신 웹페이지가 와요
        return LS_SHEET.parseCSV(text);
      });
  }
  if (useSheet) {
    document.documentElement.classList.add('is-loading');
    var cache = {}; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) {}
    var none = function () { return null; };
    Promise.all([
      fetchCSV(window.LS_SHEET_URL).then(function (rows) {
        var list = LS_SHEET.toDresses(rows, window.LS_STATUS || {}, window.LS_COLORS || {});
        if (!list.length) throw new Error('empty'); return list;
      }).catch(none),
      window.LS_BOOKINGS_URL ? fetchCSV(window.LS_BOOKINGS_URL).then(LS_SHEET.toBookings).catch(none) : null,
      window.LS_EVENTS_URL ? fetchCSV(window.LS_EVENTS_URL).then(LS_SHEET.toEvents).catch(none) : null
    ]).then(function (res) {
      // 못 읽은 것은 마지막으로 읽은 시트 내용으로 대신해요 (드레스는 그것도 없으면 data/dresses.js)
      var dr = res[0] || cache.dresses, bk = res[1] || (window.LS_BOOKINGS_URL ? cache.bookings : null), ev = res[2] || cache.events;
      if (dr && dr.length) window.LS.dresses = dr;
      if (bk) window.LS.bookings = bk;
      if (ev) window.LS.events = ev;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ dresses: res[0] || cache.dresses, bookings: res[1] || cache.bookings, events: res[2] || cache.events })); } catch (e) {}
    }).then(done, done);
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
