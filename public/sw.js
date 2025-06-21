// Service Worker for cache control
const CACHE_NAME = 'menu-cache-v1';
const MENU_ROUTES = ['/menu/'];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Fetch event - intercept all network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Check if this is a menu page request
  const isMenuRoute = MENU_ROUTES.some(route => url.pathname.startsWith(route));
  
  if (isMenuRoute) {
    // For menu routes, always fetch from network (no caching)
    event.respondWith(
      fetch(event.request.clone())
        .then(response => {
          // Add no-cache headers to the response
          const responseHeaders = new Headers(response.headers);
          responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          responseHeaders.set('Pragma', 'no-cache');
          responseHeaders.set('Expires', '0');
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
          });
        })
        .catch(error => {
          console.error('Network request failed:', error);
          // Return a basic offline page or error response
          return new Response('Menu temporarily unavailable. Please try again.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
  }
  // For non-menu routes, use default browser caching
}); 