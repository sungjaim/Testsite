/* 홈: 공연 날짜로 찾기 + 의상 레일.
   레일에는 '홈 슬라이드'를 체크한(featured) 의상이 먼저 나오고, 나머지는 전체에서 고르게 뽑아 채워요. */
LS.whenReady(function () {
  // ── 공연 날짜: 고른 날짜를 기억해 두면 의상 목록이 그 날짜로 열려요 ──
  var input = document.getElementById('home-date');
  if (input) {
    function sync() {
      input.value = LS.getDate();
      input.min = LS.iso(LS.today());
      input.parentNode.setAttribute('data-ph', LS.t('date.ph'));
    }
    input.addEventListener('change', function () { LS.setDate(input.value); document.dispatchEvent(new Event('ls:data')); });
    document.addEventListener('ls:lang', sync);
    sync();
  }

  // ── 의상 레일 ──
  var rail = document.getElementById('rail');
  if (!rail) return;
  var track = rail.querySelector('.rail-track');
  var MAX = 14;                     // 레일에 올릴 의상 수
  var SPEED = 22;                   // 흐르는 속도 (1초에 몇 px)
  var pos = 0, half = 0, last = 0, paused = false, timer = null, shown = '';
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pick() {
    var all = (LS.dresses || []).filter(function (d) { return d.photos.length; });
    var list = all.filter(function (d) { return d.featured; });
    var rest = all.filter(function (d) { return !d.featured && d.kind !== 'men'; });
    var need = Math.min(MAX, all.length) - list.length, step = rest.length / Math.max(need, 1);
    for (var i = 0; i < need && rest.length; i++) list.push(rest[Math.floor(i * step)]);
    return list;
  }
  function card(d, dup) {
    return '<a class="rail-card" href="dress.html#' + d.id + '"' + (dup ? ' aria-hidden="true" tabindex="-1"' : '') + '>' +
      '<div class="mat mat-sm"><div class="frame ph">' + LS.photo(d.photos[0], dup ? '' : 'No. ' + d.number + ' ' + d.name) + '</div></div>' +
      '<span class="rail-no">No. ' + LS.esc(d.number) + '</span><span class="rail-name">' + LS.esc(d.name) + '</span></a>';
  }
  function render() {
    var list = pick();
    document.getElementById('rail-all').textContent = LS.t('hero.all', { n: (LS.dresses || []).length });
    if (!list.length) { rail.parentNode.hidden = true; return; }
    rail.parentNode.hidden = false;
    var key = list.map(function (d) { return d.id + d.name; }).join('|');
    if (key === shown) return;        // 같은 의상이면 다시 그리지 않아요 (깜빡임 방지)
    shown = key;
    // 끊기지 않고 이어지도록 같은 줄을 두 번 놓아요 (움직임을 줄인 기기에서는 한 번만)
    track.innerHTML = list.map(function (d) { return card(d, false); }).join('') +
      (still ? '' : list.map(function (d) { return card(d, true); }).join(''));
    // 처음 보이는 사진들은 바로 불러와요
    track.querySelectorAll('img').forEach(function (img, i) { if (i < 4) img.loading = 'eager'; });
    half = 0;
  }
  function tick(now) {
    requestAnimationFrame(tick);
    var dt = Math.min(now - last, 100); last = now;
    if (paused || document.hidden) return;
    if (!half) { half = track.scrollWidth / 2; if (!half) return; }   // 화면에 없을 때는 너비가 0
    pos += SPEED * dt / 1000;
    if (pos >= half) pos -= half;
    rail.scrollLeft = pos;
  }
  // 손으로 넘기거나 마우스를 올리면 멈췄다가, 잠시 뒤 그 자리에서 다시 흘러요
  function hold() { paused = true; clearTimeout(timer); }
  function release(ms) {
    clearTimeout(timer);
    timer = setTimeout(function () { pos = half ? rail.scrollLeft % half : rail.scrollLeft; paused = false; }, ms);
  }
  render();
  if (!still) {
    ['touchstart', 'pointerdown', 'wheel', 'focusin'].forEach(function (ev) {
      rail.addEventListener(ev, function () { hold(); release(3000); }, { passive: true });
    });
    rail.addEventListener('touchend', function () { release(3000); }, { passive: true });
    rail.addEventListener('mouseenter', hold);
    rail.addEventListener('mouseleave', function () { release(400); });
    window.addEventListener('resize', function () { half = 0; });
    requestAnimationFrame(function (t) { last = t; requestAnimationFrame(tick); });
  }
  document.addEventListener('ls:lang', render);
  document.addEventListener('ls:data', render);
});
