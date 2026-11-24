// 가족 책도장 서비스 워커 (버전 fe35a9c6)
const V='gbs-fe35a9c6';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./vendor/firebase/firebase-app.js','./vendor/firebase/firebase-auth.js','./vendor/firebase/firebase-firestore.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  // 파이어베이스 라이브러리와 글꼴: 한 번 받으면 저장해 두고 씀(오프라인에서도 열리게)
  if(u.host==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/')||u.host==='fonts.googleapis.com'||u.host==='fonts.gstatic.com'){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res})));return;
  }
  if(u.origin!==location.origin)return;
  // 앱 파일: 인터넷이 되면 새 버전, 안 되면 저장해 둔 것
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(hit=>hit||caches.match('./index.html'))));
});
