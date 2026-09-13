const CACHE='uvpc-v1-0-1-rc2-build-1059';
const ASSETS=['./','./index.html','./styles.css','./storage.js','./boot.js','./app.js','./manifest.webmanifest','./assets/icon.svg','./docs/UV_Project_Calculator_Pro_User_Guide.pdf'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))])));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 const core=['/','/index.html','/boot.js','/app.js','/storage.js','/styles.css'];
 const isCore=core.some(path=>url.pathname.endsWith(path));
 if(isCore){
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));
 }else{
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response})));
 }
});
