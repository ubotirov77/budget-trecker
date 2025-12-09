// -------------------------------
// MONTH SELECTOR
// -------------------------------
const monthBtn = document.getElementById("month-btn");
const monthList = document.getElementById("month-list");

if (monthBtn && monthList) {
  monthBtn.addEventListener("click", () => {
    monthList.classList.toggle("hidden");
  });

  document.querySelectorAll("#month-list li").forEach(li => {
    li.addEventListener("click", () => {
      monthBtn.textContent = `${li.textContent} Budget`;
      monthList.classList.add("hidden");
    });
  });

  document.addEventListener("click", e => {
    if (!monthBtn.contains(e.target) && !monthList.contains(e.target)) {
      monthList.classList.add("hidden");
    }
  });
}

// -------------------------------
// DATA STORAGE + LOCALSTORAGE
// -------------------------------
const incomeData = [];
const expenseData = [];

// LOAD DATA FROM LOCAL STORAGE
function loadData() {
  const inc = localStorage.getItem("incomeData");
  const exp = localStorage.getItem("expenseData");

  if (inc) {
    try {
      const parsed = JSON.parse(inc);
      if (Array.isArray(parsed)) incomeData.push(...parsed);
    } catch {}
  }

  if (exp) {
    try {
      const parsed = JSON.parse(exp);
      if (Array.isArray(parsed)) expenseData.push(...parsed);
    } catch {}
  }
}

function saveData() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem("expenseData", JSON.stringify(expenseData));
}

// -------------------------------
// ELEMENT SHORTCUTS
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
  analyzeBtn: document.getElementById("analyze-btn"),
  langSelect: document.getElementById("lang-select"),
  currencySelect: document.getElementById("currency-select")
};

// -------------------------------
// CURRENCY
// -------------------------------
let currentCurrency = "KRW";

function formatCurrency(num) {
  const safe = Number.isFinite(num) ? num : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currentCurrency,
      maximumFractionDigits: 0
    }).format(safe);
  } catch {
    return `${currentCurrency} ${safe.toLocaleString()}`;
  }
}

// optional auto-detect
try {
  const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const region = userLocale.split("-")[1];

  const autoMap = {
    KR: "KRW",
    US: "USD",
    GB: "GBP",
    JP: "JPY",
    DE: "EUR",
    FR: "EUR",
    UZ: "UZS"
  };

  if (autoMap[region]) {
    currentCurrency = autoMap[region];
    if (els.currencySelect) els.currencySelect.value = currentCurrency;
  }
} catch {}

// currency change
if (els.currencySelect) {
  els.currencySelect.addEventListener("change", () => {
    currentCurrency = els.currencySelect.value;
    renderSummary();
    renderIncomeList();
    renderExpenseTable();
  });
}

// -------------------------------
// SUMMARY
// -------------------------------
function renderSummary() {
  if (!els.totalIncome || !els.totalExpenses || !els.totalBalance) return;

  const totalIncome = incomeData.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpenses = expenseData.reduce((s, e) => s + (e.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  els.totalIncome.textContent = formatCurrency(totalIncome);
  els.totalExpenses.textContent = formatCurrency(totalExpenses);
  els.totalBalance.textContent = formatCurrency(balance);
}

// -------------------------------
// INCOME LIST
// -------------------------------
function renderIncomeList() {
  if (!els.incomeList) return;

  els.incomeList.innerHTML = "";

  incomeData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="source">${item.source}</span>
      <span>${formatCurrency(item.amount)}</span>
      <button class="delete-btn">✖</button>
    `;

    li.querySelector(".delete-btn").onclick = () => {
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
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.desc}</td>
      <td>${item.category}</td>
      <td class="right">${formatCurrency(item.amount)}</td>
      <td><button class="delete-btn">✖</button></td>
    `;

    tr.querySelector(".delete-btn").onclick = () => {
      expenseData.splice(index, 1);
      saveData();
      renderExpenseTable();
      renderSummary();
    };

    els.expenseTableBody.appendChild(tr);
  });

  els.expenseCount.textContent = `${expenseData.length} items`;
}

// -------------------------------
// FORM HANDLERS
// -------------------------------
if (els.incomeForm) {
  els.incomeForm.addEventListener("submit", e => {
    e.preventDefault();

    const source = (els.incomeSource?.value || "").trim();
    const amount = Number(els.incomeAmount?.value);

    if (!source || !Number.isFinite(amount) || amount <= 0) return;

    incomeData.push({ source, amount });
    saveData();

    els.incomeSource.value = "";
    els.incomeAmount.value = "";

    renderIncomeList();
    renderSummary();
  });
}

if (els.expenseForm) {
  els.expenseForm.addEventListener("submit", e => {
    e.preventDefault();

    const desc = (els.expenseDesc?.value || "").trim();
    const category = els.expenseCategory?.value || "Other";
    const amount = Number(els.expenseAmount?.value);

    if (!desc || !Number.isFinite(amount) || amount <= 0) return;

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
// AI BUILDER
// -------------------------------
function buildPrompt(lang, totalIncome, totalExpenses, balance, incomeValues, expenseValues) {
  const safeLang = lang || "en";

  if (safeLang === "uz") {
    return `
Siz juda talabchan moliyaviy tahlilchisiz.
JAMI DAROMAD: ${totalIncome}
JAMI XARAJATLAR: ${totalExpenses}
QOLDIQ: ${balance}

DAROMAD:
${incomeValues.length ? incomeValues.join("\n") : "yo‘q"}

XARAJAT:
${expenseValues.length ? expenseValues.join("\n") : "yo‘q"}

A) Qisqa xulosa  
B) Spending patterns  
C) Zaif joylar  
D) Kategoriya tahlili  
E) Takliflar  
F) Prognoz  
G) Achchiq haqiqat
`;
  }

  return `
You are a strict financial analyst.

TOTAL INCOME: ${totalIncome}
TOTAL EXPENSES: ${totalExpenses}
BALANCE: ${balance}

INCOME VALUES:
${incomeValues.join("\n")}

EXPENSE VALUES:
${expenseValues.join("\n")}

A) Summary  
B) Spending patterns  
C) Weak points  
D) Category analysis  
E) Improvements  
F) Projection  
G) Hard truth paragraph
`;
}

// -------------------------------
// AI BUTTON
// -------------------------------
const aiRobotBtn = document.getElementById("ai-analyze-btn");

if (aiRobotBtn) {
  aiRobotBtn.addEventListener("click", () => {
    const totalIncome = incomeData.reduce((s, i) => s + (i.amount || 0), 0);
    const totalExpenses = expenseData.reduce((s, e) => s + (e.amount || 0), 0);
    const balance = totalIncome - totalExpenses;

    const incomeValues = incomeData.map(i => i.amount);
    const expenseValues = expenseData.map(e => e.amount);

    const lang = els.langSelect ? els.langSelect.value : "en";

    const prompt = buildPrompt(
      lang,
      totalIncome,
      totalExpenses,
      balance,
      incomeValues,
      expenseValues
    );

    window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, "_blank");
  });
}

// -------------------------------
// MULTILINGUAL
// -------------------------------
const translations = {};
let currentLangCode = "en";

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations[lang] = await res.json();
    currentLangCode = lang;
    updateTexts();
  } catch (err) {
    console.error("Language load error:", err);
  }
}

function updateTexts() {
  const dict = translations[currentLangCode];
  if (!dict) return;

  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (dict[key]) el.textContent = dict[key];
  });
}

if (els.langSelect) {
  els.langSelect.addEventListener("change", () => {
    loadLanguage(els.langSelect.value);
  });
}

loadLanguage("en");

// -------------------------------
// INITIAL LOAD + RENDER
// -------------------------------
loadData();
renderSummary();
renderIncomeList();
renderExpenseTable();
