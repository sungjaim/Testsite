/* 홈 슬라이드쇼: data/dresses.js 에서 featured: true 인 드레스를 자동으로 돌립니다. */
(function () {
  var box = document.getElementById('slides');
  if (!box) return;
  var items = (window.LS_DRESSES || []).filter(function (d) { return d.featured && d.photos.length; });
  if (!items.length) return;

  var frame = box.querySelector('.slides-frame');
  var no = box.querySelector('.slide-no');
  var name = box.querySelector('.slide-name');
  var caption = box.querySelector('.slide-caption');
  var dots = box.querySelector('.slide-dots');

  items.forEach(function (d, i) {
    var img = document.createElement('img');
    img.src = d.photos[0];
    img.alt = 'No. ' + d.number + ' ' + d.name;
    if (i > 0) img.loading = 'lazy';
    frame.appendChild(img);

    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'No. ' + d.number);
    b.addEventListener('click', function () { show(i); restart(); });
    dots.appendChild(b);
  });
  if (items.length < 2) dots.hidden = true;

  var cur = -1, timer = null;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(i) {
    if (i === cur) return;
    cur = i;
    var imgs = frame.querySelectorAll('img'), bs = dots.querySelectorAll('button');
    for (var k = 0; k < imgs.length; k++) {
      imgs[k].classList.toggle('on', k === i);
      bs[k].setAttribute('aria-current', k === i ? 'true' : 'false');
    }
    caption.classList.remove('on');
    setTimeout(function () {
      no.textContent = 'No. ' + items[i].number;
      name.textContent = items[i].name;
      caption.classList.add('on');
    }, still ? 0 : 300);
  }
  function restart() {
    clearInterval(timer);
    if (still || items.length < 2) return;
    timer = setInterval(function () { show((cur + 1) % items.length); }, 5000);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearInterval(timer); else restart();
  });
  show(0);
  restart();
})();
