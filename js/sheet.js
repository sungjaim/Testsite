/* 구글 시트(CSV) → 드레스 목록 변환. 화면 코드와 분리해 두었어요. */
(function (root) {
  // CSV 한 덩어리를 줄·칸으로 나눠요. 따옴표 안의 쉼표와 줄바꿈도 처리해요.
  function parseCSV(text) {
    text = String(text || '').replace(/^﻿/, '');
    var rows = [], row = [], cell = '', q = false, i, c;
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ''; }); });
  }

  // 머리글 이름 → 내부 이름 (한국어, 영어 둘 다 받아요)
  var HEAD = {
    '번호': 'number', 'no': 'number', 'number': 'number',
    '이름': 'name', 'name': 'name',
    '사이즈': 'size', 'size': 'size',
    '색상': 'color', 'color': 'color', 'colour': 'color',
    '대여료': 'price', 'price': 'price',
    '상태': 'status', 'status': 'status',
    '사진수': 'photoCount', '사진': 'photoCount', 'photos': 'photoCount',
    '홈슬라이드': 'featured', '홈': 'featured', 'featured': 'featured'
  };
  function norm(h) { return String(h || '').replace(/\s+/g, '').toLowerCase(); }
  function truthy(v) { return /^(true|o|y|yes|1|v|예|네|✓|✔)$/i.test(String(v || '').trim()); }
  function find(map, text) {                 // { key: {ko, en} } 에서 글자와 맞는 key 를 찾아요
    var t = String(text || '').trim().toLowerCase();
    if (!t) return '';
    for (var k in map) if (k.toLowerCase() === t || String(map[k].ko).toLowerCase() === t || String(map[k].en).toLowerCase() === t) return k;
    return '';
  }

  // 머리글 끝에 날짜가 있으면 대회 칸이에요. 예: "회장배 2026.12.20", "꿈나무대회 2027-01-15"
  var DATE_TAIL = /\s*\(?(\d{4})\s*[.\-\/년]\s*(\d{1,2})\s*[.\-\/월]\s*(\d{1,2})\s*일?\.?\)?\s*$/;
  function eventFromHeader(h) {
    var m = String(h || '').trim().match(DATE_TAIL);
    if (!m) return null;
    var name = String(h).trim().slice(0, m.index).trim();
    if (!name) return null;
    var p2 = function (x) { return (x.length < 2 ? '0' : '') + x; };
    return { name: name, date: m[1] + '-' + p2(m[2]) + '-' + p2(m[3]) };
  }

  /* rows(parseCSV 결과) → 드레스 배열.
     상태 칸이 비었거나 모르는 글자면 '준비 중'으로 보여요 (대여 가능으로 잘못 보이는 것보다 안전해요). */
  function toDresses(rows, statusMap, colorMap) {
    if (!rows.length) return [];
    var cols = rows[0].map(function (h) { return HEAD[norm(h)] || null; });
    var events = [];                                 // { name, date, col }
    rows[0].forEach(function (h, i) { if (!cols[i]) { var e = eventFromHeader(h); if (e) { e.col = i; events.push(e); } } });
    var out = [];
    rows.slice(1).forEach(function (r) {
      var o = {};
      cols.forEach(function (k, i) { if (k) o[k] = String(r[i] === undefined ? '' : r[i]).trim(); });
      if (!o.number || !o.name) return;
      var n = o.number.replace(/\D/g, '');
      if (!n) return;
      n = n.length < 2 ? '0' + n : n;
      var id = 'ls-' + n;
      var count = parseInt(o.photoCount, 10);
      if (isNaN(count) || count < 0) count = 1;       // 비어 있으면 사진 1장으로 봐요
      var photos = [];
      for (var p = 1; p <= count; p++) photos.push('images/dresses/' + id + '/' + p + '.jpg');
      var price = parseInt(String(o.price || '').replace(/[^\d]/g, ''), 10);
      out.push({
        id: id,
        number: n,
        name: o.name,
        size: o.size || null,
        color: find(colorMap, o.color) || o.color || '',
        status: find(statusMap, o.status) || 'servicing',
        price: isNaN(price) ? null : price,
        photos: photos,
        featured: truthy(o.featured),
        booked: events.filter(function (e) { return truthy(r[e.col]); }).map(function (e) { return e.name; })
      });
    });
    out.events = events.map(function (e) { return { name: e.name, date: e.date }; });
    return out;
  }

  root.LS_SHEET = { parseCSV: parseCSV, toDresses: toDresses, eventFromHeader: eventFromHeader };
  if (typeof module !== 'undefined') module.exports = root.LS_SHEET;
})(typeof window !== 'undefined' ? window : globalThis);
