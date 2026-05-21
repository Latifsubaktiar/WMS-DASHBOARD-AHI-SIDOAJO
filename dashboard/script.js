// ══════════════════════════════════════════════════════════
//  INBOUND DASHBOARD — script.js
//  Ganti GAS_URL setelah deploy Code.gs
// ══════════════════════════════════════════════════════════

const GAS_URL = 'GANTI_DENGAN_URL_GAS_INBOUND_KAMU';

// ── State ──
let allData = [];

// ── Load Data ──
async function loadData() {
  showState('loading');
  try {
    const res  = await fetch(GAS_URL + '?action=getInbound');
    const data = await res.json();

    if (!data.ok) throw new Error(data.error || 'Gagal ambil data');

    // Update tanggal
    document.getElementById('todayBadge').textContent = '📅 ' + data.today;

    // Update summary
    document.getElementById('sumTotal').textContent     = data.summary.total;
    document.getElementById('sumCheckedIn').textContent = data.summary.checkedIn;
    document.getElementById('sumSelesai').textContent   = data.summary.selesai;
    document.getElementById('sumHit').textContent       = data.summary.hit;
    document.getElementById('sumMiss').textContent      = data.summary.miss;

    allData = data.data;

    if (!allData.length) { showState('empty'); return; }

    renderTable(allData);
    showState('table');

    document.getElementById('lastUpdate').textContent =
      'Update: ' + new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});

  } catch(e) {
    document.getElementById('errorMsg').textContent = e.message;
    showState('error');
  }
}

// ── Render Table ──
function renderTable(rows) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = rows.map((r, i) => `
    <tr>
      <td class="mono">${r.no || i+1}</td>
      <td class="bold">${escHtml(r.noLc)}</td>
      <td class="mono">${escHtml(r.noPolisi)}</td>
      <td>${escHtml(r.ekspedisi)}</td>
      <td>${escHtml(r.siteFrom)}</td>
      <td>${escHtml(r.type)}</td>
      <td class="mono">${escHtml(r.bu)}</td>
      <td>${escHtml(r.updatePerj)}</td>
      <td class="mono">${r.checkIn ? `<span style="color:var(--green);font-weight:700">${escHtml(r.checkIn)}</span>` : '<span style="color:var(--text-3)">—</span>'}</td>
      <td class="mono">${r.stuffing ? escHtml(r.stuffing) : '<span style="color:var(--text-3)">—</span>'}</td>
      <td>${badgeHitMiss(r.hitMiss)}</td>
      <td class="mono">${r.updateUnload ? `<span style="color:var(--blue);font-weight:700">${escHtml(r.updateUnload)}</span>` : '<span style="color:var(--text-3)">—</span>'}</td>
    </tr>
  `).join('');

  document.getElementById('rowCount').textContent  = rows.length;
  document.getElementById('tableFooter').style.display = '';
}

// ── Badge Hit/Miss ──
function badgeHitMiss(val) {
  const v = String(val || '').toUpperCase().trim();
  if (v.includes('HIT'))  return `<span class="badge badge-hit">🎯 HIT</span>`;
  if (v.includes('MISS')) return `<span class="badge badge-miss">⚠️ MISS</span>`;
  return `<span class="badge badge-none">—</span>`;
}

// ── Filter/Search ──
function filterTable() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) { renderTable(allData); return; }
  const filtered = allData.filter(r =>
    [r.noLc, r.noPolisi, r.ekspedisi, r.siteFrom, r.type, r.hitMiss]
      .some(v => String(v||'').toLowerCase().includes(q))
  );
  renderTable(filtered);
}

// ── State Manager ──
function showState(state) {
  document.getElementById('loadingWrap').classList.toggle('hidden', state !== 'loading');
  document.getElementById('errorWrap').classList.toggle('hidden',   state !== 'error');
  document.getElementById('emptyWrap').classList.toggle('hidden',   state !== 'empty');
  document.getElementById('tableWrap').classList.toggle('hidden',   state !== 'table');
  if (state !== 'table') document.getElementById('tableFooter').style.display = 'none';
}

// ── Escape HTML ──
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Auto refresh setiap 5 menit ──
loadData();
setInterval(loadData, 5 * 60 * 1000);
