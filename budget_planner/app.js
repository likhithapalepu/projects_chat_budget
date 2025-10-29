// Simple client-side budget planner
const desc = document.getElementById('desc');
const amt = document.getElementById('amount');
const type = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const entries = document.getElementById('entries');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const ctx = document.getElementById('budgetChart').getContext('2d');

let data = JSON.parse(localStorage.getItem('budgetData') || '[]');

function save() {
  localStorage.setItem('budgetData', JSON.stringify(data));
  render();
}

function addEntry(d, a, t) {
  data.push({desc:d, amount: +a, type:t, id:Date.now()});
  save();
}

function removeEntry(id) {
  data = data.filter(e => e.id !== id);
  save();
}

addBtn.addEventListener('click', () => {
  if (!desc.value || !amt.value) return;
  addEntry(desc.value, amt.value, type.value);
  desc.value = ''; amt.value = '';
});

function render() {
  entries.innerHTML = '';
  let income = 0, expense = 0;
  data.forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.desc} — ${e.type} — ₹${e.amount}`;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => removeEntry(e.id);
    li.appendChild(btn);
    entries.appendChild(li);
    if (e.type === 'income') income += e.amount;
    else expense += e.amount;
  });
  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
  updateChart(income, expense);
}

let chart = null;
function updateChart(income, expense) {
  const labels = ['Income', 'Expense'];
  const values = [income, expense];
  if (chart) {
    chart.data.datasets[0].data = values;
    chart.update();
    return;
  }
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

render();
