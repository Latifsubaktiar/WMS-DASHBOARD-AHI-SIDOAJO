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
  inbound:   null, storing: null,
  ga:        'https://script.google.com/macros/s/AKfycbzAKPAl_-Bb36LP1qAXgK1DRaYqxz2GUP_4-sbkGHpkxdmzIU4BlaPBYhUvvi04EV7d/exec',
  hr:        null,
};
const IFRAME_PAGES   = ['inventory','outbound','planner','ga','analyst'];
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
let settingsOpen = false;          // ← deklarasi di sini, bukan di bawah!
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
let outboundPanelOpen = false;

function toggleOutboundPanel() {
  outboundPanelOpen = !outboundPanelOpen;
  const panel       = document.getElementById('outboundDetailPanel');
  const midGrid     = document.querySelector('.mid-grid');
  const progressRow = document.querySelector('.progress-row');
  const bottomGrid  = document.querySelector('.bottom-grid');
  if (!panel) return;

  // Tutup panel lain
  if (inboundPanelOpen)  { inboundPanelOpen  = false; const p=document.getElementById('inboundDetailPanel');  if(p) p.style.display='none'; }
  if (storingPanelOpen)  { storingPanelOpen  = false; const p=document.getElementById('storingDetailPanel');  if(p) p.style.display='none'; }

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

    // Summary badges
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

    // Render charts
    const isDark = document.body.classList.contains('dark');
    const border = isDark ? '#060912' : '#ffffff';
    const bg2    = isDark ? '#0e1525' : '#e2e8f0';

    const makeDonut = (id, val, colors, labels) => {
      const el = document.getElementById(id); if(!el) return;
      const ex = Chart.getChart(el); if(ex) ex.destroy();
      new Chart(el.getContext('2d'), {
        type: 'doughnut',
        data: { datasets: [{ data: val, backgroundColor: colors, borderColor: border, borderWidth: 2 }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'72%', plugins:{ legend:{display:false}, tooltip:{enabled:false} } }
      });
    };

    // Chart 1: Status
    document.getElementById('pctOutSelesai').textContent = pctSel + '%';
    document.getElementById('infoOutStatus').textContent = `Selesai:${selesai} Proses:${proses} Antri:${antri} Belum:${belum}`;
    makeDonut('chartOutStatus', [selesai,proses,antri,Math.max(belum,0)], ['#16a34a','#3b82f6','#f59e0b','#ef4444']);

    // Chart 2: %PC
    document.getElementById('pctOutPc').textContent  = avgPc + '%';
    makeDonut('chartOutPc',  [avgPc, Math.max(0,100-avgPc)],  ['#16a34a', bg2]);

    // Chart 3: %STG
    document.getElementById('pctOutStg').textContent = avgStg + '%';
    makeDonut('chartOutStg', [avgStg, Math.max(0,100-avgStg)], ['#3b82f6', bg2]);

    // Chart 4: %LD
    document.getElementById('pctOutLd').textContent  = avgLd + '%';
    makeDonut('chartOutLd',  [avgLd, Math.max(0,100-avgLd)],  ['#f59e0b', bg2]);

    renderOutboundPanelTable(rows);
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
  // Header row style: hitam solid
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
      return `<tr style="background:${hdrBg}">
        ${r.cols.map(c => `<td style="${hdrStyle}">${c||'—'}</td>`).join('')}
      </tr>`;
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
  const cn = 'text-align:center;font-size:12px;font-family:"JetBrains Mono",monospace;color:var(--text-2);';
  const c  = 'font-size:12px;color:var(--text-2);';
  const pBar = (v) => {
    const pct = parseFloat(String(v||'0').replace('%',''))||0;
    const n = pct>1?Math.round(pct):Math.round(pct*100);
    const col=n>=80?'#16a34a':n>=50?'#f59e0b':'#ef4444';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:44px;height:4px;background:rgba(148,163,184,0.2);border-radius:3px;"><div style="width:${Math.min(n,100)}%;height:100%;background:${col};border-radius:3px;"></div></div><span style="font-size:10px;font-weight:800;color:${col}">${n}%</span></div>`;
  };
  const statusBadge = (s) => {
    const u=String(s||'').toUpperCase();
    if(u.includes('SELESAI')||u.includes('KELUAR')) return `<span class="badge badge-green">✅ ${s}</span>`;
    if(u.includes('TERLAMBAT')) return `<span class="badge badge-red">⚠️ ${s}</span>`;
    if(u.includes('PROSES')||u.includes('LOADING')) return `<span class="badge badge-blue">⏳ ${s}</span>`;
    if(u.includes('ANTRI')) return `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.25)">🕐 ${s}</span>`;
    return `<span style="color:var(--text-3);font-size:12px">${s||'—'}</span>`;
  };
  tbody.innerHTML = rows.map((r,i)=>`<tr>
    <td style="${cn}">${i+1}</td>
    <td style="${c}">${r.penyelesaian||'—'}</td>
    <td style="font-weight:700;font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--text)">${escHtml(r.transno||'—')}</td>
    <td style="background:rgba(22,163,74,0.05)">${pBar(r.ppc)}</td>
    <td style="background:rgba(37,99,235,0.05)">${pBar(r.pstg)}</td>
    <td style="background:rgba(245,158,11,0.05)">${pBar(r.pld)}</td>
    <td style="${c}">${escHtml(r.shippingline||'—')}</td>
    <td style="${cn}">${escHtml(r.bu||'—')}</td>
    <td style="${cn}">${escHtml(r.carrierId||'—')}</td>
    <td style="${cn}">${r.stuffingTime||'—'}</td>
    <td style="${c}">${escHtml(r.jenisArmada||'—')}</td>
    <td style="${cn}">${escHtml(r.nopol||'—')}</td>
    <td style="text-align:center">${statusBadge(r.status)}</td>
  </tr>`).join('');
}

// ══════════════════════════════════════
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
function getSlideTableEl(idx){
  // Semua slide scroll via .main (panel cards sudah visible overflow di slideshow mode)
  return document.querySelector('.main');
}
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
    // Tutup inbound panel kalau terbuka
    if (inboundPanelOpen) { inboundPanelOpen = false; if(inboundPanel) inboundPanel.style.display='none'; }
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
    const el = document.querySelector('.stat-card.green-bar .stat-value');
    const sb = document.querySelector('.stat-card.green-bar .stat-sub');
    if (el) { el.textContent = s.total; el.style.color = 'var(--green)'; }
    if (sb) sb.innerHTML = `<span style="color:var(--green);font-weight:700">📦 ${s.sumPicked.toLocaleString()} Picked</span> &nbsp;<span class="dn">📋 ${s.sumSisa.toLocaleString()} Sisa</span>`;
    // Simpan data untuk panel
    window._storingData = data;
    renderDashStoringChart();
    // Update donut juga kalau sudah ada data inbound/outbound
    if (window._lastInTotal !== undefined) updateInventoryStatusDonut(window._lastInTotal, window._lastInSelesai, window._lastOutTotal, window._lastOutSelesai);
  } catch(e) { console.warn('Storing stat card error:', e); }
}

async function fetchStoringToday() {
  // Pakai cache kalau sudah ada
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
  const border = isDark ? '#060912' : '#ffffff';

  document.getElementById('storingSubtitle').textContent = `Total: ${s.total} LC/PO | Release: ${s.sumRelease.toLocaleString()} Case`;
  document.getElementById('storingFooter').textContent = s.total + ' LC/PO terdaftar';

  const makeDonut = (id, pct, color) => {
    const el = document.getElementById(id); if(!el) return;
    const ex = Chart.getChart(el); if(ex) ex.destroy();
    new Chart(el.getContext('2d'), {
      type:'doughnut',
      data:{datasets:[{data:[pct,Math.max(0,100-pct)],backgroundColor:[color,isDark?'#0e1525':'#e2e8f0'],borderColor:border,borderWidth:2}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{display:false},tooltip:{enabled:false}}}
    });
  };

  document.getElementById('pctStorePicking').textContent   = s.pctPickingOverall + '%';
  document.getElementById('infoStorePicking').textContent  = `Picked: ${s.sumPicked.toLocaleString()} / Release: ${s.sumRelease.toLocaleString()}`;
  makeDonut('chartStorePicking', s.pctPickingOverall, '#16a34a');

  document.getElementById('pctStoreStaged').textContent    = s.pctStagedOverall + '%';
  document.getElementById('infoStoreStaged').textContent   = `Staged: ${s.sumStaged.toLocaleString()} / Release: ${s.sumRelease.toLocaleString()}`;
  makeDonut('chartStoreStaged', s.pctStagedOverall, '#f59e0b');

  document.getElementById('pctStoreKapasitas').textContent = s.avgKapasitas + '%';
  document.getElementById('infoStoreKapasitas').textContent = `Avg % Kapasitas Armada`;
  makeDonut('chartStoreKapasitas', s.avgKapasitas, '#6366f1');

  renderStoringTable(data.data);
}

function renderStoringTable(rows) {
  const tbody = document.getElementById('storingTableBody');
  if (!tbody) return;
  if (!rows || !rows.length) {
    tbody.innerHTML = '<tr><td colspan="20" style="text-align:center;padding:20px;color:var(--text-3)">Tidak ada data</td></tr>';
    return;
  }
  const c  = 'text-align:center;font-size:11px;color:var(--text-2);';
  const cn = 'text-align:center;font-size:11px;font-family:"JetBrains Mono",monospace;color:var(--text-2);';
  const num = (v) => (v!==undefined&&v!==null&&!isNaN(Number(v))&&v!=='') ? Number(v).toLocaleString() : '—';
  const dec = (v) => (v!==undefined&&v!==null&&!isNaN(Number(v))&&v!=='') ? Number(v).toFixed(2) : '—';

  const pBar = (pct) => {
    const n = parseInt(pct) || 0;
    const col = n>=80?'#16a34a':n>=50?'#f59e0b':'#ef4444';
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:52px;height:5px;background:rgba(148,163,184,0.2);border-radius:3px;">
        <div style="width:${Math.min(n,100)}%;height:100%;background:${col};border-radius:3px;"></div>
      </div>
      <span style="font-size:10px;font-weight:800;color:${col}">${pct||'0%'}</span>
    </div>`;
  };

  tbody.innerHTML = rows.map((r,i) => `<tr>
    <td style="${c}">${i+1}</td>
    <td style="font-weight:700;font-size:11px;font-family:'JetBrains Mono',monospace;text-align:center;color:var(--text)">${escHtml(r.noLc)}</td>
    <td style="${c}">${escHtml(r.batch)}</td>
    <td style="font-size:11px;color:var(--text-2);max-width:150px;text-align:center">${escHtml(r.tujuan)}</td>
    <td style="${c}">${escHtml(r.tipeArmada)}</td>
    <td style="${cn}">${num(r.kapasitas)}</td>
    <td style="${cn}background:rgba(37,99,235,0.06)">${num(r.releaseCase)}</td>
    <td style="${cn}background:rgba(37,99,235,0.06)">${dec(r.releaseCbm)}</td>
    <td style="${cn}background:rgba(139,92,246,0.06)">${dec(r.astorCbm)}</td>
    <td style="${cn}background:rgba(22,163,74,0.06)">${num(r.pickedCase)}</td>
    <td style="${cn}background:rgba(22,163,74,0.06)">${dec(r.pickedCbm)}</td>
    <td style="${cn}background:rgba(239,68,68,0.06);color:${r.sisaCase>0?'#ef4444':'#16a34a'};font-weight:800">${num(r.sisaCase)}</td>
    <td style="background:rgba(16,185,129,0.06);${c}">${pBar(r.pctPicking)}</td>
    <td style="${cn}background:rgba(16,185,129,0.06)">${dec(r.pencPickCbm)}</td>
    <td style="${cn}background:rgba(245,158,11,0.06);color:${r.sisaPick99>0?'#f59e0b':'#16a34a'};font-weight:800">${num(r.sisaPick99)}</td>
    <td style="${cn}background:rgba(99,102,241,0.06)">${num(r.stagedCase)}</td>
    <td style="${cn}background:rgba(99,102,241,0.06)">${dec(r.stagedCbm)}</td>
    <td style="${cn}background:rgba(59,130,246,0.06)">${num(r.pencDsCase)}</td>
    <td style="${cn}background:rgba(59,130,246,0.06)">${dec(r.pencDsCbm)}</td>
    <td style="background:rgba(234,179,8,0.06);${c}">${pBar(r.pctKapasitas)}</td>
  </tr>`).join('');
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
    // Tutup storing panel kalau terbuka
    if (storingPanelOpen) { storingPanelOpen = false; const sp=document.getElementById('storingDetailPanel'); if(sp) sp.style.display='none'; }
    if (outboundPanelOpen) { outboundPanelOpen = false; const op=document.getElementById('outboundDetailPanel'); if(op) op.style.display='none'; }
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
  const wtBg=(s)=>{const wt=getWt(s);if(wt===2)return 'rgba(59,130,246,0.1)';if(wt===3)return 'rgba(139,92,246,0.1)';return '';};
  const wtLeft=(s)=>{const wt=getWt(s);if(wt===2)return 'border-left:3px solid rgba(59,130,246,0.6)';if(wt===3)return 'border-left:3px solid rgba(139,92,246,0.6)';return '';};
  const wtCol=(s)=>{const wt=getWt(s);if(wt===2)return '#93c5fd';if(wt===3)return '#c4b5fd';return 'var(--text-2)';};
  const sorted=[...rows].sort((a,b)=>getWt(a.stuffing)-getWt(b.stuffing));
  tbody.innerHTML=sorted.map((r,i)=>`<tr style="background:${wtBg(r.stuffing)};${wtLeft(r.stuffing)}">
    <td class="mono" style="font-size:12px">${i+1}</td>
    <td style="font-weight:700;font-size:12px;font-family:'JetBrains Mono',monospace">${escHtml(r.noLc)}</td>
    <td class="mono" style="font-size:12px">${escHtml(r.noPolisi)}</td>
    <td style="font-size:12px">${escHtml(r.ekspedisi)}</td>
    <td style="font-size:12px">${escHtml(r.type)}</td>
    <td class="mono" style="font-size:12px">${escHtml(r.bu)}</td>
    <td style="font-size:12px;color:${r.checkIn?'var(--green)':'var(--text-3)'};font-weight:${r.checkIn?'700':'400'}">${r.checkIn||'—'}</td>
    <td style="font-size:11px;font-weight:700;color:${wtCol(r.stuffing)}">${r.stuffing||'—'}</td>
    <td style="font-size:12px;color:${r.updateUnload?'#2563eb':'var(--text-3)'};font-weight:${r.updateUnload?'700':'400'}">${
      r.updateUnload
        ? String(r.updateUnload).toUpperCase()==='FINISH'
          ? '<span class="badge badge-green">✅ FINISH</span>'
          : String(r.updateUnload).toUpperCase()==='PROSES'
          ? '<span class="badge badge-blue">⏳ PROSES</span>'
          : String(r.updateUnload).toUpperCase()==='ANTRI'
          ? '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3)">🕐 ANTRI</span>'
          : escHtml(r.updateUnload)
        : '—'
    }</td>
    <td>${r.hitMiss&&r.hitMiss.toString().toUpperCase().includes('HIT')?'<span class="badge badge-green">🎯 HIT</span>':r.hitMiss&&r.hitMiss.toString().toUpperCase().includes('MISS')?'<span class="badge badge-red">⚠️ MISS</span>':'<span style="color:var(--text-3);font-size:12px">—</span>'}</td>
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

    const makeDonut=(canvasId,pct,color)=>{
      const el=document.getElementById(canvasId); if(!el) return;
      const ex=Chart.getChart(el); if(ex) ex.destroy();
      new Chart(el.getContext('2d'),{type:'doughnut',data:{datasets:[{data:[pct,Math.max(0,100-pct)],backgroundColor:[color,isDark?'#1e293b':'#e2e8f0'],borderColor:border,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{display:false},tooltip:{enabled:false}}}});
    };

    // Chart 1: Unloading — 4 kategori dari data inbound
    const inboundRows=window._inboundRows||[];
    const finishArmada=inboundRows.filter(r=>r&&r.updateUnload&&r.updateUnload!=='').length;
    const prosesArmada=inboundRows.filter(r=>r&&r.checkIn&&r.checkIn!==''&&r.open&&r.open!==''&&(!r.updateUnload||r.updateUnload==='')).length;
    const antriArmada =inboundRows.filter(r=>r&&r.checkIn&&r.checkIn!==''&&(!r.open||r.open==='')&&(!r.updateUnload||r.updateUnload==='')).length;
    const belumArmada =inboundRows.filter(r=>r&&(!r.checkIn||r.checkIn==='')).length;
    const totalArmada =inboundRows.length||0;
    const pctUnload=totalArmada>0?Math.round((finishArmada/totalArmada)*100):(s&&s.pctUnloading||0);
    document.getElementById('pctUnloading').textContent=pctUnload+'%';
    document.getElementById('infoUnloading').textContent=`✅ ${finishArmada} Finish · ⏳ ${prosesArmada} Proses · 🕐 ${antriArmada} Antri · 🔴 ${belumArmada} Belum`;
    makeDonut('chartUnloading',pctUnload,'#16a34a');

    // Chart 2: Aktual Receive (kolom Q)
    const pctAkt=(s&&s.avgPctAkt)||0;
    document.getElementById('pctAktualRcv').textContent=pctAkt+'%';
    document.getElementById('infoAktualRcv').textContent='';
    makeDonut('chartAktualRcv',pctAkt,'#0891b2');

    // Chart 3: Putaway Inbound (kolom X)
    const pctPutIn=(s&&s.avgPctPutIn2)||0;
    document.getElementById('pctPutawayIn').textContent=pctPutIn+'%';
    document.getElementById('infoPutawayIn').textContent=`Sisa: ${Number(s&&s.sumSisaIn||0).toLocaleString()} LPN`;
    makeDonut('chartPutawayIn',pctPutIn,'#2563eb');

    // Chart 4: Putaway Storing (kolom AG)
    const pctPutStr=(s&&s.avgPctPutStr)||0;
    document.getElementById('pctPutawayStr').textContent=pctPutStr+'%';
    document.getElementById('infoPutawayStr').textContent=`Sisa: ${Number(s&&s.sumSisaStr||0).toLocaleString()} LPN`;
    makeDonut('chartPutawayStr',pctPutStr,'#d97706');

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
  const c='text-align:center;font-size:11px;', cn='text-align:center;font-size:11px;font-family:"JetBrains Mono",monospace;';
  const pBar=(pct)=>{const n=parseInt(pct)||0;const col=n>=100?'#16a34a':n>=90?'#2563eb':n>=70?'#d97706':'#dc2626';return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:52px;height:5px;background:rgba(148,163,184,0.2);border-radius:3px;"><div style="width:${Math.min(n,100)}%;height:100%;background:${col};border-radius:3px;"></div></div><span style="font-size:10px;font-weight:800;color:${col}">${pct||'—'}</span></div>`;};
  const statusBadge=(s)=>{const col=s==='OUT'?'#16a34a':'#d97706',bg=s==='OUT'?'rgba(22,163,74,0.12)':'rgba(217,119,6,0.12)';return `<span style="display:inline-block;padding:2px 8px;border-radius:12px;background:${bg};color:${col};font-weight:800;font-size:10px;border:1px solid ${col}44">${escHtml(s)||'—'}</span>`;};
  const num=(v)=>(v!==undefined&&v!==null&&v!=='')&&!isNaN(Number(v))?Number(v).toLocaleString():'—';
  const sisa=(v)=>{const n=Number(v)||0;return `<span style="font-weight:800;color:${n>0?'#d97706':'#16a34a'}">${n}</span>`;};
  tbody.innerHTML=rows.map((r,i)=>`<tr>
    <td style="${c}">${i+1}</td>
    <td style="font-weight:700;font-size:11px;font-family:'JetBrains Mono',monospace;text-align:center">${escHtml(r.noLc)}</td>
    <td style="${c}">${escHtml(r.type)}</td><td style="${cn}">${escHtml(r.nopol)}</td>
    <td style="${c}">${escHtml(r.batch)}</td>
    <td style="${cn}font-size:10px">${r.tglIn||'—'}</td><td style="${cn}font-size:10px">${r.tglOpen||'—'}</td><td style="${cn}font-size:10px">${r.tglClose||'—'}</td>
    <td style="${c}">${statusBadge(r.status)}</td>
    <td style="${cn}background:rgba(8,145,178,0.04)">${num(r.planQty)}</td><td style="${cn}background:rgba(8,145,178,0.04)">${r.planCbm||'—'}</td><td style="${cn}background:rgba(8,145,178,0.04)">${num(r.planEstLpn)}</td>
    <td style="${cn}background:rgba(22,163,74,0.04)">${num(r.aktQty)}</td><td style="${cn}background:rgba(22,163,74,0.04)">${num(r.aktLpn)}</td>
    <td style="background:rgba(22,163,74,0.04);${c}" colspan="2">${pBar(r.pctAkt)}</td>
    <td style="${cn}background:rgba(139,92,246,0.04)">${num(r.ftQty)}</td><td style="${cn}background:rgba(139,92,246,0.04)">${num(r.ftLpn)}</td>
    <td style="${cn}background:rgba(37,99,235,0.04)">${num(r.putInQty)}</td><td style="${cn}background:rgba(37,99,235,0.04)">${num(r.putInLpn)}</td>
    <td style="${cn}background:rgba(37,99,235,0.04)">${sisa(r.sisaInLpn)}</td>
    <td style="background:rgba(37,99,235,0.04);${c}" colspan="2">${pBar(r.putInPct2)}</td>
    <td style="${cn}background:rgba(234,179,8,0.04)">${num(r.sh1InQty)}</td><td style="${cn}background:rgba(234,179,8,0.04)">${num(r.sh1InLpn)}</td>
    <td style="${cn}background:rgba(59,130,246,0.04)">${num(r.sh2InQty)}</td><td style="${cn}background:rgba(59,130,246,0.04)">${num(r.sh2InLpn)}</td>
    <td style="${cn}background:rgba(22,163,74,0.04)">${num(r.putStrQty)}</td><td style="${cn}background:rgba(22,163,74,0.04)">${num(r.putStrLpn)}</td>
    <td style="${cn}background:rgba(22,163,74,0.04)">${sisa(r.sisaStrLpn)}</td>
    <td style="background:rgba(22,163,74,0.04);${c}" colspan="2">${pBar(r.putStrPct1)}</td>
    <td style="${cn}background:rgba(234,179,8,0.04)">${num(r.sh1StrQty)}</td><td style="${cn}background:rgba(234,179,8,0.04)">${num(r.sh1StrLpn)}</td>
    <td style="${cn}background:rgba(59,130,246,0.04)">${num(r.sh2StrQty)}</td><td style="${cn}background:rgba(59,130,246,0.04)">${num(r.sh2StrLpn)}</td>
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

  // Reset semua
  [inWrap,stWrap,outWrap].forEach(w=>{ if(w) w.style.display='none'; });
  [btnIn,btnSt,btnOut].forEach(b=>{ if(b){ b.style.color='var(--text-3)'; b.style.borderBottom='2px solid transparent'; }});

  if (tab === 'inbound') {
    if(inWrap)  inWrap.style.display  = '';
    if(btnIn) { btnIn.style.color='var(--accent)'; btnIn.style.borderBottom='2px solid var(--accent)'; }
    if(cnt) cnt.textContent = (window._inboundRows||[]).length + ' data inbound hari ini';

  } else if (tab === 'storing') {
    if(stWrap)  stWrap.style.display  = '';
    if(btnSt) { btnSt.style.color='#8b5cf6'; btnSt.style.borderBottom='2px solid #8b5cf6'; }
    // Render dari cache
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
  const wtBg=(s)=>{const wt=getWt(s);if(wt===2)return 'rgba(59,130,246,0.12)';if(wt===3)return 'rgba(139,92,246,0.12)';return '';};
  const wtBL=(s)=>{const wt=getWt(s);if(wt===2)return 'border-left:3px solid rgba(59,130,246,0.7)';if(wt===3)return 'border-left:3px solid rgba(139,92,246,0.7)';return '';};
  const wtCol=(s)=>{const wt=getWt(s);if(wt===2)return '#93c5fd';if(wt===3)return '#c4b5fd';return 'var(--text-2)';};
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
      const el=document.querySelector('.stat-card.blue-bar .stat-value');
      const sb=document.querySelector('.stat-card.blue-bar .stat-sub');
      if(el) el.textContent=total;
      if(sb) sb.innerHTML=`<span class="up">✅ ${selesai} Finish</span> &nbsp;<span style="color:#2563eb;font-weight:700">⏳ ${proses} Proses</span> &nbsp;<span style="color:#f59e0b;font-weight:700">🕐 ${antri} Antri</span> &nbsp;<span class="dn">🔴 ${belum} Belum</span>`;
      renderDashInboundChart(total,selesai,proses,antri,belum,hit,miss);
      renderDashInboundTable(dataIn.data);
    }
  } catch(e){console.warn('Inbound stats error:',e);}
  try {
    const resOut=await fetch(GAS_DASHBOARD_URL+'?action=getOutbound');
    const dataOut=await resOut.json();
    if(dataOut.ok){
      outboundTotal=dataOut.total; outboundSelesai=dataOut.selesai;
      const el=document.querySelector('.stat-card.orange-bar .stat-value');
      const sb=document.querySelector('.stat-card.orange-bar .stat-sub');
      if(el) el.textContent=dataOut.total;
      if(sb) sb.innerHTML=`<span class="up">✅ ${dataOut.selesai} Selesai</span> &nbsp;<span style="color:#2563eb;font-weight:700">⏳ ${dataOut.proses||0} Proses</span> &nbsp;<span class="dn">🕐 ${dataOut.belum||0} Belum</span>`;
      renderDashOutboundChart(dataOut.total,dataOut.selesai,dataOut.proses||0,dataOut.antri||0,dataOut.belum||0,dataOut.hit||0,dataOut.miss||0);
    }
  } catch(e){console.warn('Outbound stats error:',e);}
  updateInventoryStatusDonut(inboundTotal,inboundSelesai,outboundTotal,outboundSelesai);
  window._lastInTotal=inboundTotal; window._lastInSelesai=inboundSelesai;
  window._lastOutTotal=outboundTotal; window._lastOutSelesai=outboundSelesai;
  fetchInventoryValue();

  // Fetch storing stat card
  fetchStoringStatCard();
}

function updateInventoryStatusDonut(inTotal,inSelesai,outTotal,outSelesai){
  const inPct  = inTotal>0  ? Math.round((inSelesai/inTotal)*100)   : 0;
  const outPct = outTotal>0 ? Math.round((outSelesai/outTotal)*100) : 0;

  // Storing % = avg(pickingOverall, stagedOverall)
  const s = window._storingData && window._storingData.summary;
  const storePct = s ? Math.round((s.pctPickingOverall + s.pctStagedOverall) / 2) : 0;

  const sisa   = Math.max(0, 100 - inPct - storePct - outPct);
  const overall = Math.round((inPct + storePct + outPct) / 3);

  // Center
  const centerEl = document.getElementById('donutTotal');
  if (centerEl) centerEl.textContent = overall + '%';

  // Legend
  const iv = document.getElementById('donutInboundVal');  if(iv)  iv.textContent  = inPct    + '%';
  const sv = document.getElementById('donutStoringVal');  if(sv)  sv.textContent  = storePct + '%';
  const ov = document.getElementById('donutOutboundVal'); if(ov)  ov.textContent  = outPct   + '%';
  const bv = document.getElementById('donutBelumVal');    if(bv)  bv.textContent  = sisa     + '%';

  // Chart
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

  // Legend values
  const pp = document.getElementById('piStorePickingVal'); if(pp) pp.textContent = pickPct  + '%';
  const ps = document.getElementById('piStoreStagedVal');  if(ps) ps.textContent = stagePct + '%';
  const pr = document.getElementById('piStoreSisaVal');    if(pr) pr.textContent = sisaPct  + '%';
  const pk = document.getElementById('piStoreKapVal');     if(pk) pk.textContent = (s.avgKapasitas||0) + '%';

  const canvas = document.getElementById('dashStoringChart'); if(!canvas) return;
  const ex = Chart.getChart(canvas); if(ex) ex.destroy();
  const isDark = document.body.classList.contains('dark');
  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [pickPct, stagePct, sisaPct],
        backgroundColor: ['#16a34a','#f59e0b', isDark?'#1e293b':'#fecaca'],
        borderColor: isDark?'#060912':'#ffffff',
        borderWidth: 3,
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:false, cutout:'72%',
      plugins:{legend:{display:false},tooltip:{enabled:false}}
    }
  });
}

async function fetchInventoryValue(){
  try{
    const res=await fetch(GAS_DASHBOARD_URL+'?action=getDashboardData');
    const data=await res.json(); if(!data.ok) return;
    const inv=data.mtd&&data.mtd.inventory?data.mtd.inventory:0;
    const el=document.querySelector('.stat-card.green-bar .stat-value');
    const sb=document.querySelector('.stat-card.green-bar .stat-sub');
    if(el&&inv){const fmt=inv>=1000000?'Rp '+(inv/1000000).toFixed(1).replace('.0','')+' Jt':inv>=1000?'Rp '+(inv/1000).toFixed(0)+' Rb':inv;el.textContent=fmt;el.style.fontSize='16px';}
    if(sb&&data.mtd) sb.textContent='Data bulan '+(data.mtd.monthName||'');
  }catch(e){console.warn('Inventory value error:',e);}
}

fetchDashboardStats();
setInterval(fetchDashboardStats,5*60*1000);

// ══════════════════════════════════════
//  CHARTS — DAILY ACTIVITY (custom datalabels, no CDN)
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

// ── 3D TILT ──
document.querySelectorAll('.stat-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-0.5,y=(e.clientY-r.top)/r.height-0.5;card.style.transform=`perspective(500px) rotateY(${x*16}deg) rotateX(${-y*16}deg) translateY(-6px) scale(1.03)`;});
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

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
