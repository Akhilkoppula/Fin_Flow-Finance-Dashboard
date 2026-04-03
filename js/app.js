// ─── RENDER ALL ───
function renderAll() {
  renderSummaryCards();
  renderCharts();
  renderTransactions();
  renderInsights();
}

// ─── INIT ───
function init() {
  document.getElementById('pageDate').textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  document.getElementById('fDate').value = new Date().toISOString().split('T')[0];
  populateCategoryFilter();
  renderAll();
}

// ─── BOOT ───
init();
