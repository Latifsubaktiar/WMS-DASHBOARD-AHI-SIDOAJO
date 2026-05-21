// ══════════════════════════════════════════════════════════
//  INBOUND DASHBOARD — script.js
// ══════════════════════════════════════════════════════════

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxxjijcpvbfzKtZH1gJKPswP1heNpopp2TERUESg5mJiLu7t8qZuSpVist4uAMwxZzN/exec';

let allData = [];
let progressChart = null;

// ── Load Data ──
async function loadData() {
  showState('loading');
  try {
    const res  = await fetch(GAS_URL + '?action=getInbound');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Gagal ambil data');

    document.getElementById('todayBadge').textContent = '📅 ' + data.today;

    const { total, checkedIn, selesai, hit, miss } = data.summary;
    document.getElementById('sumTotal').textContent     = total;
    document.getElementById('sumCheckedIn').textContent = checkedIn;
    document.getElementById('sumSelesai').textContent   = selesai;
    document.getElementById('sumHit').textContent       = hit;
    document.getElementById('sumMiss').textContent      = miss;

    // Update pie chart
    updateProgressChart(total, checkedIn, selesai);

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

// ── Progress Chart ──
function updateProgressChart(total, checkedIn, selesai) {
  const belum   = total - checkedIn;
  const proses  = checkedIn - selesai;
  const pct     = total > 0 ? Math.round((selesai / total) * 100) : 0;
  const sisaPct = 100 - pct;

  document.getElementById('pctValue').textContent    = pct + '%';
  document.getElementById('legSelesai').textContent  = selesai + ' truck (' + pct + '%)';
  document.getElementById('legCheckin').textContent  = checkedIn + ' truck';
  document.getElementById('legBelum').textContent    = belum + ' truck';
  document.getElementById('legSisa').textContent     = sisaPct + '% belum selesai';

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const borderColor = isDark ? '#161b22' : '#ffffff';

  const ctx = document.getElementById('progressChart').getContext('2d');

  if (progressChart) progressChart.destroy();

  progressChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Selesai', 'Check In (Proses)', 'Belum Check In'],
      datasets: [{
        data: [selesai, proses > 0 ? proses : 0, belum > 0 ? belum : 0],
        backgroundColor: ['#16a34a', '#2563eb', '#dc2626'],
        borderColor: borderColor,
        borderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? 'rgba(22,27,34,0.95)' : 'rgba(17,24,39,0.92)',
          titleColor: '#f0f6fc',
          bodyColor: '#c9d1d9',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw} truck`
          }
        }
      }
    }
  });
}

// ── Render Table ──
function renderTable(rows) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = rows.map((r, i) => `
    <tr>
      <td class="mono">${i + 1}</td>
      <td class="bold">${escHtml(r.noLc)}</td>
      <td class="mono">${escHtml(r.noPolisi)}</td>
      <td>${escHtml(r.ekspedisi)}</td>
      <td>${escHtml(r.siteFrom)}</td>
      <td>${escHtml(r.type)}</td>
      <td class="mono">${escHtml(r.bu)}</td>
      <td>${escHtml(r.updatePerj)}</td>
      <td class="mono">${r.checkIn ? `<span style="color:var(--green);font-weight:700">${escHtml(r.checkIn)}</span>` : '<span style="color:var(--text-3)">—</span>'}</td>
      <td style="max-width:180px;white-space:normal;font-size:12px;">${r.stuffing ? escHtml(r.stuffing) : '<span style="color:var(--text-3)">—</span>'}</td>
      <td>${badgeHitMiss(r.hitMiss)}</td>
      <td class="mono">${r.updateUnload ? `<span style="color:var(--blue);font-weight:700">${escHtml(r.updateUnload)}</span>` : '<span style="color:var(--text-3)">—</span>'}</td>
    </tr>
  `).join('');

  document.getElementById('rowCount').textContent = rows.length;
  document.getElementById('tableFooter').style.display = '';
}

function badgeHitMiss(val) {
  const v = String(val || '').toUpperCase().trim();
  if (v.includes('HIT'))  return `<span class="badge badge-hit">🎯 HIT</span>`;
  if (v.includes('MISS')) return `<span class="badge badge-miss">⚠️ MISS</span>`;
  return `<span class="badge badge-none">—</span>`;
}

function filterTable() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) { renderTable(allData); return; }
  const filtered = allData.filter(r =>
    [r.noLc, r.noPolisi, r.ekspedisi, r.siteFrom, r.type, r.hitMiss, r.bu]
      .some(v => String(v||'').toLowerCase().includes(q))
  );
  renderTable(filtered);
}

function showState(state) {
  document.getElementById('loadingWrap').classList.toggle('hidden', state !== 'loading');
  document.getElementById('errorWrap').classList.toggle('hidden',   state !== 'error');
  document.getElementById('emptyWrap').classList.toggle('hidden',   state !== 'empty');
  document.getElementById('tableWrap').classList.toggle('hidden',   state !== 'table');
  if (state !== 'table') document.getElementById('tableFooter').style.display = 'none';
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

loadData();
setInterval(loadData, 5 * 60 * 1000);
