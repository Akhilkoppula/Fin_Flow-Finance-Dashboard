// ─── THEME ───
let isLight = false;

function toggleTheme() {
  isLight = !isLight;
  document.body.classList.toggle('light', isLight);
  document.getElementById('themeIcon').textContent  = isLight ? '🌙' : '☀️';
  document.getElementById('themeLabel').textContent = isLight ? 'Dark' : 'Light';
  // re-draw charts so grid colours update
  setTimeout(() => {
    renderCharts();
    if (currentTab === 'insights') renderInsightLineChart();
  }, 100);
}

// ─── SIDEBAR ───
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── TOAST ───
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── ROLE SWITCHER ───
function switchRole(role) {
  currentRole = role;
  const banner = document.getElementById('roleBanner');
  const addBtn = document.getElementById('addTxBtn');

  if (role === 'admin') {
    banner.className = 'role-banner';
    banner.innerHTML = '👑 Admin Mode — You can add, edit, and delete transactions.';
    addBtn.disabled  = false;
  } else {
    banner.className = 'role-banner viewer';
    banner.innerHTML = '👁 Viewer Mode — Read-only access. Contact admin to make changes.';
    addBtn.disabled  = true;
  }
  renderTransactions();
}

// ─── TAB SWITCHING ───
const PAGE_TITLES = {
  overview:     'Dashboard Overview',
  transactions: 'Transactions',
  insights:     'Insights & Analytics',
};

function switchTab(tab) {
  currentTab = tab;

  ['overview', 'transactions', 'insights'].forEach(t => {
    document.getElementById('page-' + t).style.display = t === tab ? 'block' : 'none';
    document.getElementById('tab-'  + t).classList.toggle('active', t === tab);
  });

  document.querySelectorAll('.nav-item[data-tab]').forEach(n => {
    n.classList.toggle('active', n.dataset.tab === tab);
  });

  document.getElementById('pageTitle').textContent = PAGE_TITLES[tab];

  if (tab === 'insights') renderInsightLineChart();
}

// ─── EXPORT ───
function exportData() {
  if (currentTab === 'transactions') {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows   = transactions.map(t =>
      `${t.date},"${t.desc}",${t.category},${t.type},${t.amount}`
    ).join('\n');
    triggerDownload('transactions.csv',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows));
    showToast('📥 CSV exported!');
  } else {
    triggerDownload('finflow-data.json',
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(transactions, null, 2)));
    showToast('📥 JSON exported!');
  }
}

function triggerDownload(filename, dataUrl) {
  const a = document.createElement('a');
  a.href = dataUrl; a.download = filename; a.click();
}