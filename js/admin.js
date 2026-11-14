/* 관리자 화면: 로그인 + 예약 관리. 설정 방법은 admin/README.md.
   로그인과 예약 저장은 Supabase 가 맡아요. 손님 이름·연락처는 로그인한 관리자에게만 보여요. */
LS.whenReady(function () {
  var URL = (window.LS_SUPABASE_URL || '').replace(/\/$/, ''), KEY = window.LS_SUPABASE_KEY || '';
  var KEY_SESSION = 'ls-admin-session';
  var $ = function (id) { return document.getElementById(id); };
  var views = { setup: $('adm-setup'), login: $('adm-login'), app: $('adm-app') };
  function view(name) { for (var k in views) views[k].hidden = k !== name; }

  if (!URL || !KEY) { view('setup'); return; }

  // ── 로그인 상태 ──
  var session = null;
  try { session = JSON.parse(localStorage.getItem(KEY_SESSION)); } catch (e) {}
  function save(s) {
    session = s;
    try { if (s) localStorage.setItem(KEY_SESSION, JSON.stringify(s)); else localStorage.removeItem(KEY_SESSION); } catch (e) {}
  }
  function fromAuth(j) {
    return { access: j.access_token, refresh: j.refresh_token, until: Date.now() + (j.expires_in || 3600) * 1000, email: (j.user && j.user.email) || '' };
  }
  function auth(path, body, token) {
    return fetch(URL + '/auth/v1/' + path, {
      method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json', Authorization: 'Bearer ' + (token || KEY) }, body: JSON.stringify(body || {})
    });
  }
  // 로그인이 곧 끝나면 미리 연장해요
  function fresh() {
    if (!session) return Promise.reject(new Error('signed-out'));
    if (session.until - Date.now() > 60000) return Promise.resolve(session.access);
    return auth('token?grant_type=refresh_token', { refresh_token: session.refresh })
      .then(function (r) { if (!r.ok) throw new Error('signed-out'); return r.json(); })
      .then(function (j) { save(fromAuth(j)); return session.access; });
  }
  // 예약 표 읽기·쓰기
  function db(path, opts) {
    opts = opts || {};
    return fresh().then(function (token) {
      return fetch(URL + '/rest/v1/' + path, {
        method: opts.method || 'GET',
        headers: { apikey: KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: opts.body ? JSON.stringify(opts.body) : undefined
      });
    }).then(function (r) {
      if (r.status === 401) throw new Error('signed-out');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.status === 204 ? [] : r.json();
    });
  }
  function fail(e, el) {
    if (e && e.message === 'signed-out') { save(null); showLogin('로그인이 만료되었습니다. 다시 로그인해 주세요.'); return; }
    el.textContent = '처리하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.';
  }

  // ── 로그인 화면 ──
  function showLogin(msg) { view('login'); $('adm-login-msg').textContent = msg || ''; }
  views.login.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('adm-email').value.trim(), pw = $('adm-pw').value, msg = $('adm-login-msg');
    if (!email || !pw) { msg.textContent = '이메일과 비밀번호를 입력해 주세요.'; return; }
    msg.textContent = '';
    auth('token?grant_type=password', { email: email, password: pw })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) { msg.textContent = '이메일 또는 비밀번호가 맞지 않습니다.'; return; }
        save(fromAuth(res.j)); $('adm-pw').value = ''; start();
      })
      .catch(function () { msg.textContent = '로그인하지 못했습니다. 인터넷 연결을 확인해 주세요.'; });
  });
  $('adm-logout').addEventListener('click', function () {
    var token = session && session.access;
    save(null); showLogin('');
    if (token) auth('logout', {}, token).catch(function () {});
  });

  // ── 예약 관리 ──
  var bookings = [], span = LS.rule.before + LS.rule.after, force = false;
  function dressOf(no) { return LS.dresses.filter(function (d) { return d.number === no; })[0]; }
  function label(no) { var d = dressOf(no); return 'No. ' + no + (d ? ' ' + d.name : ''); }
  function fullDate(s) { var d = LS.toDate(s); return d ? d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate() : s; }
  function clash(no, date, skipId) {
    var x = LS.toDate(date);
    return bookings.filter(function (b) {
      var y = LS.toDate(b.date);
      return b.id !== skipId && b.dress === no && y && Math.abs(Math.round((x - y) / 864e5)) <= span;
    });
  }
  function row(b) {
    var who = [b.customer_name ? LS.esc(b.customer_name) : '',
      b.phone ? '<a href="tel:' + LS.esc(String(b.phone).replace(/[^\d+]/g, '')) + '">' + LS.esc(b.phone) + '</a>' : ''].filter(Boolean).join(' · ');
    return '<li data-id="' + b.id + '">' +
      '<div class="adm-row-main"><span class="adm-date">' + fullDate(b.date) + '</span><span class="adm-dress">' + LS.esc(label(b.dress)) + '</span></div>' +
      (who ? '<div class="adm-row-sub">' + who + '</div>' : '') +
      (b.memo ? '<div class="adm-row-sub">' + LS.esc(b.memo) + '</div>' : '') +
      '<div class="adm-row-act"><button type="button" class="btn btn-ghost btn-sm" data-act="ask">삭제</button>' +
      '<span class="adm-confirm" hidden>삭제할까요? <button type="button" class="btn btn-primary btn-sm" data-act="del">삭제</button> ' +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="no">취소</button></span></div></li>';
  }
  function render() {
    var today = LS.iso(LS.today());
    var next = bookings.filter(function (b) { return b.date >= today; });
    var past = bookings.filter(function (b) { return b.date < today; }).reverse();
    $('adm-n').textContent = next.length + '건';
    $('adm-list').innerHTML = next.length ? next.map(row).join('') : '<li class="adm-empty">다가오는 예약이 없습니다.</li>';
    $('adm-past-wrap').hidden = !past.length;
    $('adm-past-n').textContent = past.length + '건';
    $('adm-past').innerHTML = past.map(row).join('');
  }
  function load() {
    return db('bookings?select=*&order=date.asc,id.asc').then(function (rows) {
      bookings = rows.map(function (b) { b.dress = String(b.dress); b.date = String(b.date).slice(0, 10); return b; });
      $('adm-list-msg').textContent = ''; render();
    }).catch(function (e) { fail(e, $('adm-list-msg')); });
  }
  function start() {
    view('app');
    $('adm-who').textContent = session.email;
    $('adm-rule').textContent = '한 예약은 공연일 ' + LS.rule.before + '일 전부터 ' + LS.rule.after + '일 후까지 그 의상을 막습니다. 사이트에는 의상 번호와 날짜만 공개됩니다.';
    $('adm-dress').innerHTML = '<option value="">의상 선택</option>' + LS.dresses.map(function (d) {
      return '<option value="' + LS.esc(d.number) + '">' + LS.esc(label(d.number)) + '</option>';
    }).join('');
    load();
  }

  // 추가: 같은 의상의 다른 예약과 기간이 겹치면 한 번 더 확인해요
  var addMsg = $('adm-add-msg'), addBtn = $('adm-add-btn');
  function resetForce() { force = false; addBtn.textContent = '예약 추가'; }
  ['adm-dress', 'adm-date'].forEach(function (id) { $(id).addEventListener('change', function () { resetForce(); addMsg.textContent = ''; }); });
  $('adm-add').addEventListener('submit', function (e) {
    e.preventDefault();
    var no = $('adm-dress').value, date = $('adm-date').value;
    if (!no || !date) { addMsg.textContent = '의상과 공연 날짜를 선택해 주세요.'; return; }
    var hit = clash(no, date);
    if (hit.length && !force) {
      addMsg.textContent = '이 의상은 ' + hit.map(function (b) { return fullDate(b.date); }).join(', ') + ' 공연 예약과 기간이 겹칩니다. 그래도 추가하려면 버튼을 한 번 더 눌러 주세요.';
      force = true; addBtn.textContent = '겹쳐도 추가'; return;
    }
    addBtn.disabled = true; addMsg.textContent = '';
    db('bookings', { method: 'POST', body: {
      dress: no, date: date,
      customer_name: $('adm-name').value.trim() || null, phone: $('adm-phone').value.trim() || null, memo: $('adm-memo').value.trim() || null
    } }).then(function () {
      ['adm-name', 'adm-phone', 'adm-memo'].forEach(function (id) { $(id).value = ''; });
      $('adm-dress').value = ''; $('adm-date').value = '';
      addMsg.textContent = '추가했습니다.'; resetForce();
      return load();
    }).catch(function (e2) { fail(e2, addMsg); }).then(function () { addBtn.disabled = false; });
  });

  // 삭제: 누르면 한 번 더 물어봐요
  $('adm-app').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var li = b.closest('li'), act = b.getAttribute('data-act');
    if (act === 'ask' || act === 'no') {
      li.querySelector('.adm-confirm').hidden = act === 'no';
      li.querySelector('[data-act="ask"]').hidden = act === 'ask';
      return;
    }
    b.disabled = true;
    db('bookings?id=eq.' + encodeURIComponent(li.getAttribute('data-id')), { method: 'DELETE' })
      .then(load).catch(function (e2) { b.disabled = false; fail(e2, $('adm-list-msg')); });
  });

  if (session) start(); else showLogin('');
});
