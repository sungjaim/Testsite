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
    '홈슬라이드': 'featured', '홈': 'featured', 'featured': 'featured',
    '종류': 'kind', '구분': 'kind', 'kind': 'kind', 'type': 'kind'
  };
  function norm(h) { return String(h || '').replace(/\s+/g, '').toLowerCase(); }
  function truthy(v) { return /^(true|o|y|yes|1|v|예|네|✓|✔)$/i.test(String(v || '').trim()); }
  function find(map, text) {                 // { key: {ko, en} } 에서 글자와 맞는 key 를 찾아요
    var t = String(text || '').trim().toLowerCase();
    if (!t) return '';
    for (var k in map) if (k.toLowerCase() === t || String(map[k].ko).toLowerCase() === t || String(map[k].en).toLowerCase() === t) return k;
    return '';
  }

  /* rows(parseCSV 결과) → 드레스 배열.
     상태 칸이 비었거나 모르는 글자면 '준비 중'으로 보여요 (대여 가능으로 잘못 보이는 것보다 안전해요). */
  function toDresses(rows, statusMap, colorMap) {
    if (!rows.length) return [];
    var cols = rows[0].map(function (h) { return HEAD[norm(h)] || null; });
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
        kind: /남|men|male|boy/i.test(o.kind || '') ? 'men' : 'dress'   // 종류 칸: '남자 의상'이면 따로 보여요
      });
    });
    return out;
  }

  // 날짜 글자 → 'YYYY-MM-DD'. "2026-12-20", "2026. 12. 20", "2026/12/20", "2026년 12월 20일" 모두 돼요
  function normDate(v) {
    var m = String(v || '').match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
    var us = !m && String(v || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);     // 12/20/2026 꼴
    if (us) m = [0, us[3], us[1], us[2]];
    if (!m) return '';
    return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  }
  function table(rows, head) {                    // 머리글 이름으로 칸을 찾아 { key: 값 } 목록으로
    if (!rows.length) return [];
    var cols = rows[0].map(function (h) { return head[norm(h)] || null; });
    return rows.slice(1).map(function (r) {
      var o = {}; cols.forEach(function (k, i) { if (k) o[k] = String(r[i] === undefined ? '' : r[i]).trim(); }); return o;
    });
  }
  function dressNo(v) { var n = String(v || '').replace(/\D/g, ''); return n ? (n.length < 2 ? '0' + n : n) : ''; }

  // "예약" 탭: 드레스 번호 | 공연 날짜 | 메모
  var BOOK_HEAD = { '드레스번호': 'dress', '번호': 'dress', '드레스': 'dress', 'dress': 'dress', 'no': 'dress',
                    '공연날짜': 'date', '날짜': 'date', '공연일': 'date', 'date': 'date' };
  function need(rows, head, keys) {                // 필요한 머리글이 없으면 오류 (엉뚱한 표를 "예약 없음"으로 오해하지 않게)
    var have = (rows[0] || []).map(function (h) { return head[norm(h)]; });
    keys.forEach(function (k) { if (have.indexOf(k) === -1) throw new Error('missing column: ' + k); });
  }
  function toBookings(rows) {
    need(rows, BOOK_HEAD, ['dress', 'date']);
    var out = [];
    table(rows, BOOK_HEAD).forEach(function (o) {
      var date = normDate(o.date); if (!date) return;
      // 한 칸에 의상이 여러 벌이면("69번,49번", "5/7 번") 각각 예약으로 봐요. "54번-1" 은 54번이에요.
      var text = String(o.dress || '').replace(/(\d)\s*번?\s*-\s*\d+(?!\d|\s*번)/g, '$1');
      (text.match(/\d+/g) || []).forEach(function (n) { out.push({ dress: dressNo(n), date: date }); });
    });
    return out;
  }
  // "대회" 탭: 대회 이름 | 날짜
  var EVENT_HEAD = { '대회이름': 'name', '대회': 'name', '이름': 'name', 'name': 'name', 'event': 'name',
                     '날짜': 'date', '대회날짜': 'date', 'date': 'date' };
  function toEvents(rows) {
    need(rows, EVENT_HEAD, ['name', 'date']);
    return table(rows, EVENT_HEAD).map(function (o) { return { name: o.name || '', date: normDate(o.date) }; })
      .filter(function (e) { return e.name && e.date; });
  }

  root.LS_SHEET = { parseCSV: parseCSV, toDresses: toDresses, toBookings: toBookings, toEvents: toEvents, normDate: normDate };
  if (typeof module !== 'undefined') module.exports = root.LS_SHEET;
})(typeof window !== 'undefined' ? window : globalThis);
