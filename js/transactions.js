// ─── POPULATE CATEGORY FILTER ───
function populateCategoryFilter() {
  const cats = [...new Set(transactions.map(t => t.category))].sort();
  const sel = document.getElementById('txCategory');
  sel.innerHTML = '<option value="">All Categories</option>' +
    cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

// ─── RENDER TRANSACTION TABLE ───
function renderTransactions() {
  const search   = document.getElementById('txSearch').value.toLowerCase();
  const type     = document.getElementById('txType').value;
  const category = document.getElementById('txCategory').value;
  const sort     = document.getElementById('txSort').value;

  let filtered = transactions.filter(t => {
    if (type     && t.type !== type)         return false;
    if (category && t.category !== category) return false;
    if (search   && !t.desc.toLowerCase().includes(search) && !t.category.toLowerCase().includes(search)) return false;
    return true;
  });

  if      (sort === 'date-desc')   filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  else if (sort === 'date-asc')    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sort === 'amount-desc') filtered.sort((a, b) => b.amount - a.amount);
  else                             filtered.sort((a, b) => a.amount - b.amount);

  document.getElementById('txCountBadge').textContent = `(${filtered.length})`;
  document.getElementById('txCount').textContent =
    `Showing ${filtered.length} of ${transactions.length} transactions`;

  const body = document.getElementById('txBody');

  if (!filtered.length) {
    body.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <div class="e-icon">📭</div>
          <p>No transactions found</p>
        </div>
      </td></tr>`;
    return;
  }

  body.innerHTML = filtered.map(t => `
    <tr>
      <td style="color:var(--text-muted);font-size:12px;white-space:nowrap">${formatDate(t.date)}</td>
      <td style="font-weight:500">${t.desc}</td>
      <td>
        <span class="tx-category">
          <span class="tx-dot" style="background:${CATEGORY_COLORS[t.category] || '#94a3b8'}"></span>
          ${t.category}
        </span>
      </td>
      <td>
        <span class="tx-type-badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}">
          ${t.type}
        </span>
      </td>
      <td class="${t.type === 'income' ? 'tx-amount-pos' : 'tx-amount-neg'}">
        ${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}
      </td>
      <td>
        ${currentRole === 'admin' ? `
          <div class="tx-actions">
            <button class="icon-btn" onclick="editTransaction(${t.id})"   title="Edit">✏️</button>
            <button class="icon-btn" onclick="deleteTransaction(${t.id})" title="Delete">🗑</button>
          </div>` :
          `<span style="color:var(--text-dim);font-size:12px">—</span>`
        }
      </td>
    </tr>
  `).join('');
}

// ─── SUMMARY CARDS ───
function renderSummaryCards() {
  const income  = totalIncome();
  const expense = totalExpense();
  const balance = netBalance();
  const savings = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const cards = [
    { label: 'Total Balance',  value: fmt(balance), icon: '💰', color: 'var(--gold-dim)',  change: '+12.4%', up: true  },
    { label: 'Total Income',   value: fmt(income),  icon: '📈', color: 'var(--green-dim)', change: '+8.2%',  up: true  },
    { label: 'Total Expenses', value: fmt(expense), icon: '📉', color: 'var(--red-dim)',   change: '+3.1%',  up: false },
    { label: 'Savings Rate',   value: savings + '%',icon: '🏦', color: 'var(--blue-dim)',  change: '+2.3%',  up: true  },
  ];

  document.getElementById('summaryCards').innerHTML = cards.map((c, i) => `
    <div class="card" style="animation-delay:${i * 0.08}s">
      <div class="card-icon" style="background:${c.color}">${c.icon}</div>
      <div class="card-label">${c.label}</div>
      <div class="card-value">${c.value}</div>
      <div class="card-change ${c.up ? '' : 'down'}">${c.up ? '↑' : '↓'} ${c.change} vs last month</div>
    </div>
  `).join('');
}

// ─── CRUD ───
function openModal(id = null) {
  if (currentRole !== 'admin') return showToast('⚠️ Admin access required');
  editingId = id;
  document.getElementById('modalTitle').textContent = id ? 'Edit Transaction' : 'New Transaction';

  if (id) {
    const t = transactions.find(x => x.id === id);
    document.getElementById('fDesc').value     = t.desc;
    document.getElementById('fAmount').value   = t.amount;
    document.getElementById('fType').value     = t.type;
    document.getElementById('fCategory').value = t.category;
    document.getElementById('fDate').value     = t.date;
  } else {
    document.getElementById('fDesc').value     = '';
    document.getElementById('fAmount').value   = '';
    document.getElementById('fType').value     = 'expense';
    document.getElementById('fCategory').value = 'Food';
    document.getElementById('fDate').value     = new Date().toISOString().split('T')[0];
  }
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function saveTransaction() {
  const desc     = document.getElementById('fDesc').value.trim();
  const amount   = parseFloat(document.getElementById('fAmount').value);
  const type     = document.getElementById('fType').value;
  const category = document.getElementById('fCategory').value;
  const date     = document.getElementById('fDate').value;

  if (!desc || !amount || !date) return showToast('⚠️ Please fill all fields');

  if (editingId) {
    const idx = transactions.findIndex(t => t.id === editingId);
    transactions[idx] = { ...transactions[idx], desc, amount, type, category, date };
    showToast('✅ Transaction updated');
  } else {
    transactions.push({ id: Date.now(), desc, amount, type, category, date });
    showToast('✅ Transaction added');
  }
  saveState();
  closeModal();
  populateCategoryFilter();
  renderAll();
}

function editTransaction(id)   { openModal(id); }

function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;
  transactions = transactions.filter(t => t.id !== id);
  saveState();
  populateCategoryFilter();
  renderAll();
  showToast('🗑 Transaction deleted');
}