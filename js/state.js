// ─── STATE ───
let transactions = JSON.parse(localStorage.getItem('ff_transactions') || 'null') || SEED_TRANSACTIONS;
let currentRole  = 'admin';
let editingId    = null;
let currentTab   = 'overview';

// ─── PERSISTENCE ───
function saveState() {
  localStorage.setItem('ff_transactions', JSON.stringify(transactions));
}

// ─── COMPUTED HELPERS ───
function totalIncome() {
  return transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
}
function totalExpense() {
  return transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
}
function netBalance() {
  return totalIncome() - totalExpense();
}
function categoryTotal(cat) {
  return transactions
    .filter(t => t.category === cat && t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
}

// ─── FORMAT HELPERS ───
function fmt(n) {
  return '₹' + n.toLocaleString('en-IN');
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
