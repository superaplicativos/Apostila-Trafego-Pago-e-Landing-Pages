/* ============================================================
   APOSTILA TRÁFEGO PAGO & LANDING PAGES — Interações
   ============================================================ */
(function () {
  'use strict';

  var d = document;

  /* ---------- barra de progresso de leitura ---------- */
  var progress = d.getElementById('progress');
  function onScroll() {
    if (!progress) return;
    var h = d.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) : 0;
    var off = window.innerWidth > 1080 ? 304 : 0; /* largura da sidebar no desktop */
    progress.style.width = 'calc((100vw - ' + off + 'px) * ' + pct.toFixed(4) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- menu mobile ---------- */
  var menuBtn = d.getElementById('menuBtn');
  var sidebar = d.getElementById('sidebar');
  var overlay = d.getElementById('overlay');
  function closeNav() {
    sidebar && sidebar.classList.remove('open');
    d.body.classList.remove('nav-open');
  }
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      d.body.classList.toggle('nav-open', open);
    });
    overlay && overlay.addEventListener('click', closeNav);
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
  }

  /* ---------- scrollspy (destaque no sumário) ---------- */
  var navLinks = Array.prototype.slice.call(d.querySelectorAll('.nav-item'));
  var sections = navLinks
    .map(function (a) { return d.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      var current = sections[0].id;
      var best = -1;
      sections.forEach(function (s) {
        var r = visible[s.id] || 0;
        if (r > best) { best = r; current = s.id; }
      });
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.05, 0.25, 0.6] });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- botões de copiar ---------- */
  d.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.code');
      var pre = box && box.querySelector('pre');
      if (!pre) return;
      var txt = pre.innerText;
      function done() {
        btn.textContent = 'Copiado';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copiar'; btn.classList.remove('done'); }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = d.createElement('textarea');
        ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
        d.body.appendChild(ta); ta.select();
        try { d.execCommand('copy'); done(); } catch (e) {}
        d.body.removeChild(ta);
      }
    });
  });

  /* ---------- voltar ao topo ---------- */
  var toTop = d.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 900);
    }, { passive: true });
  }

  /* ---------- filtro do glossário ---------- */
  var gi = d.getElementById('glossFilter');
  if (gi) {
    gi.addEventListener('input', function () {
      var q = gi.value.trim().toLowerCase();
      d.querySelectorAll('.gloss .gterm').forEach(function (t) {
        t.style.display = t.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none';
      });
    });
  }

  /* ---------- imprimir: abrir acordeões ---------- */
  var openedByPrint = [];
  window.addEventListener('beforeprint', function () {
    openedByPrint = [];
    d.querySelectorAll('details.acc').forEach(function (el) {
      if (!el.open) { el.open = true; openedByPrint.push(el); }
    });
  });
  window.addEventListener('afterprint', function () {
    openedByPrint.forEach(function (el) { el.open = false; });
    openedByPrint = [];
  });

  /* ---------- ano no rodapé ---------- */
  var yearStr = String(new Date().getFullYear());
  var yr = d.getElementById('yr');
  if (yr) yr.textContent = yearStr;
  d.querySelectorAll('.yr-copy').forEach(function (el) { el.textContent = yearStr; });
})();
