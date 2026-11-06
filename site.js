/* Fittest4Fit · Cabecera común (.f4f-nav): fondo al hacer scroll, menú móvil y enlace activo. */
(function () {
  var nav = document.querySelector('.f4f-nav');
  if (!nav) return;
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 60); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var here = location.pathname.replace(/\/$/, '/index.html').split('/').pop() || 'index.html';
  nav.querySelectorAll('.f4f-links a').forEach(function (a) {
    if (a.getAttribute('href').split('#')[0].replace(/^\//, '') === here) a.setAttribute('aria-current', 'page');
  });

  var burger = nav.querySelector('.f4f-burger'), drawer = document.getElementById('f4fDrawer');
  if (!burger || !drawer) return;
  var set = function (open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', function () { set(burger.getAttribute('aria-expanded') !== 'true'); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();
