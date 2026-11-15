/* 드레스 상세. 주소 끝의 #ls-01 같은 id 로 data/dresses.js 에서 드레스를 찾아 그립니다.
   사진이 4장보다 적으면 남는 칸은 연회색 자리표시로 채워요. */
LS.whenReady(function () {
  var MIN_SLOTS = 1;   // 사진이 없을 때만 회색 칸 1개. 있으면 사진 수만큼만 보여요
  var root = document.getElementById('detail');

  function find() {
    var id = decodeURIComponent((location.hash || '').slice(1)) ||
      new URLSearchParams(location.search).get('id') || '';
    return LS.dresses.filter(function (d) { return d.id === id; })[0];
  }

  // 날짜별 예약 가능 여부: 고른 공연 날짜의 결과 + 예약이 잡힌 기간
  function avail(d) {
    var date = LS.getDate();
    return '<div class="avail"><h2 class="events-title">' + LS.t('av.title') + '</h2>' +
      '<div class="date-row"><span class="date-wrap" data-ph="' + LS.t('date.ph') + '"><input type="date" class="date-input" id="d-date" required value="' + date + '" min="' + LS.iso(LS.today()) + '" aria-label="' + LS.t('av.pick') + '"></span>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="d-date-clear"' + (date ? '' : ' hidden') + '>' + LS.t('date.clear') + '</button></div>' +
      '<div class="avail-body">' + availBody(d) + '</div></div>';
  }
  // 날짜 칸 아래의 결과 부분 (날짜를 바꾸면 이 부분만 다시 그려요)
  function availBody(d) {
    var date = LS.getDate(), ranges = LS.blockedRanges(d), h = '';
    if (date) {
      var ok = LS.availableOn(d, date);
      h += '<p class="avail-result">' + LS.t('av.result', { d: LS.fmtDate(date) }) + ' ' +
        (ok === null ? '<span class="status s-servicing">' + LS.t('av.unknownTag') + '</span>'
          : '<span class="status ' + (ok ? 's-available' : 's-booked') + '">' + LS.t(ok ? 'av.yes' : 'av.no') + '</span>') + '</p>';
      if (LS.statusKey(d) !== 'available') h += '<p class="avail-why">' + LS.t('av.servicing') + '</p>';   // 정리·수선 중이라 불가
      else if (ok && LS.toDate(date) - LS.today() < LS.rule.before * 86400000) h += '<p class="avail-why">' + LS.t('date.soon', { b: LS.rule.before }) + '</p>';
    } else {
      h += '<p class="avail-result muted">' + LS.t('av.pickHint') + '</p>';
    }
    // 예약된 기간은 있을 때만 보여 줘요
    if (ranges === null) h += '<p class="ev-none">' + LS.t('av.unknown') + '</p>';
    else if (ranges.length) h += '<p class="avail-sub">' + LS.t('av.ranges') + '</p><ul class="ev-list rng-list">' + ranges.map(function (r) {
      return '<li><span class="ev-name">' + LS.dot(r.from) + ' ~ ' + LS.dot(r.to) + '</span><span class="status s-booked">' + LS.t('av.no') + '</span></li>';
    }).join('') + '</ul>';
    return h;
  }

  // 날짜를 바꾸면 "예약 가능 날짜" 부분만 바꿔요 (사진·글이 다시 그려지며 깜빡이지 않게)
  function bindAvail(d) {
    var di = document.getElementById('d-date'), dc = document.getElementById('d-date-clear');
    // 날짜 칸은 그대로 두고 결과만 바꿔요. 날짜 칸을 새로 만들면 아이폰에서 달력이 바로 닫혀요.
    function refresh() {
      var box = root.querySelector('.avail'), body = box.querySelector('.avail-body');
      body.innerHTML = availBody(d);
      box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap');
      dc.hidden = !LS.getDate();
      var m = document.getElementById('ask-msg'); if (m) bindAskText(d);
      others(d);                                                            // 아래 추천도 새 날짜로
    }
    di.addEventListener('change', function () { LS.setDate(di.value); refresh(); });
    dc.addEventListener('click', function () { LS.setDate(''); di.value = ''; refresh(); });
  }

  // ── 대여 문의: 손님이 칸을 채우면 누나에게 보낼 메시지를 만들어 줘요 ──
  // (키·몸무게를 다시 묻는 DM 왕복을 줄이려고. 적은 값은 이 창을 닫을 때까지 기억해요)
  var ASK_KEY = 'ls-ask';
  function askSaved() { try { return JSON.parse(sessionStorage.getItem(ASK_KEY)) || {}; } catch (e) { return {}; } }
  function ask() {
    var v = askSaved(), f = function (id, key, unit, extra) {
      return '<div class="ask-f' + (extra ? ' wide' : '') + '"><label for="' + id + '">' + LS.t(key) + '</label><span class="ask-in"><input id="' + id + '" type="text" inputmode="decimal" autocomplete="off" value="' + LS.esc(v[id] || '') + '"><span>' + unit + '</span></span>' + (extra || '') + '</div>';
    };
    return '<section class="ask" aria-labelledby="ask-title"><h2 class="events-title" id="ask-title">' + LS.t('ask.title') + '</h2>' +
      '<p class="ask-hint">' + LS.t('ask.hint') + '</p>' +
      '<div class="ask-grid">' + f('ask-h', 'ask.h', 'cm') + f('ask-w', 'ask.w', 'kg') +
      f('ask-g', 'ask.g', 'cm', '<small>' + LS.t('ask.gHelp') + '</small>') +
      '<label class="ask-check wide"><input type="checkbox" id="ask-t"' + (v['ask-t'] ? ' checked' : '') + '> ' + LS.t('ask.t') + '</label></div>' +
      '<p class="avail-sub">' + LS.t('ask.msgLabel') + '</p><p class="ask-msg" id="ask-msg"></p>' +
      '<div class="actions">' +
      '<a class="btn btn-primary" id="ask-insta" href="https://ig.me/m/' + LS.site.instaName.replace('@', '') + '" target="_blank" rel="noopener">' + LS.t('ask.insta') + '</a>' +
      '<a class="btn btn-ghost" id="ask-sms" href="#">' + LS.t('ask.sms') + '</a></div>' +
      '<p class="ask-done" id="ask-done" role="status"></p>' +
      '<p class="d-tel">' + LS.t('ask.call') + ' <a href="tel:' + LS.site.tel.replace(/-/g, '') + '">' + LS.site.tel + '</a></p></section>';
  }
  function askText(d) {
    var g = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var date = LS.toDate(LS.getDate()), lines = ['[LS 대여 문의]', '의상: No. ' + d.number + ' ' + d.name];
    lines.push('대회 날짜: ' + (date ? date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일' : '미정'));
    var body = [g('ask-h') && '키 ' + g('ask-h') + 'cm', g('ask-w') && '몸무게 ' + g('ask-w') + 'kg', g('ask-g') && '온몸둘레 ' + g('ask-g') + 'cm'].filter(Boolean);
    if (body.length) lines.push(body.join(' / '));
    if (document.getElementById('ask-t') && document.getElementById('ask-t').checked) lines.push('스타킹 대여 희망');
    return lines.join('\n');
  }
  function bindAsk(d) {
    var ids = ['ask-h', 'ask-w', 'ask-g', 'ask-t'];
    function update() {
      var v = {}; ids.forEach(function (id) { var el = document.getElementById(id); v[id] = el.type === 'checkbox' ? el.checked : el.value; });
      try { sessionStorage.setItem(ASK_KEY, JSON.stringify(v)); } catch (e) {}
      var text = askText(d);
      document.getElementById('ask-msg').textContent = text;
      document.getElementById('ask-sms').href = 'sms:' + LS.site.tel.replace(/-/g, '') + '?&body=' + encodeURIComponent(text);
      document.getElementById('ask-done').textContent = '';
    }
    ids.forEach(function (id) { var el = document.getElementById(id); el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', update); });
    // 인스타그램은 미리 글을 넣어 줄 수 없어서, 메시지를 복사해 두고 DM 창을 열어요
    document.getElementById('ask-insta').addEventListener('click', function () {
      var text = askText(d), done = document.getElementById('ask-done');
      function ok() { done.textContent = LS.t('ask.copied'); }
      function fallback() {
        var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (x) {} document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
    });
    update();
  }
  function bindAskText(d) {
    var text = askText(d);
    document.getElementById('ask-msg').textContent = text;
    document.getElementById('ask-sms').href = 'sms:' + LS.site.tel.replace(/-/g, '') + '?&body=' + encodeURIComponent(text);
  }

  // 아래 추천: 날짜를 골랐으면 그 날짜에 예약 가능한 드레스를 보여 줘요
  function others(d) {
    var list = LS.dresses.filter(function (x) { return x.id !== d.id && (x.kind || 'dress') === (d.kind || 'dress'); }), date = LS.getDate();
    var open = date ? list.filter(function (x) { return LS.availableOn(x, date) === true; }) : [];
    var show = (open.length ? open : list).slice(0, 3);
    document.getElementById('more-title').textContent = open.length ? LS.t('d.moreDate', { d: LS.fmtDate(date) }) : LS.t(d.kind === 'men' ? 'd.moreMen' : 'd.more');
    document.getElementById('more-grid').innerHTML = show.map(LS.card).join('');
    document.getElementById('more').hidden = !show.length;
  }

  function render() {
    var d = find();
    if (!d) {
      root.innerHTML = '<div class="notfound"><p>' + LS.t('d.notfound') + '</p>' +
        '<a class="btn btn-ghost" href="dresses.html">' + LS.t('d.all') + '</a></div>';
      document.getElementById('more').hidden = true;
      return;
    }
    document.title = 'No. ' + d.number + ' ' + d.name + ' | 엘에스(LS) 피겨 의상 대여';

    var slots = d.photos.slice();
    while (slots.length < MIN_SLOTS) slots.push(null);
    var rest = slots.length - 1;

    var gallery = '<div class="gallery' + (slots.length === 1 ? ' single' : '') + '" style="--rest:' + Math.max(1, Math.min(rest, 3)) + '">' +
      '<div class="gallery-track" id="track">' +
      slots.map(function (src, i) {
        return '<div class="gallery-item' + (i === 0 ? ' main' : '') + '"><div class="mat' + (i === 0 ? '' : ' mat-sm') + '">' +
          '<div class="frame ph">' + LS.photo(src, i === 0 ? d.name : '') + '</div></div></div>';
      }).join('') +
      '</div><p class="gallery-count" id="gcount">1 / ' + slots.length + '</p></div>';

    var info = '<div class="info">' +
      '<p class="card-no">No. ' + LS.esc(d.number) + '</p>' +
      '<h1 class="d-name">' + LS.esc(d.name) + '</h1>' +
      '<dl class="specs">' +
      '<div><dt>' + LS.t('d.size') + '</dt><dd>' + LS.esc(LS.sizeText(d)) + '</dd></div>' +
      '<div><dt>' + LS.t('d.color') + '</dt><dd>' + LS.esc(LS.colorName(d.color)) + '</dd></div>' +
      '<div><dt>' + LS.t('d.price') + '</dt><dd>' + LS.esc(LS.priceText(d)) + '</dd></div>' +
      '</dl>' +
      avail(d) +
      ask() +
      '</div>';

    var men = d.kind === 'men';
    var back = '<a class="back" href="dresses.html' + (men ? '#men' : '') + '">' + LS.t(men ? 'd.backMen' : 'd.back') + '</a>';
    root.innerHTML = back + gallery + info;
    bindAvail(d);
    bindAsk(d);

    // 폰에서 옆으로 넘길 때 "1 / 4" 표시 갱신
    var track = document.getElementById('track'), gcount = document.getElementById('gcount');
    track.addEventListener('scroll', function () {
      var i = Math.round(track.scrollLeft / track.clientWidth * (track.clientWidth / track.firstChild.offsetWidth));
      gcount.textContent = Math.min(i + 1, slots.length) + ' / ' + slots.length;
    }, { passive: true });

    others(d);
  }

  window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });
  document.addEventListener('ls:lang', render);
  document.addEventListener('ls:data', render);     // 시트에서 새 내용이 오면 다시 그려요
  render();
});
