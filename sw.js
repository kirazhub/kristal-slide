// ==========================================================
// KRİSTAL KRALLIĞI — Service Worker
// Offline desteği: tüm oyun dosyalarını cache'ler
// ==========================================================

const CACHE_AD = 'kristal-kralligi-v1';
const DOSYALAR = [
  './',
  './index.html',
  './manifest.json',
  './css/ana.css',
  './css/ekranlar.css',
  './css/oyun.css',
  './data/bolumler.js',
  './js/kayit.js',
  './js/ses.js',
  './js/oyun.js',
  './js/arayuz.js',
  './public/assets/kek.png',
  './public/assets/kurabiye.png',
  './public/assets/cilek.png',
  './public/assets/cikolata.png',
  './public/assets/dondurma.png',
  './public/assets/lolipop.png',
  './public/ui/logo.png',
  './public/ui/altin-kutu.png',
  './public/ui/hedef-kutu.png',
  './public/ui/guc-cekic.png',
  './public/ui/guc-karistir.png',
  './public/ui/guc-bomba.png',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Luckiest+Guy&display=swap'
];

// Kurulum
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_AD).then((cache) => {
      return cache.addAll(DOSYALAR.map(d => new Request(d, { cache: 'reload' })))
        .catch(err => console.warn('SW cache eksik dosya:', err));
    })
  );
  self.skipWaiting();
});

// Aktivasyon
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((anahtarlar) => {
      return Promise.all(
        anahtarlar.filter(a => a !== CACHE_AD).map(a => caches.delete(a))
      );
    })
  );
  self.clients.claim();
});

// Fetch — önce cache, yoksa ağ, sonra cache'e at
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((yanıt) => {
        // Başarılı yanıtları cache'e ekle
        if (yanıt && yanıt.status === 200) {
          const kopya = yanıt.clone();
          caches.open(CACHE_AD).then((cache) => {
            cache.put(e.request, kopya).catch(() => {});
          });
        }
        return yanıt;
      }).catch(() => {
        // Offline ve cache'de yok — boş yanıt
        return new Response('', { status: 503 });
      });
    })
  );
});
