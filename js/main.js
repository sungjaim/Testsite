// 모바일 메뉴 토글
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// 스크롤 시 등장 효과
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('visible'));
}

// 문의 폼 검증 (데모: 서버 전송 없음)
const form = document.getElementById('contact-form');
const msg = form.querySelector('.form-msg');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('input, textarea').forEach((f) => {
    const valid = f.value.trim() !== '' && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('invalid', !valid);
    if (!valid) ok = false;
  });
  msg.className = 'form-msg ' + (ok ? 'ok' : 'error');
  msg.textContent = ok ? '문의가 접수되었습니다. 감사합니다!' : '모든 항목을 올바르게 입력해 주세요.';
  if (ok) form.reset();
});
