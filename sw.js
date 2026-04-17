// ------------------------------------------------------------
// Evento de INSTALAÇÃO do Service Worker
// ------------------------------------------------------------
self.addEventListener('install', event => {
  // O event.waitUntil() garante que o SW só conclua a instalação
  // depois de terminar de abrir o cache e adicionar todos os arquivos
  event.waitUntil(
    caches.open('site-cache') // Cria (ou abre) um cache chamado "site-cache"
      .then(cache => 
        // Adiciona todos os arquivos listados ao cache
        cache.addAll([
          '/',                   // Raiz do site
          '/index.html',         // Página principal
          '/styles.css',         // Arquivo CSS
          '/script.js',          // Arquivo JS
          '/icons/icon-192.png', // Ícone pequeno do PWA
          '/icons/icon-512.png'  // Ícone maior do PWA
        ])
      )
  );
  // Dica: se você alterar os arquivos, mude também o nome do cache
  // (por exemplo, de 'site-cache' para 'site-cache-v2')
  // para forçar o navegador a baixar a nova versão.
});

// ------------------------------------------------------------
// Evento de FETCH (busca de recursos)
// ------------------------------------------------------------
self.addEventListener('fetch', event => {
  // Intercepta todas as requisições feitas pelo app/site
  event.respondWith(
    caches.match(event.request) // Verifica se o recurso já está no cache
      .then(response => 
        // Se o recurso está no cache, usa ele
        // Se não, faz o fetch normal pela internet
        response || fetch(event.request)
      )
  );
});
