// ══════════════════════════════════════════════════════════
//  🔥 FIREBASE CONFIG
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

const GAS_USER_URL = 'https://script.google.com/macros/s/AKfycbxTVbfZUlgGGJL9YgO6XLuCS6Ro4ksk9Iy8t486SFvCB-xRnHIFo1X6b8-PD9Qjn4qp/exec';
const GAS_DASHBOARD_URL = 'https://script.google.com/macros/s/AKfycbxxjijcpvbfzKtZH1gJKPswP1heNpopp2TERUESg5mJiLu7t8qZuSpVist4uAMwxZzN/exec';

const URLS = {
  planner:   'https://plannerazko.github.io/DashboardPlanning/',
  inventory: 'https://script.google.com/a/macros/kawanlamacorp.com/s/AKfycbznK9XTBd5Zz07tyb-1bvjQEa00pXEMPFOXhCtYaBqthThQUliRjcXUYYr27VaXV-888w/exec',
  outbound:  'https://outboundazko.github.io/Monitoring-Loading/index.html',
  analyst:   'https://script.google.com/a/macros/kawanlamacorp.com/s/AKfycbzbsvn8Tiu3N3WGjBRbN_6-CsqAI9vTl2IxW1bsYi92Gk15Alzzk1JBvL4iyyvnL8nj/exec',
  inbound:   'https://script.google.com/macros/s/AKfycbyuWCeC7vR3JrVbDu9wn99FCtWl9oN1hZ3pJ5Kbrx9sOXg_l9xjoIAu2qTZMSulYWrb/exec', storing: 'https://script.google.com/a/macros/kawanlamacorp.com/s/AKfycbyBTR01ZrItlvxh1C83yxFs5B8lwK5t-a4kuKHir8s8a1SprmUA_6TsRkzDZpWOaBL9Ew/exec',
  ga:        'https://script.google.com/macros/s/AKfycbzAKPAl_-Bb36LP1qAXgK1DRaYqxz2GUP_4-sbkGHpkxdmzIU4BlaPBYhUvvi04EV7d/exec',
  hr:        null,
};
const IFRAME_PAGES   = ['inventory','outbound','planner','ga','analyst','storing','inbound'];
const GAS_AI_URL     = 'https://script.google.com/macros/s/AKfycbzphhWpNaHVnvJzRl2dO2g-JsUnLByOPvkYZWIKoN_XrfD42uF_m7sqPgNkhUCIQlEu/exec';

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
const THEME_COLORS = {
  '#3b82f6': { accent:'#2563eb', dark:'#1d4ed8', light:'#eff6ff', mid:'#bfdbfe' },
  '#ec4899': { accent:'#db2777', dark:'#be185d', light:'#fdf2f8', mid:'#fbcfe8' },
  '#06b6d4': { accent:'#0891b2', dark:'#0e7490', light:'#ecfeff', mid:'#a5f3fc' },
  '#10b981': { accent:'#059669', dark:'#047857', light:'#ecfdf5', mid:'#a7f3d0' },
  '#f59e0b': { accent:'#d97706', dark:'#b45309', light:'#fffbeb', mid:'#fde68a' },
  '#8b5cf6': { accent:'#7c3aed', dark:'#6d28d9', light:'#f5f3ff', mid:'#ddd6fe' },
  '#ef4444': { accent:'#dc2626', dark:'#b91c1c', light:'#fef2f2', mid:'#fecaca' },
  '#64748b': { accent:'#475569', dark:'#334155', light:'#f8fafc', mid:'#cbd5e1' },
};
function applyTheme(hexColor) {
  const theme = THEME_COLORS[hexColor] || THEME_COLORS['#3b82f6'];
  const root = document.documentElement;
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-dark', theme.dark);
  root.style.setProperty('--accent-light', theme.light);
  root.style.setProperty('--accent-mid', theme.mid);
}

// ── User session — SEMUA DEKLARASI DI ATAS ──
let me = { nip: '', name: '', jabatan: '', color: AVATAR_COLORS[0], initials: '' };
let fbReady = false;
let db = null, chatRef = null, onlineRef = null;
let settingsOpen = false;
let notifList = [], notifOpen = false, lastSeenTs = 0;
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
  } catch(e) { console.error('Firebase init error:', e); }
}
initFirebase();

// ══════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════
const colorOptions = document.getElementById('colorOptions');
let selectedColorIdx = 0;
colorOptions.querySelectorAll('.color-opt').forEach(el => {
  el.addEventListener('click', () => {
    colorOptions.querySelectorAll('.color-opt').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    selectedColorIdx = parseInt(el.dataset.idx || '0');
  });
});
let nipVerified = false, verifiedData = null;
document.getElementById('loginBtn').addEventListener('click', handleLoginClick);
document.getElementById('loginNip').addEventListener('keydown', e => { if (e.key === 'Enter') handleLoginClick(); });

function handleLoginClick() { if (!nipVerified) checkNip(); else doLogin(); }

async function checkNip() {
  const nipInput = document.getElementById('loginNip');
  const nip = nipInput.value.trim();
  const errEl = document.getElementById('loginErr');
  const loadEl = document.getElementById('loginLoading');
  const btn = document.getElementById('loginBtn');
  if (!nip) { errEl.textContent='NIP tidak boleh kosong!'; errEl.classList.add('show'); nipInput.focus(); return; }
  errEl.classList.remove('show'); loadEl.classList.add('show'); btn.disabled=true; nipInput.disabled=true;
  try {
    const res = await fetch(GAS_USER_URL + '?action=checkNip&nip=' + encodeURIComponent(nip));
    const data = await res.json();
    if (data.found) {
      verifiedData = data; nipVerified = true;
      document.getElementById('previewName').textContent    = data.name    || '—';
      document.getElementById('previewJabatan').textContent = data.jabatan || 'Staff';
      document.getElementById('loginFoundBox').classList.add('show');
      document.getElementById('loginColorsWrap').style.display = 'block';
      btn.textContent = 'Masuk ke Dashboard →'; btn.disabled = false; nipInput.disabled = true;
    } else {
      errEl.textContent = '❌ NIP tidak terdaftar! Hubungi admin. (Latif Subaktiar_0838-3084-8989)';
      errEl.classList.add('show'); btn.disabled=false; nipInput.disabled=false; nipInput.focus();
    }
  } catch(e) {
    errEl.textContent='⚠️ Gagal terhubung ke server. Coba lagi.'; errEl.classList.add('show');
    btn.disabled=false; nipInput.disabled=false;
  }
  loadEl.classList.remove('show');
}

function doLogin() {
  if (!verifiedData) return;
  me.nip      = verifiedData.nip || document.getElementById('loginNip').value.trim();
  me.name     = verifiedData.name || '—';
  me.jabatan  = verifiedData.jabatan || 'Staff';
  me.color    = AVATAR_COLORS[selectedColorIdx];
  me.initials = me.name.slice(0,2).toUpperCase();
  applyTheme(me.color.hex);
  localStorage.setItem('wms_nip',     me.nip);
  localStorage.setItem('wms_name',    me.name);
  localStorage.setItem('wms_jabatan', me.jabatan);
  localStorage.setItem('wms_color',   selectedColorIdx);
  applyLogin();
}

function applyLogin() {
  const av = document.getElementById('headerAvatar');
  av.textContent = me.initials; av.style.background = me.color.bg;
  document.getElementById('headerName').textContent = me.name;
  if (fbReady && onlineRef) {
    const safeKey = me.name.replace(/[.#$/[\]\s]/g,'_');
    const myOnlineRef = onlineRef.child(safeKey);
    myOnlineRef.set({ name:me.name, jabatan:me.jabatan, color:me.color.hex, nip:me.nip, ts:firebase.database.ServerValue.TIMESTAMP });
    myOnlineRef.onDisconnect().remove();
    onlineRef.on('value', snap => {
      const count = snap.numChildren();
      document.getElementById('onlineCount').textContent = count + ' online';
      const discCount = document.getElementById('onlineCountDisc');
      if (discCount) discCount.textContent = count + ' user';
      const list = document.getElementById('onlineList');
      if (!list) return;
      const users = [];
      snap.forEach(child => { users.push(child.val()); });
      if (!users.length) { list.innerHTML='<div style="text-align:center;color:var(--text-3);font-size:12px;padding:20px 0">Belum ada yang online</div>'; return; }
      list.innerHTML = users.map(u => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,0.5);border:1px solid rgba(200,215,240,0.3);">
          <div style="width:36px;height:36px;border-radius:50%;background:${u.color||'#2563eb'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${(u.name||'?').slice(0,2).toUpperCase()}</div>
          <div style="min-width:0;"><div style="font-size:12.5px;font-weight:700;color:var(--text)">${u.name||'User'}</div><div style="font-size:10.5px;color:var(--text-3)">${u.jabatan||'Staff'}</div></div>
          ${u.name===me.name?'<span style="font-size:10px;background:var(--accent-light);color:var(--accent);padding:2px 8px;border-radius:10px;font-weight:700;margin-left:auto">Kamu</span>':''}
        </div>`).join('');
    });
  }
  lastSeenTs = parseInt(localStorage.getItem('lastSeenTs_'+me.name)||'0');
  startChat();
  const overlay = document.getElementById('loginOverlay');
  overlay.style.opacity='0'; overlay.style.transition='opacity 0.3s ease';
  setTimeout(()=>overlay.classList.add('hidden'),300);
  setTimeout(updateSettingsUser,350);
}

(function checkSavedLogin() {
  const savedNip=localStorage.getItem('wms_nip'), savedName=localStorage.getItem('wms_name');
  const savedJabatan=localStorage.getItem('wms_jabatan'), savedColor=parseInt(localStorage.getItem('wms_color')||'0');
  if (savedNip && savedName) {
    nipVerified=true; verifiedData={nip:savedNip,name:savedName,jabatan:savedJabatan||'Staff'};
    selectedColorIdx=savedColor; applyTheme(AVATAR_COLORS[savedColor].hex);
    const nipInput=document.getElementById('loginNip');
    if(nipInput){nipInput.value=savedNip;nipInput.disabled=true;}
    document.getElementById('previewName').textContent=savedName;
    document.getElementById('previewJabatan').textContent=savedJabatan||'Staff';
    document.getElementById('loginFoundBox').classList.add('show');
    document.getElementById('loginColorsWrap').style.display='block';
    colorOptions.querySelectorAll('.color-opt').forEach((el,i)=>el.classList.toggle('selected',i===savedColor));
    const btn=document.getElementById('loginBtn'); if(btn) btn.textContent='Masuk ke Dashboard →';
  }
})();

function doLogout() {
  localStorage.removeItem('wms_nip'); localStorage.removeItem('wms_name');
  localStorage.removeItem('wms_jabatan'); localStorage.removeItem('wms_color');
  nipVerified=false; verifiedData=null;
  document.getElementById('loginNip').value=''; document.getElementById('loginNip').disabled=false;
  document.getElementById('loginFoundBox').classList.remove('show');
  document.getElementById('loginColorsWrap').style.display='none';
  document.getElementById('loginBtn').textContent='Masuk ke Dashboard →';
  document.getElementById('loginErr').classList.remove('show');
  settingsOpen=false;
  document.getElementById('settingsPanel').classList.remove('open');
  const overlay=document.getElementById('loginOverlay');
  overlay.classList.remove('hidden'); overlay.style.opacity='1';
}

// ══════════════════════════════════════
//  CHAT ENGINE
// ══════════════════════════════════════
const seenIds = new Set();
function startChat() {
  if (!fbReady) { document.getElementById('discStatus').textContent='⚠️ Offline — Firebase error'; loadDemoMessages(); setupOfflineChat('miniDiscIn','miniDiscBtn','miniDiscMsg'); setupOfflineChat('fullDiscIn','fullDiscBtn','fullDiscMsg'); return; }
  document.getElementById('discStatus').textContent='🟢 Terhubung';
  const loadTime=Date.now();
  chatRef.limitToLast(100).on('child_added', snap=>{
    const msg=snap.val(); if(!msg||seenIds.has(snap.key)) return;
    seenIds.add(snap.key);
    const isNew=msg.timestamp&&msg.timestamp>(loadTime-3000);
    renderMessage(msg,snap.key,'miniDiscMsg',5,isNew); renderMessage(msg,snap.key,'fullDiscMsg',999,isNew);
    if(isNew) addNotif(msg);
  });
  setupFirebaseChat('miniDiscIn','miniDiscBtn','miniDiscMsg');
  setupFirebaseChat('fullDiscIn','fullDiscBtn','fullDiscMsg');
}
function renderMessage(msg,key,listId,maxItems,isNew=true){
  const list=document.getElementById(listId); if(!list) return;
  if(list.querySelector(`[data-key="${key}"]`)) return;
  while(list.children.length>=maxItems) list.removeChild(list.firstChild);
  const isMine=msg.name===me.name, timeStr=msg.timestamp?formatTime(new Date(msg.timestamp)):'';
  const row=document.createElement('div'); row.className='disc-msg'+(isMine?' mine':''); row.dataset.key=key;
  row.innerHTML=`<div class="disc-avatar" style="background:${msg.color||'linear-gradient(145deg,#3b82f6,#1d4ed8)'}">${(msg.name||'?').slice(0,2).toUpperCase()}</div><div class="disc-bubble-wrap"><div class="disc-meta">${isMine?`<span class="disc-time">${timeStr}</span><span class="disc-name">Kamu</span>`:`<span class="disc-name">${escHtml(msg.name)}</span><span class="disc-time">${timeStr}</span>`}</div><div class="disc-bubble">${escHtml(msg.text)}</div></div>`;
  list.appendChild(row); if(isNew) list.scrollTop=list.scrollHeight;
}
function setupFirebaseChat(inId,btnId,listId){
  const inp=document.getElementById(inId),btn=document.getElementById(btnId); if(!inp||!btn) return;
  function send(){ const text=inp.value.trim(); if(!text) return; inp.value=''; inp.disabled=true; btn.disabled=true; chatRef.push({name:me.name,text,color:me.color.bg,initials:me.initials,timestamp:firebase.database.ServerValue.TIMESTAMP}).finally(()=>{inp.disabled=false;btn.disabled=false;inp.focus();}); }
  btn.addEventListener('click',send); inp.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
}
const demoMessages=[{name:'Rani',text:'Stok ABC mulai menipis, perlu restock segera.',color:'linear-gradient(145deg,#ec4899,#db2777)',timestamp:Date.now()-120000},{name:'Budi',text:'Besok ada inbound besar jam 10 pagi.',color:'linear-gradient(145deg,#06b6d4,#0891b2)',timestamp:Date.now()-80000},{name:'Tapes',text:'Forklift sudah stand by di loading area.',color:'linear-gradient(145deg,#10b981,#059669)',timestamp:Date.now()-30000}];
function loadDemoMessages(){ demoMessages.forEach((msg,i)=>{renderMessage(msg,'demo-'+i,'miniDiscMsg',5);renderMessage(msg,'demo-'+i,'fullDiscMsg',999);}); }
function setupOfflineChat(inId,btnId,listId){
  const inp=document.getElementById(inId),btn=document.getElementById(btnId); if(!inp||!btn) return;
  function send(){ const text=inp.value.trim(); if(!text) return; const msg={name:me.name,text,color:me.color.bg,timestamp:Date.now()}; renderMessage(msg,'local-'+Date.now(),'miniDiscMsg',5); renderMessage(msg,'local-'+Date.now()+1,'fullDiscMsg',999); inp.value=''; inp.focus(); }
  btn.addEventListener('click',send); inp.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
}
function formatTime(date){ const now=new Date(),diff=now-date; if(diff<60000) return 'baru saja'; if(diff<3600000) return Math.floor(diff/60000)+' mnt lalu'; if(date.toDateString()===now.toDateString()) return date.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}); return date.toLocaleDateString('id-ID',{day:'numeric',month:'short'}); }
function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

const d=new Date();
const dateStr=d.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
document.getElementById('todayDate').textContent=dateStr;
document.getElementById('todayDate2').textContent=dateStr;

// ══════════════════════════════════════
//  OUTBOUND DETAIL PANEL
// ══════════════════════════════════════
let outboundPanelOpen   = false;
let inventoryPanelOpen  = false;  // ✅ di sini bersama panel lainnya
let inventoryDetailLoaded = false;

function toggleOutboundPanel() {
  outboundPanelOpen = !outboundPanelOpen;
  const panel       = document.getElementById('outboundDetailPanel');
  const midGrid     = document.querySelector('.mid-grid');
  const progressRow = document.querySelector('.progress-row');
  const bottomGrid  = document.querySelector('.bottom-grid');
  if (!panel) return;

  if (inboundPanelOpen)   { inboundPanelOpen   = false; const p=document.getElementById('inboundDetailPanel');   if(p) p.style.display='none'; }
  if (storingPanelOpen)   { storingPanelOpen   = false; const p=document.getElementById('storingDetailPanel');   if(p) p.style.display='none'; }
  if (inventoryPanelOpen) { inventoryPanelOpen = false; const p=document.getElementById('inventoryDetailPanel'); if(p) p.style.display='none'; }
  if (plannerPanelOpen)   { plannerPanelOpen   = false; const p=document.getElementById('plannerDetailPanel');   if(p) p.style.display='none'; }

  if (outboundPanelOpen) {
    panel.style.display = 'block';
    if (midGrid)     midGrid.style.display     = 'none';
    if (progressRow) progressRow.style.display = 'none';
    if (bottomGrid)  bottomGrid.style.display  = 'none';
    fetchOutboundPanel();
    setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'start'}),100);
  } else {
    panel.style.display = 'none';
    if (midGrid)     midGrid.style.display     = '';
    if (progressRow) progressRow.style.display = '';
    if (bottomGrid)  bottomGrid.style.display  = '';
    lineOutboundLoaded = false;
    switchOutboundTab('data');
  }
}

// ══════════════════════════════════════
//  INVENTORY CONTROL DETAIL PANEL
// ══════════════════════════════════════
function toggleInventoryPanel() {
  inventoryPanelOpen = !inventoryPanelOpen;
  const panel       = document.getElementById('inventoryDetailPanel');
  const midGrid     = document.querySelector('.mid-grid');
  const progressRow = document.querySelector('.progress-row');
  const bottomGrid  = document.querySelector('.bottom-grid');
  if (!panel) return;

  // Tutup semua panel lain
  if (inboundPanelOpen)  { inboundPanelOpen  = false; const p=document.getElementById('inboundDetailPanel');  if(p) p.style.display='none'; }
  if (storingPanelOpen)  { storingPanelOpen  = false; const p=document.getElementById('storingDetailPanel');  if(p) p.style.display='none'; }
  if (outboundPanelOpen) { outboundPanelOpen = false; const p=document.getElementById('outboundDetailPanel'); if(p) p.style.display='none'; }
  if (plannerPanelOpen)  { plannerPanelOpen  = false; const p=document.getElementById('plannerDetailPanel');  if(p) p.style.display='none'; }

  if (inventoryPanelOpen) {
    panel.style.display = 'block';
    if (midGrid)     midGrid.style.display     = 'none';
    if (progressRow) progressRow.style.display = 'none';
    if (bottomGrid)  bottomGrid.style.display  = 'none';
    if (!inventoryDetailLoaded) fetchInventoryDetail();
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  } else {
    panel.style.display = 'none';
    if (midGrid)     midGrid.style.display     = '';
    if (progressRow) progressRow.style.display = '';
    if (bottomGrid)  bottomGrid.style.display  = '';
  }
}

async function fetchOutboundPanel() {
  const tbody   = document.getElementById('outboundPanelBody');
  const summary = document.getElementById('outboundPanelSummary');
  const footer  = document.getElementById('outboundPanelFooter');
  const sub     = document.getElementById('outboundPanelSubtitle');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="13" style="text-align:center;padding:24px;color:var(--text-3)">Memuat data outbound...</td></tr>';
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getOutboundDetail');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Gagal');

    const rows = data.data || [];
    const selesai = rows.filter(r=>String(r.status).toUpperCase().includes('SELESAI')||String(r.status).toUpperCase().includes('KELUAR')).length;
    const proses  = rows.filter(r=>String(r.status).toUpperCase().includes('PROSES')||String(r.status).toUpperCase().includes('LOADING')).length;
    const antri   = rows.filter(r=>String(r.status).toUpperCase().includes('ANTRI')).length;
    const belum   = rows.length - selesai - proses - antri;
    const total   = rows.length || 1;

    const toNum = (v) => { const n=parseFloat(String(v).replace('%','')||'0'); return isNaN(n)?0:(n>1?n:Math.round(n*100)); };
    const avgPc  = rows.length ? Math.round(rows.reduce((s,r)=>s+toNum(r.ppc),0)/total)  : 0;
    const avgStg = rows.length ? Math.round(rows.reduce((s,r)=>s+toNum(r.pstg),0)/total) : 0;
    const avgLd  = rows.length ? Math.round(rows.reduce((s,r)=>s+toNum(r.pld),0)/total)  : 0;
    const pctSel = Math.round((selesai/total)*100);

    if (sub)    sub.textContent = `Total: ${rows.length} armada hari ini`;
    if (footer) footer.textContent = rows.length + ' data outbound hari ini';
    if (summary) summary.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(22,163,74,0.12);color:#16a34a;border:1px solid rgba(22,163,74,0.25)">✅ ${selesai} Selesai</span>
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(37,99,235,0.12);color:#3b82f6;border:1px solid rgba(37,99,235,0.25)">⏳ ${proses} Proses</span>
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.25)">🕐 ${antri} Antri</span>
      <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.25)">🔴 ${belum} Belum</span>
    `;

    const isDark = document.body.classList.contains('dark');

    const makeSVGOut = (elId, pct, color) => {
      const el=document.getElementById(elId); if(!el) return;
      const r=26,cx=32,cy=32,circ=2*Math.PI*r;
      const dash=Math.min(pct,100)/100*circ;
      const bg=isDark?'#334155':'#e2e8f0';
      el.innerHTML=`<svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${bg}" stroke-width="7"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="7"
          stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
        <text x="${cx}" y="${cy+1}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="900" fill="${color}">${pct}%</text>
      </svg>`;
    };

    // Status Armada card
    document.getElementById('pctOutSelesai').textContent = pctSel + '%';
    document.getElementById('footOutStatus').textContent = pctSel + '%';
    document.getElementById('outMiniSelesai').textContent = selesai;
    document.getElementById('outMiniProses').textContent  = proses;
    document.getElementById('outMiniAntri').textContent   = antri;
    document.getElementById('outMiniBelum').textContent   = belum;
    makeSVGOut('chartOutStatus', pctSel, '#d97706');
    const bo=document.getElementById('barOutStatus'); if(bo) setTimeout(()=>bo.style.width=Math.min(pctSel,100)+'%',300);

    // % PC
    document.getElementById('pctOutPc').textContent  = avgPc + '%';
    document.getElementById('footOutPc').textContent = avgPc + '%';
    makeSVGOut('chartOutPc', avgPc, '#16a34a');
    const bp=document.getElementById('barOutPc'); if(bp) setTimeout(()=>bp.style.width=Math.min(avgPc,100)+'%',300);

    // % STG
    document.getElementById('pctOutStg').textContent = avgStg + '%';
    document.getElementById('footOutStg').textContent= avgStg + '%';
    makeSVGOut('chartOutStg', avgStg, '#2563eb');
    const bs=document.getElementById('barOutStg'); if(bs) setTimeout(()=>bs.style.width=Math.min(avgStg,100)+'%',300);

    // % LD
    document.getElementById('pctOutLd').textContent  = avgLd + '%';
    document.getElementById('footOutLd').textContent = avgLd + '%';
    makeSVGOut('chartOutLd', avgLd, '#ec4899');
    const bl=document.getElementById('barOutLd'); if(bl) setTimeout(()=>bl.style.width=Math.min(avgLd,100)+'%',300);

    renderOutboundPanelTable(rows);

    // Full-body beam amber otomatis loop
    setTimeout(()=>{
      const speeds=['3s','3.5s','4s','4.5s'];
      document.querySelectorAll('#outboundDetailPanel [style*="overflow:hidden;box-shadow"]').forEach((card,i)=>{
        if(card.querySelector('.out-beam')) return;
        const b=document.createElement('div');
        b.className='out-beam';
        b.style.cssText=`position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.18),transparent);transform:skewX(-15deg);pointer-events:none;z-index:10;animation:kpiBodyBeam ${speeds[i]||'3.5s'} ease-in-out infinite;`;
        card.style.position='relative';
        card.style.overflow='hidden';
        card.appendChild(b);
      });
    },300);
  } catch(e) {
    if(tbody) tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;padding:24px;color:var(--red)">Gagal: ${e.message}</td></tr>`;
  }
}

function switchOutboundTab(tab) {
  const wData = document.getElementById('outWrapData');
  const wLine = document.getElementById('outWrapLine');
  const bData = document.getElementById('outTabData');
  const bLine = document.getElementById('outTabLine');
  if (tab === 'data') {
    if(wData) wData.style.display = '';
    if(wLine) wLine.style.display = 'none';
    if(bData) { bData.style.color='var(--accent)'; bData.style.borderBottom='2px solid var(--accent)'; }
    if(bLine) { bLine.style.color='var(--text-3)'; bLine.style.borderBottom='2px solid transparent'; }
  } else {
    if(wData) wData.style.display = 'none';
    if(wLine) wLine.style.display = '';
    if(bLine) { bLine.style.color='var(--accent)'; bLine.style.borderBottom='2px solid var(--accent)'; }
    if(bData) { bData.style.color='var(--text-3)'; bData.style.borderBottom='2px solid transparent'; }
    fetchLineOutbound();
  }
}

let lineOutboundLoaded = false;
async function fetchLineOutbound() {
  if (lineOutboundLoaded) return;
  const tbody = document.getElementById('lineOutboundBody'); if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="14" style="text-align:center;padding:24px;color:var(--text-3)">Memuat Line Outbound...</td></tr>';
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getLineOutbound');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Gagal');
    lineOutboundLoaded = true;
    renderLineOutboundTable(data.data, data.summary);
  } catch(e) {
    if(tbody) tbody.innerHTML = `<tr><td colspan="14" style="text-align:center;padding:20px;color:var(--red)">Gagal: ${e.message}</td></tr>`;
  }
}

function renderLineOutboundTable(rows, summary) {
  const tbody = document.getElementById('lineOutboundBody'); if(!tbody) return;
  if (!rows||!rows.length) { tbody.innerHTML='<tr><td colspan="14" style="text-align:center;padding:20px;color:var(--text-3)">Tidak ada data</td></tr>'; return; }

  const isDark = document.body.classList.contains('dark');
  const hdrBg    = isDark ? '#0a0f1e' : '#1e293b';
  const hdrText  = '#ffffff';
  const hdrStyle = `background:${hdrBg};color:${hdrText};font-weight:800;font-size:11px;text-align:center;padding:8px 10px;letter-spacing:0.5px;`;

  const c  = 'text-align:center;font-size:11px;color:var(--text-2);padding:7px 10px;';
  const cn = 'text-align:center;font-size:11px;font-family:"JetBrains Mono",monospace;color:var(--text-2);padding:7px 10px;';

  const ketBadge = (v) => {
    const u = String(v||'').toUpperCase();
    if (u.includes('PROSES'))  return `<span class="badge badge-blue">⏳ ${v}</span>`;
    if (u.includes('ANTRI'))   return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.25)">🕐 ${v}</span>`;
    if (u.includes('BELUM'))   return `<span class="badge badge-red">🔴 ${v}</span>`;
    if (u.includes('SELESAI')||u.includes('KELUAR')) return `<span class="badge badge-green">✅ ${v}</span>`;
    return `<span style="color:var(--text-3);font-size:11px">${v||'—'}</span>`;
  };

  const pBar = (pct) => {
    const n = parseFloat(pct)||0, p = n>1?Math.round(n):Math.round(n*100);
    const col = p>=80?'#16a34a':p>=50?'#f59e0b':'#ef4444';
    if (p===0) return `<span style="color:var(--text-3);font-size:11px">0%</span>`;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:44px;height:4px;background:rgba(148,163,184,0.2);border-radius:3px;"><div style="width:${Math.min(p,100)}%;height:100%;background:${col};border-radius:3px;"></div></div><span style="font-size:10px;font-weight:800;color:${col}">${p}%</span></div>`;
  };

  tbody.innerHTML = rows.map(r => {
    if (r.isHeader) {
      return `<tr style="background:${hdrBg}">${r.cols.map(c => `<td style="${hdrStyle}">${c||'—'}</td>`).join('')}</tr>`;
    }
    return `<tr>
      <td style="${c}">${r.no||'—'}</td>
      <td style="${cn}font-weight:800;color:var(--accent)">${r.noLine||'—'}</td>
      <td style="font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--text);padding:7px 10px">${r.noLc||'—'}</td>
      <td style="font-size:11px;color:var(--text-2);padding:7px 10px;max-width:180px">${r.shipping||'—'}</td>
      <td style="${c}font-weight:800;color:var(--accent)">${r.batch||'—'}</td>
      <td style="${cn}">${r.stuffing||'—'}</td>
      <td style="font-size:11px;color:var(--text-2);padding:7px 10px">${r.armada||'—'}</td>
      <td style="${cn}">${r.cbmS2||'—'}</td>
      <td style="background:rgba(22,163,74,0.05);padding:7px 10px;text-align:center">${pBar(r.pctPc)}</td>
      <td style="background:rgba(37,99,235,0.05);padding:7px 10px;text-align:center">${pBar(r.pctStg)}</td>
      <td style="${c}">${r.type||'—'}</td>
      <td style="${cn}">${r.nopol||'—'}</td>
      <td style="padding:7px 10px;text-align:center">${ketBadge(r.ket)}</td>
      <td style="${c}font-weight:700;color:var(--text)">${r.loading||'—'}</td>
    </tr>`;
  }).join('');
}

function renderOutboundPanelTable(rows) {
  const tbody = document.getElementById('outboundPanelBody'); if(!tbody) return;
  if (!rows||!rows.length) { tbody.innerHTML='<tr><td colspan="13" style="text-align:center;padding:20px;color:var(--text-3)">Tidak ada data</td></tr>'; return; }

  const shiftStyle = (penyelesaian) => {
    const m = String(penyelesaian||'').match(/SHIFT\s*(\d+)/i);
    const n = m ? parseInt(m[1]) : 1;
    switch(n) {
      case 2: return { bg:'rgba(234,179,8,0.22)',  border:'4px solid rgba(234,179,8,1)' };
      case 3: return { bg:'rgba(34,197,94,0.20)',  border:'4px solid rgba(34,197,94,1)' };
      case 4: return { bg:'rgba(59,130,246,0.20)', border:'4px solid rgba(59,130,246,1)' };
      default:return { bg:'',                       border:'' };
    }
  };

  const isDarkO=document.body.classList.contains('dark');
  const txO=isDarkO?'#f0f4ff':'#0a0f1e';
  const cn = `text-align:center;font-size:12px;font-family:"JetBrains Mono",monospace;font-weight:600;color:${txO};`;
  const c  = `font-size:12px;font-weight:600;color:${txO};`;

  const pBar = (v) => {
    const pct=parseFloat(String(v||'0').replace('%',''))||0;
    const n=pct>1?Math.round(pct):Math.round(pct*100);
    const col=n>=80?'#15803d':n>=50?'#b45309':'#b91c1c';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:44px;height:5px;background:rgba(0,0,0,0.12);border-radius:3px;"><div style="width:${Math.min(n,100)}%;height:100%;background:${col};border-radius:3px;"></div></div><span style="font-size:10px;font-weight:900;color:${col}">${n}%</span></div>`;
  };
  const statusBadge = (s) => {
    const u=String(s||'').toUpperCase();
    if(u.includes('KELUAR DC')||u.includes('KELUAR')) return `<span class="badge badge-green">✅ ${s}</span>`;
    if(u.includes('SELESAI'))  return `<span class="badge badge-green">✅ ${s}</span>`;
    if(u.includes('TERLAMBAT'))return `<span class="badge badge-red">⚠️ ${s}</span>`;
    if(u.includes('PROSES')||u.includes('LOADING')) return `<span class="badge badge-blue">⏳ ${s}</span>`;
    if(u.includes('ANTRI'))    return `<span class="badge badge-orange" style="display:inline-flex;align-items:center;gap:4px;">🕐 ${s}</span>`;
    if(u.includes('BELUM'))    return `<span class="badge badge-red">🔴 ${s}</span>`;
    return `<span style="color:var(--text-3);font-size:12px">${s||'—'}</span>`;
  };

  tbody.innerHTML = rows.map((r,i) => {
    const ss = shiftStyle(r.penyelesaian);
    const trStyle = `background:${ss.bg};${ss.border?'border-left:'+ss.border:''}`;
    return `<tr style="${trStyle}">
    <td style="${cn}">${i+1}</td>
    <td style="${c}font-weight:800">${r.penyelesaian||'—'}</td>
    <td style="font-weight:800;font-size:12px;font-family:'JetBrains Mono',monospace;color:${txO}">${escHtml(r.transno||'—')}</td>
    <td style="background:rgba(21,128,61,0.12)">${pBar(r.ppc)}</td>
    <td style="background:rgba(29,78,216,0.12)">${pBar(r.pstg)}</td>
    <td style="background:rgba(180,83,9,0.12)">${pBar(r.pld)}</td>
    <td style="${c}">${escHtml(r.shippingline||'—')}</td>
    <td style="${cn}">${escHtml(r.bu||'—')}</td>
    <td style="${cn}">${escHtml(r.carrierId||'—')}</td>
    <td style="${cn}">${r.stuffingTime||'—'}</td>
    <td style="${c}">${escHtml(r.jenisArmada||'—')}</td>
    <td style="${cn}">${escHtml(r.nopol||'—')}</td>
    <td style="text-align:center">${statusBadge(r.status)}</td>
  </tr>`;
  }).join('');
}

// ══════════════════════════════════════
//  SLIDESHOW MODE
// ══════════════════════════════════════
let slideshowActive = false;
let slideshowIndex  = 0;
let slideshowRAF    = null;
let slideshowTimer  = null;
const SLIDES=[{name:'🏠 Dashboard'},{name:'📦 Inbound Data'},{name:'📋 Putaway'},{name:'🏗️ Storing'},{name:'🚚 Outbound'},{name:'📊 Line OB'}];
function toggleSlideshow(){if(slideshowActive)stopSlideshow();else startSlideshow();}
function startSlideshow(){
  slideshowActive=true;slideshowIndex=0;
  const el=document.documentElement;if(el.requestFullscreen)el.requestFullscreen().catch(()=>{});
  const h=document.querySelector('.header'),s=document.querySelector('.sidebar');
  if(h)h.style.display='none';if(s)s.style.display='none';
  const sh=document.querySelector('.shell');if(sh){sh.style.gridTemplateColumns='1fr';sh.style.gridTemplateRows='1fr';}
  document.body.classList.add('slideshow-mode');
  const btn=document.getElementById('slideshowBtn');if(btn)btn.innerHTML='<span style="font-size:14px">⏹</span> Stop';
  createFadeOverlay();showSlideshowIndicator();
  document.addEventListener('keydown',onSlideshowKey);
  document.addEventListener('fullscreenchange',onFullscreenChange);
  runSlide(0);
}
function stopSlideshow(){
  slideshowActive=false;
  if(slideshowRAF){cancelAnimationFrame(slideshowRAF);slideshowRAF=null;}
  if(slideshowTimer){clearTimeout(slideshowTimer);slideshowTimer=null;}
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  const h=document.querySelector('.header'),s=document.querySelector('.sidebar');
  if(h)h.style.display='';if(s)s.style.display='';
  const sh=document.querySelector('.shell');if(sh){sh.style.gridTemplateColumns='';sh.style.gridTemplateRows='';}
  document.body.classList.remove('slideshow-mode');
  document.getElementById('slideshowOverlay')?.remove();
  document.getElementById('slideshowIndicator')?.remove();
  const btn=document.getElementById('slideshowBtn');if(btn)btn.innerHTML='<span style="font-size:14px">▶</span> Slide Show';
  if(inboundPanelOpen){inboundPanelOpen=false;document.getElementById('inboundDetailPanel').style.display='none';}
  if(storingPanelOpen){storingPanelOpen=false;document.getElementById('storingDetailPanel').style.display='none';}
  if(outboundPanelOpen){outboundPanelOpen=false;document.getElementById('outboundDetailPanel').style.display='none';}
  if(plannerPanelOpen){plannerPanelOpen=false;const pp=document.getElementById('plannerDetailPanel');if(pp)pp.style.display='none';}
  ['mid-grid','progress-row','bottom-grid'].forEach(cls=>{const e=document.querySelector('.'+cls);if(e)e.style.display='';});
  document.removeEventListener('keydown',onSlideshowKey);
  document.removeEventListener('fullscreenchange',onFullscreenChange);
}
function onSlideshowKey(e){if(e.key==='Escape')stopSlideshow();}
function onFullscreenChange(){if(!document.fullscreenElement&&slideshowActive)stopSlideshow();}
function createFadeOverlay(){
  document.getElementById('slideshowOverlay')?.remove();
  const div=document.createElement('div');
  div.id='slideshowOverlay';
  div.style.cssText='position:fixed;inset:0;z-index:9998;background:#000;opacity:0;pointer-events:none;transition:opacity 0.45s ease;';
  document.body.appendChild(div);
}
function fadeOut(){return new Promise(res=>{const ov=document.getElementById('slideshowOverlay');if(!ov){res();return;}ov.style.opacity='0.65';setTimeout(res,480);});}
function fadeIn(){return new Promise(res=>{const ov=document.getElementById('slideshowOverlay');if(!ov){res();return;}ov.style.opacity='0';setTimeout(res,480);});}
function ssleep(ms){return new Promise(res=>{if(!slideshowActive){res();return;}slideshowTimer=setTimeout(res,ms);});}
async function runSlide(idx){
  if(!slideshowActive)return;
  slideshowIndex=idx%SLIDES.length;
  updateSlideshowIndicator(slideshowIndex);
  await fadeOut();
  await prepareSlide(slideshowIndex);
  const tbl=getSlideTableEl(slideshowIndex);
  if(tbl)tbl.scrollTop=0;
  if(slideshowIndex===0){const m=document.querySelector('.main');if(m)m.scrollTop=0;}
  await fadeIn();
  await ssleep(1000);
  await scrollTableSlowly(tbl);
  await ssleep(3500);
  if(slideshowActive)runSlide(slideshowIndex+1);
}
function getSlideTableEl(idx){ return document.querySelector('.main'); }
async function scrollTableSlowly(el){
  if(!el||!slideshowActive)return;
  return new Promise(resolve=>{
    const maxMs=20000,start=Date.now(),px=0.55;
    function step(){
      if(!slideshowActive||Date.now()-start>maxMs){resolve();return;}
      const max=el.scrollHeight-el.clientHeight;
      if(max<5||el.scrollTop>=max-2){resolve();return;}
      el.scrollTop+=px;
      slideshowRAF=requestAnimationFrame(step);
    }
    if(el.scrollHeight-el.clientHeight<5){resolve();return;}
    slideshowRAF=requestAnimationFrame(step);
  });
}
async function prepareSlide(idx){
  const hideG=()=>['mid-grid','progress-row','bottom-grid'].forEach(cls=>{const e=document.querySelector('.'+cls);if(e)e.style.display='none';});
  const closeAll=(keep)=>{
    if(keep!=='inbound'&&inboundPanelOpen){inboundPanelOpen=false;document.getElementById('inboundDetailPanel').style.display='none';}
    if(keep!=='storing'&&storingPanelOpen){storingPanelOpen=false;document.getElementById('storingDetailPanel').style.display='none';}
    if(keep!=='outbound'&&outboundPanelOpen){outboundPanelOpen=false;document.getElementById('outboundDetailPanel').style.display='none';}
    if(plannerPanelOpen){plannerPanelOpen=false;const pp=document.getElementById('plannerDetailPanel');if(pp)pp.style.display='none';}
  };
  switch(idx){
    case 0:
      if(inboundPanelOpen){inboundPanelOpen=false;document.getElementById('inboundDetailPanel').style.display='none';}
      if(storingPanelOpen){storingPanelOpen=false;document.getElementById('storingDetailPanel').style.display='none';}
      if(outboundPanelOpen){outboundPanelOpen=false;document.getElementById('outboundDetailPanel').style.display='none';}
      ['mid-grid','progress-row','bottom-grid'].forEach(cls=>{const e=document.querySelector('.'+cls);if(e)e.style.display='';});
      break;
    case 1:
      closeAll('inbound');
      if(!inboundPanelOpen){inboundPanelOpen=true;const p=document.getElementById('inboundDetailPanel');if(p)p.style.display='block';hideG();renderPanelInboundTable(window._inboundRows||[]);fetchInlineProses();}
      switchPanelTab('inbound');break;
    case 2:switchPanelTab('inline');break;
    case 3:
      closeAll('storing');
      if(!storingPanelOpen){storingPanelOpen=true;const p=document.getElementById('storingDetailPanel');if(p)p.style.display='block';hideG();if(window._storingData)renderStoringPanel(window._storingData);else await fetchStoringToday();}
      break;
    case 4:
      closeAll('outbound');
      if(!outboundPanelOpen){outboundPanelOpen=true;const p=document.getElementById('outboundDetailPanel');if(p)p.style.display='block';hideG();await fetchOutboundPanel();}
      switchOutboundTab('data');break;
    case 5:switchOutboundTab('line');await fetchLineOutbound();break;
  }
}
function jumpSlide(idx){if(slideshowRAF)cancelAnimationFrame(slideshowRAF);if(slideshowTimer)clearTimeout(slideshowTimer);runSlide(idx);}

function showSlideshowIndicator(){
  document.getElementById('slideshowIndicator')?.remove();
  const div=document.createElement('div');
  div.id='slideshowIndicator';
  div.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;align-items:center;gap:12px;background:rgba(4,6,14,0.88);backdrop-filter:blur(16px);border:1px solid rgba(79,142,247,0.2);border-radius:40px;padding:10px 22px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
  div.innerHTML=SLIDES.map((s,i)=>`<div onclick="jumpSlide(${i})" style="display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;padding:2px 4px;"><div id="sdot${i}" style="width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all 0.3s;"></div><span id="slbl${i}" style="font-size:9px;color:rgba(255,255,255,0.3);font-weight:600;white-space:nowrap;transition:all 0.3s;">${s.name}</span></div>`).join('')+'<div style="width:1px;height:28px;background:rgba(255,255,255,0.1);margin:0 4px;"></div><button onclick="stopSlideshow()" style="background:rgba(239,68,68,0.85);border:none;border-radius:20px;padding:5px 14px;color:#fff;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">✕ Stop</button>';
  document.body.appendChild(div);
  updateSlideshowIndicator(0);
}
function updateSlideshowIndicator(idx){
  SLIDES.forEach((_,i)=>{
    const dot=document.getElementById('sdot'+i),lbl=document.getElementById('slbl'+i),on=i===idx;
    if(dot){dot.style.background=on?'#4f8ef7':'rgba(255,255,255,0.2)';dot.style.transform=on?'scale(1.6)':'scale(1)';dot.style.boxShadow=on?'0 0 10px rgba(79,142,247,0.9)':'none';}
    if(lbl){lbl.style.color=on?'#93c5fd':'rgba(255,255,255,0.3)';lbl.style.fontWeight=on?'800':'600';}
  });
}
let storingPanelOpen = false;
let storingLoaded    = false;

function toggleStoringPanel() {
  storingPanelOpen = !storingPanelOpen;
  const panel       = document.getElementById('storingDetailPanel');
  const midGrid     = document.querySelector('.mid-grid');
  const progressRow = document.querySelector('.progress-row');
  const bottomGrid  = document.querySelector('.bottom-grid');
  const inboundPanel= document.getElementById('inboundDetailPanel');
  if (!panel) return;

  if (storingPanelOpen) {
    if (inboundPanelOpen)   { inboundPanelOpen   = false; if(inboundPanel) inboundPanel.style.display='none'; }
    if (outboundPanelOpen)  { outboundPanelOpen  = false; const p=document.getElementById('outboundDetailPanel');  if(p) p.style.display='none'; }
    if (inventoryPanelOpen) { inventoryPanelOpen = false; const p=document.getElementById('inventoryDetailPanel'); if(p) p.style.display='none'; }
    if (plannerPanelOpen)   { plannerPanelOpen   = false; const p=document.getElementById('plannerDetailPanel');   if(p) p.style.display='none'; }
    panel.style.display = 'block';
    if (midGrid)     midGrid.style.display     = 'none';
    if (progressRow) progressRow.style.display = 'none';
    if (bottomGrid)  bottomGrid.style.display  = 'none';
    if (!storingLoaded) fetchStoringToday();
    setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'start'}),100);
  } else {
    panel.style.display = 'none';
    if (midGrid)     midGrid.style.display     = '';
    if (progressRow) progressRow.style.display = '';
    if (bottomGrid)  bottomGrid.style.display  = '';
  }
}

async function fetchStoringStatCard() {
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getStoringToday');
    const data = await res.json();
    if (!data.ok) return;
    const s = data.summary;
    const el = document.querySelector('#storingStatCard .stat-value');
    if (el) { el.textContent = s.total; el.style.color = '#db2777'; }
    // Mini boxes
    const sr=document.getElementById('strStatRelease'); if(sr) sr.textContent=(s.sumRelease||0).toLocaleString('id-ID');
    const sp=document.getElementById('strStatPicked');  if(sp) sp.textContent=(s.sumPicked||0).toLocaleString('id-ID');
    const ss=document.getElementById('strStatStaged');  if(ss) ss.textContent=(s.sumStaged||0).toLocaleString('id-ID');
    const si=document.getElementById('strStatSisa');    if(si) si.textContent=(s.sumSisa||0).toLocaleString('id-ID');
    // Pie chart
    const strPct = s.sumRelease>0 ? Math.round(s.sumPicked/s.sumRelease*100) : 0;
    _makeSVGStatChart('storingStatChart', strPct, '#ec4899');
    const strBar  = document.querySelector('#storingStatCard .stat-bar-fill');
    const strFoot = document.querySelector('#storingStatCard .stat-foot-val');
    if(strBar) setTimeout(()=>strBar.style.width=Math.min(strPct,100)+'%',300);
    if(strFoot) strFoot.textContent=strPct+'%';
    window._storingData = data;
    renderDashStoringChart();
    if (window._lastInTotal !== undefined) updateInventoryStatusDonut(window._lastInTotal, window._lastInSelesai, window._lastOutTotal, window._lastOutSelesai);
  } catch(e) { console.warn('Storing stat card error:', e); }
}

async function fetchStoringToday() {
  if (window._storingData && window._storingData.ok) {
    renderStoringPanel(window._storingData);
    return;
  }
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getStoringToday');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Gagal');
    window._storingData = data;
    renderStoringPanel(data);
  } catch(e) {
    console.warn('Storing error:', e);
    const tb = document.getElementById('storingTableBody');
    if (tb) tb.innerHTML = `<tr><td colspan="16" style="text-align:center;padding:20px;color:var(--red)">Gagal: ${e.message}</td></tr>`;
  }
}

function renderStoringPanel(data) {
  storingLoaded = true;
  const s = data.summary;
  const isDark = document.body.classList.contains('dark');

  document.getElementById('storingSubtitle').textContent = `Total: ${s.total} LC/PO | Release: ${s.sumRelease.toLocaleString()} Case`;
  document.getElementById('storingFooter').textContent = s.total + ' LC/PO terdaftar';

  const makeSVG = (elId, pct, color) => {
    const el = document.getElementById(elId); if(!el) return;
    const r=26,cx=32,cy=32,circ=2*Math.PI*r;
    const dash=Math.min(pct,100)/100*circ;
    const bg=isDark?'#334155':'#e2e8f0';
    el.innerHTML=`<svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${bg}" stroke-width="7"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="7"
        stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
        stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
    </svg>`;
  };

  const p1 = s.pctPickingOverall;
  const p2 = s.pctStagedOverall;
  const p3 = s.avgKapasitas;

  renderStoringTable(data.data);
  renderStoringBatchCards(data.data);

  // Beam kilat pink otomatis loop seperti Inbound panel
  setTimeout(()=>{
    const speeds = ['3s','3.5s','4s'];
    document.querySelectorAll('#storingDetailPanel [style*="overflow:hidden;box-shadow"]').forEach((card,i)=>{
      if(card.querySelector('.store-beam')) return;
      const b=document.createElement('div');
      b.className='store-beam';
      b.style.cssText=`position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(236,72,153,0.18),transparent);transform:skewX(-15deg);pointer-events:none;z-index:10;animation:kpiBodyBeam ${speeds[i]||'3.5s'} ease-in-out infinite;`;
      card.style.position='relative';
      card.style.overflow='hidden';
      card.appendChild(b);
    });
  },300);
}

function renderStoringBatchCards(rows) {
  const grid = document.getElementById('storingBatchGrid');
  if (!grid || !rows || !rows.length) return;

  // Group by batch
  const batches = {};
  rows.forEach(r => {
    const b = String(r.batch||'').trim() || '?';
    if (!batches[b]) batches[b] = { noLc:new Set(), releaseCase:0, pickedCase:0, stagedCase:0, sisaCase:0 };
    batches[b].noLc.add(r.noLc);
    batches[b].releaseCase += parseFloat(r.releaseCase)||0;
    batches[b].pickedCase  += parseFloat(r.pickedCase)||0;
    batches[b].stagedCase  += parseFloat(r.stagedCase)||0;
    batches[b].sisaCase    += parseFloat(r.sisaCase)||0;
  });

  const batchList = Object.entries(batches).sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true}));
  const count = batchList.length;

  // Adjust grid columns dynamically
  grid.style.gridTemplateColumns = `repeat(${Math.min(count,4)},1fr)`;

  const colors = [
    { tint:'#ede9fe', border:'rgba(99,102,241,0.25)', accent:'#4f46e5', stripe:'#6366f1' },
    { tint:'#d1fae5', border:'rgba(16,185,129,0.25)', accent:'#059669', stripe:'#10b981' },
    { tint:'#fef3c7', border:'rgba(245,158,11,0.25)', accent:'#d97706', stripe:'#f59e0b' },
    { tint:'#f3e8ff', border:'rgba(139,92,246,0.25)', accent:'#7c3aed', stripe:'#8b5cf6' },
  ];

  grid.innerHTML = batchList.map(([batchNum, d], i) => {
    const col = colors[i % colors.length];
    const pickPct = d.releaseCase>0 ? Math.round(d.pickedCase/d.releaseCase*100) : 0;
    const stagePct = d.releaseCase>0 ? Math.round(d.stagedCase/d.releaseCase*100) : 0;
    const lcCount = d.noLc.size;
    const num = n => Math.round(n).toLocaleString('id-ID');

    return `<div style="background:linear-gradient(160deg,#fff 55%,${col.tint} 100%);border:1px solid #e2e8f0;box-shadow:0 1px 6px rgba(0,0,0,0.06);position:relative;overflow:hidden;">
      <div style="height:3px;background:${col.stripe};position:relative;overflow:hidden;"><div style="position:absolute;top:0;left:-80%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent);animation:cardBeam ${3+i*0.4}s ease-in-out infinite;"></div></div>
      <div style="padding:12px 14px 0;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:28px;height:28px;background:${col.accent};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#fff;">${batchNum}</div>
            <div>
              <div style="font-size:12px;font-weight:900;color:#1e293b;">Batch ${batchNum}</div>
              <div style="font-size:9px;color:#94a3b8;">${lcCount} LC · Semua · CID</div>
            </div>
          </div>
          <div style="font-size:11px;font-weight:800;color:${col.accent};">${pickPct}%</div>
        </div>
        <!-- Mini KPI boxes -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;">
          <div style="background:#fff;border:1px solid rgba(245,158,11,0.3);padding:4px 7px;">
            <div style="font-size:7.5px;font-weight:700;color:#d97706;text-transform:uppercase;">RELEASE</div>
            <div style="font-size:14px;font-weight:900;color:#d97706;line-height:1.2;">${num(d.releaseCase)}</div>
          </div>
          <div style="background:#fff;border:1px solid rgba(16,185,129,0.3);padding:4px 7px;">
            <div style="font-size:7.5px;font-weight:700;color:#059669;text-transform:uppercase;">PICKED</div>
            <div style="font-size:14px;font-weight:900;color:#059669;line-height:1.2;">${num(d.pickedCase)}</div>
          </div>
          <div style="background:#fff;border:1px solid rgba(236,72,153,0.3);padding:4px 7px;">
            <div style="font-size:7.5px;font-weight:700;color:#db2777;text-transform:uppercase;">STAGED</div>
            <div style="font-size:14px;font-weight:900;color:#db2777;line-height:1.2;">${num(d.stagedCase)}</div>
          </div>
          <div style="background:#fff;border:1px solid rgba(239,68,68,0.3);padding:4px 7px;">
            <div style="font-size:7.5px;font-weight:700;color:#dc2626;text-transform:uppercase;">SISA</div>
            <div style="font-size:14px;font-weight:900;color:#dc2626;line-height:1.2;">${num(d.sisaCase)}</div>
          </div>
        </div>
        <!-- Pick Rate bar -->
        <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#64748b;margin-bottom:3px;">
          <span>Pick Rate</span><span style="color:${col.accent};">${pickPct}%</span>
        </div>
        <div style="height:4px;background:rgba(0,0,0,0.06);margin-bottom:6px;"><div style="height:100%;background:${col.accent};width:${pickPct}%;transition:width 1s;"></div></div>
        <!-- Stage Rate bar -->
        <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#64748b;margin-bottom:3px;">
          <span>Stage Rate</span><span style="color:#ec4899;">${stagePct}%</span>
        </div>
        <div style="height:4px;background:rgba(0,0,0,0.06);margin-bottom:12px;"><div style="height:100%;background:#ec4899;width:${stagePct}%;transition:width 1s;"></div></div>
      </div>
    </div>`;
  }).join('');
}

function renderStoringTable(rows) {
  const tbody = document.getElementById('storingTableBody');
  if (!tbody) return;
  if (!rows || !rows.length) {
    tbody.innerHTML = '<tr><td colspan="20" style="text-align:center;padding:20px;color:var(--text-3)">Tidak ada data</td></tr>';
    return;
  }

  const batchStyle = (batch) => {
    const b = parseInt(batch) || 0;
    switch(b) {
      case 2: return { bg:'rgba(234,179,8,0.22)',  border:'4px solid rgba(234,179,8,1)' };
      case 3: return { bg:'rgba(34,197,94,0.20)',  border:'4px solid rgba(34,197,94,1)' };
      case 4: return { bg:'rgba(59,130,246,0.20)', border:'4px solid rgba(59,130,246,1)' };
      default:return { bg:'',                       border:'' };
    }
  };

  const isDarkS=document.body.classList.contains('dark');
  const txS=isDarkS?'#f0f4ff':'#0a0f1e';
  const ct = `text-align:center;font-size:11px;font-weight:600;color:${txS};`;
  const cn = `text-align:center;font-size:11px;font-family:"JetBrains Mono",monospace;font-weight:600;color:${txS};`;
  const num = (v) => (v!==undefined&&v!==null&&!isNaN(Number(v))&&v!=='') ? Number(v).toLocaleString() : '—';
  const dec = (v) => (v!==undefined&&v!==null&&!isNaN(Number(v))&&v!=='') ? Number(v).toFixed(2) : '—';

  const pBar = (pct) => {
    const n = parseInt(pct) || 0;
    const col = n>=80?'#15803d':n>=50?'#b45309':'#b91c1c';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:52px;height:6px;background:rgba(0,0,0,0.12);border-radius:3px;">
        <div style="width:${Math.min(n,100)}%;height:100%;background:${col};border-radius:3px;"></div>
      </div>
      <span style="font-size:10px;font-weight:900;color:${col}">${pct||'0%'}</span>
    </div>`;
  };

  tbody.innerHTML = rows.map((r,i) => {
    const bs = batchStyle(r.batch);
    const trStyle = `background:${bs.bg};${bs.border?'border-left:'+bs.border:''}`;
    return `<tr style="${trStyle}">
    <td style="${ct}">${i+1}</td>
    <td style="font-weight:800;font-size:11px;font-family:'JetBrains Mono',monospace;text-align:center;color:${txS}">${escHtml(r.noLc)}</td>
    <td style="${ct}font-weight:900;font-size:12px">${escHtml(r.batch)}</td>
    <td style="font-size:11px;font-weight:600;color:${txS};max-width:150px;text-align:center">${escHtml(r.tujuan)}</td>
    <td style="${ct}">${escHtml(r.tipeArmada)}</td>
    <td style="${cn}">${num(r.kapasitas)}</td>
    <td style="${cn}background:rgba(37,99,235,0.10)">${num(r.releaseCase)}</td>
    <td style="${cn}background:rgba(37,99,235,0.10)">${dec(r.releaseCbm)}</td>
    <td style="${cn}background:rgba(139,92,246,0.10)">${dec(r.astorCbm)}</td>
    <td style="${cn}background:rgba(22,163,74,0.10)">${num(r.pickedCase)}</td>
    <td style="${cn}background:rgba(22,163,74,0.10)">${dec(r.pickedCbm)}</td>
    <td style="${cn}background:rgba(239,68,68,0.10);color:${r.sisaCase>0?'#b91c1c':'#15803d'};font-weight:900">${num(r.sisaCase)}</td>
    <td style="background:rgba(16,185,129,0.10);${ct}">${pBar(r.pctPicking)}</td>
    <td style="${cn}background:rgba(16,185,129,0.10)">${dec(r.pencPickCbm)}</td>
    <td style="${cn}background:rgba(245,158,11,0.10);color:${r.sisaPick99>0?'#b45309':'#15803d'};font-weight:900">${num(r.sisaPick99)}</td>
    <td style="${cn}background:rgba(99,102,241,0.10)">${num(r.stagedCase)}</td>
    <td style="${cn}background:rgba(99,102,241,0.10)">${dec(r.stagedCbm)}</td>
    <td style="${cn}background:rgba(59,130,246,0.10)">${num(r.pencDsCase)}</td>
    <td style="${cn}background:rgba(59,130,246,0.10)">${dec(r.pencDsCbm)}</td>
    <td style="background:rgba(234,179,8,0.10);${ct}">${pBar(r.pctKapasitas)}</td>
  </tr>`;
  }).join('');
}

// ══════════════════════════════════════
//  INBOUND DETAIL PANEL
// ══════════════════════════════════════
let inboundPanelOpen = false;
let inlineLoaded     = false;

function toggleInboundPanel() {
  inboundPanelOpen = !inboundPanelOpen;
  const panel       = document.getElementById('inboundDetailPanel');
  const midGrid     = document.querySelector('.mid-grid');
  const progressRow = document.querySelector('.progress-row');
  const bottomGrid  = document.querySelector('.bottom-grid');
  if (!panel) return;

  if (inboundPanelOpen) {
    if (storingPanelOpen)   { storingPanelOpen   = false; const sp=document.getElementById('storingDetailPanel');   if(sp) sp.style.display='none'; }
    if (outboundPanelOpen)  { outboundPanelOpen  = false; const op=document.getElementById('outboundDetailPanel');  if(op) op.style.display='none'; }
    if (inventoryPanelOpen) { inventoryPanelOpen = false; const ip=document.getElementById('inventoryDetailPanel'); if(ip) ip.style.display='none'; }
    if (plannerPanelOpen)   { plannerPanelOpen   = false; const pp=document.getElementById('plannerDetailPanel');   if(pp) pp.style.display='none'; }
    panel.style.display = 'block';
    if (midGrid)     midGrid.style.display     = 'none';
    if (progressRow) progressRow.style.display = 'none';
    if (bottomGrid)  bottomGrid.style.display  = 'none';
    renderPanelInboundTable(window._inboundRows || []);
    fetchInlineProses();
    setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'start'}),100);
  } else {
    panel.style.display = 'none';
    if (midGrid)     midGrid.style.display     = '';
    if (progressRow) progressRow.style.display = '';
    if (bottomGrid)  bottomGrid.style.display  = '';
  }
}

function switchPanelTab(tab) {
  const tblIn=document.getElementById('panelInboundTable'), tblInl=document.getElementById('panelInlineTable');
  const btnIn=document.getElementById('panelTabInbound'),   btnInl=document.getElementById('panelTabInline');
  if (tab==='inbound') {
    tblIn.style.display=''; tblInl.style.display='none';
    btnIn.style.color='var(--accent)'; btnIn.style.borderBottom='2px solid var(--accent)';
    btnInl.style.color='var(--text-3)'; btnInl.style.borderBottom='2px solid transparent';
  } else {
    tblIn.style.display='none'; tblInl.style.display='';
    btnIn.style.color='var(--text-3)'; btnIn.style.borderBottom='2px solid transparent';
    btnInl.style.color='var(--accent)'; btnInl.style.borderBottom='2px solid var(--accent)';
    if (!inlineLoaded) fetchInlineProses();
  }
}

function renderPanelInboundTable(rows) {
  const tbody=document.getElementById('panelInboundBody'); if(!tbody) return;
  if (!rows||!rows.length) { tbody.innerHTML='<tr><td colspan="10" style="text-align:center;padding:20px;color:var(--text-3)">Tidak ada data inbound hari ini</td></tr>'; return; }
  const getWt=(s)=>{const m=s&&s.match(/WT\s*(\d+)/i);return m?parseInt(m[1]):999;};
  const wtBg=(s,i)=>{const wt=getWt(s);if(wt===1)return i%2===0?'#f0f9ff':'#e0f2fe';if(wt===2)return i%2===0?'#f5f3ff':'#ede9fe';if(wt===3)return i%2===0?'#fdf4ff':'#fae8ff';return i%2===0?'#f8fafc':'#fff';};
  const wtLeft=(s)=>{const wt=getWt(s);if(wt===1)return 'border-left:3px solid #2563eb';if(wt===2)return 'border-left:3px solid #8b5cf6';if(wt===3)return 'border-left:3px solid #ec4899';return 'border-left:3px solid #e2e8f0';};
  const sorted=[...rows].sort((a,b)=>getWt(a.stuffing)-getWt(b.stuffing));
  tbody.innerHTML=sorted.map((r,i)=>`<tr style="background:${wtBg(r.stuffing,i)};${wtLeft(r.stuffing)};border-bottom:1px solid rgba(200,215,240,0.3);">
    <td style="text-align:center;font-size:11px;color:#94a3b8;padding:9px 8px;">${i+1}</td>
    <td style="font-weight:800;font-size:12px;color:#1e293b;padding:9px 10px;">${escHtml(r.noLc)}</td>
    <td style="font-size:11.5px;color:#475569;padding:9px 10px;">${escHtml(r.noPolisi)}</td>
    <td style="font-size:11.5px;color:#475569;padding:9px 10px;">${escHtml(r.ekspedisi)}</td>
    <td style="font-size:11px;font-weight:600;color:#64748b;padding:9px 10px;text-align:center;">${escHtml(r.type)}</td>
    <td style="font-size:11px;font-weight:700;color:#64748b;padding:9px 10px;text-align:center;">${escHtml(r.bu)}</td>
    <td style="font-size:12px;font-weight:800;color:${r.checkIn?'#16a34a':'#94a3b8'};padding:9px 10px;text-align:center;">${r.checkIn||'—'}</td>
    <td style="font-size:11.5px;font-weight:700;color:#1e293b;padding:9px 10px;text-align:center;">${r.stuffing||'—'}</td>
    <td style="padding:7px 10px;text-align:center;">${
      r.updateUnload
        ? String(r.updateUnload).toUpperCase()==='FINISH'
          ? '<span class="badge badge-green">✅ FINISH</span>'
          : String(r.updateUnload).toUpperCase()==='PROSES'
          ? '<span class="badge badge-blue">⏳ PROSES</span>'
          : String(r.updateUnload).toUpperCase()==='ANTRI'
          ? '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;background:rgba(234,179,8,0.15);color:#92400e;border:1px solid rgba(234,179,8,0.3)">🕐 ANTRI</span>'
          : `<span style="font-size:11px;font-weight:700;padding:3px 10px;background:#f1f5f9;color:#475569;">${escHtml(r.updateUnload)}</span>`
        : '<span style="color:#94a3b8;font-size:12px">—</span>'
    }</td>
    <td style="padding:7px 10px;text-align:center;">${r.hitMiss&&r.hitMiss.toString().toUpperCase().includes('HIT')?'<span class="badge badge-green">🎯 HIT</span>':r.hitMiss&&r.hitMiss.toString().toUpperCase().includes('MISS')?'<span class="badge badge-red">⚠️ MISS</span>':'<span style="color:#94a3b8;font-size:12px">—</span>'}</td>
  </tr>`).join('');
}

async function fetchInlineProses() {
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getInlineProses');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error||'Gagal');
    inlineLoaded = true;
    const tgl=document.getElementById('inlineTanggal'); if(tgl) tgl.textContent='📅 Tanggal Unload: '+data.tanggalUnload;
    const footer=document.getElementById('panelFooter'); if(footer) footer.textContent=data.total+' LC/PO terdaftar hari ini';
    const s=data.summary, isDark=document.body.classList.contains('dark'), border=isDark?'#161b22':'#ffffff';

    // SVG donut - lebih reliable dari Chart.js canvas
    const makeSVGDonut=(elId,pct,color)=>{
      const el=document.getElementById(elId); if(!el) return;
      const r=26,cx=32,cy=32,circ=2*Math.PI*r;
      const dash=Math.min(pct,100)/100*circ;
      const bg=isDark?'#334155':'#e2e8f0';
      el.innerHTML=`<svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${bg}" stroke-width="7"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="7"
          stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
      </svg>`;
    };

    const inboundRows=window._inboundRows||[];
    const putawayRows=data.data||[]; // data dari GAS inline proses - punya aktQty, putInQty dll
    const finishArmada=inboundRows.filter(r=>r&&r.updateUnload&&['DONE','FINISH'].includes(String(r.updateUnload).toUpperCase())).length;
    const prosesArmada=inboundRows.filter(r=>r&&r.updateUnload&&String(r.updateUnload).toUpperCase()==='PROSES').length;
    const antriArmada =inboundRows.filter(r=>r&&r.updateUnload&&String(r.updateUnload).toUpperCase()==='ANTRI').length;
    const belumArmada =inboundRows.filter(r=>r&&(!r.updateUnload||String(r.updateUnload).trim()==='')).length;
    const totalArmada =inboundRows.length||0;
    const pctUnload=totalArmada>0?Math.round((finishArmada/totalArmada)*100):(s&&s.pctUnloading||0);
    document.getElementById('pctUnloading').textContent='';
    document.getElementById('infoUnloading') && (document.getElementById('infoUnloading').textContent='');
    // Mini boxes
    const mf=document.getElementById('inbMiniFinish'); if(mf) mf.textContent=finishArmada;
    const mp=document.getElementById('inbMiniProses'); if(mp) mp.textContent=prosesArmada;
    const ma=document.getElementById('inbMiniAntri');  if(ma) ma.textContent=antriArmada;
    const mb=document.getElementById('inbMiniBelum');  if(mb) mb.textContent=belumArmada;
    // Pie chart dengan % di dalam
    const unEl=document.getElementById('chartUnloading');
    if(unEl){
      const r=26,cx=32,cy=32,circ=2*Math.PI*r;
      const dash=Math.min(pctUnload,100)/100*circ;
      unEl.innerHTML=`<svg width="72" height="72" viewBox="0 0 64 64">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="7"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#16a34a" stroke-width="7"
          stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
        <text x="${cx}" y="${cy-4}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="900" fill="#16a34a">${pctUnload}%</text>
        <text x="${cx}" y="${cy+9}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-weight="600" fill="#94a3b8">Selesai</text>
      </svg>`;
    }
    const fu=document.getElementById('pctUnloadingFoot'); if(fu) fu.textContent=pctUnload+'%';
    const bu=document.getElementById('barUnloading'); if(bu) setTimeout(()=>bu.style.width=pctUnload+'%',300);

    // % Aktual Receive
    const pctAkt=(s&&s.avgPctAkt)||0;
    document.getElementById('pctAktualRcv') && (document.getElementById('pctAktualRcv').textContent='');
    // mini boxes aktual
    const sumAktQty=putawayRows.reduce((a,r)=>a+(parseFloat(r.aktQty)||0),0);
    const sumAktLpn=putawayRows.reduce((a,r)=>a+(parseFloat(r.aktLpn)||0),0);
    const aqb=document.getElementById('aktQtyBox'); if(aqb) aqb.textContent=sumAktQty.toLocaleString('id-ID');
    const alb=document.getElementById('aktLpnBox'); if(alb) alb.textContent=sumAktLpn.toLocaleString('id-ID');
    // chart aktual
    const aktEl=document.getElementById('chartAktualRcv');
    if(aktEl){const r2=26,cx2=32,cy2=32,c2=2*Math.PI*r2,d2=Math.min(pctAkt,100)/100*c2;aktEl.innerHTML=`<svg width="72" height="72" viewBox="0 0 64 64"><circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="none" stroke="#e2e8f0" stroke-width="7"/><circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="none" stroke="#059669" stroke-width="7" stroke-dasharray="${d2.toFixed(2)} ${c2.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${cx2} ${cy2})"/><text x="${cx2}" y="${cy2-4}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="900" fill="#059669">${pctAkt}%</text><text x="${cx2}" y="${cy2+9}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-weight="600" fill="#94a3b8">Selesai</text></svg>`;}
    const ba=document.getElementById('barAktualRcv'); if(ba) setTimeout(()=>ba.style.width=pctAkt+'%',300);
    const fa=document.getElementById('pctAktualRcvFoot'); if(fa) fa.textContent=pctAkt+'%';

    // % Putaway Inbound = LPN Putaway IN / LPN Aktual Receive
    const sumLpnAkt = putawayRows.reduce((acc,r)=>acc+(parseFloat(r.aktLpn)||0),0);
    const sumLpnPutIn = putawayRows.reduce((acc,r)=>acc+(parseFloat(r.putInLpn)||0),0);
    const sumQtyPutIn = putawayRows.reduce((acc,r)=>acc+(parseFloat(r.putInQty)||0),0);
    const sumSisaPutIn = putawayRows.reduce((acc,r)=>acc+(parseFloat(r.sisaInLpn)||0),0);
    const pctPutIn = sumLpnAkt>0 ? Math.round(sumLpnPutIn/sumLpnAkt*100) : (s&&s.avgPctPutIn2)||0;
    document.getElementById('pctPutawayIn') && (document.getElementById('pctPutawayIn').textContent='');
    // mini boxes putIn
    const piqb=document.getElementById('putInQtyBox'); if(piqb) piqb.textContent=sumQtyPutIn.toLocaleString('id-ID');
    const pilb=document.getElementById('putInLpnBox'); if(pilb) pilb.textContent=sumLpnPutIn.toLocaleString('id-ID');
    const pisb=document.getElementById('putInSisaBox'); if(pisb) pisb.textContent=sumSisaPutIn.toLocaleString('id-ID');
    // chart putIn
    const piEl=document.getElementById('chartPutawayIn');
    if(piEl){const r3=26,cx3=32,cy3=32,c3=2*Math.PI*r3,d3=Math.min(pctPutIn,100)/100*c3;piEl.innerHTML=`<svg width="72" height="72" viewBox="0 0 64 64"><circle cx="${cx3}" cy="${cy3}" r="${r3}" fill="none" stroke="#e2e8f0" stroke-width="7"/><circle cx="${cx3}" cy="${cy3}" r="${r3}" fill="none" stroke="#7c3aed" stroke-width="7" stroke-dasharray="${d3.toFixed(2)} ${c3.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${cx3} ${cy3})"/><text x="${cx3}" y="${cy3-4}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="900" fill="#7c3aed">${pctPutIn}%</text><text x="${cx3}" y="${cy3+9}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-weight="600" fill="#94a3b8">Selesai</text></svg>`;}
    const bpi=document.getElementById('barPutawayIn'); if(bpi) setTimeout(()=>bpi.style.width=Math.min(pctPutIn,100)+'%',300);
    const fpi=document.getElementById('pctPutawayInFoot'); if(fpi) fpi.textContent=pctPutIn+'%';

    // % Putaway Storing = LPN Putaway STR / LPN Putaway IN
    const sumLpnPutStr = putawayRows.reduce((acc,r)=>acc+(parseFloat(r.putStrLpn)||0),0);
    const sumQtyPutStr = putawayRows.reduce((acc,r)=>acc+(parseFloat(r.putStrQty)||0),0);
    const sumSisaPutStr = putawayRows.reduce((acc,r)=>acc+(parseFloat(r.sisaStrLpn)||0),0);
    const pctPutStr = sumLpnPutIn>0 ? Math.round(sumLpnPutStr/sumLpnPutIn*100) : (s&&s.avgPctPutStr)||0;
    document.getElementById('pctPutawayStr') && (document.getElementById('pctPutawayStr').textContent='');
    // mini boxes putStr
    const psqb=document.getElementById('putStrQtyBox'); if(psqb) psqb.textContent=sumQtyPutStr.toLocaleString('id-ID');
    const pslb=document.getElementById('putStrLpnBox'); if(pslb) pslb.textContent=sumLpnPutStr.toLocaleString('id-ID');
    const pssb=document.getElementById('putStrSisaBox'); if(pssb) pssb.textContent=sumSisaPutStr.toLocaleString('id-ID');
    // chart putStr
    const psEl=document.getElementById('chartPutawayStr');
    if(psEl){const r4=26,cx4=32,cy4=32,c4=2*Math.PI*r4,d4=Math.min(pctPutStr,100)/100*c4;psEl.innerHTML=`<svg width="72" height="72" viewBox="0 0 64 64"><circle cx="${cx4}" cy="${cy4}" r="${r4}" fill="none" stroke="#e2e8f0" stroke-width="7"/><circle cx="${cx4}" cy="${cy4}" r="${r4}" fill="none" stroke="#d97706" stroke-width="7" stroke-dasharray="${d4.toFixed(2)} ${c4.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${cx4} ${cy4})"/><text x="${cx4}" y="${cy4-4}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="900" fill="#d97706">${pctPutStr}%</text><text x="${cx4}" y="${cy4+9}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-weight="600" fill="#94a3b8">Selesai</text></svg>`;}
    const bps=document.getElementById('barPutawayStr'); if(bps) setTimeout(()=>bps.style.width=Math.min(pctPutStr,100)+'%',300);
    const fps=document.getElementById('pctPutawayStrFoot'); if(fps) fps.textContent=pctPutStr+'%';

    renderPanelInlineTable(data.data);
  } catch(e) {
    console.warn('Inline proses error:',e);
    const tbody=document.getElementById('panelInlineBody');
    if(tbody) tbody.innerHTML=`<tr><td colspan="36" style="text-align:center;padding:20px;color:var(--red)">Gagal: ${e.message}</td></tr>`;
  }
}

function renderPanelInlineTable(rows) {
  const tbody=document.getElementById('panelInlineBody'); if(!tbody) return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="36" style="text-align:center;padding:20px;color:var(--text-3)">Tidak ada data</td></tr>';return;}
  const isDarkI=document.body.classList.contains('dark');
  const txI=isDarkI?'#f0f4ff':'#0a0f1e';
  const c=`text-align:center;font-size:11px;font-weight:600;color:${txI};`;
  const cn=`text-align:center;font-size:11px;font-family:"JetBrains Mono",monospace;font-weight:600;color:${txI};`;
  const pBar=(pct)=>{const n=parseInt(pct)||0;const col=n>=100?'#15803d':n>=90?'#1d4ed8':n>=70?'#b45309':'#b91c1c';return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:52px;height:5px;background:rgba(0,0,0,0.12);border-radius:3px;"><div style="width:${Math.min(n,100)}%;height:100%;background:${col};border-radius:3px;"></div></div><span style="font-size:10px;font-weight:900;color:${col}">${pct||'—'}</span></div>`;};
  const statusBadge=(s)=>{const col=s==='OUT'?'#15803d':'#b45309',bg=s==='OUT'?'rgba(21,128,61,0.15)':'rgba(180,83,9,0.15)';return `<span style="display:inline-block;padding:2px 8px;border-radius:12px;background:${bg};color:${col};font-weight:900;font-size:10px;border:1px solid ${col}66">${escHtml(s)||'—'}</span>`;};
  const num=(v)=>(v!==undefined&&v!==null&&v!=='')&&!isNaN(Number(v))?Number(v).toLocaleString():'—';
  const sisa=(v)=>{const n=Number(v)||0;return `<span style="font-weight:900;color:${n>0?'#b45309':'#15803d'}">${n}</span>`;};
  tbody.innerHTML=rows.map((r,i)=>`<tr>
    <td style="${c}">${i+1}</td>
    <td style="font-weight:900;font-size:11px;font-family:'JetBrains Mono',monospace;text-align:center;color:${txI}">${escHtml(r.noLc)}</td>
    <td style="${c}">${escHtml(r.type)}</td><td style="${cn}">${escHtml(r.nopol)}</td>
    <td style="${c}">${escHtml(r.batch)}</td>
    <td style="${cn}font-size:10px">${r.tglIn||'—'}</td><td style="${cn}font-size:10px">${r.tglOpen||'—'}</td><td style="${cn}font-size:10px">${r.tglClose||'—'}</td>
    <td style="${c}">${statusBadge(r.status)}</td>
    <td style="${cn}background:rgba(8,145,178,0.10)">${num(r.planQty)}</td><td style="${cn}background:rgba(8,145,178,0.10)">${r.planCbm||'—'}</td><td style="${cn}background:rgba(8,145,178,0.10)">${num(r.planEstLpn)}</td>
    <td style="${cn}background:rgba(22,163,74,0.10)">${num(r.aktQty)}</td><td style="${cn}background:rgba(22,163,74,0.10)">${num(r.aktLpn)}</td>
    <td style="background:rgba(22,163,74,0.10);${c}" colspan="2">${pBar(r.pctAkt)}</td>
    <td style="${cn}background:rgba(139,92,246,0.10)">${num(r.ftQty)}</td><td style="${cn}background:rgba(139,92,246,0.10)">${num(r.ftLpn)}</td>
    <td style="${cn}background:rgba(37,99,235,0.10)">${num(r.putInQty)}</td><td style="${cn}background:rgba(37,99,235,0.10)">${num(r.putInLpn)}</td>
    <td style="${cn}background:rgba(37,99,235,0.10)">${sisa(r.sisaInLpn)}</td>
    <td style="background:rgba(37,99,235,0.10);${c}" colspan="2">${pBar(r.putInPct)}</td>
    <td style="${cn}background:rgba(234,179,8,0.10)">${num(r.sh1InQty)}</td><td style="${cn}background:rgba(234,179,8,0.10)">${num(r.sh1InLpn)}</td>
    <td style="${cn}background:rgba(59,130,246,0.10)">${num(r.sh2InQty)}</td><td style="${cn}background:rgba(59,130,246,0.10)">${num(r.sh2InLpn)}</td>
    <td style="${cn}background:rgba(22,163,74,0.10)">${num(r.putStrQty)}</td><td style="${cn}background:rgba(22,163,74,0.10)">${num(r.putStrLpn)}</td>
    <td style="${cn}background:rgba(22,163,74,0.10)">${sisa(r.sisaStrLpn)}</td>
    <td style="background:rgba(22,163,74,0.10);${c}" colspan="2">${pBar(r.putStrPct)}</td>
    <td style="${cn}background:rgba(234,179,8,0.10)">${num(r.sh1StrQty)}</td><td style="${cn}background:rgba(234,179,8,0.10)">${num(r.sh1StrLpn)}</td>
    <td style="${cn}background:rgba(59,130,246,0.10)">${num(r.sh2StrQty)}</td><td style="${cn}background:rgba(59,130,246,0.10)">${num(r.sh2StrLpn)}</td>
  </tr>`).join('');
}

// ══════════════════════════════════════
//  TAB SWITCH (bottom table)
// ══════════════════════════════════════
let currentDashTab = 'inbound';
let outboundDetailLoaded = false;

function switchDashTab(tab) {
  currentDashTab = tab;
  const inWrap  = document.getElementById('tableInboundWrap');
  const stWrap  = document.getElementById('tableStoringWrap');
  const outWrap = document.getElementById('tableOutboundWrap');
  const btnIn   = document.getElementById('tabBtnInbound');
  const btnSt   = document.getElementById('tabBtnStoring');
  const btnOut  = document.getElementById('tabBtnOutbound');
  const cnt     = document.getElementById('dashTableCount');

  [inWrap,stWrap,outWrap].forEach(w=>{ if(w) w.style.display='none'; });
  [btnIn,btnSt,btnOut].forEach(b=>{ if(b){ b.style.color='var(--text-3)'; b.style.borderBottom='2px solid transparent'; }});

  if (tab === 'inbound') {
    if(inWrap)  inWrap.style.display  = '';
    if(btnIn) { btnIn.style.color='var(--accent)'; btnIn.style.borderBottom='2px solid var(--accent)'; }
    if(cnt) cnt.textContent = (window._inboundRows||[]).length + ' data inbound hari ini';
  } else if (tab === 'storing') {
    if(stWrap)  stWrap.style.display  = '';
    if(btnSt) { btnSt.style.color='#8b5cf6'; btnSt.style.borderBottom='2px solid #8b5cf6'; }
    if (window._storingData && window._storingData.data) {
      renderDashStoringBody(window._storingData.data);
      if(cnt) cnt.textContent = window._storingData.total + ' data storing hari ini';
    } else {
      fetchStoringStatCard().then(()=>{
        if(window._storingData) { renderDashStoringBody(window._storingData.data); if(cnt) cnt.textContent=window._storingData.total+' data storing hari ini'; }
      });
    }
  } else {
    if(outWrap) outWrap.style.display = '';
    if(btnOut){ btnOut.style.color='var(--accent)'; btnOut.style.borderBottom='2px solid var(--accent)'; }
    if(!outboundDetailLoaded) fetchOutboundDetail();
  }
}

function renderDashStoringBody(rows) {
  const tbody = document.getElementById('dashStoringBody'); if(!tbody) return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="20" style="text-align:center;padding:20px;color:var(--text-3)">Tidak ada data storing hari ini</td></tr>';return;}
  const c  = 'text-align:center;font-size:11px;color:var(--text-2);';
  const cn = 'text-align:center;font-size:11px;font-family:"JetBrains Mono",monospace;color:var(--text-2);';
  const num = (v) => (!isNaN(Number(v))&&v!=='') ? Number(v).toLocaleString() : '—';
  const dec = (v) => (!isNaN(Number(v))&&v!=='') ? Number(v).toFixed(2) : '—';
  const pBar = (pct) => {
    const n=parseInt(pct)||0, col=n>=80?'#16a34a':n>=50?'#f59e0b':'#ef4444';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:44px;height:4px;background:rgba(148,163,184,0.2);border-radius:3px;"><div style="width:${Math.min(n,100)}%;height:100%;background:${col};border-radius:3px;"></div></div><span style="font-size:10px;font-weight:800;color:${col}">${pct||'0%'}</span></div>`;
  };
  tbody.innerHTML = rows.map((r,i)=>`<tr>
    <td style="${c}">${i+1}</td>
    <td style="font-weight:700;font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--text)">${escHtml(r.noLc)}</td>
    <td style="${c}">${escHtml(r.batch)}</td>
    <td style="font-size:11px;color:var(--text-2);max-width:130px">${escHtml(r.tujuan)}</td>
    <td style="${c}">${escHtml(r.tipeArmada)}</td>
    <td style="${cn}">${num(r.kapasitas)}</td>
    <td style="${cn}background:rgba(37,99,235,0.05)">${num(r.releaseCase)}</td>
    <td style="${cn}background:rgba(37,99,235,0.05)">${dec(r.releaseCbm)}</td>
    <td style="${cn}background:rgba(139,92,246,0.05)">${dec(r.astorCbm)}</td>
    <td style="${cn}background:rgba(22,163,74,0.05)">${num(r.pickedCase)}</td>
    <td style="${cn}background:rgba(22,163,74,0.05)">${dec(r.pickedCbm)}</td>
    <td style="${cn}background:rgba(239,68,68,0.05);color:${r.sisaCase>0?'#ef4444':'#16a34a'};font-weight:800">${num(r.sisaCase)}</td>
    <td style="background:rgba(16,185,129,0.05);${c}">${pBar(r.pctPicking)}</td>
    <td style="${cn}background:rgba(16,185,129,0.05)">${dec(r.pencPickCbm)}</td>
    <td style="${cn}background:rgba(245,158,11,0.05);color:${r.sisaPick99>0?'#f59e0b':'#16a34a'};font-weight:800">${num(r.sisaPick99)}</td>
    <td style="${cn}background:rgba(99,102,241,0.05)">${num(r.stagedCase)}</td>
    <td style="${cn}background:rgba(99,102,241,0.05)">${dec(r.stagedCbm)}</td>
    <td style="${cn}background:rgba(59,130,246,0.05)">${num(r.pencDsCase)}</td>
    <td style="${cn}background:rgba(59,130,246,0.05)">${dec(r.pencDsCbm)}</td>
    <td style="background:rgba(234,179,8,0.05);${c}">${pBar(r.pctKapasitas)}</td>
  </tr>`).join('');
}

async function fetchOutboundDetail() {
  const tbody=document.getElementById('dashOutboundBody'); if(!tbody) return;
  tbody.innerHTML='<tr><td colspan="13" style="text-align:center;padding:24px;color:var(--text-3)">Memuat data outbound...</td></tr>';
  try {
    const res=await fetch(GAS_DASHBOARD_URL+'?action=getOutboundDetail');
    const data=await res.json();
    if(!data.ok) throw new Error(data.error||'Gagal');
    outboundDetailLoaded=true; renderDashOutboundTable(data.data);
    const cnt=document.getElementById('dashTableCount'); if(cnt) cnt.textContent=data.total+' data outbound hari ini';
  } catch(e) { tbody.innerHTML=`<tr><td colspan="13" style="text-align:center;padding:24px;color:var(--red)">Gagal memuat: ${e.message}</td></tr>`; }
}

function renderDashOutboundTable(rows) {
  const tbody=document.getElementById('dashOutboundBody'); if(!tbody) return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="13" style="text-align:center;padding:24px;color:var(--text-3)">Tidak ada data outbound hari ini</td></tr>';return;}
  tbody.innerHTML=rows.map((r,i)=>`<tr>
    <td class="mono" style="font-size:12px">${i+1}</td>
    <td style="font-size:12px;font-weight:600">${escHtml(r.penyelesaian)}</td>
    <td class="mono" style="font-size:11px">${escHtml(r.transno)}</td>
    <td style="font-size:12px;text-align:center;color:${r.ppc==='100%'?'var(--green)':'var(--orange)'};font-weight:700">${r.ppc||'—'}</td>
    <td style="font-size:12px;text-align:center;color:${r.pstg==='100%'?'var(--green)':'var(--orange)'};font-weight:700">${r.pstg||'—'}</td>
    <td style="font-size:12px;text-align:center;color:${r.pld==='100%'?'var(--green)':'var(--orange)'};font-weight:700">${r.pld||'—'}</td>
    <td style="font-size:11px">${escHtml(r.shippingline)}</td>
    <td class="mono" style="font-size:12px">${escHtml(r.bu)}</td>
    <td style="font-size:11px">${escHtml(r.carrierId)}</td>
    <td style="font-size:12px;font-weight:600">${r.stuffingTime||'—'}</td>
    <td style="font-size:11px">${escHtml(r.jenisArmada)}</td>
    <td class="mono" style="font-size:11px">${escHtml(r.nopol)}</td>
    <td>${r.status.toUpperCase().includes('SELESAI')||r.status.toUpperCase().includes('KELUAR')?`<span class="badge badge-green">✅ ${escHtml(r.status)}</span>`:r.status.toUpperCase().includes('TERLAMBAT')?`<span class="badge badge-red">⚠️ ${escHtml(r.status)}</span>`:`<span class="badge badge-orange">⏳ ${escHtml(r.status)}</span>`}</td>
  </tr>`).join('');
}

// ══════════════════════════════════════
//  STAT CARDS + CHARTS
// ══════════════════════════════════════
let dashInboundChart=null, dashOutboundChart=null;

function renderDashInboundChart(total,selesai,proses,antri,belum,hit,miss) {
  const pct=total>0?Math.round((selesai/total)*100):0;
  document.getElementById('dashInboundPct').textContent=pct+'%';
  document.getElementById('inboundPctBadge').textContent=pct+'% Selesai';
  document.getElementById('piInSelesai').textContent=selesai+' truck';
  document.getElementById('piInProses').textContent=proses+' truck';
  const piAntri=document.getElementById('piInAntri'); if(piAntri) piAntri.textContent=antri+' truck';
  document.getElementById('piInBelum').textContent=belum+' truck';
  document.getElementById('piInHitMiss').textContent=hit+' HIT / '+miss+' MISS';
  const isDark=document.body.classList.contains('dark'), border=isDark?'#161b22':'#ffffff';
  if(dashInboundChart) dashInboundChart.destroy();
  dashInboundChart=new Chart(document.getElementById('dashInboundChart').getContext('2d'),{
    type:'doughnut',
    data:{labels:['Selesai Unloading','Proses','Antri','Belum Datang'],datasets:[{data:[selesai,proses,antri,belum],backgroundColor:['#16a34a','#2563eb','#f59e0b','#dc2626'],borderColor:border,borderWidth:3,hoverOffset:6}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{backgroundColor:isDark?'rgba(22,27,34,0.95)':'rgba(17,24,39,0.9)',titleColor:'#fff',bodyColor:'rgba(255,255,255,0.8)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,padding:10,cornerRadius:10,callbacks:{label:ctx=>` ${ctx.label}: ${ctx.raw} truck`}}}}
  });
}

function renderDashOutboundChart(total,selesai,proses,antri,belum,hit,miss) {
  proses=proses||0; antri=antri||0; belum=belum||0; hit=hit||0; miss=miss||0;
  const pct=total>0?Math.round((selesai/total)*100):0;
  document.getElementById('dashOutboundPct').textContent=pct+'%';
  document.getElementById('outboundPctBadge').textContent=pct+'% Selesai';
  document.getElementById('piOutSelesai').textContent=selesai+' armada';
  const elP=document.getElementById('piOutProses'),elA=document.getElementById('piOutAntri'),elHM=document.getElementById('piOutHitMiss');
  if(elP) elP.textContent=proses+' armada';
  if(elA) elA.textContent=antri+' armada';
  document.getElementById('piOutBelum').textContent=belum+' armada';
  if(elHM) elHM.textContent=hit+' HIT / '+miss+' MISS';
  const isDark=document.body.classList.contains('dark'), border=isDark?'#161b22':'#ffffff';
  if(dashOutboundChart) dashOutboundChart.destroy();
  dashOutboundChart=new Chart(document.getElementById('dashOutboundChart').getContext('2d'),{
    type:'doughnut',
    data:{labels:['Selesai','Proses','Antri','Belum Datang'],datasets:[{data:[selesai,proses,antri,belum],backgroundColor:['#16a34a','#2563eb','#f59e0b','#dc2626'],borderColor:border,borderWidth:3,hoverOffset:6}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{backgroundColor:isDark?'rgba(22,27,34,0.95)':'rgba(17,24,39,0.9)',titleColor:'#fff',bodyColor:'rgba(255,255,255,0.8)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,padding:10,cornerRadius:10,callbacks:{label:ctx=>` ${ctx.label}: ${ctx.raw} armada`}}}}
  });
}

function renderDashInboundTable(rows) {
  window._inboundRows=rows||[];
  const tbody=document.getElementById('dashInboundBody'), count=document.getElementById('dashTableCount');
  if(!tbody) return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--text-3)">Tidak ada data inbound hari ini</td></tr>';if(count&&currentDashTab==='inbound')count.textContent='0 data inbound hari ini';return;}
  const getWt=(s)=>{const m=s&&s.match(/WT\s*(\d+)/i);return m?parseInt(m[1]):999;};
  const wtBg=(s)=>{const wt=getWt(s);if(wt===2)return 'rgba(59,130,246,0.20)';if(wt===3)return 'rgba(139,92,246,0.20)';return '';};
  const wtBL=(s)=>{const wt=getWt(s);if(wt===2)return 'border-left:4px solid rgba(59,130,246,1)';if(wt===3)return 'border-left:4px solid rgba(139,92,246,1)';return '';};
  const wtCol=(s)=>{const wt=getWt(s);if(wt===2)return 'var(--text)';if(wt===3)return 'var(--text)';return 'var(--text-2)';};
  const sorted=[...rows].sort((a,b)=>getWt(a.stuffing)-getWt(b.stuffing));
  tbody.innerHTML=sorted.map((r,i)=>`<tr style="background:${wtBg(r.stuffing)};${wtBL(r.stuffing)}">
    <td class="mono" style="font-size:12px">${i+1}</td>
    <td style="font-weight:700;font-size:12px;font-family:'JetBrains Mono',monospace">${escHtml(r.noLc)}</td>
    <td class="mono" style="font-size:12px">${escHtml(r.noPolisi)}</td>
    <td style="font-size:12px">${escHtml(r.ekspedisi)}</td>
    <td style="font-size:12px">${escHtml(r.type)}</td>
    <td class="mono" style="font-size:12px">${escHtml(r.bu)}</td>
    <td style="font-size:12px;color:${r.checkIn?'var(--green)':'var(--text-3)'};font-weight:${r.checkIn?'700':'400'}">${r.checkIn||'—'}</td>
    <td style="font-size:11px;max-width:140px;white-space:normal;font-weight:700;color:${wtCol(r.stuffing)}">${r.stuffing||'—'}</td>
    <td>${r.hitMiss&&r.hitMiss.toString().toUpperCase().includes('HIT')?'<span class="badge badge-green">🎯 HIT</span>':r.hitMiss&&r.hitMiss.toString().toUpperCase().includes('MISS')?'<span class="badge badge-red">⚠️ MISS</span>':'<span style="color:var(--text-3);font-size:12px">—</span>'}</td>
  </tr>`).join('');
  if(count&&currentDashTab==='inbound') count.textContent=rows.length+' data inbound hari ini';
}

async function fetchDashboardStats() {
  let inboundTotal=0,inboundSelesai=0,inboundCheckedIn=0,inboundHit=0,inboundMiss=0;
  let outboundTotal=0,outboundSelesai=0;
  try {
    const resIn=await fetch(GAS_DASHBOARD_URL+'?action=getInbound');
    const dataIn=await resIn.json();
    if(dataIn.ok){
      const{total,checkedIn,selesai,proses,antri,belum,hit,miss}=dataIn.summary;
      inboundTotal=total; inboundSelesai=selesai; inboundCheckedIn=checkedIn; inboundHit=hit; inboundMiss=miss;
      const el=document.querySelector('#inboundStatCard .stat-value');
      if(el) el.textContent=total;
      // Mini boxes
      const sf=document.getElementById('inbStatFinish'); if(sf) sf.textContent=selesai;
      const sp=document.getElementById('inbStatProses'); if(sp) sp.textContent=proses;
      const sa=document.getElementById('inbStatAntri');  if(sa) sa.textContent=antri;
      const sb2=document.getElementById('inbStatBelum'); if(sb2) sb2.textContent=belum;
      // Pie chart
      const inPct = total>0 ? Math.round(selesai/total*100) : 0;
      _makeSVGStatChart('inboundStatChart', inPct, '#16a34a');
      const inBar = document.querySelector('#inboundStatCard .stat-bar-fill');
      const inFoot = document.querySelector('#inboundStatCard .stat-foot-val');
      if(inBar) setTimeout(()=>inBar.style.width=inPct+'%',300);
      if(inFoot) inFoot.textContent=inPct+'%';
      renderDashInboundChart(total,selesai,proses,antri,belum,hit,miss);
      renderDashInboundTable(dataIn.data);
    }
  } catch(e){console.warn('Inbound stats error:',e);}
  try {
    const resOut=await fetch(GAS_DASHBOARD_URL+'?action=getOutbound');
    const dataOut=await resOut.json();
    if(dataOut.ok){
      outboundTotal=dataOut.total; outboundSelesai=dataOut.selesai;
      const el=document.querySelector('#outboundStatCard .stat-value');
      if(el) el.textContent=dataOut.total;
      // Mini boxes
      const os=document.getElementById('outStatSelesai'); if(os) os.textContent=dataOut.selesai||0;
      const op=document.getElementById('outStatProses');  if(op) op.textContent=dataOut.proses||0;
      const oa=document.getElementById('outStatAntri');   if(oa) oa.textContent=dataOut.antri||0;
      const ob=document.getElementById('outStatBelum');   if(ob) ob.textContent=dataOut.belum||0;
      // Pie chart
      const outPct = dataOut.total>0 ? Math.round((dataOut.selesai/dataOut.total)*100) : 0;
      _makeSVGStatChart('outboundStatChart', outPct, '#d97706');
      const outBar = document.querySelector('#outboundStatCard .stat-bar-fill');
      const outFoot = document.querySelector('#outboundStatCard .stat-foot-val');
      if(outBar) setTimeout(()=>outBar.style.width=outPct+'%',300);
      if(outFoot) outFoot.textContent=outPct+'%';
      renderDashOutboundChart(dataOut.total,dataOut.selesai,dataOut.proses||0,dataOut.antri||0,dataOut.belum||0,dataOut.hit||0,dataOut.miss||0);
    }
  } catch(e){console.warn('Outbound stats error:',e);}
  updateInventoryStatusDonut(inboundTotal,inboundSelesai,outboundTotal,outboundSelesai);
  window._lastInTotal=inboundTotal; window._lastInSelesai=inboundSelesai;
  window._lastOutTotal=outboundTotal; window._lastOutSelesai=outboundSelesai;
  fetchInventoryValue();
  fetchStoringStatCard();

  // ✅ INVENTORY CONTROL — fetch akurasi dari sheet INVENTORY J26
  fetchInventoryAccuracy();
  // ✅ SLA PLANNER — fetch SLA GRW & SLA CUSTOMER
  fetchSLAPlanner();
}

// ══════════════════════════════════════
//  ✅ INVENTORY CONTROL ACCURACY
// ══════════════════════════════════════

async function fetchInventoryDetail() {
  const lorongBody = document.getElementById('invLorongBody');
  const areaBody   = document.getElementById('invAreaBody');
  if (lorongBody) lorongBody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--text-3)">Memuat data...</td></tr>';
  if (areaBody)   areaBody.innerHTML   = '<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--text-3)">Memuat data...</td></tr>';
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getInventoryDetail');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Gagal');
    inventoryDetailLoaded = true;
    renderInventoryPanel(data);
  } catch(e) {
    const lb = document.getElementById('invLorongBody');
    const ab = document.getElementById('invAreaBody');
    const sb = document.getElementById('invPanelSubtitle');
    if (lb) lb.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--red)">Gagal memuat: ${e.message}</td></tr>`;
    if (ab) ab.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--red)">Gagal</td></tr>`;
    if (sb) sb.textContent = 'Gagal memuat data';
    console.error('fetchInventoryDetail error:', e);
  }
}

function renderInventoryPanel(data) {
  const s    = data.summary;
  const rows = data.rows || [];

  const subtitle = document.getElementById('invPanelSubtitle');
  const footer   = document.getElementById('invPanelFooter');

  const totalLok = Number(s.totalLokasi).toLocaleString('id-ID');
  const totalCcN = Number(s.totalCc).toLocaleString('id-ID');
  if (subtitle) subtitle.textContent = `${data.bulan || ''} · Total ${totalLok} Lokasi · ${totalCcN} CC`;

  // Update stat card mini boxes dengan data lengkap
  const il2=document.getElementById('invStatLokasi'); if(il2) il2.textContent=totalLok;
  const ic2=document.getElementById('invStatCC');     if(ic2) ic2.textContent=totalCcN;
  const ih2=document.getElementById('invStatHit');    if(ih2) ih2.textContent=Number(s.totalHit||0).toLocaleString('id-ID');
  const im2=document.getElementById('invStatMiss');   if(im2) im2.textContent=Number(s.totalMiss||0).toLocaleString('id-ID');
  const ccPct2 = Math.round(parseFloat(String(s.pctCcTotal||'0').replace('%',''))||0);
  _makeSVGStatChart('invStatChart', ccPct2, '#10b981');
  if (footer)   footer.textContent   = `${rows.filter(r=>!r.isAreaRow).length} lorong terdaftar · Akurasi keseluruhan: ${s.akurasiTotal} · Diperbarui: ${new Date().toLocaleTimeString('id-ID')}`;

  // ── KPI CARDS (top-border accent, like image 2) ──
  const kpiRow  = document.getElementById('invKpiRow');
  const MISS    = Number(s.totalMiss);
  const akuNum  = parseFloat(s.akurasiTotal) || 0;
  const belumN  = Math.max(0, Number(s.totalLokasi) - Number(s.totalCc));

  const kpis = [
    { label:'PROGRESS CC',   val: s.pctCcTotal,
      sub1l:'SUDAH CC', sub1v: totalCcN, sub2l:'TOTAL LOKASI', sub2v: totalLok,
      color:'#2563eb', icon:'📊' },
    { label:'TOTAL LOKASI',  val: totalLok,
      sub1l:'JML TERDAFTAR', sub1v: totalLok, sub2l:'SUDAH CC', sub2v: totalCcN,
      color:'#7c3aed', icon:'📍' },
    { label:'TOTAL CC SCAN', val: totalCcN,
      sub1l:'SUDAH SCAN', sub1v: totalCcN, sub2l:'BELUM CC', sub2v: belumN.toLocaleString('id-ID'),
      color:'#0891b2', icon:'🔢' },
    { label:'TOTAL HIT',     val: Number(s.totalHit).toLocaleString('id-ID'),
      sub1l:'SESUAI FISIK', sub1v: Number(s.totalHit).toLocaleString('id-ID'), sub2l:'DARI CC', sub2v: totalCcN,
      color:'#16a34a', icon:'✅' },
    { label:'TOTAL MISS',    val: Number(s.totalMiss).toLocaleString('id-ID'),
      sub1l:'DISCREPANCY', sub1v: Number(s.totalMiss).toLocaleString('id-ID'), sub2l:'DARI CC', sub2v: totalCcN,
      color: MISS > 0 ? '#dc2626' : '#16a34a', icon: MISS > 0 ? '❌' : '✅' },
    { label:'AKURASI TOTAL', val: s.akurasiTotal,
      sub1l:'HIT / CC SCAN', sub1v:`${Number(s.totalHit).toLocaleString('id-ID')} / ${totalCcN}`, sub2l:'TARGET', sub2v:'≥ 99.5%',
      color: akuNum >= 99.5 ? '#16a34a' : akuNum >= 98 ? '#d97706' : '#dc2626', icon:'🎯' },
  ];

  if (kpiRow) {
    kpiRow.style.cssText = 'display:grid;grid-template-columns:repeat(6,1fr);gap:10px;padding:14px 20px;border-bottom:1px solid rgba(200,215,240,0.25);';
    kpiRow.innerHTML = kpis.map((k,i) => `
      <div style="background:linear-gradient(160deg,#fff 55%,${k.color}18 100%);border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.06);display:flex;flex-direction:column;position:relative;">
        <div style="height:3px;background:${k.color};position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent);animation:kpiBodyBeam ${3+i*0.4}s ease-in-out infinite;"></div>
        </div>
        <div style="padding:11px 12px 0;flex:1;display:flex;flex-direction:column;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);transform:skewX(-15deg);animation:kpiBodyBeam ${3.5+i*0.4}s ease-in-out infinite;pointer-events:none;z-index:1;"></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <div style="font-size:9px;font-weight:700;color:#64748b;letter-spacing:0.1em;text-transform:uppercase;">${k.label}</div>
            <div style="font-size:14px;line-height:1;">${k.icon}</div>
          </div>
          <div style="font-size:${k.val.length>8?'17px':'22px'};font-weight:900;color:${k.color};line-height:1;letter-spacing:-0.5px;margin-bottom:3px;">${k.val}</div>
          <div style="font-size:8.5px;color:${k.color};font-weight:700;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">— ${k.label}</div>
          <div style="height:3px;background:rgba(0,0,0,0.06);margin-top:auto;"><div style="height:100%;background:${k.color};width:100%;"></div></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;padding:6px 12px;background:#f8fafc;border-top:1px solid #f1f5f9;">
          <div><div style="color:#94a3b8;margin-bottom:1px;">${k.sub1l}</div><div style="font-weight:700;color:#475569;">${k.sub1v}</div></div>
          <div style="text-align:right;"><div style="color:#94a3b8;margin-bottom:1px;">${k.sub2l}</div><div style="font-weight:700;color:#475569;">${k.sub2v}</div></div>
        </div>
      </div>`).join('');
  }

  // ── PROGRESS BAR ──
  const pct = parseFloat(s.pctCcTotal) || 0;
  const pb  = document.getElementById('invProgressBar');
  const pl  = document.getElementById('invProgressLabel');
  if (pb) setTimeout(() => pb.style.width = Math.min(pct,100)+'%', 200);
  if (pl) pl.textContent = s.pctCcTotal;

  // ── RENDER TABLES ──
  renderInvLorongTable(rows, s);
  renderInvAreaTable(rows, s);
}

// ── TABLE KIRI: DETAIL BY LORONG ──
function renderInvLorongTable(rows, s) {
  const tbody = document.getElementById('invLorongBody');
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--text-3);">Tidak ada data</td></tr>';
    return;
  }

  const AREA_COL  = { '1':'#2563eb', '2':'#d97706', '3':'#16a34a' };
  const AREA_BG   = { '1':'rgba(37,99,235,0.04)', '2':'rgba(217,119,6,0.04)', '3':'rgba(22,163,74,0.04)' };
  const AREA_SUM  = { '1':'rgba(37,99,235,0.18)', '2':'rgba(217,119,6,0.18)', '3':'rgba(22,163,74,0.18)' };

  // Pre-hitung rowspan untuk SPV AREA (hanya data rows, bukan area summary)
  const dataOnly = rows.filter(r => !r.isAreaRow);
  const rowspanMap = new Map(); // index → rowspan count
  for (let i = 0; i < dataOnly.length; i++) {
    if (dataOnly[i].spvArea) {
      let span = 1;
      while (i + span < dataOnly.length && !dataOnly[i + span].spvArea && !dataOnly[i + span].isAreaRow) span++;
      rowspanMap.set(i, span);
    }
  }

  let curArea = '1';
  let dataIdx = 0;
  let html = '';

  rows.forEach(r => {
    const m = (r.spvArea || '').match(/(\d+)/);
    if (m) curArea = m[1];
    const col = AREA_COL[curArea] || '#64748b';

    if (r.isAreaRow) {
      // AREA summary row
      const bg     = AREA_SUM[curArea] || 'rgba(100,116,139,0.18)';
      const akuNum = parseFloat(r.akurasi) || 0;
      const akuCol = akuNum >= 99.5 ? '#16a34a' : akuNum >= 98 ? '#d97706' : '#dc2626';
      html += `<tr style="background:${bg};border-top:2px solid ${col}60;border-bottom:2px solid ${col}60;">
        <td style="padding:9px 10px;font-weight:900;color:${col};font-size:12px;text-align:center;border-right:1px solid ${col}30;">${escHtml(r.spvArea)}</td>
        <td colspan="2" style="padding:9px 10px;text-align:center;font-size:11px;color:${col};font-weight:700;letter-spacing:0.05em;">— SUBTOTAL —</td>
        <td style="padding:9px 10px;text-align:right;font-weight:800;color:${col};">${r.jumlahLokasi.toLocaleString('id-ID')}</td>
        <td style="padding:9px 10px;text-align:right;font-weight:800;color:${col};">${r.cc.toLocaleString('id-ID')}</td>
        <td style="padding:9px 10px;text-align:right;font-weight:800;color:#16a34a;">${r.hit.toLocaleString('id-ID')}</td>
        <td style="padding:9px 10px;text-align:right;font-weight:800;color:${r.miss>0?'#dc2626':'#94a3b8'};">${r.miss.toLocaleString('id-ID')}</td>
        <td style="padding:9px 10px;text-align:center;font-weight:800;color:${col};">${r.pctCc}</td>
        <td style="padding:9px 10px;text-align:center;font-weight:900;color:${akuCol};">${r.akurasi}</td>
      </tr>`;
      return;
    }

    // Normal lorong row
    const rowBg  = AREA_BG[curArea] || '';
    const akuNum = parseFloat(r.akurasi) || 0;
    const akuColor = akuNum >= 100 ? '#16a34a' : akuNum >= 99 ? '#2563eb' : akuNum >= 98 ? '#d97706' : '#dc2626';
    const akuBg    = akuNum >= 100 ? 'rgba(22,163,74,0.12)' : akuNum >= 99 ? 'rgba(37,99,235,0.12)' : akuNum >= 98 ? 'rgba(217,119,6,0.12)' : 'rgba(220,38,38,0.12)';

    // SPV AREA cell dengan rowspan + vertical center
    let spvCell = '';
    if (r.spvArea && rowspanMap.has(dataIdx)) {
      const span = rowspanMap.get(dataIdx);
      spvCell = `<td rowspan="${span}" style="text-align:center;vertical-align:middle;font-size:11px;font-weight:800;color:${col};background:${rowBg};border-right:2px solid ${col}40;padding:4px 8px;line-height:1.4;">${escHtml(r.spvArea).replace(/\n/g,'<br>')}</td>`;
    }
    // kalau spvArea kosong = sudah di-merge, skip cell ini

    html += `<tr style="background:${rowBg};border-bottom:1px solid rgba(200,215,240,0.1);">
      ${spvCell}
      <td style="padding:7px 10px;font-size:11.5px;color:var(--text-2);">${escHtml(r.pic)}</td>
      <td style="padding:7px 10px;text-align:center;font-weight:900;color:${col};font-size:13px;">${escHtml(String(r.lorong))}</td>
      <td style="padding:7px 10px;text-align:right;font-weight:600;color:var(--text-2);">${r.jumlahLokasi.toLocaleString('id-ID')}</td>
      <td style="padding:7px 10px;text-align:right;font-weight:700;color:#0891b2;">${r.cc.toLocaleString('id-ID')}</td>
      <td style="padding:7px 10px;text-align:right;font-weight:700;color:#16a34a;">${r.hit.toLocaleString('id-ID')}</td>
      <td style="padding:7px 10px;text-align:right;font-weight:${r.miss>0?800:600};color:${r.miss>0?'#dc2626':'#94a3b8'};">${r.miss.toLocaleString('id-ID')}</td>
      <td style="padding:7px 10px;text-align:center;color:var(--text-2);">${r.pctCc}</td>
      <td style="padding:5px 10px;text-align:center;"><span style="display:inline-block;padding:2px 9px;border-radius:20px;background:${akuBg};color:${akuColor};font-size:11px;font-weight:800;white-space:nowrap;">${r.akurasi}</span></td>
    </tr>`;
    dataIdx++;
  });

  // TOTAL row
  const ak    = parseFloat(s.akurasiTotal) || 0;
  const akCol = ak >= 99.5 ? '#4ade80' : '#f87171';
  html += `<tr style="background:#1e293b;border-top:2px solid rgba(100,116,139,0.4);">
    <td colspan="3" style="padding:9px 10px;color:#fff;font-weight:900;font-size:11.5px;letter-spacing:0.04em;">TOTAL</td>
    <td style="padding:9px 10px;text-align:right;color:#fff;font-weight:800;">${Number(s.totalLokasi).toLocaleString('id-ID')}</td>
    <td style="padding:9px 10px;text-align:right;color:#22d3ee;font-weight:800;">${Number(s.totalCc).toLocaleString('id-ID')}</td>
    <td style="padding:9px 10px;text-align:right;color:#4ade80;font-weight:800;">${Number(s.totalHit).toLocaleString('id-ID')}</td>
    <td style="padding:9px 10px;text-align:right;color:${Number(s.totalMiss)>0?'#f87171':'#94a3b8'};font-weight:800;">${Number(s.totalMiss).toLocaleString('id-ID')}</td>
    <td style="padding:9px 10px;text-align:center;color:#a78bfa;font-weight:800;">${s.pctCcTotal}</td>
    <td style="padding:9px 10px;text-align:center;color:${akCol};font-weight:900;font-size:12px;">${s.akurasiTotal}</td>
  </tr>`;

  tbody.innerHTML = html;
}

// ── TABLE KANAN: SEBARAN AKURASI BY LEVEL RAK ──
function renderInvAreaTable(rows, s) {
  const tbody = document.getElementById('invAreaBody');
  if (!tbody) return;

  const AREA_COL = { '1':'#2563eb', '2':'#d97706', '3':'#16a34a' };
  const AREA_BG  = { '1':'rgba(37,99,235,0.04)', '2':'rgba(217,119,6,0.04)', '3':'rgba(22,163,74,0.04)' };

  // Helper: warna akurasi level
  const lvColor = (v) => {
    if (!v || v === '0%' || v === '—') return '#94a3b8';
    const n = parseFloat(v);
    if (n >= 100) return '#16a34a';
    if (n >= 99)  return '#2563eb';
    if (n >= 98)  return '#d97706';
    return '#dc2626';
  };
  const lvCell = (v) => {
    if (!v || v === '0%' || v === '—') return `<td style="padding:6px 7px;text-align:center;color:#94a3b8;font-size:10px;">—</td>`;
    const col = lvColor(v);
    const n   = parseFloat(v);
    const fw  = n < 100 ? 800 : 700;
    return `<td style="padding:6px 7px;text-align:center;color:${col};font-weight:${fw};font-size:10.5px;">${v}</td>`;
  };

  const dataRows  = rows.filter(r => !r.isAreaRow);
  const areaRows  = rows.filter(r =>  r.isAreaRow);

  if (!dataRows.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--text-3);">Tidak ada data</td></tr>';
    return;
  }

  let curArea = '1';
  let html = '';

  dataRows.forEach(r => {
    const m = (r.spvArea || r.area || '').match(/(\d+)/);
    if (m) curArea = m[1];
    const col    = AREA_COL[curArea] || '#64748b';
    const rowBg  = AREA_BG[curArea]  || '';
    const lv     = r.levelData || [];
    const akuNum   = parseFloat(r.akurasi) || 0;
    const akuColor = akuNum >= 100 ? '#16a34a' : akuNum >= 99 ? '#2563eb' : akuNum >= 98 ? '#d97706' : '#dc2626';
    const akuBg    = akuNum >= 100 ? 'rgba(22,163,74,0.12)' : akuNum >= 99 ? 'rgba(37,99,235,0.12)' : akuNum >= 98 ? 'rgba(217,119,6,0.12)' : 'rgba(220,38,38,0.12)';

    html += `<tr style="background:${rowBg};border-bottom:1px solid rgba(200,215,240,0.08);">
      <td style="padding:6px 10px;text-align:center;font-weight:900;color:${col};font-size:13px;">${escHtml(String(r.lorong))}</td>
      <td style="padding:6px 8px;text-align:center;"><span style="display:inline-block;padding:2px 7px;border-radius:20px;background:${akuBg};color:${akuColor};font-size:10.5px;font-weight:800;">${r.akurasi||'—'}</span></td>
      ${lvCell(lv[0])}${lvCell(lv[1])}${lvCell(lv[2])}${lvCell(lv[3])}
      ${lvCell(lv[4])}${lvCell(lv[5])}${lvCell(lv[6])}${lvCell(lv[7])}
    </tr>`;
  });

  // Area summary rows
  areaRows.forEach(a => {
    const m   = (a.spvArea || '').match(/(\d+)/);
    const key = m ? m[1] : '1';
    const col = AREA_COL[key] || '#64748b';
    const lv  = a.levelData || [];
    const akuNum = parseFloat(a.akurasi) || 0;
    const akuCol = akuNum >= 99.5 ? '#4ade80' : akuNum >= 98 ? '#fb923c' : '#f87171';
    html += `<tr style="background:#2d3748;border-top:1px solid rgba(100,116,139,0.3);">
      <td style="padding:7px 10px;text-align:center;font-weight:900;color:${col};font-size:11px;letter-spacing:0.03em;">${a.spvArea}</td>
      <td style="padding:7px 8px;text-align:center;font-weight:900;color:${akuCol};font-size:11px;">${a.akurasi||'—'}</td>
      ${lvCell(lv[0])}${lvCell(lv[1])}${lvCell(lv[2])}${lvCell(lv[3])}
      ${lvCell(lv[4])}${lvCell(lv[5])}${lvCell(lv[6])}${lvCell(lv[7])}
    </tr>`;
  });

  // TOTAL row
  html += `<tr style="background:#1e293b;border-top:2px solid rgba(100,116,139,0.4);">
    <td style="padding:9px 10px;text-align:center;color:#fff;font-weight:900;font-size:11px;">TOTAL</td>
    <td style="padding:9px 8px;text-align:center;color:#4ade80;font-weight:900;font-size:11px;">${s.akurasiTotal}</td>
    <td colspan="8" style="padding:9px 10px;text-align:center;color:#94a3b8;font-size:10px;">—</td>
  </tr>`;

  tbody.innerHTML = html;
}


// ── SVG stat chart helper ──
// ── fetchSLAPlanner ──
async function fetchSLAPlanner() {
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getSLAPlanner');
    const data = await res.json();
    if (!data.ok) return;

    const grwPct  = parseFloat(String(data.slaGrw).replace('%',''))||0;
    const custPct = parseFloat(String(data.slaCust).replace('%',''))||0;
    const avgPct  = Math.round((grwPct + custPct) / 2);

    _makeSVGStatChart('plannerStatChart', avgPct, '#991b1b');

    const sg = document.getElementById('plannerSlaGrw');   if(sg) sg.textContent = data.slaGrw;
    const sc = document.getElementById('plannerSlaCust');  if(sc) sc.textContent = data.slaCust;
    const pv = document.getElementById('plannerStatVal');  if(pv) pv.textContent = avgPct + '%';
    const pf = document.getElementById('plannerStatFoot'); if(pf) pf.textContent = avgPct + '%';
    const pb = document.getElementById('plannerStatBar');
    if(pb) setTimeout(()=>pb.style.width=Math.min(avgPct,100)+'%',300);
  } catch(e) { console.warn('SLA Planner error:', e); }
}

function _makeSVGStatChart(elId, pct, color) {
  const el = document.getElementById(elId); if(!el) return;
  const r=30,cx=38,cy=38,circ=2*Math.PI*r;
  const dash=Math.min(pct,100)/100*circ;
  const bg='#e2e8f0';
  el.innerHTML=`<svg width="76" height="76" viewBox="0 0 76 76">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${bg}" stroke-width="7"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="7"
      stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy-4}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="900" fill="${color}">${pct}%</text>
    <text x="${cx}" y="${cy+11}" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="600" fill="#94a3b8">Progress</text>
  </svg>`;
}

async function fetchInventoryAccuracy() {
  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getInventoryAccuracy');
    const data = await res.json();
    if (!data.ok) return;

    const pct    = parseFloat(data.accuracy);
    const valEl  = document.getElementById('invAccuracyVal');
    const subEl  = document.getElementById('invAccuracySub');
    const card   = document.getElementById('invControlCard');
    const icon   = document.getElementById('invControlIcon');

    if (!valEl) return;

    // Update value
    valEl.textContent = pct.toFixed(2) + '%';

    let color, gradColors, label, labelClass, iconBg, borderColor;
    if (pct >= 99.5) {
      color = '#10b981'; gradColors = '#10b981,#6ee7b7';
      label = '✅ Akurasi Sangat Baik'; labelClass = 'up';
      iconBg = 'rgba(16,185,129,0.08)'; borderColor = 'rgba(16,185,129,0.15)';
    } else if (pct >= 98) {
      color = '#d97706'; gradColors = '#d97706,#fbbf24';
      label = '⚠️ Perlu Perhatian'; labelClass = '';
      iconBg = 'rgba(217,119,6,0.08)'; borderColor = 'rgba(217,119,6,0.15)';
    } else {
      color = '#dc2626'; gradColors = '#dc2626,#f87171';
      label = '❌ Di Bawah Target'; labelClass = 'dn';
      iconBg = 'rgba(220,38,38,0.08)'; borderColor = 'rgba(220,38,38,0.15)';
    }

    valEl.style.color = color;
    if (subEl) subEl.innerHTML = `<span style="color:${color};font-weight:700">${label}</span>`;

    const topBar = document.getElementById('invControlTopBar');
    if (card)   card.style.borderColor = borderColor;
    if (topBar) topBar.innerHTML = `<div style="height:100%;background:linear-gradient(90deg,${gradColors});width:${pct>99?99:pct}%;transition:width 1s;"></div>`;
    if (icon)   icon.style.background = iconBg;

    // Pie chart Progress CC - ambil dari window._invData jika sudah ada, fallback ke data.summary
    const invS = (window._invData && window._invData.summary) ? window._invData.summary : data.summary;
    const rawCcPct = String(invS.pctCcTotal||'0').replace('%','').trim();
    const ccPct = Math.round(parseFloat(rawCcPct)||0);
    _makeSVGStatChart('invStatChart', ccPct, color);

    // Mini boxes - dari invS
    const il=document.getElementById('invStatLokasi'); if(il) il.textContent=Number(invS.totalLokasi||0).toLocaleString('id-ID');
    const ic=document.getElementById('invStatCC');     if(ic) ic.textContent=Number(invS.totalCc||0).toLocaleString('id-ID');
    const ih=document.getElementById('invStatHit');    if(ih) ih.textContent=Number(invS.totalHit||0).toLocaleString('id-ID');
    const im=document.getElementById('invStatMiss');   if(im) im.textContent=Number(invS.totalMiss||0).toLocaleString('id-ID');


  } catch(e) {
    console.warn('Inventory accuracy error:', e);
  }
}

function updateInventoryStatusDonut(inTotal,inSelesai,outTotal,outSelesai){
  const inPct  = inTotal>0  ? Math.round((inSelesai/inTotal)*100)   : 0;
  const outPct = outTotal>0 ? Math.round((outSelesai/outTotal)*100) : 0;
  const s = window._storingData && window._storingData.summary;
  const storePct = s ? Math.round((s.pctPickingOverall + s.pctStagedOverall) / 2) : 0;
  const sisa   = Math.max(0, 100 - inPct - storePct - outPct);
  const overall = Math.round((inPct + storePct + outPct) / 3);
  const centerEl = document.getElementById('donutTotal');
  if (centerEl) centerEl.textContent = overall + '%';
  const iv = document.getElementById('donutInboundVal');  if(iv)  iv.textContent  = inPct    + '%';
  const sv = document.getElementById('donutStoringVal');  if(sv)  sv.textContent  = storePct + '%';
  const ov = document.getElementById('donutOutboundVal'); if(ov)  ov.textContent  = outPct   + '%';
  const bv = document.getElementById('donutBelumVal');    if(bv)  bv.textContent  = sisa     + '%';
  const ctx = document.getElementById('donutChart'); if(!ctx) return;
  const isDark = document.body.classList.contains('dark');
  const belumColor = isDark ? '#1e293b' : '#e2e8f0';
  const chart = Chart.getChart(ctx);
  if (chart) {
    chart.data.datasets[0].data = [inPct, storePct, outPct, sisa];
    chart.data.datasets[0].backgroundColor = ['#16a34a','#8b5cf6','#d97706', belumColor];
    chart.update('none');
  }
}

function renderDashStoringChart() {
  const s = window._storingData && window._storingData.summary;
  if (!s) return;
  const pickPct  = s.pctPickingOverall || 0;
  const stagePct = s.pctStagedOverall  || 0;
  const sisaPct  = Math.max(0, 100 - pickPct);
  const avgPct   = Math.round((pickPct + stagePct) / 2);
  const badge = document.getElementById('storingPctBadge');
  const pctEl = document.getElementById('dashStoringPct');
  if (badge) badge.textContent = avgPct + '% Progres';
  if (pctEl) pctEl.textContent = avgPct + '%';
  const pp = document.getElementById('piStorePickingVal'); if(pp) pp.textContent = pickPct  + '%';
  const ps = document.getElementById('piStoreStagedVal');  if(ps) ps.textContent = stagePct + '%';
  const pr = document.getElementById('piStoreSisaVal');    if(pr) pr.textContent = sisaPct  + '%';
  const pk = document.getElementById('piStoreKapVal');     if(pk) pk.textContent = (s.avgKapasitas||0) + '%';
  const canvas = document.getElementById('dashStoringChart'); if(!canvas) return;
  const ex = Chart.getChart(canvas); if(ex) ex.destroy();
  const isDark = document.body.classList.contains('dark');
  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: { datasets: [{ data: [pickPct, stagePct, sisaPct], backgroundColor: ['#16a34a','#f59e0b','#dc2626'], borderColor: isDark?'#161b22':'#ffffff', borderWidth: 3, hoverOffset: 6 }] },
    options: { responsive:true, maintainAspectRatio:false, cutout:'72%', plugins:{legend:{display:false},tooltip:{enabled:false}} }
  });
}

async function fetchInventoryValue(){
  try{
    const res=await fetch(GAS_DASHBOARD_URL+'?action=getDashboardData');
    const data=await res.json(); if(!data.ok) return;
    const inv=data.mtd&&data.mtd.inventory?data.mtd.inventory:0;
    const el=document.querySelector('#storingStatCard .stat-value');
    const sb=document.querySelector('#storingStatCard .stat-sub');
    if(el&&inv){const fmt=inv>=1000000?'Rp '+(inv/1000000).toFixed(1).replace('.0','')+' Jt':inv>=1000?'Rp '+(inv/1000).toFixed(0)+' Rb':inv;el.textContent=fmt;el.style.fontSize='16px';}
    if(sb&&data.mtd) sb.textContent='Data bulan '+(data.mtd.monthName||'');
  }catch(e){console.warn('Inventory value error:',e);}
}

fetchDashboardStats();
setInterval(fetchDashboardStats,5*60*1000);

// ══════════════════════════════════════
//  CHARTS — DAILY ACTIVITY
// ══════════════════════════════════════
Chart.defaults.color='#6b7280';
Chart.defaults.font.family='Outfit';

const dataLabelPlugin={
  id:'customDataLabels',
  afterDatasetsDraw(chart){
    const{ctx}=chart;
    chart.data.datasets.forEach((dataset,i)=>{
      const meta=chart.getDatasetMeta(i);
      meta.data.forEach((point,j)=>{
        const val=dataset.data[j]; if(!val||val===0) return;
        ctx.save();
        ctx.font='bold 11px Outfit, sans-serif';
        ctx.fillStyle=dataset.borderColor;
        ctx.textAlign='center';
        ctx.textBaseline=i===0?'bottom':'top';
        ctx.fillText(val,point.x,point.y+(i===0?-6:6));
        ctx.restore();
      });
    });
  }
};

let lineChartInstance=null;

async function fetchDailyActivity(){
  try{
    const res=await fetch(GAS_DASHBOARD_URL+'?action=getDailyActivity');
    const data=await res.json(); if(!data.ok) return;
    const isDark=document.body.classList.contains('dark');
    const gridColor=isDark?'rgba(255,255,255,0.05)':'rgba(99,120,167,0.07)';
    const tickColor=isDark?'#484f58':'#9ca3af';
    if(lineChartInstance) lineChartInstance.destroy();
    lineChartInstance=new Chart(document.getElementById('lineChart').getContext('2d'),{
      type:'line', plugins:[dataLabelPlugin],
      data:{labels:data.labels,datasets:[
        {label:'Inbound', data:data.inbound, borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,0.08)',tension:0.4,fill:true,pointBackgroundColor:'#2563eb',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5,borderWidth:2.5},
        {label:'Outbound',data:data.outbound,borderColor:'#d97706',backgroundColor:'rgba(217,119,6,0.08)', tension:0.4,fill:true,pointBackgroundColor:'#d97706',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5,borderWidth:2.5}
      ]},
      options:{responsive:true,maintainAspectRatio:false,layout:{padding:{top:24,bottom:5}},plugins:{legend:{display:false},tooltip:{backgroundColor:isDark?'rgba(22,27,34,0.95)':'rgba(17,24,39,0.9)',titleColor:'#fff',bodyColor:'rgba(255,255,255,0.8)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,padding:12,cornerRadius:10}},scales:{x:{grid:{color:gridColor},ticks:{font:{size:11},color:tickColor}},y:{grid:{color:gridColor},ticks:{font:{size:11},color:tickColor,stepSize:1},beginAtZero:true}}}
    });
    const cardTitle=document.querySelector('#page-dashboard .mid-grid .card-title');
    if(cardTitle&&data.weekStart) cardTitle.innerHTML=`<span class="live-dot"></span>Daily Activity <span style="font-size:10px;font-weight:500;color:var(--text-3);margin-left:6px">Minggu ini (ab ${data.weekStart})</span>`;
  }catch(e){
    console.warn('Daily activity error:',e);
    if(lineChartInstance) lineChartInstance.destroy();
    lineChartInstance=new Chart(document.getElementById('lineChart').getContext('2d'),{type:'line',data:{labels:['Sen','Sel','Rab','Kam','Jum','Sab'],datasets:[{label:'Inbound',data:[0,0,0,0,0,0],borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,0.06)',tension:0.4,fill:true,pointBackgroundColor:'#2563eb',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5,borderWidth:2.5},{label:'Outbound',data:[0,0,0,0,0,0],borderColor:'#d97706',backgroundColor:'rgba(217,119,6,0.06)',tension:0.4,fill:true,pointBackgroundColor:'#d97706',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5,borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(99,120,167,0.07)'},ticks:{font:{size:11},color:'#9ca3af'}},y:{grid:{color:'rgba(99,120,167,0.07)'},ticks:{font:{size:11},color:'#9ca3af'},beginAtZero:true}}}});
  }
}
fetchDailyActivity();

new Chart(document.getElementById('donutChart').getContext('2d'),{
  type:'doughnut',
  data:{labels:['Inbound','Storing','Outbound','Belum Selesai'],datasets:[{data:[0,0,0,100],backgroundColor:['#16a34a','#8b5cf6','#d97706','#e2e8f0'],borderColor:['#fff','#fff','#fff','#fff'],borderWidth:3,hoverOffset:10}]},
  options:{responsive:true,maintainAspectRatio:false,cutout:'70%',plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(17,24,39,0.9)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,callbacks:{label:ctx=>` ${ctx.label}: ${ctx.raw}%`},padding:10,cornerRadius:10}}}
});

// ── BEAM on KPI cards ──
const kpiBeams = {
  inboundStatCard:   'rgba(59,130,246,0.35)',
  storingStatCard:   'rgba(236,72,153,0.35)',
  outboundStatCard:  'rgba(245,158,11,0.35)',
  invControlCard:    'rgba(16,185,129,0.35)',
  dailyActivityCard: 'rgba(99,102,241,0.3)',
  persentaseCard:    'rgba(236,72,153,0.3)',
};
Object.entries(kpiBeams).forEach(([id, color]) => {
  const card = document.getElementById(id);
  if (!card) return;
  const beam = document.createElement('div');
  beam.style.cssText = `position:absolute;top:0;left:-100%;width:55%;height:100%;background:linear-gradient(90deg,transparent,${color},transparent);transform:skewX(-15deg);pointer-events:none;z-index:10;`;
  card.appendChild(beam);

  card.addEventListener('mouseenter', () => {
    beam.style.transition = 'none';
    beam.style.left = '-100%';
    void beam.offsetWidth;
    beam.style.transition = 'left 1.2s ease';
    beam.style.left = '160%';
  });
  card.addEventListener('mouseleave', () => {
    beam.style.transition = 'none';
    beam.style.left = '-100%';
  });
});

// ── BEAM on progress cards ──
function addBeam(el, color) {
  if (!el) return;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  const b = document.createElement('div');
  b.style.cssText = `position:absolute;top:0;left:-100%;width:55%;height:100%;background:linear-gradient(90deg,transparent,${color},transparent);transform:skewX(-15deg);pointer-events:none;z-index:10;`;
  el.appendChild(b);
  el.addEventListener('mouseenter',()=>{b.style.transition='none';b.style.left='-100%';void b.offsetWidth;b.style.transition='left 1.2s ease';b.style.left='160%';});
  el.addEventListener('mouseleave',()=>{b.style.transition='none';b.style.left='-100%';});
}
const pr = document.querySelectorAll('.progress-row > div');
if(pr[0]) addBeam(pr[0],'rgba(59,130,246,0.3)');
if(pr[1]) addBeam(pr[1],'rgba(236,72,153,0.3)');
if(pr[2]) addBeam(pr[2],'rgba(245,158,11,0.3)');

// ── NAVIGATION ──
document.querySelectorAll('.nav-item').forEach(btn=>{btn.addEventListener('click',()=>{const p=btn.dataset.page;if(p)go(p);});});
function go(p){
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  const nb=document.querySelector(`[data-page="${p}"]`); if(nb) nb.classList.add('active');
  document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.iframe-page').forEach(el=>{el.classList.remove('active');el.style.display='none';});
  if(IFRAME_PAGES.includes(p)){const pg=document.getElementById(`page-${p}`);if(pg){pg.style.display='flex';pg.classList.add('active');}loadIframe(p);}
  else{const pg=document.getElementById(`page-${p}`);if(pg)pg.classList.add('active');}
}
function goHome(){go('dashboard');IFRAME_PAGES.forEach(k=>{const f=document.getElementById(`ifr${cap(k)}`);if(f)f.src='about:blank';});}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function loadIframe(key){
  const url=URLS[key]; if(!url) return;
  const f=document.getElementById(`ifr${cap(key)}`), ld=document.getElementById(`ld${cap(key)}`), er=document.getElementById(`err${cap(key)}`);
  const tab=document.getElementById(`tab${cap(key)}`), errTab=document.getElementById(`errTab${cap(key)}`);
  if(!f) return; if(tab) tab.href=url; if(errTab) errTab.href=url;
  ld.classList.remove('hidden'); er.classList.remove('show'); f.style.opacity='0';
  let realLoaded=false;
  const t=setTimeout(()=>{ld.classList.add('hidden');er.classList.add('show');},20000);
  f.onload=()=>{if(!realLoaded)return;clearTimeout(t);ld.classList.add('hidden');f.style.opacity='1';};
  f.onerror=()=>{if(!realLoaded)return;clearTimeout(t);ld.classList.add('hidden');er.classList.add('show');};
  f.src='about:blank'; setTimeout(()=>{realLoaded=true;f.src=url;},150);
}
function reloadIframe(frameId,key){const f=document.getElementById(frameId),url=URLS[key];if(!f||!url)return;const ld=document.getElementById(`ld${cap(key)}`),er=document.getElementById(`err${cap(key)}`);f.src='about:blank';ld.classList.remove('hidden');er.classList.remove('show');f.style.opacity='0';setTimeout(()=>{f.src=url;},100);}

// ── AI SUPPORT ──
function setupAI(inId,btnId,msgsId,typingId){
  const inp=document.getElementById(inId),btn=document.getElementById(btnId),msgs=document.getElementById(msgsId),typing=document.getElementById(typingId);
  if(!inp||!btn||!msgs) return;
  function addBubble(text,type){const div=document.createElement('div');div.className=`ai-bubble ${type}`;div.style.whiteSpace='pre-wrap';div.textContent=text;if(typing&&msgs.contains(typing))msgs.insertBefore(div,typing);else msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;}
  async function send(){const txt=inp.value.trim();if(!txt)return;addBubble(txt,'user');inp.value='';inp.disabled=true;btn.disabled=true;if(typing){typing.classList.add('show');msgs.scrollTop=msgs.scrollHeight;}try{const res=await fetch(GAS_AI_URL+'?q='+encodeURIComponent(txt));const data=await res.json();if(typing)typing.classList.remove('show');addBubble(data.answer||'Maaf, tidak ada jawaban.','bot');}catch(e){if(typing)typing.classList.remove('show');addBubble('Maaf, terjadi kesalahan koneksi.','bot');}inp.disabled=false;btn.disabled=false;inp.focus();}
  btn.addEventListener('click',send);inp.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
}
setupAI('aiIn','aiBtn','aiMsg','aiTyping');
setupAI('aiIn2','aiBtn2','aiMsg2','aiTyping2');

// ── NOTIFIKASI ──
function getLastSeenTs(){return parseInt(localStorage.getItem('lastSeenTs_'+(me.name||'guest'))||'0');}
function setLastSeenTs(ts){localStorage.setItem('lastSeenTs_'+(me.name||'guest'),ts);}
function toggleNotif(){notifOpen=!notifOpen;document.getElementById('notifPanel').style.display=notifOpen?'block':'none';if(notifOpen){setLastSeenTs(Date.now());document.getElementById('notifBadge').style.display='none';document.getElementById('notifBadge').textContent='0';}}
function clearNotifs(){notifList=[];setLastSeenTs(Date.now());document.getElementById('notifBadge').style.display='none';document.getElementById('notifList').innerHTML='<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px">Belum ada notifikasi</div>';}
function addNotif(msg){if(!msg||!msg.name)return;if(me.name&&msg.name===me.name)return;if(!msg.timestamp||msg.timestamp<=getLastSeenTs())return;notifList.unshift(msg);if(notifList.length>20)notifList.pop();if(!notifOpen){const badge=document.getElementById('notifBadge'),count=parseInt(badge.textContent||'0')+1;badge.textContent=count>9?'9+':count;badge.style.display='flex';const btn=document.getElementById('notifBtn');btn.style.animation='none';setTimeout(()=>btn.style.animation='shakeBell 0.5s ease',10);}renderNotifList();}
function renderNotifList(){if(!notifList.length){document.getElementById('notifList').innerHTML='<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px">Belum ada notifikasi</div>';return;}document.getElementById('notifList').innerHTML=notifList.map(m=>`<div style="padding:12px 18px;border-bottom:1px solid rgba(200,215,240,0.3);display:flex;align-items:flex-start;gap:10px;cursor:pointer" onclick="go('discussion')"><div style="width:36px;height:36px;border-radius:50%;background:${m.color||'#2563eb'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0">${(m.name||'?').slice(0,2).toUpperCase()}</div><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:#0f172a">${m.name||'User'} <span style="font-weight:400;color:#94a3b8">di Discussion</span></div><div style="font-size:12px;color:#334155;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.text||''}</div><div style="font-size:10px;color:#94a3b8;margin-top:3px">${m.timestamp?new Date(m.timestamp).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}):''}</div></div><span style="font-size:10px;background:#eff6ff;color:#2563eb;padding:2px 8px;border-radius:10px;font-weight:700;flex-shrink:0">💬</span></div>`).join('');}
document.addEventListener('click',e=>{if(notifOpen&&!document.getElementById('notifPanel').contains(e.target)&&!document.getElementById('notifBtn').contains(e.target)){notifOpen=false;document.getElementById('notifPanel').style.display='none';}});

// ── DARK MODE ──
let isDark=localStorage.getItem('wms_dark')==='1';
function applyDark(){document.body.classList.toggle('dark',isDark);updateDarkToggle();}
function toggleDark(){isDark=!isDark;localStorage.setItem('wms_dark',isDark?'1':'0');applyDark();}
applyDark();

// ── SETTINGS ──
let profileColorIdx=parseInt(localStorage.getItem('wms_color')||'0');
function updateSettingsUser(){if(!me.name)return;const ava=document.getElementById('settingsAva');if(ava){ava.textContent=me.initials;ava.style.background=me.color.bg;}const nm=document.getElementById('settingsName');if(nm)nm.textContent=me.name;const rl=document.getElementById('settingsRole');if(rl)rl.textContent=me.jabatan||'Member AHI Sidoarjo';}
function toggleSettings(){settingsOpen=!settingsOpen;document.getElementById('settingsPanel').classList.toggle('open',settingsOpen);updateDarkToggle();}
function updateDarkToggle(){const toggle=document.getElementById('darkToggle');if(toggle)toggle.classList.toggle('on',isDark);}
function openProfile(){settingsOpen=false;document.getElementById('settingsPanel').classList.remove('open');document.getElementById('profileOverlay').classList.remove('hidden');document.getElementById('profileAvaBig').textContent=me.initials||'?';document.getElementById('profileAvaBig').style.background=me.color?me.color.bg:'#2563eb';document.getElementById('profileNameShow').textContent=me.name||'—';document.getElementById('profileJabatan').textContent=me.jabatan||'Staff';document.getElementById('profileNipShow').value=me.nip||'—';profileColorIdx=parseInt(localStorage.getItem('wms_color')||'0');document.querySelectorAll('#profileColorOpts .color-opt').forEach((el,i)=>{el.classList.toggle('selected',i===profileColorIdx);el.onclick=function(){document.querySelectorAll('#profileColorOpts .color-opt').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');profileColorIdx=parseInt(el.dataset.pidx||i);document.getElementById('profileAvaBig').style.background=el.style.background;};});}
document.getElementById('profileSaveBtn').addEventListener('click',function(){me.color=AVATAR_COLORS[profileColorIdx];localStorage.setItem('wms_color',profileColorIdx);document.getElementById('headerAvatar').textContent=me.initials;document.getElementById('headerAvatar').style.background=me.color.bg;applyTheme(me.color.hex);updateSettingsUser();document.getElementById('profileOverlay').classList.add('hidden');});
document.getElementById('profileCloseBtn').addEventListener('click',function(){document.getElementById('profileOverlay').classList.add('hidden');});
document.getElementById('profileOverlay').addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden');});
document.addEventListener('click',function(e){const panel=document.getElementById('settingsPanel'),btn=document.getElementById('settingsBtn');if(settingsOpen&&panel&&btn&&!panel.contains(e.target)&&!btn.contains(e.target)){settingsOpen=false;panel.classList.remove('open');}});

// ── SEARCH BAR ──
const SEARCH_ITEMS=[{label:'Dashboard',page:'dashboard',icon:'🏠',desc:'Halaman utama'},{label:'Planner',page:'planner',icon:'📋',desc:'Rencana Operasional'},{label:'Inbound',page:'inbound',icon:'📦',desc:'Dashboard Inbound'},{label:'Storing',page:'storing',icon:'🏗️',desc:'Dashboard Storing'},{label:'Outbound',page:'outbound',icon:'🚚',desc:'Dashboard Outbound'},{label:'Inventory',page:'inventory',icon:'📊',desc:'Manajemen Stok'},{label:'GA',page:'ga',icon:'🏢',desc:'General Affairs'},{label:'HR',page:'hr',icon:'👥',desc:'Human Resources'},{label:'Analyst',page:'analyst',icon:'📊',desc:'Dashboard Analitik Operasional'},{label:'Discussion',page:'discussion',icon:'💬',desc:'Discussion Room'},{label:'AI Support',page:'ai',icon:'🤖',desc:'Asisten AI Warehouse'}];
const searchInput=document.getElementById('searchInput'), searchDropdown=document.getElementById('searchDropdown');
function renderSearch(query){if(!query.trim()){searchDropdown.style.display='none';return;}const q=query.toLowerCase(),results=SEARCH_ITEMS.filter(item=>item.label.toLowerCase().includes(q)||item.desc.toLowerCase().includes(q));if(!results.length){searchDropdown.innerHTML='<div style="padding:12px 14px;font-size:12.5px;color:var(--text-3);text-align:center;">Tidak ditemukan</div>';searchDropdown.style.display='block';return;}searchDropdown.innerHTML=results.map(item=>`<div class="search-item" data-page="${item.page}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;cursor:pointer;transition:all 0.15s;"><div style="width:34px;height:34px;border-radius:9px;background:var(--accent-light);display:grid;place-items:center;font-size:16px;flex-shrink:0;border:1px solid var(--accent-mid);">${item.icon}</div><div><div style="font-size:13px;font-weight:700;color:var(--text);">${item.label}</div><div style="font-size:11px;color:var(--text-3);">${item.desc}</div></div><span style="margin-left:auto;font-size:10px;color:var(--text-3);">↵</span></div>`).join('');searchDropdown.style.display='block';searchDropdown.querySelectorAll('.search-item').forEach(el=>{el.addEventListener('mouseenter',()=>{el.style.background='var(--accent-light)';});el.addEventListener('mouseleave',()=>{el.style.background='none';});el.addEventListener('click',()=>{go(el.dataset.page);searchInput.value='';searchDropdown.style.display='none';});});}
if(searchInput){searchInput.addEventListener('input',e=>renderSearch(e.target.value));searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){const first=searchDropdown.querySelector('.search-item');if(first){go(first.dataset.page);searchInput.value='';searchDropdown.style.display='none';}}if(e.key==='Escape'){searchInput.value='';searchDropdown.style.display='none';}});}
document.addEventListener('click',e=>{if(searchDropdown&&!searchDropdown.contains(e.target)&&e.target!==searchInput)searchDropdown.style.display='none';});

// ── MOBILE SIDEBAR ──
function toggleSidebar(){const sidebar=document.querySelector('.sidebar'),overlay=document.getElementById('sidebarOverlay'),btn=document.getElementById('hamburgerBtn');sidebar.classList.toggle('open');overlay.classList.toggle('show');btn.classList.toggle('active');}
function closeSidebar(){const sidebar=document.querySelector('.sidebar'),overlay=document.getElementById('sidebarOverlay'),btn=document.getElementById('hamburgerBtn');sidebar.classList.remove('open');overlay.classList.remove('show');btn.classList.remove('active');}
document.querySelectorAll('.nav-item').forEach(btn=>{btn.addEventListener('click',()=>{if(window.innerWidth<=768)closeSidebar();});});

// ══════════════════════════════════════
//  PLANNER DETAIL PANEL
// ══════════════════════════════════════
let plannerPanelOpen = false;

function togglePlannerPanel() {
  plannerPanelOpen = !plannerPanelOpen;
  const panel       = document.getElementById('plannerDetailPanel');
  const midGrid     = document.querySelector('.mid-grid');
  const progressRow = document.querySelector('.progress-row');
  const bottomGrid  = document.querySelector('.bottom-grid');
  if (!panel) return;

  if (inboundPanelOpen)   { inboundPanelOpen   = false; const p=document.getElementById('inboundDetailPanel');   if(p) p.style.display='none'; }
  if (storingPanelOpen)   { storingPanelOpen   = false; const p=document.getElementById('storingDetailPanel');   if(p) p.style.display='none'; }
  if (outboundPanelOpen)  { outboundPanelOpen  = false; const p=document.getElementById('outboundDetailPanel');  if(p) p.style.display='none'; }
  if (inventoryPanelOpen) { inventoryPanelOpen = false; const p=document.getElementById('inventoryDetailPanel'); if(p) p.style.display='none'; }

  if (plannerPanelOpen) {
    panel.style.display = 'block';
    if (midGrid)     midGrid.style.display     = 'none';
    if (progressRow) progressRow.style.display = 'none';
    if (bottomGrid)  bottomGrid.style.display  = 'none';
    fetchPlannerDetail();
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  } else {
    panel.style.display = 'none';
    if (midGrid)     midGrid.style.display     = '';
    if (progressRow) progressRow.style.display = '';
    if (bottomGrid)  bottomGrid.style.display  = '';
  }
}

async function fetchPlannerDetail() {
  const subtitle = document.getElementById('plannerDetailSubtitle');
  const footer   = document.getElementById('plannerDetailFooter');
  if (subtitle) subtitle.textContent = 'Memuat data...';

  try {
    const res  = await fetch(GAS_DASHBOARD_URL + '?action=getPlannerDetail');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Gagal');

    if (subtitle) subtitle.textContent = 'Periode: ' + data.bulan;
    if (footer)   footer.textContent   = 'Data Planner — ' + data.bulan + ' · ' + data.summary.totalAll + ' LC total';

    const s = data.summary;

    // ── KPI ──
    const kv = document.getElementById('plKpiVendor');    if(kv) { kv.textContent = s.vendorSupporting + '%'; kv.style.color = parseFloat(s.vendorSupporting) >= 95 ? '#d97706' : '#dc2626'; }
    const kc = document.getElementById('plKpiCompleted'); if(kc) { kc.textContent = s.totalCompleted.toLocaleString('id-ID') + ' LC'; }
    const ko = document.getElementById('plKpiOnTime');    if(ko) { ko.textContent = s.totalOnTime.toLocaleString('id-ID') + ' LC'; }
    const kd = document.getElementById('plKpiDelayed');   if(kd) { kd.textContent = s.totalDelayed.toLocaleString('id-ID') + ' LC'; kd.style.color = s.totalDelayed > 0 ? '#dc2626' : '#16a34a'; }
    // Footer & bar KPI cards
    const fv = document.getElementById('footPlVendor');    if(fv) { fv.textContent = s.vendorSupporting + '%'; fv.style.color = parseFloat(s.vendorSupporting) >= 95 ? '#d97706' : '#dc2626'; }
    const fc = document.getElementById('footPlCompleted'); if(fc) fc.textContent = s.totalCompleted.toLocaleString('id-ID') + ' LC';
    const fo = document.getElementById('footPlOnTime');    if(fo) fo.textContent = s.totalOnTime.toLocaleString('id-ID') + ' LC';
    const fd = document.getElementById('footPlDelayed');   if(fd) { fd.textContent = s.totalDelayed.toLocaleString('id-ID') + ' LC'; fd.style.color = s.totalDelayed > 0 ? '#dc2626' : '#16a34a'; }
    const bv = document.getElementById('barPlVendor');  if(bv) setTimeout(()=>bv.style.width=Math.min(parseFloat(s.vendorSupporting),100)+'%',300);
    const bo = document.getElementById('barPlOnTime');  if(bo) setTimeout(()=>bo.style.width=s.totalCompleted>0?Math.round(s.totalOnTime/s.totalCompleted*100)+'%':'0%',300);
    const bd = document.getElementById('barPlDelayed'); if(bd) setTimeout(()=>bd.style.width=s.totalCompleted>0?Math.min(Math.round(s.totalDelayed/s.totalCompleted*100)*3,100)+'%':'0%',300);

    // ── TREND CHART ──
    const trendCtx = document.getElementById('plTrendChart');
    if (trendCtx && data.trendData && data.trendData.length) {
      const existing = Chart.getChart(trendCtx); if(existing) existing.destroy();
      // Custom plugin label % di atas titik line
      const plLabelPlugin = {
        id: 'plLabelPlugin',
        afterDatasetsDraw(chart) {
          const{ctx, data} = chart;
          chart.data.datasets.forEach((dataset, i) => {
            if (dataset.yAxisID !== 'y2') return;
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((point, j) => {
              const val = dataset.data[j];
              if (val === undefined || val === null) return;
              ctx.save();
              ctx.font = 'bold 9px Outfit, sans-serif';
              ctx.fillStyle = '#d97706';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(val + '%', point.x, point.y - 5);
              ctx.restore();
            });
          });
        }
      };

      new Chart(trendCtx.getContext('2d'), {
        type: 'bar',
        plugins: [plLabelPlugin],
        data: {
          labels: data.trendData.map(d => d.date.slice(5)),
          datasets: [
            { label: 'ON TIME (LC)', data: data.trendData.map(d => d.onTime), backgroundColor: '#2563eb', order: 2 },
            { label: 'DELAYED (LC)', data: data.trendData.map(d => d.delayed), backgroundColor: '#ef4444', order: 2 },
            { label: 'ACHIEVEMENT %', data: data.trendData.map(d => d.pct), type: 'line',
              borderColor: '#f59e0b', backgroundColor: 'transparent',
              pointBackgroundColor: '#f59e0b', pointBorderColor: '#fff', pointBorderWidth: 2,
              pointRadius: 5, borderWidth: 2.5, yAxisID: 'y2', order: 1 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          layout: { padding: { top: 20 } },
          scales: {
            x: { stacked: true, ticks: { color: '#475569', font: { size: 9 } }, grid: { display: false }, border: { display: false } },
            y: { stacked: true, ticks: { color: '#475569', font: { size: 10 } }, grid: { display: false }, border: { display: false }, beginAtZero: true },
            y2: { position: 'right', min: 0, max: 110, ticks: { color: '#d97706', font: { size: 10, weight: '700' }, callback: v => v <= 100 ? v + '%' : '' }, grid: { display: false } }
          },
          plugins: {
            legend: { labels: { color: '#475569', font: { size: 10, weight: '600' }, boxWidth: 12 } },
            tooltip: { backgroundColor: 'rgba(15,23,42,0.92)', titleColor: '#f0f4ff', bodyColor: '#cbd5e1',
              callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.raw + (ctx.dataset.yAxisID === 'y2' ? '%' : ' LC') } }
          }
        }
      });
    }

    // ── CBM BY KOTA ──
    const kotaBody = document.getElementById('plKotaBody');
    if (kotaBody && data.kotaData) {
      const fmt = v => v > 0 ? v.toLocaleString('id-ID') : '-';
      const fmtCbm = v => v > 0 ? v.toFixed(2) : '-';
      kotaBody.innerHTML = data.kotaData.map(r =>
        '<tr style="border-bottom:1px solid rgba(200,215,240,0.25);">' +
        '<td style="padding:6px 10px;font-size:11px;font-weight:800;color:#1e293b;">' + r.kota + '</td>' +
        '<td style="padding:6px 8px;text-align:right;color:#4ade80;font-size:11px;">' + fmtCbm(r.onTimeCbm) + '</td>' +
        '<td style="padding:6px 8px;text-align:right;color:#4ade80;font-size:11px;">' + fmt(r.onTimeJml) + '</td>' +
        '<td style="padding:6px 8px;text-align:right;color:#f87171;font-size:11px;">' + fmtCbm(r.terlambatCbm) + '</td>' +
        '<td style="padding:6px 8px;text-align:right;color:#f87171;font-size:11px;">' + fmt(r.terlambatJml) + '</td>' +
        '<td style="padding:6px 8px;text-align:right;color:#94a3b8;font-size:11px;">' + fmtCbm(r.belumCbm) + '</td>' +
        '<td style="padding:6px 8px;text-align:right;color:#94a3b8;font-size:11px;">' + fmt(r.belumJml) + '</td>' +
        '</tr>'
      ).join('') +
      '<tr style="background:rgba(37,99,235,0.06);border-top:2px solid rgba(37,99,235,0.2);">' +
      '<td style="padding:7px 10px;font-size:11px;font-weight:900;color:#1e293b;">TOTAL</td>' +
      '<td style="padding:7px 8px;text-align:right;color:#fbbf24;font-weight:800;font-size:11px;">' + data.kotaTotals.onTimeCbm.toFixed(2) + '</td>' +
      '<td style="padding:7px 8px;text-align:right;color:#fbbf24;font-weight:800;font-size:11px;">' + data.kotaTotals.onTimeJml + '</td>' +
      '<td style="padding:7px 8px;text-align:right;color:#fbbf24;font-weight:800;font-size:11px;">' + data.kotaTotals.terlambatCbm.toFixed(2) + '</td>' +
      '<td style="padding:7px 8px;text-align:right;color:#fbbf24;font-weight:800;font-size:11px;">' + data.kotaTotals.terlambatJml + '</td>' +
      '<td style="padding:7px 8px;text-align:right;color:#fbbf24;font-weight:800;font-size:11px;">' + data.kotaTotals.belumCbm.toFixed(2) + '</td>' +
      '<td style="padding:7px 8px;text-align:right;color:#fbbf24;font-weight:800;font-size:11px;">' + data.kotaTotals.belumJml + '</td>' +
      '</tr>';
    }

    // ── VENDOR NOT AVAILABLE ──
    const vnaBody = document.getElementById('plVendorNotAvailBody');
    if (vnaBody) {
      if (!data.vendorNotAvail || !data.vendorNotAvail.length) {
        vnaBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#6a7a9a;">Tidak ada data</td></tr>';
      } else {
        vnaBody.innerHTML = data.vendorNotAvail.slice(0,20).map((r,i) =>
          '<tr style="border-bottom:1px solid rgba(200,215,240,0.25);">' +
          '<td style="padding:6px 8px;text-align:center;color:#6a7a9a;font-size:11px;">' + (i+1) + '</td>' +
          '<td style="padding:6px 10px;font-weight:800;color:#2563eb;font-family:JetBrains Mono,monospace;font-size:11px;">' + r.lc + '</td>' +
          '<td style="padding:6px 8px;color:var(--text-2);font-size:11px;">' + r.carrier + '</td>' +
          '<td style="padding:6px 8px;color:var(--text-2);font-size:11px;">' + r.jalur + '</td>' +
          '<td style="padding:6px 8px;color:#2563eb;font-size:11px;font-weight:600;">' + r.loadDate + '</td>' +
          '<td style="padding:6px 8px;text-align:right;color:#94a3b8;font-size:11px;">' + r.cbm.toFixed(2) + '</td>' +
          '<td style="padding:6px 8px;text-align:center;color:#f87171;font-weight:700;font-size:11px;">' + (r.aging > 0 ? Math.round(r.aging) + ' HARI' : '-') + '</td>' +
          '</tr>'
        ).join('');
      }
    }

    // ── VENDOR DELAYED ──
    const delBody = document.getElementById('plDelayedBody');
    if (delBody) {
      if (!data.vendorDelayed || !data.vendorDelayed.length) {
        delBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#6a7a9a;">Tidak ada data</td></tr>';
      } else {
        delBody.innerHTML = data.vendorDelayed.slice(0,20).map((r,i) =>
          '<tr style="border-bottom:1px solid rgba(200,215,240,0.25);">' +
          '<td style="padding:6px 8px;text-align:center;color:#6a7a9a;font-size:11px;">' + (i+1) + '</td>' +
          '<td style="padding:6px 10px;font-weight:800;color:#2563eb;font-family:JetBrains Mono,monospace;font-size:11px;">' + r.lc + '</td>' +
          '<td style="padding:6px 8px;color:var(--text-2);font-size:11px;">' + r.carrier + '</td>' +
          '<td style="padding:6px 8px;color:var(--text-2);font-size:11px;">' + r.jalur + '</td>' +
          '<td style="padding:6px 8px;color:#2563eb;font-size:11px;font-weight:600;">' + r.loadDate + '</td>' +
          '<td style="padding:6px 8px;text-align:right;color:#94a3b8;font-size:11px;">' + r.cbm.toFixed(2) + '</td>' +
          '<td style="padding:6px 8px;text-align:center;color:#f87171;font-weight:700;font-size:11px;">' + r.agingLabel + '</td>' +
          '</tr>'
        ).join('');
      }
    }

    // ── AGING PER CARRIER ──
    const agBody = document.getElementById('plAgingBody');
    if (agBody && data.agingData) {
      const dc = v => v > 0 ? '<span style="color:#60a5fa;font-weight:700;">'+v+'</span>' : '<span style="color:#3a4a6a;">-</span>';
      agBody.innerHTML = data.agingData.map((r,i) =>
        '<tr style="border-bottom:1px solid rgba(200,215,240,0.25);">' +
        '<td style="padding:6px 8px;text-align:center;color:#6a7a9a;font-size:11px;">' + (i+1) + '</td>' +
        '<td style="padding:6px 10px;font-weight:700;color:#fbbf24;font-size:11px;">' + r.carrier + '</td>' +
        '<td style="padding:6px 8px;text-align:center;font-size:11px;">' + dc(r.a1) + '</td>' +
        '<td style="padding:6px 8px;text-align:center;font-size:11px;">' + dc(r.a2) + '</td>' +
        '<td style="padding:6px 8px;text-align:center;font-size:11px;">' + dc(r.a3) + '</td>' +
        '<td style="padding:6px 8px;text-align:center;font-size:11px;">' + dc(r.a4) + '</td>' +
        '<td style="padding:6px 8px;text-align:center;font-size:11px;">' + dc(r.a5) + '</td>' +
        '<td style="padding:6px 8px;text-align:center;font-size:11px;">' + dc(r.a5up) + '</td>' +
        '<td style="padding:6px 8px;text-align:center;font-size:11px;"><span style="background:#dc2626;color:#fff;padding:2px 8px;border-radius:4px;font-weight:800;">' + r.total + '</span></td>' +
        '</tr>'
      ).join('') +
      '<tr style="background:rgba(37,99,235,0.06);border-top:2px solid rgba(37,99,235,0.2);">' +
      '<td colspan="2" style="padding:7px 10px;font-size:11px;font-weight:900;color:#1e293b;">TOTAL</td>' +
      '<td style="padding:7px 8px;text-align:center;color:#1e293b;font-weight:800;">' + (data.agingTotals.a1||'-') + '</td>' +
      '<td style="padding:7px 8px;text-align:center;color:#1e293b;font-weight:800;">' + (data.agingTotals.a2||'-') + '</td>' +
      '<td style="padding:7px 8px;text-align:center;color:#1e293b;font-weight:800;">' + (data.agingTotals.a3||'-') + '</td>' +
      '<td style="padding:7px 8px;text-align:center;color:#1e293b;font-weight:800;">' + (data.agingTotals.a4||'-') + '</td>' +
      '<td style="padding:7px 8px;text-align:center;color:#1e293b;font-weight:800;">' + (data.agingTotals.a5||'-') + '</td>' +
      '<td style="padding:7px 8px;text-align:center;color:#1e293b;font-weight:800;">' + (data.agingTotals.a5up||'-') + '</td>' +
      '<td style="padding:7px 8px;text-align:center;"><span style="background:#dc2626;color:#fff;padding:2px 8px;border-radius:4px;font-weight:900;">' + data.agingTotals.total + '</span></td>' +
      '</tr>';
    }

    // ── VENDOR PERFORMANCE % ──
    const vpBody = document.getElementById('plVendorPerfBody');
    if (vpBody && data.vendorPerf) {
      vpBody.innerHTML = data.vendorPerf.map((r,i) => {
        const pct = parseFloat(r.pct);
        const col = pct >= 100 ? '#16a34a' : pct >= 95 ? '#d97706' : '#dc2626';
        const bg = i%2===0 ? 'background:rgba(255,255,255,0.7);' : 'background:rgba(226,232,240,0.5);';
        return '<tr style="'+bg+'border-bottom:1px solid rgba(200,215,240,0.3);">' +
          '<td style="padding:7px 10px;text-align:center;color:#94a3b8;font-size:11px;font-weight:600;">' + (i+1) + '</td>' +
          '<td style="padding:7px 12px;font-weight:800;color:#0f172a;font-size:12px;">' + r.carrier + '</td>' +
          '<td style="padding:7px 10px;text-align:center;color:#16a34a;font-weight:800;font-size:12px;">' + r.onTime + '</td>' +
          '<td style="padding:7px 10px;text-align:center;color:#dc2626;font-weight:800;font-size:12px;">' + (r.delayed > 0 ? r.delayed : '<span style="color:#94a3b8;">-</span>') + '</td>' +
          '<td style="padding:7px 10px;text-align:center;color:#475569;font-size:12px;font-weight:700;">' + r.total + '</td>' +
          '<td style="padding:7px 10px;text-align:center;"><span style="color:'+col+';font-weight:900;font-size:13px;">'+r.pct+'</span></td>' +
          '</tr>';
      }).join('');
    }

    // ── PERCENTAGE BREAKDOWN BARS ──
    const bbEl = document.getElementById('plBreakdownBars');
    if (bbEl) {
      const maxV = Math.max(data.pctDelayed, data.pctOnTime, data.pctBelum, 1);
      const barH = (v) => Math.round((v / 100) * 100);
      bbEl.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">' +
          '<div style="font-size:12px;font-weight:900;color:#f87171;">' + data.pctDelayed + '%</div>' +
          '<div style="width:100%;background:#ef4444;height:' + barH(data.pctDelayed) + 'px;min-height:4px;border-radius:3px 3px 0 0;margin-top:auto;"></div>' +
          '<div style="font-size:10px;color:var(--text-3);text-align:center;">TERLAMBAT</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:2;">' +
          '<div style="font-size:12px;font-weight:900;color:#60a5fa;">' + data.pctOnTime + '%</div>' +
          '<div style="width:100%;background:#3b82f6;height:' + barH(data.pctOnTime) + 'px;min-height:4px;border-radius:3px 3px 0 0;margin-top:auto;"></div>' +
          '<div style="font-size:10px;color:var(--text-3);text-align:center;">ON TIME</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">' +
          '<div style="font-size:12px;font-weight:900;color:#94a3b8;">' + data.pctBelum + '%</div>' +
          '<div style="width:100%;background:#94a3b8;height:' + barH(data.pctBelum) + 'px;min-height:4px;border-radius:3px 3px 0 0;margin-top:auto;"></div>' +
          '<div style="font-size:10px;color:var(--text-3);text-align:center;">BELUM SUPPORT</div>' +
        '</div>';
    }

    // ── AGING BREAKDOWN ──
    const abEl = document.getElementById('plAgingBreak');
    if (abEl && data.agingBreak) {
      const tot = data.agingBreakTotal || 1;
      const items = [
        { label:'1 Hari', val: data.agingBreak.h1 },
        { label:'2 Hari', val: data.agingBreak.h2 },
        { label:'3 Hari', val: data.agingBreak.h3 },
        { label:'4 Hari', val: data.agingBreak.h4 },
        { label:'5 Hari', val: data.agingBreak.h5 },
        { label:'> 5 Hari', val: data.agingBreak.h5up },
      ];
      abEl.innerHTML = items.map(it => {
        const pct = Math.round((it.val/tot)*100);
        return '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div style="font-size:10px;color:var(--text-3);width:48px;">' + it.label + '</div>' +
          '<div style="flex:1;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">' +
            '<div style="width:' + pct + '%;height:100%;background:#94a3b8;border-radius:3px;"></div>' +
          '</div>' +
          '<div style="font-size:10px;color:var(--text-2);font-weight:700;min-width:28px;">' + pct + '%</div>' +
          '</div>';
      }).join('');
    }

  } catch(e) {
    console.error('Planner detail error:', e);
    const els = ['plKotaBody','plVendorNotAvailBody','plDelayedBody','plAgingBody','plVendorPerfBody'];
    els.forEach(id => { const el=document.getElementById(id); if(el) el.innerHTML='<tr><td colspan="9" style="text-align:center;padding:16px;color:#f87171;">Gagal: '+e.message+'</td></tr>'; });
    if(subtitle) subtitle.textContent = 'Error: ' + e.message;
  }
}
