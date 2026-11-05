/* Fittest4Fit · Consentimiento de cookies (único para toda la web)
 * Uso: <script src="/consent.js" defer></script> en cualquier página.
 * - Muestra el aviso si no hay elección guardada (clave compartida 'f4f_cookies_v1').
 * - Carga Meta Pixel / Google Ads / Metricool SOLO con consentimiento.
 * - Cualquier elemento con [data-cookie-settings] reabre el panel (retirar o cambiar el consentimiento).
 * - window.f4fConsent.has('meta') para consultar desde otros scripts; evento 'f4f:consent' al cambiar.
 */
(function () {
  if (window.f4fConsent) return;
  var STORAGE_KEY = 'f4f_cookies_v1';
  var META_PIXEL_ID = '1394874288749580';
  var GOOGLE_ADS_ID = '';            // Rellenar con 'AW-XXXXXXXXX' cuando exista la cuenta de Google Ads
  var METRICOOL_HASH = '809a6c3a43e2b1f527a9885070026d50';

  var css = '' +
    '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9000;background:#081828;border-top:1px solid #1a3a5c;' +
    'padding:1.5rem clamp(1.2rem,4vw,3rem);display:flex;align-items:flex-start;gap:2rem;flex-wrap:wrap;' +
    'transform:translateY(100%);transition:transform .5s cubic-bezier(.16,1,.3,1);box-shadow:0 -8px 40px rgba(0,0,0,.4);font-family:Outfit,system-ui,sans-serif}' +
    '#cookie-banner.visible{transform:translateY(0)}' +
    '#cookie-banner .cookie-text{flex:1;min-width:260px}' +
    '#cookie-banner .cookie-text p{font-size:.78rem;color:#8899AA;line-height:1.7;margin:0}' +
    '#cookie-banner .cookie-text a{color:#00C2FF;text-decoration:none}#cookie-banner .cookie-text a:hover{text-decoration:underline}' +
    '#cookie-banner .cookie-toggles{display:flex;flex-direction:column;gap:.6rem;min-width:200px}' +
    '#cookie-banner .cookie-toggle-row{display:flex;align-items:center;justify-content:space-between;gap:1rem}' +
    '#cookie-banner .cookie-toggle-label{font-family:"DM Mono",ui-monospace,monospace;font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:#8899AA}' +
    '#cookie-banner .cookie-toggle-label.disabled{opacity:.4}' +
    '#cookie-banner .toggle-switch{position:relative;width:36px;height:20px;flex-shrink:0}' +
    '#cookie-banner .toggle-switch input{opacity:0;width:0;height:0}' +
    '#cookie-banner .toggle-slider{position:absolute;inset:0;border-radius:20px;background:#1a3a5c;cursor:pointer;transition:background .2s}' +
    '#cookie-banner .toggle-slider::before{content:"";position:absolute;left:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#8899AA;transition:transform .2s}' +
    '#cookie-banner .toggle-switch input:checked+.toggle-slider{background:#00C2FF}' +
    '#cookie-banner .toggle-switch input:checked+.toggle-slider::before{transform:translateX(16px);background:#04101F}' +
    '#cookie-banner .toggle-switch input:focus-visible+.toggle-slider{outline:2px solid #00C2FF;outline-offset:2px}' +
    '#cookie-banner .cookie-actions{display:flex;flex-direction:column;gap:.6rem;justify-content:center;min-width:160px}' +
    '#cookie-banner button{font-family:Outfit,system-ui,sans-serif;font-size:.75rem;cursor:pointer;white-space:nowrap;padding:.55rem 1.2rem}' +
    '#cookie-banner .btn-cookie-all{background:#FFB830;color:#04101F;border:none;font-weight:700;letter-spacing:.04em}' +
    '#cookie-banner .btn-cookie-save,#cookie-banner .btn-cookie-reject{background:transparent;color:#8899AA;border:1px solid #0d2540}' +
    '#cookie-banner .btn-cookie-save:hover,#cookie-banner .btn-cookie-reject:hover{border-color:#1a3a5c;color:#F0F4F8}';

  var html = '' +
    '<div class="cookie-text"><p>Usamos cookies propias y de terceros (Meta Pixel · Google Ads · Metricool) para analizar el tráfico y mostrarte publicidad relevante. ' +
    'Puedes aceptarlas, rechazarlas o elegir cuáles. <a href="/cookies.html">Política de cookies →</a> · <a href="/privacidad.html">Política de privacidad →</a></p></div>' +
    '<div class="cookie-toggles">' +
    '<div class="cookie-toggle-row"><span class="cookie-toggle-label disabled">Esenciales</span><label class="toggle-switch"><input type="checkbox" checked disabled aria-label="Cookies esenciales (siempre activas)"><span class="toggle-slider"></span></label></div>' +
    '<div class="cookie-toggle-row"><span class="cookie-toggle-label">Meta Pixel</span><label class="toggle-switch"><input type="checkbox" id="toggle-meta" aria-label="Meta Pixel"><span class="toggle-slider"></span></label></div>' +
    '<div class="cookie-toggle-row"><span class="cookie-toggle-label">Google Ads</span><label class="toggle-switch"><input type="checkbox" id="toggle-google" aria-label="Google Ads"><span class="toggle-slider"></span></label></div>' +
    '<div class="cookie-toggle-row"><span class="cookie-toggle-label">Metricool (analítica)</span><label class="toggle-switch"><input type="checkbox" id="toggle-metricool" aria-label="Metricool"><span class="toggle-slider"></span></label></div>' +
    '</div>' +
    '<div class="cookie-actions"><button type="button" class="btn-cookie-all" id="cookie-accept-all">Aceptar todas</button>' +
    '<button type="button" class="btn-cookie-reject" id="cookie-reject">Rechazar todas</button>' +
    '<button type="button" class="btn-cookie-save" id="cookie-save">Guardar selección</button></div>';

  var loaded = {};
  function loadMetaPixel() {
    if (loaded.meta || !META_PIXEL_ID) return; loaded.meta = true;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  function loadGoogleAds() {
    if (loaded.google || !GOOGLE_ADS_ID) return; loaded.google = true;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', GOOGLE_ADS_ID);
  }
  function loadMetricool() {
    if (loaded.metricool) return; loaded.metricool = true;
    var img = new Image(); img.alt = ''; img.src = 'https://tracker.metricool.com/c3po.jpg?hash=' + METRICOOL_HASH;
  }

  var prefs = null;
  try { prefs = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
  function apply(p) {
    if (p.meta) loadMetaPixel();
    if (p.google) loadGoogleAds();
    if (p.metricool) loadMetricool();
    try { window.dispatchEvent(new CustomEvent('f4f:consent', { detail: p })); } catch (e) {}
  }

  var banner;
  function build() {
    if (banner) return banner;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    banner = document.createElement('div');
    banner.id = 'cookie-banner'; banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML = html; document.body.appendChild(banner);
    var t = function (id) { return banner.querySelector('#' + id); };
    var sync = function (p) { t('toggle-meta').checked = !!(p && p.meta); t('toggle-google').checked = !!(p && p.google); t('toggle-metricool').checked = !!(p && p.metricool); };
    sync(prefs);
    var save = function (p) {
      prefs = { ts: Date.now(), meta: !!p.meta, google: !!p.google, metricool: !!p.metricool };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (e) {}
      banner.classList.remove('visible'); sync(prefs);
      // Retirar un consentimiento ya dado exige recargar para descargar los scripts de terceros.
      if ((loaded.meta && !prefs.meta) || (loaded.google && !prefs.google)) location.reload(); else apply(prefs);
    };
    t('cookie-accept-all').addEventListener('click', function () { save({ meta: 1, google: 1, metricool: 1 }); });
    t('cookie-reject').addEventListener('click', function () { save({}); });
    t('cookie-save').addEventListener('click', function () { save({ meta: t('toggle-meta').checked, google: t('toggle-google').checked, metricool: t('toggle-metricool').checked }); });
    return banner;
  }
  function open() { build(); requestAnimationFrame(function () { banner.classList.add('visible'); }); }

  window.f4fConsent = { has: function (k) { return !!(prefs && prefs[k]); }, open: open };
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (el) { e.preventDefault(); open(); }
  });

  function start() {
    if (prefs) { apply(prefs); return; }
    build(); setTimeout(function () { banner.classList.add('visible'); }, 2500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
