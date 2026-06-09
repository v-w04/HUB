/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  HUB DE RECURSOS HUMANOS — Service Worker
 *  Electronics México
 *
 *  ESTRATEGIA DE CACHE:
 *  - App shell (HTML, íconos, logo): cache-first (carga instantánea)
 *  - Google Sheets: network-only (datos siempre frescos)
 *  - CDNs (Font Awesome): bypass (las maneja el navegador)
 *  - Offline fallback: muestra index.html si no hay red
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// IMPORTANTE: cambia esta versión cada vez que actualices index.html
// para forzar a los usuarios a descargar la nueva versión.
const CACHE_VERSION = 'v2.1.8';
const CACHE_NAME = `hub-rh-${CACHE_VERSION}`;

// Archivos que se precachean en la instalación
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './logo-electronics.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './favicon-16.png'
];

// ━━━ INSTALL: precachear el app shell ━━━
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando versión', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precacheando app shell...');
        // addAll es atómico — si uno falla, falla todo. Para evitar eso,
        // los agregamos uno por uno con tolerancia a fallos.
        return Promise.all(
          APP_SHELL.map((url) =>
            cache.add(url).catch((err) =>
              console.warn(`[SW] No se pudo cachear ${url}:`, err.message)
            )
          )
        );
      })
      .then(() => {
        console.log('[SW] App shell cacheado ✓');
        // NO skipWaiting automático — esperamos a que el usuario confirme la actualización
        // desde el banner. El cliente enviará el mensaje 'skipWaiting' cuando esté listo.
      })
  );
});

// ━━━ ACTIVATE: limpiar caches viejos ━━━
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando versión', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('hub-rh-') && key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Eliminando cache viejo:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())  // Tomar control de las pestañas abiertas
  );
});

// ━━━ FETCH: estrategias por tipo de petición ━━━
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const req = event.request;

  // Solo cacheamos GETs
  if (req.method !== 'GET') return;

  // ━━━ Google Sheets: SIEMPRE red, ignorando cualquier caché HTTP ━━━
  if (url.hostname === 'docs.google.com' ||
      url.hostname.endsWith('.googleusercontent.com') ||
      url.hostname.endsWith('.googleapis.com')) {
    event.respondWith(
      // Reconstruimos la request con cache:'no-store' para forzar el bypass
      // incluso si la request original no lo tenía configurado.
      fetch(req.url, {
        method: req.method,
        headers: req.headers,
        credentials: req.credentials,
        mode: req.mode === 'navigate' ? 'cors' : req.mode,
        cache: 'no-store'
      }).catch(() => {
        return new Response('', { status: 503, statusText: 'Sheet no disponible offline' });
      })
    );
    return;
  }

  // ━━━ CDNs (Font Awesome, etc.): bypass total ━━━
  // Los CDNs ya tienen sus propios headers de cache, dejamos que el navegador maneje
  if (url.hostname === 'cdnjs.cloudflare.com' ||
      url.hostname === 'cdn.jsdelivr.net' ||
      url.hostname === 'fonts.googleapis.com' ||
      url.hostname === 'fonts.gstatic.com') {
    return;  // Dejar pasar a la red sin interceptar
  }

  // ━━━ App shell y assets propios: cache-first ━━━
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // Revalidar en segundo plano (stale-while-revalidate)
          fetch(req).then((freshResponse) => {
            if (freshResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, freshResponse));
            }
          }).catch(() => { /* sin red, no problem */ });
          return cached;
        }

        // No estaba cacheado — descargar y guardar
        return fetch(req).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return response;
        }).catch(() => {
          // Sin red: si es navegación, devolver index.html (modo offline)
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }

  // Cualquier otra cosa: dejar pasar a la red
});

// ━━━ Mensaje para forzar actualización desde el cliente ━━━
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
