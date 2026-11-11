/* 드레스 목록 + 사이즈/색상 필터. 필터 버튼은 data/dresses.js 값으로 자동으로 만들어져요. */
LS.whenReady(function () {
  var state = { size: '', color: '', status: '', event: '' };
  var grid = document.getElementById('grid');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');

  function uniq(key) {
    var seen = {}, out = [];
    LS.dresses.forEach(function (d) { var v = d[key]; if (v && !seen[v]) { seen[v] = 1; out.push(v); } });
    return out;
  }
  function chips(boxId, key, values, label) {
    var box = document.getElementById(boxId);
    var html = '<button type="button" class="chip" data-v="" aria-pressed="' + (state[key] === '') + '">' + LS.t('filter.all') + '</button>';
    values.forEach(function (v) {
      html += '<button type="button" class="chip" data-v="' + LS.esc(v) + '" aria-pressed="' + (state[key] === v) + '">' + LS.esc(label(v)) + '</button>';
    });
    box.innerHTML = html;
    box.parentNode.hidden = !values.length;   // 고를 값이 없으면 줄을 숨겨요
    box.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () { state[key] = b.getAttribute('data-v'); render(); });
    });
  }
  function render() {
    var all = LS.dresses;
    // 대회: 다가오는 대회만. 고르면 그 대회에 예약 가능한(예약이 안 잡힌) 드레스만 보여요
    var evs = LS.upcomingEvents();
    if (state.event && !evs.some(function (e) { return e.name === state.event; })) state.event = '';
    chips('f-event', 'event', evs.map(function (e) { return e.name; }), function (n) {
      var e = evs.filter(function (x) { return x.name === n; })[0]; return n + ' · ' + LS.eventDate(e, true);
    });
    chips('f-size', 'size', uniq('size'), function (v) { return v; });
    chips('f-color', 'color', uniq('color'), LS.colorName);
    var used = {}; all.forEach(function (d) { used[LS.statusKey(d)] = 1; });
    chips('f-status', 'status', Object.keys(window.LS_STATUS || {}).filter(function (k) { return used[k]; }), LS.statusName);
    var list = all.filter(function (d) {
      return (!state.size || d.size === state.size) && (!state.color || d.color === state.color) &&
        (!state.status || LS.statusKey(d) === state.status) &&
        (!state.event || !LS.isBooked(d, { name: state.event }));
    });
    grid.innerHTML = list.map(LS.card).join('');
    count.textContent = LS.t('list.count', { n: list.length });
    empty.hidden = list.length > 0;
    // 접혀 있어도 어떤 필터가 걸려 있는지 보이게
    var on = [state.event, state.size, state.color && LS.colorName(state.color), state.status && LS.statusName(state.status)].filter(Boolean);
    document.getElementById('active').textContent = on.join(', ');
  }
  document.getElementById('reset').addEventListener('click', function () { state.size = ''; state.color = ''; state.status = ''; state.event = ''; render(); });
  document.getElementById('filters').open = !!(window.matchMedia && matchMedia('(min-width: 900px)').matches);
  document.addEventListener('ls:lang', render);
  render();
});
