/* 드레스 목록: 공연 날짜로 찾기 + 사이즈/색상/상태 필터.
   날짜를 고르지 않으면 모든 드레스가 보이고, 고르면 그 날짜 공연에 예약 가능한 드레스만 보여요. */
LS.whenReady(function () {
  var state = { size: '', color: '', status: '' };
  var grid = document.getElementById('grid');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var input = document.getElementById('date');
  var clearBtn = document.getElementById('date-clear');
  var result = document.getElementById('date-result');

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
  // 다가오는 대회: 누르면 그 날짜가 공연 날짜로 들어가요
  function eventChips(date) {
    var evs = LS.upcomingEvents(), box = document.getElementById('ev-chips');
    document.getElementById('ev-pick').hidden = !evs.length;
    box.innerHTML = evs.map(function (e) {
      return '<button type="button" class="chip" data-date="' + LS.esc(LS.iso(LS.toDate(e.date))) + '" aria-pressed="' + (LS.iso(LS.toDate(e.date)) === date) + '">' +
        LS.esc(e.name) + ' · ' + LS.eventDate(e, true) + '</button>';
    }).join('');
    box.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () { var v = b.getAttribute('data-date'); LS.setDate(v === LS.getDate() ? '' : v); render(); });
    });
  }

  function render() {
    var date = LS.getDate();
    input.value = date;
    input.min = LS.iso(LS.today());
    clearBtn.hidden = !date;
    eventChips(date);

    chips('f-size', 'size', uniq('size'), function (v) { return v; });
    chips('f-color', 'color', uniq('color'), LS.colorName);
    var used = {}; LS.dresses.forEach(function (d) { used[LS.statusKey(d)] = 1; });
    chips('f-status', 'status', Object.keys(window.LS_STATUS || {}).filter(function (k) { return used[k]; }), LS.statusName);

    var unknown = !!date && LS.bookings === null;      // 예약 현황을 못 읽었으면 날짜로 거르지 않아요
    var list = LS.dresses.filter(function (d) {
      return (!state.size || d.size === state.size) && (!state.color || d.color === state.color) &&
        (!state.status || LS.statusKey(d) === state.status) &&
        (!date || unknown || LS.availableOn(d, date) === true);
    });
    grid.innerHTML = list.map(LS.card).join('');
    count.textContent = LS.t('list.count', { n: list.length });
    empty.hidden = list.length > 0;

    var msg = !date ? LS.t('date.hint') : unknown ? LS.t('date.unknown') : LS.t('date.result', { d: LS.fmtDate(date), n: list.length });
    var soon = date && LS.toDate(date) - LS.today() < LS.rule.before * 86400000;
    result.textContent = msg + (soon ? ' ' + LS.t('date.soon', { b: LS.rule.before }) : '');
    result.classList.toggle('on', !!date);

    // 접혀 있어도 어떤 필터가 걸려 있는지 보이게
    var on = [state.size, state.color && LS.colorName(state.color), state.status && LS.statusName(state.status)].filter(Boolean);
    document.getElementById('active').textContent = on.join(', ');
  }
  input.addEventListener('change', function () { LS.setDate(input.value); render(); });
  clearBtn.addEventListener('click', function () { LS.setDate(''); render(); });
  document.getElementById('reset').addEventListener('click', function () { state.size = ''; state.color = ''; state.status = ''; LS.setDate(''); render(); });
  document.getElementById('filters').open = !!(window.matchMedia && matchMedia('(min-width: 900px)').matches);
  document.addEventListener('ls:lang', render);
  render();
});
