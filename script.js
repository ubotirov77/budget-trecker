// script.js

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // MONTH SELECTOR + THEME + DECOR
  // -------------------------------
  const monthBtn = document.getElementById("month-btn");
  const monthList = document.getElementById("month-list");

  const monthSeasonMap = {
    January: "winter",
    February: "winter",
    December: "winter",
    March: "spring",
    April: "spring",
    May: "spring",
    June: "summer",
    July: "summer",
    August: "summer",
    September: "autumn",
    October: "autumn",
    November: "autumn"
  };

  const seasons = ["winter", "spring", "summer", "autumn"];

  let currentSeason = null;
  let decorContainer = null;
  let decorParticles = [];
  let decorAnimationId = null;

  function applySeasonTheme(season) {
    seasons.forEach(s => document.body.classList.remove(`theme-${s}`));
    if (season && seasons.includes(season)) {
      document.body.classList.add(`theme-${season}`);
    }
    setSeasonDecor(season);
  }

  function clearSeasonDecor() {
    if (decorAnimationId) {
      cancelAnimationFrame(decorAnimationId);
      decorAnimationId = null;
    }
    if (decorContainer && decorContainer.parentNode) {
      decorContainer.parentNode.removeChild(decorContainer);
    }
    decorContainer = null;
    decorParticles = [];
  }

  function createDecorContainer() {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.left = "0";
    div.style.top = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.pointerEvents = "none";
    div.style.overflow = "hidden";
    div.style.zIndex = "999";
    document.body.appendChild(div);
    return div;
  }

  function createParticle(options) {
    const span = document.createElement("span");
    span.textContent = options.char;
    span.style.position = "absolute";
    span.style.left = options.x + "px";
    span.style.top = options.y + "px";
    span.style.fontSize = options.size + "px";
    span.style.opacity = options.opacity;
    span.style.filter = "blur(" + (options.blur || 0) + "px)";
    span.style.willChange = "transform";

    decorContainer.appendChild(span);

    return {
      el: span,
      x: options.x,
      y: options.y,
      speedY: options.speedY,
      speedX: options.speedX || 0,
      rotate: options.rotate || 0,
      rotateSpeed: options.rotateSpeed || 0,
      size: options.size,
      type: options.type,
      centerX: options.centerX,
      centerY: options.centerY,
      radius: options.radius
    };
  }

  function initWinterDecor() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = 40;

    for (let i = 0; i < count; i++) {
      const p = createParticle({
        char: "❄",
        x: Math.random() * width,
        y: Math.random() * height,
        size: 14 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.5,
        blur: Math.random() * 1.5,
        speedY: 0.5 + Math.random() * 1.5,
        speedX: -0.3 + Math.random() * 0.6,
        rotate: Math.random() * 360,
        rotateSpeed: -0.2 + Math.random() * 0.4,
        type: "snow"
      });
      decorParticles.push(p);
    }
  }

  function initSpringDecor() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = 25;

    for (let i = 0; i < count; i++) {
      const p = createParticle({
        char: "🌸",
        x: Math.random() * width,
        y: Math.random() * height,
        size: 18 + Math.random() * 8,
        opacity: 0.5 + Math.random() * 0.4,
        speedY: 0.4 + Math.random() * 1.0,
        speedX: 0.2 + Math.random() * 0.6,
        rotate: Math.random() * 360,
        rotateSpeed: -0.3 + Math.random() * 0.6,
        type: "petal"
      });
      decorParticles.push(p);
    }
  }

  function initSummerDecor() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width - 80;
    const centerY = 80;
    const count = 12;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const radius = 40 + Math.random() * 20;

      const p = createParticle({
        char: "☀️",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: 20 + Math.random() * 6,
        opacity: 0.6 + Math.random() * 0.3,
        speedY: 0,
        speedX: 0,
        rotate: angle,
        rotateSpeed: 0.005 + Math.random() * 0.01,
        type: "sun",
        centerX,
        centerY,
        radius
      });
      decorParticles.push(p);
    }
  }

  function initAutumnDecor() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = 30;
    const leafChars = ["🍂", "🍁", "🍃"];

    for (let i = 0; i < count; i++) {
      const p = createParticle({
        char: leafChars[Math.floor(Math.random() * leafChars.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        size: 18 + Math.random() * 10,
        opacity: 0.4 + Math.random() * 0.5,
        speedY: 0.5 + Math.random() * 1.4,
        speedX: -0.5 + Math.random() * 1.0,
        rotate: Math.random() * 360,
        rotateSpeed: -0.4 + Math.random() * 0.8,
        type: "leaf"
      });
      decorParticles.push(p);
    }
  }

  function runDecorAnimation() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    decorParticles.forEach(p => {
      if (p.type === "sun") {
        p.rotate += p.rotateSpeed;
        p.x = p.centerX + Math.cos(p.rotate) * p.radius;
        p.y = p.centerY + Math.sin(p.rotate) * p.radius;
      } else {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotate += p.rotateSpeed;

        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }
        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;
      }

      p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`;
    });

    decorAnimationId = requestAnimationFrame(runDecorAnimation);
  }

  function setSeasonDecor(season) {
    if (season === currentSeason) return;

    clearSeasonDecor();
    currentSeason = season;

    if (!season) return;

    decorContainer = createDecorContainer();

    switch (season) {
      case "winter":
        initWinterDecor();
        break;
      case "spring":
        initSpringDecor();
        break;
      case "summer":
        initSummerDecor();
        break;
      case "autumn":
        initAutumnDecor();
        break;
    }

    if (decorParticles.length > 0) {
      runDecorAnimation();
    }
  }

  if (monthBtn && monthList) {
    monthBtn.addEventListener("click", () => {
      monthList.classList.toggle("hidden");
    });

    document.querySelectorAll("#month-list li").forEach(li => {
      li.addEventListener("click", () => {
        const monthName = li.dataset.month || li.textContent.trim();
        monthBtn.textContent = `${monthName} Budget`;
        monthList.classList.add("hidden");

        const season = monthSeasonMap[monthName];
        applySeasonTheme(season);
      });
    });

    document.addEventListener("click", e => {
      if (!monthBtn.contains(e.target) && !monthList.contains(e.target)) {
        monthList.classList.add("hidden");
      }
    });

    const initialText = monthBtn.textContent.trim();
    const initialMonth = initialText.split(" ")[0];
    const initialSeason = monthSeasonMap[initialMonth];
    applySeasonTheme(initialSeason);
  }

  // -------------------------------
  // LOAD DATA FIRST (LOCALSTORAGE)
  // -------------------------------
  let incomeData = [];
  let expenseData = [];

  try {
    const inc = JSON.parse(localStorage.getItem("incomeData"));
    const exp = JSON.parse(localStorage.getItem("expenseData"));
    if (Array.isArray(inc)) incomeData = inc;
    if (Array.isArray(exp)) expenseData = exp;
  } catch {
    incomeData = [];
    expenseData = [];
  }

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
    currencySelect: document.getElementById("currency-select"),
    aiAnalyzeBtn: document.getElementById("ai-analyze-btn")
  };

  // -------------------------------
  // CURRENCY SYSTEM
  // -------------------------------
  let currentCurrency = localStorage.getItem("budgetCurrency") || "KRW";

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

  try {
    if (!localStorage.getItem("budgetCurrency")) {
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
        localStorage.setItem("budgetCurrency", currentCurrency);
      }
    }
  } catch {}

  if (els.currencySelect) {
    els.currencySelect.value = currentCurrency;

    els.currencySelect.addEventListener("change", () => {
      currentCurrency = els.currencySelect.value;
      localStorage.setItem("budgetCurrency", currentCurrency);
      renderSummary();
      renderIncomeList();
      renderExpenseTable();
    });
  }

  // -------------------------------
  // SUMMARY
  // -------------------------------
  function renderSummary() {
    const totalIncome = incomeData.reduce(
      (s, i) => s + (Number(i.amount) || 0),
      0
    );
    const totalExpenses = expenseData.reduce(
      (s, e) => s + (Number(e.amount) || 0),
      0
    );
    const balance = totalIncome - totalExpenses;

    if (els.totalIncome)
      els.totalIncome.textContent = formatCurrency(totalIncome);
    if (els.totalExpenses)
      els.totalExpenses.textContent = formatCurrency(totalExpenses);
    if (els.totalBalance)
      els.totalBalance.textContent = formatCurrency(balance);
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
        <span class="source">${item.source}</span>
        <span>${formatCurrency(amount)}</span>
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
      const amount = Number(item.amount) || 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.date}</td>
        <td>${item.desc}</td>
        <td>${item.category}</td>
        <td class="right">${formatCurrency(amount)}</td>
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
  function buildPrompt(
    lang,
    totalIncome,
    totalExpenses,
    balance,
    incomes,
    expenses
  ) {
    const safeLang = lang || "en";

    const incomeLines = incomes.length
      ? incomes
          .map(i => `- ${i.source} : ${Number(i.amount) || 0}`)
          .join("\n")
      : "none";

    const expenseLines = expenses.length
      ? expenses
          .map(
            e =>
              `- [${e.category}] ${e.desc} (${e.date}) : ${
                Number(e.amount) || 0
              }`
          )
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
      const totalIncome = incomeData.reduce(
        (s, i) => s + (Number(i.amount) || 0),
        0
      );
      const totalExpenses = expenseData.reduce(
        (s, e) => s + (Number(e.amount) || 0),
        0
      );
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
  // MULTILINGUAL SYSTEM
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
  // INITIAL RENDER
  // -------------------------------
  renderIncomeList();
  renderExpenseTable();
  renderSummary();
});
