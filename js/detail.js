/* 드레스 상세. 주소 끝의 #ls-01 같은 id 로 data/dresses.js 에서 드레스를 찾아 그립니다.
   사진이 4장보다 적으면 남는 칸은 연회색 자리표시로 채워요. */
LS.whenReady(function () {
  var MIN_SLOTS = 4;
  var root = document.getElementById('detail');

  function find() {
    var id = decodeURIComponent((location.hash || '').slice(1)) ||
      new URLSearchParams(location.search).get('id') || '';
    return LS.dresses.filter(function (d) { return d.id === id; })[0];
  }

  // 날짜별 예약 가능 여부: 고른 공연 날짜의 결과 + 예약이 잡힌 기간
  function avail(d) {
    var date = LS.getDate(), ranges = LS.blockedRanges(d);
    var h = '<div class="avail"><h2 class="events-title">' + LS.t('av.title') + '</h2>' +
      '<div class="date-row"><input type="date" class="date-input" id="d-date" value="' + date + '" min="' + LS.iso(LS.today()) + '" aria-label="' + LS.t('av.pick') + '">' +
      (date ? '<button type="button" class="btn btn-ghost btn-sm" id="d-date-clear">' + LS.t('date.clear') + '</button>' : '') + '</div>';
    if (date) {
      var ok = LS.availableOn(d, date);
      h += '<p class="avail-result">' + LS.t('av.result', { d: LS.fmtDate(date) }) + ' ' +
        (ok === null ? '<span class="status s-servicing">' + LS.t('av.unknownTag') + '</span>'
          : '<span class="status ' + (ok ? 's-available' : 's-booked') + '">' + LS.t(ok ? 'av.yes' : 'av.no') + '</span>') + '</p>';
    } else {
      h += '<p class="avail-result muted">' + LS.t('av.pickHint') + '</p>';
    }
    h += '<p class="avail-sub">' + LS.t('av.ranges') + '</p>';
    if (ranges === null) h += '<p class="ev-none">' + LS.t('av.unknown') + '</p>';
    else if (!ranges.length) h += '<p class="ev-none">' + LS.t('av.none') + '</p>';
    else h += '<ul class="ev-list rng-list">' + ranges.map(function (r) {
      return '<li><span class="ev-name">' + LS.dot(r.from) + ' ~ ' + LS.dot(r.to) + '</span><span class="status s-booked">' + LS.t('av.no') + '</span></li>';
    }).join('') + '</ul>';
    return h + '<p class="ev-other">' + LS.t('av.rule', { b: LS.rule.before, a: LS.rule.after }) + '</p></div>';
  }

  function render() {
    var d = find();
    if (!d) {
      root.innerHTML = '<div class="notfound"><p>' + LS.t('d.notfound') + '</p>' +
        '<a class="btn btn-ghost" href="dresses.html">' + LS.t('d.all') + '</a></div>';
      document.getElementById('more').hidden = true;
      return;
    }
    document.title = 'No. ' + d.number + ' ' + d.name + ' | LS';

    var slots = d.photos.slice();
    while (slots.length < MIN_SLOTS) slots.push(null);
    var rest = slots.length - 1;

    var gallery = '<div class="gallery" style="--rest:' + Math.min(rest, 3) + '">' +
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
      (LS.statusKey(d) !== 'available' ? '<div><dt>' + LS.t('d.status') + '</dt><dd>' + LS.statusTag(d) + '</dd></div>' : '') +
      '</dl>' +
      avail(d) +
      (LS.statusKey(d) !== 'available' ? '<p class="d-status-note">' + LS.t('d.note.' + LS.statusKey(d)) + '</p>' : '') +
      '<div class="actions">' +
      '<a class="btn btn-primary" href="' + LS.site.insta + '" target="_blank" rel="noopener">' + LS.t('btn.insta') + '</a>' +
      '<a class="btn btn-ghost" href="tel:' + LS.site.tel.replace(/-/g, '') + '">' + LS.t('btn.tel') + '</a>' +
      '</div>' +
      '<p class="d-note">' + LS.t('d.note') + ' <a href="guide.html">' + LS.t('d.guide') + '</a></p>' +
      '<p class="d-tel">Tel ' + LS.site.tel + ' · Instagram ' + LS.site.instaName + '</p>' +
      '</div>';

    var back = '<a class="back" href="dresses.html">' + LS.t('d.back') + '</a>';
    root.innerHTML = back + gallery + info;
    var di = document.getElementById('d-date'), dc = document.getElementById('d-date-clear');
    di.addEventListener('change', function () { LS.setDate(di.value); render(); });
    if (dc) dc.addEventListener('click', function () { LS.setDate(''); render(); });

    // 폰에서 옆으로 넘길 때 "1 / 4" 표시 갱신
    var track = document.getElementById('track'), gcount = document.getElementById('gcount');
    track.addEventListener('scroll', function () {
      var i = Math.round(track.scrollLeft / track.clientWidth * (track.clientWidth / track.firstChild.offsetWidth));
      gcount.textContent = Math.min(i + 1, slots.length) + ' / ' + slots.length;
    }, { passive: true });

    var others = LS.dresses.filter(function (x) { return x.id !== d.id; }).slice(0, 3);
    document.getElementById('more-grid').innerHTML = others.map(LS.card).join('');
    document.getElementById('more').hidden = !others.length;
  }

  window.addEventListener('hashchange', function () { render(); window.scrollTo(0, 0); });
  document.addEventListener('ls:lang', render);
  render();
});
