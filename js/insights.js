// ─── RENDER INSIGHTS ───
function renderInsights() {
  const expByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expByCategory[t.category] = (expByCategory[t.category] || 0) + t.amount;
  });

  const topCat     = Object.entries(expByCategory).sort((a, b) => b[1] - a[1])[0];
  const income     = totalIncome();
  const expense    = totalExpense();
  const balance    = netBalance();
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
  const expCount   = transactions.filter(t => t.type === 'expense').length;
  const avgTx      = expCount > 0 ? (expense / expCount).toFixed(0) : 0;
  const txCount    = transactions.length;
  const ratio      = income > 0 ? ((expense / income) * 100).toFixed(1) : 0;

  const insights = [
    {
      icon: '🔥', bg: 'var(--red-dim)',
      title: 'Highest Spending Category',
      text: `<strong>${topCat ? topCat[0] : 'N/A'}</strong> accounts for ₹${topCat ? topCat[1].toLocaleString('en-IN') : 0} of your total spending — your biggest expense area.`,
    },
    {
      icon: '💹', bg: 'var(--green-dim)',
      title: 'Savings Rate',
      text: `You're saving <strong>${savingsRate}%</strong> of your income this period. Financial advisors recommend a savings rate of at least 20%.`,
    },
    {
      icon: '📊', bg: 'var(--blue-dim)',
      title: 'Monthly Comparison',
      text: `Expenses are <strong>${expense > 40000 ? 'above' : 'within'}</strong> your typical monthly range. Income of ${fmt(income)} supports healthy spending.`,
    },
    {
      icon: '💡', bg: 'var(--gold-dim)',
      title: 'Smart Observation',
      text: `You have <strong>${txCount} transactions</strong> with an average expense of ₹${parseInt(avgTx).toLocaleString('en-IN')} per transaction.`,
    },
    {
      icon: '🎯', bg: 'rgba(167,139,250,0.15)',
      title: 'Budget Health',
      text: `Your expense-to-income ratio is <strong>${ratio}%</strong>. Keeping this below 70% ensures long-term financial stability.`,
    },
    {
      icon: '📅', bg: 'rgba(56,189,248,0.12)',
      title: 'Transaction Frequency',
      text: `You're averaging <strong>${(txCount / 3).toFixed(1)} transactions/month</strong>. Regular reviews help keep spending in check.`,
    },
  ];

  document.getElementById('insightsGrid').innerHTML = insights.map((ins, i) => `
    <div class="insight-card" style="animation-delay:${i * 0.07}s">
      <div class="insight-icon" style="background:${ins.bg}">${ins.icon}</div>
      <div class="insight-text">
        <h4>${ins.title}</h4>
        <p>${ins.text}</p>
      </div>
    </div>
  `).join('');
}