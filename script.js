// ══════════════════════════════════════════════════════════
//  🔥 FIREBASE CONFIG — sudah dikonfigurasi untuk WMS AHI Sidoarjo
// ══════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "AIzaSyB6odEt5wEdtq6H-NyXK2BpLqrxxW5WENA",
  authDomain:        "wms-ahi-sidoarjo.firebaseapp.com",
  databaseURL:       "https://wms-ahi-sidoarjo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "wms-ahi-sidoarjo",
  storageBucket:     "wms-ahi-sidoarjo.firebasestorage.app",
  messagingSenderId: "834978642750",
  appId:             "1:834978642750:web:e0ed9877bc9281dba94a6f",
  measurementId:     "G-8ZPFL4DH0D"
};
// ══════════════════════════════════════════════════════════

// ── URL Dashboard ──
const URLS = {
  planner:   'https://plannerazko.github.io/DashboardPlanning/',
  inventory: 'https://script.google.com/a/macros/kawanlamacorp.com/s/AKfycbzycCoQgClG2VO7M3HUsTMWg0ZDnOs8Un81br35sS4OtpKZsVqNsT2Btdzgs1SdMYZ3kg/exec',
  outbound:  'https://outboundazko.github.io/Monitoring-Loading/index.html',
  inbound: null,
  storing: null,
  ga: null,
  hr: null,
};
const IFRAME_PAGES   = ['inventory','outbound','planner'];
const LAUNCHER_PAGES = [];

// ── Avatar color palette ──
const AVATAR_COLORS = [
  { bg: 'linear-gradient(145deg,#3b82f6,#1d4ed8)', hex: '#3b82f6' },
  { bg: 'linear-gradient(145deg,#ec4899,#db2777)', hex: '#ec4899' },
  { bg: 'linear-gradient(145deg,#06b6d4,#0891b2)', hex: '#06b6d4' },
  { bg: 'linear-gradient(145deg,#10b981,#059669)', hex: '#10b981' },
  { bg: 'linear-gradient(145deg,#f59e0b,#d97706)', hex: '#f59e0b' },
  { bg: 'linear-gradient(145deg,#8b5cf6,#7c3aed)', hex: '#8b5cf6' },
  { bg: 'linear-gradient(145deg,#ef4444,#dc2626)', hex: '#ef4444' },
  { bg: 'linear-gradient(145deg,#64748b,#475569)', hex: '#64748b' },
];

// ── User session ──
let me = { name: '', color: AVATAR_COLORS[0], initials: '' };
let fbReady = false;
let db = null;
let chatRef = null;
let onlineRef = null;
const CHAT_PATH   = 'wms_ahi_chat/messages';
const ONLINE_PATH = 'wms_ahi_chat/online';

// ── Init Firebase ──
function initFirebase() {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    chatRef   = db.ref(CHAT_PATH);
    onlineRef = db.ref(ONLINE_PATH);
    fbReady = true;
    console.log('✅ Firebase connected!');
  } catch(e) {
    console.error('Firebase init error:', e);
  }
}
initFirebase();

// ══════════════════════════════════════
//  LOGIN MODAL
// ══════════════════════════════════════
const colorOptions = document.getElementById('colorOptions');
let selectedColorIdx = 0;

// Handle color selection on hardcoded elements
colorOptions.querySelectorAll('.color-opt').forEach(el => {
  el.addEventListener('click', () => {
    colorOptions.querySelectorAll('.color-opt').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    selectedColorIdx = parseInt(el.dataset.idx || '0');
  });
});

document.getElementById('loginBtn').addEventListener('click', doLogin);
document.getElementById('loginName').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });

function doLogin() {
  const nameInput = document.getElementById('loginName');
  const name = nameInput.value.trim();
  const errEl = document.getElementById('loginErr');
  if (!name) { errEl.classList.add('show'); nameInput.focus(); return; }
  errEl.classList.remove('show');

  me.name     = name;
  me.color    = AVATAR_COLORS[selectedColorIdx];
  me.initials = name.slice(0,2).toUpperCase();

  // Simpan ke localStorage biar next visit langsung masuk
  localStorage.setItem('wms_name', name);
  localStorage.setItem('wms_color', selectedColorIdx);

  applyLogin();
}

function applyLogin() {
  // Update header
  const av = document.getElementById('headerAvatar');
  av.textContent  = me.initials;
  av.style.background = me.color.bg;
  document.getElementById('headerName').textContent = me.name;

  // Online presence
  if (fbReady && onlineRef) {
    const safeKey = me.name.replace(/[.#$/[\]\s]/g,'_');
    const myOnlineRef = onlineRef.child(safeKey);
    myOnlineRef.set({ name: me.name, color: me.color.hex, ts: firebase.database.ServerValue.TIMESTAMP });
    myOnlineRef.onDisconnect().remove();
    onlineRef.on('value', snap => {
      const count = snap.numChildren();
      document.getElementById('onlineCount').textContent = count + ' online';
      // Update onlineCountDisc if exists
      const discCount = document.getElementById('onlineCountDisc');
      if (discCount) discCount.textContent = count + ' user';
      // Render online users list
      const list = document.getElementById('onlineList');
      if (!list) return;
      const users = [];
      snap.forEach(child => { users.push(child.val()); });
      if (!users.length) {
        list.innerHTML = '<div style="text-align:center;color:var(--text-3);font-size:12px;padding:20px 0">Belum ada yang online</div>';
        return;
      }
      list.innerHTML = users.map(u => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,0.5);border:1px solid rgba(200,215,240,0.3);">
          <div style="width:36px;height:36px;border-radius:50%;background:${u.color||'#2563eb'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
            ${(u.name||'?').slice(0,2).toUpperCase()}
          </div>
          <div style="min-width:0;">
            <div style="font-size:12.5px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.name||'User'}</div>
            <div style="display:flex;align-items:center;gap:4px;font-size:10.5px;color:var(--green);font-weight:600;">
              <span style="width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;box-shadow:0 0 6px rgba(22,163,74,0.6);"></span>
              Online
            </div>
          </div>
          ${u.name === me.name ? '<span style="font-size:10px;background:var(--accent-light);color:var(--accent);padding:2px 8px;border-radius:10px;font-weight:700;margin-left:auto;flex-shrink:0;">Kamu</span>' : ''}
        </div>
      `).join('');
    });
  }

  lastSeenTs = parseInt(localStorage.getItem('lastSeenTs_' + me.name) || '0');

  startChat();

  const overlay = document.getElementById('loginOverlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s ease';
  setTimeout(() => overlay.classList.add('hidden'), 300);
  setTimeout(updateSettingsUser, 350);
}

// ── Pre-fill dari localStorage (modal tetap muncul, nama sudah terisi) ──
(function checkSavedLogin() {
  const savedName = localStorage.getItem('wms_name');
  const savedColor = parseInt(localStorage.getItem('wms_color') || '0');
  if (savedName) {
    selectedColorIdx = savedColor;
    const nameInput = document.getElementById('loginName');
    if (nameInput) nameInput.value = savedName;
    colorOptions.querySelectorAll('.color-opt').forEach((el, i) => {
      el.classList.toggle('selected', i === savedColor);
    });
  }
})();

// ── Klik avatar di header = ganti nama ──
document.getElementById('headerUser').addEventListener('click', () => {
  localStorage.removeItem('wms_name');
  localStorage.removeItem('wms_color');
  const overlay = document.getElementById('loginOverlay');
  overlay.classList.remove('hidden');
  overlay.style.opacity = '1';
});

// ══════════════════════════════════════
//  CHAT ENGINE
// ══════════════════════════════════════
const seenIds = new Set();

function startChat() {
  if (!fbReady) {
    document.getElementById('discStatus').textContent = '⚠️ Offline — Firebase error';
    loadDemoMessages();
    setupOfflineChat('miniDiscIn','miniDiscBtn','miniDiscMsg');
    setupOfflineChat('fullDiscIn','fullDiscBtn','fullDiscMsg');
    return;
  }

  document.getElementById('discStatus').textContent = '🟢 Terhubung';

  // Listen to last 100 messages
  const loadTime = Date.now();
  chatRef.limitToLast(100).on('child_added', snap => {
    const msg = snap.val();
    if (!msg || seenIds.has(snap.key)) return;
    seenIds.add(snap.key);
    const isNew = msg.timestamp && msg.timestamp > (loadTime - 3000);
    renderMessage(msg, snap.key, 'miniDiscMsg', 5, isNew);
    renderMessage(msg, snap.key, 'fullDiscMsg', 999, isNew);
    if (isNew) addNotif(msg);
  });

  setupFirebaseChat('miniDiscIn', 'miniDiscBtn', 'miniDiscMsg');
  setupFirebaseChat('fullDiscIn', 'fullDiscBtn', 'fullDiscMsg');
}

function renderMessage(msg, key, listId, maxItems, isNew=true) {
  const list = document.getElementById(listId);
  if (!list) return;
  // Skip if already rendered
  if (list.querySelector(`[data-key="${key}"]`)) return;
  while (list.children.length >= maxItems) list.removeChild(list.firstChild);

  const isMine = msg.name === me.name;
  const timeStr = msg.timestamp ? formatTime(new Date(msg.timestamp)) : '';

  const row = document.createElement('div');
  row.className = 'disc-msg' + (isMine ? ' mine' : '');
  row.dataset.key = key;

  row.innerHTML = `
    <div class="disc-avatar" style="background:${msg.color || 'linear-gradient(145deg,#3b82f6,#1d4ed8)'}">${(msg.name||'?').slice(0,2).toUpperCase()}</div>
    <div class="disc-bubble-wrap">
      <div class="disc-meta">
        ${isMine
          ? `<span class="disc-time">${timeStr}</span><span class="disc-name">Kamu</span>`
          : `<span class="disc-name">${escHtml(msg.name)}</span><span class="disc-time">${timeStr}</span>`
        }
      </div>
      <div class="disc-bubble">${escHtml(msg.text)}</div>
    </div>`;

  list.appendChild(row);
  if (isNew) list.scrollTop = list.scrollHeight;
}

function setupFirebaseChat(inId, btnId, listId) {
  const inp = document.getElementById(inId);
  const btn = document.getElementById(btnId);
  if (!inp || !btn) return;
  function send() {
    const text = inp.value.trim(); if (!text) return;
    inp.value = ''; inp.disabled = true; btn.disabled = true;
    chatRef.push({
      name:      me.name,
      text:      text,
      color:     me.color.bg,
      initials:  me.initials,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).finally(() => { inp.disabled = false; btn.disabled = false; inp.focus(); });
  }
  btn.addEventListener('click', send);
  inp.addEventListener('keydown', e => { if(e.key==='Enter') send(); });
}

// Demo fallback
const demoMessages = [
  { name:'Rani',  text:'Stok ABC mulai menipis, perlu restock segera.', color:'linear-gradient(145deg,#ec4899,#db2777)', timestamp: Date.now()-120000 },
  { name:'Budi',  text:'Besok ada inbound besar jam 10 pagi.',          color:'linear-gradient(145deg,#06b6d4,#0891b2)', timestamp: Date.now()-80000 },
  { name:'Tapes', text:'Forklift sudah stand by di loading area.',       color:'linear-gradient(145deg,#10b981,#059669)', timestamp: Date.now()-30000 },
];
function loadDemoMessages() {
  demoMessages.forEach((msg, i) => {
    renderMessage(msg, 'demo-'+i, 'miniDiscMsg', 5);
    renderMessage(msg, 'demo-'+i, 'fullDiscMsg', 999);
  });
}
function setupOfflineChat(inId, btnId, listId) {
  const inp = document.getElementById(inId);
  const btn = document.getElementById(btnId);
  if (!inp || !btn) return;
  function send() {
    const text = inp.value.trim(); if (!text) return;
    const msg = { name: me.name, text, color: me.color.bg, timestamp: Date.now() };
    renderMessage(msg, 'local-'+Date.now(), 'miniDiscMsg', 5);
    renderMessage(msg, 'local-'+Date.now()+1, 'fullDiscMsg', 999);
    inp.value = ''; inp.focus();
  }
  btn.addEventListener('click', send);
  inp.addEventListener('keydown', e => { if(e.key==='Enter') send(); });
}

function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'baru saja';
  if (diff < 3600000) return Math.floor(diff/60000) + ' mnt lalu';
  if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  return date.toLocaleDateString('id-ID',{day:'numeric',month:'short'});
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── DATE ──
const d = new Date();
const dateStr = d.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
document.getElementById('todayDate').textContent  = dateStr;
document.getElementById('todayDate2').textContent = dateStr;

// ── CHARTS ──
Chart.defaults.color = '#6b7280';
Chart.defaults.font.family = 'Outfit';
new Chart(document.getElementById('lineChart').getContext('2d'),{
  type:'line',
  data:{ labels:['Sen','Sel','Rab','Kam','Jum','Sab'], datasets:[
    {label:'Inbound', data:[120,190,170,240,210,290],borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,0.06)',tension:0.4,fill:true,pointBackgroundColor:'#2563eb',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5,borderWidth:2.5},
    {label:'Outbound',data:[100,130,150,110,170,200],borderColor:'#d97706',backgroundColor:'rgba(217,119,6,0.06)',tension:0.4,fill:true,pointBackgroundColor:'#d97706',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5,borderWidth:2.5}
  ]},
  options:{ responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(17,24,39,0.9)',titleColor:'#fff',bodyColor:'rgba(255,255,255,0.8)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,padding:12,cornerRadius:10}},
    scales:{x:{grid:{color:'rgba(99,120,167,0.07)'},ticks:{font:{size:11},color:'#9ca3af'}},y:{grid:{color:'rgba(99,120,167,0.07)'},ticks:{font:{size:11},color:'#9ca3af'}}}
  }
});
new Chart(document.getElementById('donutChart').getContext('2d'),{
  type:'doughnut',
  data:{labels:['Available','Reserved','Low Stock'],datasets:[{data:[60,25,15],backgroundColor:['#16a34a','#d97706','#dc2626'],borderColor:['#fff','#fff','#fff'],borderWidth:3,hoverOffset:10}]},
  options:{responsive:true,maintainAspectRatio:false,cutout:'70%',plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(17,24,39,0.9)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,callbacks:{label:ctx=>` ${ctx.label}: ${ctx.raw}%`},padding:10,cornerRadius:10}}}
});

// ── 3D TILT ──
document.querySelectorAll('.stat-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`perspective(500px) rotateY(${x*16}deg) rotateX(${-y*16}deg) translateY(-6px) scale(1.03)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});

// ── NAVIGATION ──
document.querySelectorAll('.nav-item').forEach(btn=>{
  btn.addEventListener('click',()=>{ const p=btn.dataset.page; if(p) go(p); });
});
function go(p){
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  const nb=document.querySelector(`[data-page="${p}"]`);
  if(nb) nb.classList.add('active');
  document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.iframe-page').forEach(el=>{el.classList.remove('active');el.style.display='none';});
  document.querySelectorAll('.launcher-page').forEach(el=>{el.classList.remove('active');el.style.display='none';});
  if(IFRAME_PAGES.includes(p)){
    const pg=document.getElementById(`page-${p}`);
    if(pg){pg.style.display='flex';pg.classList.add('active');}
    loadIframe(p);
  } else if(LAUNCHER_PAGES.includes(p)){
    const pg=document.getElementById(`page-${p}`);
    if(pg){pg.style.display='flex';pg.classList.add('active');}
    const url=URLS[p];
    if(url){const btn=document.getElementById(`${p}OpenBtn`);if(btn)btn.href=url;}
  } else {
    const pg=document.getElementById(`page-${p}`);
    if(pg) pg.classList.add('active');
  }
}
function goHome(){
  go('dashboard');
  IFRAME_PAGES.forEach(k=>{const f=document.getElementById(`ifr${cap(k)}`);if(f)f.src='about:blank';});
}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function loadIframe(key){
  const url=URLS[key];if(!url)return;
  const f=document.getElementById(`ifr${cap(key)}`);
  const ld=document.getElementById(`ld${cap(key)}`);
  const er=document.getElementById(`err${cap(key)}`);
  const tab=document.getElementById(`tab${cap(key)}`);
  const errTab=document.getElementById(`errTab${cap(key)}`);
  if(!f)return;
  if(tab)tab.href=url; if(errTab)errTab.href=url;
  ld.classList.remove('hidden');er.classList.remove('show');
  f.style.opacity='0';
  let realLoaded=false;
  const t=setTimeout(()=>{ld.classList.add('hidden');er.classList.add('show');},20000);
  f.onload=()=>{
    if(!realLoaded)return;
    clearTimeout(t);ld.classList.add('hidden');f.style.opacity='1';
  };
  f.onerror=()=>{
    if(!realLoaded)return;
    clearTimeout(t);ld.classList.add('hidden');er.classList.add('show');
  };
  f.src='about:blank';
  setTimeout(()=>{realLoaded=true;f.src=url;},150);
}
function reloadIframe(frameId,key){
  const f=document.getElementById(frameId);const url=URLS[key];
  if(!f||!url)return;
  const ld=document.getElementById(`ld${cap(key)}`);
  const er=document.getElementById(`err${cap(key)}`);
  f.src='about:blank';ld.classList.remove('hidden');er.classList.remove('show');
  f.style.opacity='0';setTimeout(()=>{f.src=url;},100);
}

// ── AI SUPPORT ──
const GAS_AI_URL = 'https://script.google.com/macros/s/AKfycbzphhWpNaHVnvJzRl2dO2g-JsUnLByOPvkYZWIKoN_XrfD42uF_m7sqPgNkhUCIQlEu/exec';

function setupAI(inId,btnId,msgsId,typingId){
  const inp=document.getElementById(inId),btn=document.getElementById(btnId),msgs=document.getElementById(msgsId),typing=document.getElementById(typingId);
  if(!inp||!btn||!msgs)return;
  function addBubble(text,type){
    const div=document.createElement('div');div.className=`ai-bubble ${type}`;
    div.style.whiteSpace='pre-wrap';div.textContent=text;
    if(typing&&msgs.contains(typing))msgs.insertBefore(div,typing);else msgs.appendChild(div);
    msgs.scrollTop=msgs.scrollHeight;
  }
  async function send(){
    const txt=inp.value.trim();if(!txt)return;
    addBubble(txt,'user');inp.value='';inp.disabled=true;btn.disabled=true;
    if(typing){typing.classList.add('show');msgs.scrollTop=msgs.scrollHeight;}
    try{
      const url=GAS_AI_URL+'?q='+encodeURIComponent(txt);
      const res=await fetch(url);
      const data=await res.json();
      if(typing)typing.classList.remove('show');
      addBubble(data.answer||'Maaf, tidak ada jawaban.','bot');
    }catch(e){
      if(typing)typing.classList.remove('show');
      // Fallback: JSONP
      try{
        const reply=await askViaJsonp(txt);
        addBubble(reply,'bot');
      }catch(e2){
        addBubble('Maaf, terjadi kesalahan koneksi.','bot');
      }
    }
    inp.disabled=false;btn.disabled=false;inp.focus();
  }
  btn.addEventListener('click',send);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
}

function askViaJsonp(question){
  return new Promise((resolve,reject)=>{
    const cbName='cb_'+Date.now();
    window[cbName]=function(data){
      delete window[cbName];
      document.getElementById('jsonpScript')?.remove();
      resolve(data.answer||'Maaf, tidak ada jawaban.');
    };
    const s=document.createElement('script');
    s.id='jsonpScript';
    s.src=GAS_AI_URL+'?q='+encodeURIComponent(question)+'&cb='+cbName;
    s.onerror=()=>reject(new Error('JSONP failed'));
    document.body.appendChild(s);
    setTimeout(()=>reject(new Error('Timeout')),15000);
  });
}
setupAI('aiIn','aiBtn','aiMsg','aiTyping');
setupAI('aiIn2','aiBtn2','aiMsg2','aiTyping2');

// ── NOTIFIKASI SYSTEM ──
let notifList = [];
let notifOpen = false;
let lastSeenTs = 0;

function getLastSeenTs() {
  const key = 'lastSeenTs_' + (me.name || 'guest');
  return parseInt(localStorage.getItem(key) || '0');
}

function setLastSeenTs(ts) {
  const key = 'lastSeenTs_' + (me.name || 'guest');
  localStorage.setItem(key, ts);
}

function toggleNotif() {
  notifOpen = !notifOpen;
  document.getElementById('notifPanel').style.display = notifOpen ? 'block' : 'none';
  if (notifOpen) {
    setLastSeenTs(Date.now());
    document.getElementById('notifBadge').style.display = 'none';
    document.getElementById('notifBadge').textContent = '0';
  }
}

function clearNotifs() {
  notifList = [];
  setLastSeenTs(Date.now());
  document.getElementById('notifBadge').style.display = 'none';
  document.getElementById('notifList').innerHTML = '<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px">Belum ada notifikasi</div>';
}

function addNotif(msg) {
  if (!msg || !msg.name) return;
  if (me.name && msg.name === me.name) return;
  if (!msg.timestamp || msg.timestamp <= getLastSeenTs()) return;

  notifList.unshift(msg);
  if (notifList.length > 20) notifList.pop();

  if (!notifOpen) {
    const badge = document.getElementById('notifBadge');
    const count = parseInt(badge.textContent || '0') + 1;
    badge.textContent = count > 9 ? '9+' : count;
    badge.style.display = 'flex';
    const btn = document.getElementById('notifBtn');
    btn.style.animation = 'none';
    setTimeout(() => btn.style.animation = 'shakeBell 0.5s ease', 10);
  }
  renderNotifList();
}

function renderNotifList() {
  if (!notifList.length) {
    document.getElementById('notifList').innerHTML = '<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px">Belum ada notifikasi</div>';
    return;
  }
  document.getElementById('notifList').innerHTML = notifList.map(m => `
    <div style="padding:12px 18px;border-bottom:1px solid rgba(200,215,240,0.3);display:flex;align-items:flex-start;gap:10px;cursor:pointer" onclick="go('discussion')">
      <div style="width:36px;height:36px;border-radius:50%;background:${m.color||'#2563eb'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">${(m.name||'?').slice(0,2).toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:700;color:#0f172a">${m.name||'User'} <span style="font-weight:400;color:#94a3b8">di Discussion</span></div>
        <div style="font-size:12px;color:#334155;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.text||''}</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:3px">${m.timestamp ? new Date(m.timestamp).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) : ''}</div>
      </div>
      <span style="font-size:10px;background:#eff6ff;color:#2563eb;padding:2px 8px;border-radius:10px;font-weight:700;flex-shrink:0">💬</span>
    </div>
  `).join('');
}

// Close notif panel when clicking outside
document.addEventListener('click', (e) => {
  if (notifOpen && !document.getElementById('notifPanel').contains(e.target) && !document.getElementById('notifBtn').contains(e.target)) {
    notifOpen = false;
    document.getElementById('notifPanel').style.display = 'none';
  }
});

// ── DARK MODE ──
let isDark = localStorage.getItem('wms_dark') === '1';
function applyDark() {
  document.body.classList.toggle('dark', isDark);
  updateDarkToggle();
}
function toggleDark() {
  isDark = !isDark;
  localStorage.setItem('wms_dark', isDark ? '1' : '0');
  applyDark();
}
applyDark();


// ── SETTINGS ──
let settingsOpen = false;
let profileColorIdx = parseInt(localStorage.getItem('wms_color') || '0');

function updateSettingsUser() {
  if (!me.name) return;
  const ava = document.getElementById('settingsAva');
  if (ava) { ava.textContent = me.initials; ava.style.background = me.color.bg; }
  const nm = document.getElementById('settingsName');
  if (nm) nm.textContent = me.name;
}

function toggleSettings() {
  settingsOpen = !settingsOpen;
  document.getElementById('settingsPanel').classList.toggle('open', settingsOpen);
  updateDarkToggle();
}

function updateDarkToggle() {
  const toggle = document.getElementById('darkToggle');
  if (toggle) toggle.classList.toggle('on', isDark);
}

function openProfile() {
  settingsOpen = false;
  document.getElementById('settingsPanel').classList.remove('open');
  document.getElementById('profileOverlay').classList.remove('hidden');
  document.getElementById('profileNameIn').value = me.name || '';
  document.getElementById('profileAvaBig').textContent = me.initials || '?';
  document.getElementById('profileAvaBig').style.background = me.color ? me.color.bg : '#2563eb';
  document.getElementById('profileNameShow').textContent = me.name || '—';
  profileColorIdx = parseInt(localStorage.getItem('wms_color') || '0');
  document.querySelectorAll('#profileColorOpts .color-opt').forEach((el, i) => {
    el.classList.toggle('selected', i === profileColorIdx);
    el.onclick = function() {
      document.querySelectorAll('#profileColorOpts .color-opt').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      profileColorIdx = parseInt(el.dataset.pidx || i);
      document.getElementById('profileAvaBig').style.background = el.style.background;
    };
  });
}

function doLogout() {
  settingsOpen = false;
  document.getElementById('settingsPanel').classList.remove('open');
  localStorage.removeItem('wms_name');
  localStorage.removeItem('wms_color');
  const overlay = document.getElementById('loginOverlay');
  overlay.classList.remove('hidden');
  overlay.style.opacity = '1';
}

document.getElementById('profileSaveBtn').addEventListener('click', function() {
  const newName = document.getElementById('profileNameIn').value.trim();
  if (!newName) return;
  me.name = newName;
  me.color = AVATAR_COLORS[profileColorIdx];
  me.initials = newName.slice(0,2).toUpperCase();
  localStorage.setItem('wms_name', newName);
  localStorage.setItem('wms_color', profileColorIdx);
  document.getElementById('headerAvatar').textContent = me.initials;
  document.getElementById('headerAvatar').style.background = me.color.bg;
  document.getElementById('headerName').textContent = me.name;
  updateSettingsUser();
  document.getElementById('profileOverlay').classList.add('hidden');
});

document.getElementById('profileCloseBtn').addEventListener('click', function() {
  document.getElementById('profileOverlay').classList.add('hidden');
});

document.getElementById('profileOverlay').addEventListener('click', function(e) {
  if (e.target === this) this.classList.add('hidden');
});

// Close settings on outside click
document.addEventListener('click', function(e) {
  const panel = document.getElementById('settingsPanel');
  const btn = document.getElementById('settingsBtn');
  if (settingsOpen && panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    settingsOpen = false;
    panel.classList.remove('open');
  }
});

// ── SEARCH BAR ──
const SEARCH_ITEMS = [
  { label: 'Dashboard',   page: 'dashboard', icon: '🏠', desc: 'Halaman utama' },
  { label: 'Planner',     page: 'planner',   icon: '📋', desc: 'Rencana Operasional' },
  { label: 'Inbound',     page: 'inbound',   icon: '📦', desc: 'Dashboard Inbound' },
  { label: 'Storing',     page: 'storing',   icon: '🏗️', desc: 'Dashboard Storing' },
  { label: 'Outbound',    page: 'outbound',  icon: '🚚', desc: 'Dashboard Outbound' },
  { label: 'Inventory',   page: 'inventory', icon: '📊', desc: 'Manajemen Stok' },
  { label: 'GA',          page: 'ga',        icon: '🏢', desc: 'General Affairs' },
  { label: 'HR',          page: 'hr',        icon: '👥', desc: 'Human Resources' },
  { label: 'Reports',     page: 'reports',   icon: '📈', desc: 'Laporan Operasional' },
  { label: 'Discussion',  page: 'discussion',icon: '💬', desc: 'Discussion Room' },
  { label: 'AI Support',  page: 'ai',        icon: '🤖', desc: 'Asisten AI Warehouse' },
];

const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');

function renderSearch(query) {
  if (!query.trim()) { searchDropdown.style.display = 'none'; return; }
  const q = query.toLowerCase();
  const results = SEARCH_ITEMS.filter(item =>
    item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
  );
  if (!results.length) {
    searchDropdown.innerHTML = '<div style="padding:12px 14px;font-size:12.5px;color:var(--text-3);text-align:center;">Tidak ditemukan</div>';
    searchDropdown.style.display = 'block';
    return;
  }
  searchDropdown.innerHTML = results.map((item, i) => `
    <div class="search-item" data-page="${item.page}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;cursor:pointer;transition:all 0.15s;">
      <div style="width:34px;height:34px;border-radius:9px;background:var(--accent-light);display:grid;place-items:center;font-size:16px;flex-shrink:0;border:1px solid var(--accent-mid);">${item.icon}</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--text);">${item.label}</div>
        <div style="font-size:11px;color:var(--text-3);font-weight:500;">${item.desc}</div>
      </div>
      <span style="margin-left:auto;font-size:10px;color:var(--text-3);">↵</span>
    </div>
  `).join('');
  searchDropdown.style.display = 'block';

  // Add hover + click events
  searchDropdown.querySelectorAll('.search-item').forEach(el => {
    el.addEventListener('mouseenter', () => { el.style.background = 'var(--accent-light)'; });
    el.addEventListener('mouseleave', () => { el.style.background = 'none'; });
    el.addEventListener('click', () => {
      go(el.dataset.page);
      searchInput.value = '';
      searchDropdown.style.display = 'none';
    });
  });
}

if (searchInput) {
  searchInput.addEventListener('input', e => renderSearch(e.target.value));
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const first = searchDropdown.querySelector('.search-item');
      if (first) { go(first.dataset.page); searchInput.value = ''; searchDropdown.style.display = 'none'; }
    }
    if (e.key === 'Escape') { searchInput.value = ''; searchDropdown.style.display = 'none'; }
  });
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  if (searchDropdown && !searchDropdown.contains(e.target) && e.target !== searchInput) {
    searchDropdown.style.display = 'none';
  }
});

// ── MOBILE SIDEBAR ──
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btn = document.getElementById('hamburgerBtn');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
  btn.classList.toggle('active');
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btn = document.getElementById('hamburgerBtn');
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  btn.classList.remove('active');
}

// Close sidebar when nav item clicked on mobile
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});
