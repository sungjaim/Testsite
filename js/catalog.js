/* 드레스 목록 + 사이즈/색상 필터. 필터 버튼은 data/dresses.js 값으로 자동으로 만들어져요. */
(function () {
  var all = LS.dresses;
  var state = { size: '', color: '', status: '' };
  var grid = document.getElementById('grid');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');

  function uniq(key) {
    var seen = {}, out = [];
    all.forEach(function (d) { var v = d[key]; if (v && !seen[v]) { seen[v] = 1; out.push(v); } });
    return out;
  }
  function chips(boxId, key, values, label) {
    var box = document.getElementById(boxId);
    var html = '<button type="button" class="chip" data-v="" aria-pressed="' + (state[key] === '') + '">' + LS.t('filter.all') + '</button>';
    values.forEach(function (v) {
      html += '<button type="button" class="chip" data-v="' + LS.esc(v) + '" aria-pressed="' + (state[key] === v) + '">' + LS.esc(label(v)) + '</button>';
    });
    box.innerHTML = html;
    box.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () { state[key] = b.getAttribute('data-v'); render(); });
    });
  }
  function render() {
    chips('f-size', 'size', uniq('size'), function (v) { return v; });
    chips('f-color', 'color', uniq('color'), LS.colorName);
    var used = {}; all.forEach(function (d) { used[LS.statusKey(d)] = 1; });
    chips('f-status', 'status', Object.keys(window.LS_STATUS || {}).filter(function (k) { return used[k]; }), LS.statusName);
    var list = all.filter(function (d) {
      return (!state.size || d.size === state.size) && (!state.color || d.color === state.color) &&
        (!state.status || LS.statusKey(d) === state.status);
    });
    grid.innerHTML = list.map(LS.card).join('');
    count.textContent = LS.t('list.count', { n: list.length });
    empty.hidden = list.length > 0;
  }
  document.getElementById('reset').addEventListener('click', function () { state.size = ''; state.color = ''; state.status = ''; render(); });
  document.addEventListener('ls:lang', render);
  render();
})();
