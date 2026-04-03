// ─── CHART INSTANCES ───
let lineChart, doughnutChart, barChart, insightLineChart;

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

// shared chart defaults
function chartDefaults() {
  return {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7a7f94', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7a7f94', font: { size: 11 } } },
  };
}

// ── Balance Trend (Line) ──
function renderLineChart() {
  const ctx = document.getElementById('lineChart').getContext('2d');
  if (lineChart) lineChart.destroy();
  const balanceData = [42000, 55000, 48000, 67000, 72000, netBalance()];
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'Balance',
        data: balanceData,
        borderColor: '#c9a84c',
        backgroundColor: 'rgba(201,168,76,0.08)',
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointBackgroundColor: '#c9a84c', pointRadius: 4, pointHoverRadius: 7,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => '₹' + c.parsed.y.toLocaleString('en-IN') } },
      },
      scales: {
        ...chartDefaults(),
        y: { ...chartDefaults().y, ticks: { ...chartDefaults().y.ticks, callback: v => '₹' + v / 1000 + 'k' } },
      },
    },
  });
}

// ── Spending Breakdown (Doughnut) ──
function renderDoughnutChart() {
  const ctx = document.getElementById('doughnutChart').getContext('2d');
  if (doughnutChart) doughnutChart.destroy();

  const expByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expByCategory[t.category] = (expByCategory[t.category] || 0) + t.amount;
  });
  const top = Object.entries(expByCategory).sort((a, b) => b[1] - a[1]).slice(0, 6);

  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: top.map(c => c[0]),
      datasets: [{
        data: top.map(c => c[1]),
        backgroundColor: top.map(c => CATEGORY_COLORS[c[0]] || '#94a3b8'),
        borderWidth: 0, hoverOffset: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#7a7f94', font: { size: 11 }, padding: 10, boxWidth: 10, boxHeight: 10 } },
        tooltip: { callbacks: { label: c => `${c.label}: ₹${c.parsed.toLocaleString('en-IN')}` } },
      },
    },
  });
}

// ── Income vs Expenses (Bar) ──
function renderBarChart() {
  const ctx = document.getElementById('barChart').getContext('2d');
  if (barChart) barChart.destroy();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'Income',   data: [92000, 88000, 95000, 107000, 93500, totalIncome()],  backgroundColor: 'rgba(74,222,128,0.7)',  borderRadius: 4 },
        { label: 'Expenses', data: [50000, 33000, 47000, 40000,  21400, totalExpense()], backgroundColor: 'rgba(248,113,113,0.7)', borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#7a7f94', font: { size: 11 } } },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ₹${c.parsed.y.toLocaleString('en-IN')}` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#7a7f94', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7a7f94', font: { size: 11 }, callback: v => '₹' + v / 1000 + 'k' } },
      },
    },
  });
}

// ── Insight Line Chart ──
function renderInsightLineChart() {
  const ctx = document.getElementById('insightLineChart').getContext('2d');
  if (insightLineChart) insightLineChart.destroy();
  const cats = ['Food', 'Transport', 'Shopping', 'Entertainment'];
  const mockData = {
    Food:          [4800, 5200, 4100, 4900, 2200, categoryTotal('Food')],
    Transport:     [1200,  900, 1400, 1100, 1400, categoryTotal('Transport')],
    Shopping:      [3200, 2800, 5500, 4100,    0, categoryTotal('Shopping')],
    Entertainment: [1800, 1200, 1400, 1600,    0, categoryTotal('Entertainment')],
  };
  insightLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: cats.map(cat => ({
        label: cat, data: mockData[cat],
        borderColor: CATEGORY_COLORS[cat], backgroundColor: 'transparent',
        borderWidth: 2, tension: 0.4, pointRadius: 3,
      })),
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#7a7f94', font: { size: 11 } } },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ₹${c.parsed.y.toLocaleString('en-IN')}` } },
      },
      scales: {
        ...chartDefaults(),
        y: { ...chartDefaults().y, ticks: { ...chartDefaults().y.ticks, callback: v => '₹' + v / 1000 + 'k' } },
      },
    },
  });
}

// ── Render all overview charts ──
function renderCharts() {
  renderLineChart();
  renderDoughnutChart();
  renderBarChart();
}