/* Gemeinsames, minimales Skript (keine Bibliotheken) */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navigation: Hintergrund nach dem Scrollen
  var nav = document.getElementById('mainNav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobiles Menü
  var ham = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (ham && menu) {
    var shut = function () { menu.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    var open = function () { menu.classList.add('open'); ham.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
    ham.addEventListener('click', function () { menu.classList.contains('open') ? shut() : open(); });
    document.querySelector('.nav-logo').addEventListener('click', shut);
    document.querySelectorAll('.ml').forEach(function (l) { l.addEventListener('click', shut); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  }

  // Einblenden beim Scrollen (auch für Gruppen, die nacheinander erscheinen sollen)
  var targets = document.querySelectorAll('.reveal, [data-seq]');
  if ('IntersectionObserver' in window && !reduce) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible', 'in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { obs.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('visible', 'in'); });
  }

  // Linien, die beim Scrollen gezeichnet werden (path mit pathLength="1")
  var draws = Array.prototype.slice.call(document.querySelectorAll('[data-draw]'));
  if (draws.length) {
    var setAll = function (v) { draws.forEach(function (p) { p.style.strokeDashoffset = String(1 - v); }); };
    if (reduce) { setAll(1); }
    else {
      var ticking = false;
      var update = function () {
        ticking = false;
        var vh = window.innerHeight;
        draws.forEach(function (p) {
          var host = p.closest('[data-draw-host]') || p.parentNode;
          var r = host.getBoundingClientRect();
          var prog = (vh * 0.9 - r.top) / (vh * 0.55 + r.height * 0.5);
          prog = Math.max(0, Math.min(1, prog));
          p.style.strokeDashoffset = String(1 - prog);
        });
      };
      var req = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      window.addEventListener('scroll', req, { passive: true });
      window.addEventListener('resize', req);
      update();
    }
  }

  // Akkordeon (tastaturbedienbar: echte Buttons, aria-expanded)
  document.querySelectorAll('.acc').forEach(function (acc) {
    var buttons = acc.querySelectorAll('.acc-q');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        buttons.forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          document.getElementById(b.getAttribute('aria-controls')).classList.remove('open');
        });
        if (!isOpen) { btn.setAttribute('aria-expanded', 'true'); panel.classList.add('open'); }
      });
    });
  });
})();
