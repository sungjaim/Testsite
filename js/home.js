/* 홈: 의상 레일.
   레일에는 '홈 슬라이드'를 체크한(featured) 의상이 먼저 나오고, 나머지는 전체에서 고르게 뽑아 채워요. */
LS.whenReady(function () {
  // ── 의상 레일 ──
  var rail = document.getElementById('rail');
  if (!rail) return;
  var track = rail.querySelector('.rail-track');
  var MAX = 14;                     // 레일에 올릴 의상 수
  var SPEED = 24;                   // 흐르는 속도 (1초에 몇 px)
  var anim = null, half = 0, timer = null, shown = '';
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
    document.getElementById('rail-all').textContent = LS.t('hero.all');
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
    if (anim) requestAnimationFrame(start);
  }
  /* 움직임: 스크롤 위치를 1px씩 옮기면 폰에서 툭툭 끊겨 보여서,
     줄 전체를 transform 으로 옮겨요(그래픽 처리라 소수점 단위로 부드럽게 움직여요).
     같은 줄을 두 번 놓았으니 절반만큼 가면 처음과 똑같은 모습이라 끊김 없이 반복돼요. */
  function start() {
    if (still) return;
    var w = track.scrollWidth / 2;
    if (!w) return;                                  // 화면에 아직 안 그려졌으면 다음 기회에
    var progress = anim && half ? (anim.currentTime % (half / SPEED * 1000)) / (half / SPEED * 1000) : 0;
    if (anim) anim.cancel();
    half = w;
    var dur = half / SPEED * 1000;
    anim = track.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(' + (-half) + 'px,0,0)' }],
      { duration: dur, iterations: Infinity });
    anim.currentTime = progress * dur;
  }
  function pause() { clearTimeout(timer); if (anim) anim.pause(); }
  function resume(ms) { clearTimeout(timer); timer = setTimeout(function () { if (anim && !drag) anim.play(); }, ms); }

  // 손가락이나 마우스로 끌면 그만큼 넘어가고, 놓으면 잠시 뒤 다시 흘러요
  var drag = null, moved = false;
  rail.addEventListener('pointerdown', function (e) {
    if (!anim || (e.pointerType === 'mouse' && e.button !== 0)) return;
    pause(); moved = false;
    drag = { x: e.clientX, t: anim.currentTime };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || !anim) return;
    var dx = e.clientX - drag.x;
    if (Math.abs(dx) > 6) moved = true;
    var dur = half / SPEED * 1000;
    anim.currentTime = ((drag.t - dx / half * dur) % dur + dur) % dur;
  });
  function endDrag() { if (!drag) return; drag = null; resume(moved ? 2500 : 1200); }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  rail.addEventListener('dragstart', function (e) { e.preventDefault(); });   // 링크·사진을 끌어 옮기는 브라우저 기본 동작은 막아요
  // 끌다가 손을 뗀 건 의상을 누른 걸로 치지 않아요
  rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  rail.addEventListener('mouseenter', function () { if (!drag) pause(); });
  rail.addEventListener('mouseleave', function () { if (!drag) resume(300); });
  rail.addEventListener('focusin', function () { pause(); resume(4000); });
  document.addEventListener('visibilitychange', function () { if (!anim) return; if (document.hidden) anim.pause(); else resume(0); });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(start, 200); });

  render();
  requestAnimationFrame(start);
  document.addEventListener('ls:lang', render);
  document.addEventListener('ls:data', render);
});
