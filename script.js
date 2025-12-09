// -------------------------------
// LOAD DATA FIRST
// -------------------------------
let incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
let expenseData = JSON.parse(localStorage.getItem("expenseData")) || [];

function saveData() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem("expenseData", JSON.stringify(expenseData));
}

// -------------------------------
// ELEMENTS
// -------------------------------
const els = {
  totalIncome: document.getElementById("total-income"),
  totalExpenses: document.getElementById("total-expenses"),
  totalBalance: document.getElementById("total-balance"),
  incomeList: document.getElementById("income-list"),
  expenseTableBody: document.getElementById("expense-table-body"),
  expenseCount: document.getElementById("expense-count"),
  incomeForm: document.getElementById("income-form"),
  incomeSource: document.getElementById("income-source"),
  incomeAmount: document.getElementById("income-amount"),
  expenseForm: document.getElementById("expense-form"),
  expenseDesc: document.getElementById("expense-desc"),
  expenseCategory: document.getElementById("expense-category"),
  expenseAmount: document.getElementById("expense-amount"),
  langSelect: document.getElementById("lang-select"),
  aiAnalyzeBtn: document.getElementById("ai-analyze-btn")
};

// -------------------------------
// SUMMARY
// -------------------------------
function renderSummary() {
  const totalIncome = incomeData.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const totalExpenses = expenseData.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const balance = totalIncome - totalExpenses;

  if (els.totalIncome) els.totalIncome.textContent = totalIncome.toLocaleString();
  if (els.totalExpenses) els.totalExpenses.textContent = totalExpenses.toLocaleString();
  if (els.totalBalance) els.totalBalance.textContent = balance.toLocaleString();
}

// -------------------------------
// INCOME LIST
// -------------------------------
function renderIncomeList() {
  if (!els.incomeList) return;

  els.incomeList.innerHTML = "";

  incomeData.forEach((item, index) => {
    const amount = Number(item.amount) || 0;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.source}</span>
      <span>${amount.toLocaleString()}</span>
      <button class="delete-btn">✖</button>
    `;

    li.querySelector("button").onclick = () => {
      incomeData.splice(index, 1);
      saveData();
      renderIncomeList();
      renderSummary();
    };

    els.incomeList.appendChild(li);
  });
}

// -------------------------------
// EXPENSE TABLE
// -------------------------------
function renderExpenseTable() {
  if (!els.expenseTableBody || !els.expenseCount) return;

  els.expenseTableBody.innerHTML = "";

  expenseData.forEach((item, index) => {
    const amount = Number(item.amount) || 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.desc}</td>
      <td>${item.category}</td>
      <td>${amount.toLocaleString()}</td>
      <td><button class="delete-btn">✖</button></td>
    `;

    tr.querySelector("button").onclick = () => {
      expenseData.splice(index, 1);
      saveData();
      renderExpenseTable();
      renderSummary();
    };

    els.expenseTableBody.appendChild(tr);
  });

  els.expenseCount.textContent = expenseData.length + " items";
}

// -------------------------------
// INCOME FORM
// -------------------------------
if (els.incomeForm) {
  els.incomeForm.addEventListener("submit", e => {
    e.preventDefault();

    const source = els.incomeSource.value.trim();
    const amount = Number(els.incomeAmount.value);

    if (!source || amount <= 0 || !Number.isFinite(amount)) return;

    incomeData.push({ source, amount });
    saveData();

    els.incomeSource.value = "";
    els.incomeAmount.value = "";

    renderIncomeList();
    renderSummary();
  });
}

// -------------------------------
// EXPENSE FORM
// -------------------------------
if (els.expenseForm) {
  els.expenseForm.addEventListener("submit", e => {
    e.preventDefault();

    const desc = els.expenseDesc.value.trim();
    const category = els.expenseCategory.value;
    const amount = Number(els.expenseAmount.value);

    if (!desc || amount <= 0 || !Number.isFinite(amount)) return;

    const today = new Date().toISOString().slice(0, 10);

    expenseData.push({ date: today, desc, category, amount });
    saveData();

    els.expenseDesc.value = "";
    els.expenseAmount.value = "";

    renderExpenseTable();
    renderSummary();
  });
}

// -------------------------------
// AI PROMPT BUILDER
// -------------------------------
function buildPrompt(lang, totalIncome, totalExpenses, balance, incomes, expenses) {
  const safeLang = lang || "en";

  const incomeLines = incomes.length
    ? incomes
        .map(i => `- ${i.source} : ${Number(i.amount) || 0}`)
        .join("\n")
    : "none";

  const expenseLines = expenses.length
    ? expenses
        .map(e => `- [${e.category}] ${e.desc} (${e.date}) : ${Number(e.amount) || 0}`)
        .join("\n")
    : "none";

  if (safeLang === "uz") {
    return `
Siz juda talabchan, qattiq moliyaviy tahlilchisiz.
Javobingizni faqat UZBEK tilida yozing.

JAMI DAROMAD: ${totalIncome}
JAMI XARAJATLAR: ${totalExpenses}
QOLDIQ: ${balance}

DAROMAD OBYEKTLARI (manba | summa):
${incomeLines}

XARAJAT OBYEKTLARI (kategoriya | tavsif | sana | summa):
${expenseLines}

A) Qisqa xulosa  
B) Spending patterns (pul qayerga to'planayapti)  
C) Zaif joylar  
D) Kategoriya bo‘yicha tahlil (kategoriya va tavsifga tayangan holda)  
E) O‘lchanadigan takliflar (aniq raqamlar bilan)  
F) Kelajak prognozi  
G) Achchiq haqiqat paragrafi
`;
  }

  return `
You are a strict personal finance analyst.
Answer ONLY in ENGLISH.

TOTAL INCOME: ${totalIncome}
TOTAL EXPENSES: ${totalExpenses}
BALANCE: ${balance}

INCOME OBJECTS (source | amount):
${incomeLines}

EXPENSE OBJECTS (category | description | date | amount):
${expenseLines}

Provide:
A) Summary  
B) Spending patterns (where money is concentrated)  
C) Weak points  
D) Category-by-category analysis (USE description & category fields)  
E) Specific measurable improvements  
F) Future projection  
G) Brutally honest hard truth paragraph
`;
}

// -------------------------------
// AI ANALYZE BUTTON
// -------------------------------
if (els.aiAnalyzeBtn) {
  els.aiAnalyzeBtn.addEventListener("click", () => {
    const totalIncome = incomeData.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const totalExpenses = expenseData.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const balance = totalIncome - totalExpenses;

    const incomeObjects = incomeData.map(i => ({
      source: i.source || "unknown",
      amount: Number(i.amount) || 0
    }));

    const expenseObjects = expenseData.map(e => ({
      date: e.date || "no-date",
      desc: e.desc || "no-desc",
      category: e.category || "Other",
      amount: Number(e.amount) || 0
    }));

    const lang = els.langSelect ? els.langSelect.value : "en";

    const prompt = buildPrompt(
      lang,
      totalIncome,
      totalExpenses,
      balance,
      incomeObjects,
      expenseObjects
    );

    const encoded = encodeURIComponent(prompt);
    window.open(`https://chatgpt.com/?q=${encoded}`, "_blank");
  });
}

// -------------------------------
// INITIAL RENDER
// -------------------------------
renderIncomeList();
renderExpenseTable();
renderSummary();
