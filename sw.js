/* Polymathia — Service Worker
   Stratégie : cache-first pour tout le shell applicatif (fonctionne
   entièrement hors-ligne dès la première visite en ligne). */
const CACHE_NAME = "polymathia-v5";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/state.js",
  "./js/srs.js",
  "./js/gamification.js",
  "./js/app.js",
  "./js/data/physique.js",
  "./js/data/physique_ext/physique-quotidien.js",
  "./js/data/physique_ext/physique-assemble.js",
  "./js/data/maths.js",
  "./js/data/maths_ext/maths-suites.js",
  "./js/data/maths_ext/maths-integration.js",
  "./js/data/maths_ext/maths-algebre.js",
  "./js/data/maths_ext/maths-probas.js",
  "./js/data/maths_ext/maths-assemble.js",
  "./js/data/philosophie.js",
  "./js/data/philosoc/philosoc-logique.js",
  "./js/data/philosoc/philosoc-socio.js",
  "./js/data/philosoc/philosoc-assemble.js",
  "./js/data/histoire.js",
  "./js/data/histoire_ext/histoire-antiquite.js",
  "./js/data/histoire_ext/histoire-moyenage.js",
  "./js/data/histoire_ext/histoire-assemble.js",
  "./js/data/litterature.js",
  "./js/data/litterature_ext/litterature-mouvements.js",
  "./js/data/litterature_ext/litterature-mondial.js",
  "./js/data/litterature_ext/litterature-assemble.js",
  "./js/data/arabe.js",
  "./js/data/arabe_ext/arabe-alphabet2.js",
  "./js/data/arabe_ext/arabe-vocab2.js",
  "./js/data/arabe_ext/arabe-grammaire2.js",
  "./js/data/arabe_ext/arabe-culture.js",
  "./js/data/arabe_ext/arabe-assemble.js",
  "./js/data/kabyle.js",
  "./js/data/kabyle_ext/kabyle-grammaire.js",
  "./js/data/kabyle_ext/kabyle-assemble.js",
  "./js/data/quant/quant-legacy.js",
  "./js/data/quant/quant-calcul.js",
  "./js/data/quant/quant-algebre.js",
  "./js/data/quant/quant-probabilites.js",
  "./js/data/quant/quant-statistiques.js",
  "./js/data/quant/quant-stochastique2.js",
  "./js/data/quant/quant-hull-produits.js",
  "./js/data/quant/quant-hull-exercices.js",
  "./js/data/quant/quant-hull-produits2.js",
  "./js/data/quant/quant-hull-exercices2.js",
  "./js/data/quant/quant-assemble.js",
  "./js/data/index.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./vendor/katex/katex.min.css",
  "./vendor/katex/katex.min.js",
  "./vendor/katex/auto-render.min.js",
  "./vendor/katex/fonts/KaTeX_AMS-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2",
  "./vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2",
  "./vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Main-Bold.woff2",
  "./vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2",
  "./vendor/katex/fonts/KaTeX_Main-Italic.woff2",
  "./vendor/katex/fonts/KaTeX_Main-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2",
  "./vendor/katex/fonts/KaTeX_Math-Italic.woff2",
  "./vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2",
  "./vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2",
  "./vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Script-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Size1-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Size2-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Size3-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Size4-Regular.woff2",
  "./vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
