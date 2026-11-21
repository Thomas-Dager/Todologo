// Controlador Principal de Todologo — Idioma Global (Nativo en Español) y Directorio Limpio
window.AppTelemetry = {
  storageKey: "todologo_telemetry_v1",
  data: {},

  init() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.data = raw ? JSON.parse(raw) : {};
    } catch {
      this.data = {};
    }
  },

  getToolStat(code) {
    return this.data[code] || { hits: 0, attempts: 0, bestStreak: 0 };
  },

  recordRep(code, isHit, currentStreak) {
    const stat = this.getToolStat(code);
    stat.attempts++;
    if (isHit) stat.hits++;
    if (currentStreak > stat.bestStreak) stat.bestStreak = currentStreak;
    this.data[code] = stat;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch {
      // ignore
    }
  }
};

window.TodologoI18n = {
  es: {
    page_doc_title: "Herramientas | Todologo",
    nav_tools: "Herramientas",
    sys_online: "En línea",
    eyebrow: "Arsenal // Herramientas",
    page_title: "Herramientas",
    page_lede: "Herramientas que construí para aprender más rápido en mis propios experimentos. Libres para que cualquiera las use.",
    cat_all: "Todas",
    cat_anatomy: "Anatomía",
    cat_games: "Juegos",
    cat_geography: "Geografía",
    cat_languages: "Idiomas",
    cat_machines: "Máquinas",
    cat_science: "Ciencia",
    launch: "Abrir",
    status_online: "En línea",
    status_beta: "Beta",
    back_to_tools: "← Volver a Herramientas",
    mode_explore: "01 // Estudiar",
    mode_drill: "02 // Practicar",
    mode_quiz: "03 // Examen",
    footer_tag: "n = 1 // Aprendizaje acelerado y experimentación"
  },
  en: {
    page_doc_title: "Tools | Todologo",
    nav_tools: "Tools",
    sys_online: "Online",
    eyebrow: "Arsenal // Tools",
    page_title: "Tools",
    page_lede: "Tools I built to learn things faster for my own experiments. Free for anyone to use.",
    cat_all: "All",
    cat_anatomy: "Anatomy",
    cat_games: "Games",
    cat_geography: "Geography",
    cat_languages: "Languages",
    cat_machines: "Machines",
    cat_science: "Science",
    launch: "Launch",
    status_online: "Online",
    status_beta: "Beta",
    back_to_tools: "← Back to Tools",
    mode_explore: "01 // Study",
    mode_drill: "02 // Practice",
    mode_quiz: "03 // Test",
    footer_tag: "n = 1 // Accelerated learning & experimentation"
  },
  pt: {
    page_doc_title: "Ferramentas | Todologo",
    nav_tools: "Ferramentas",
    sys_online: "Online",
    eyebrow: "Arsenal // Ferramentas",
    page_title: "Ferramentas",
    page_lede: "Ferramentas que criei para aprender mais rápido em meus próprios experimentos. Gratuitas para qualquer pessoa usar.",
    cat_all: "Todas",
    cat_anatomy: "Anatomia",
    cat_games: "Jogos",
    cat_geography: "Geografia",
    cat_languages: "Idiomas",
    cat_machines: "Máquinas",
    cat_science: "Ciência",
    launch: "Abrir",
    status_online: "Online",
    status_beta: "Beta",
    back_to_tools: "← Voltar às Ferramentas",
    mode_explore: "01 // Estudar",
    mode_drill: "02 // Praticar",
    mode_quiz: "03 // Teste",
    footer_tag: "n = 1 // Aprendizado acelerado e experimentação"
  },
  fr: {
    page_doc_title: "Outils | Todologo",
    nav_tools: "Outils",
    sys_online: "En ligne",
    eyebrow: "Arsenal // Outils",
    page_title: "Outils",
    page_lede: "Des outils conçus pour apprendre plus vite lors de mes propres expériences. Libres d'utilisation pour tous.",
    cat_all: "Tous",
    cat_anatomy: "Anatomie",
    cat_games: "Jeux",
    cat_geography: "Géographie",
    cat_languages: "Langues",
    cat_machines: "Machines",
    cat_science: "Sciences",
    launch: "Ouvrir",
    status_online: "En ligne",
    status_beta: "Bêta",
    back_to_tools: "← Retour aux Outils",
    mode_explore: "01 // Étudier",
    mode_drill: "02 // S'entraîner",
    mode_quiz: "03 // Test",
    footer_tag: "n = 1 // Apprentissage accéléré et expérimentation"
  },
  de: {
    page_doc_title: "Werkzeuge | Todologo",
    nav_tools: "Werkzeuge",
    sys_online: "Online",
    eyebrow: "Arsenal // Werkzeuge",
    page_title: "Werkzeuge",
    page_lede: "Werkzeuge, die ich gebaut habe, um für meine eigenen Experimente schneller zu lernen. Kostenlos für alle.",
    cat_all: "Alle",
    cat_anatomy: "Anatomie",
    cat_games: "Spiele",
    cat_geography: "Geografie",
    cat_languages: "Sprachen",
    cat_machines: "Maschinen",
    cat_science: "Wissenschaft",
    launch: "Starten",
    status_online: "Online",
    status_beta: "Beta",
    back_to_tools: "← Zurück zu Werkzeugen",
    mode_explore: "01 // Lernen",
    mode_drill: "02 // Üben",
    mode_quiz: "03 // Test",
    footer_tag: "n = 1 // Beschleunigtes Lernen & Experimentieren"
  },
  it: {
    page_doc_title: "Strumenti | Todologo",
    nav_tools: "Strumenti",
    sys_online: "Online",
    eyebrow: "Arsenale // Strumenti",
    page_title: "Strumenti",
    page_lede: "Strumenti costruiti per imparare più velocemente nei miei esperimenti. Gratuiti per chiunque.",
    cat_all: "Tutti",
    cat_anatomy: "Anatomia",
    cat_games: "Giochi",
    cat_geography: "Geografia",
    cat_languages: "Lingue",
    cat_machines: "Macchine",
    cat_science: "Scienza",
    launch: "Apri",
    status_online: "Online",
    status_beta: "Beta",
    back_to_tools: "← Torna agli Strumenti",
    mode_explore: "01 // Studia",
    mode_drill: "02 // Pratica",
    mode_quiz: "03 // Esame",
    footer_tag: "n = 1 // Apprendimento accelerato e sperimentazione"
  }
};

window.N1App = {
  lang: "es",
  activeCategory: "all",
  activeTool: null,
  activeMode: "explore",

  init() {
    window.AppTelemetry.init();
    this.initLanguage();
    this.bindEvents();
    this.updateCounts();
    this.applyLanguage();
  },

  initLanguage() {
    let saved = null;
    try {
      const urlLang = new URLSearchParams(window.location.search).get("lang");
      if (urlLang && window.TodologoI18n[urlLang]) saved = urlLang;
    } catch {
      // ignore
    }
    if (!saved) {
      try {
        const stored = localStorage.getItem("todologo.lang");
        if (stored && window.TodologoI18n[stored]) saved = stored;
      } catch {
        // ignore
      }
    }
    // Natively default to Spanish ('es')
    this.lang = saved || "es";
    this.syncLanguageStorage(this.lang);
  },

  syncLanguageStorage(code) {
    try {
      localStorage.setItem("todologo.lang", code);
      // Synchronize with all 10 standalone tools so global language applies everywhere
      const atlasLang = code === "es" || code === "en" ? code : "es";
      localStorage.setItem("ss1.capital-atlas.lang", JSON.stringify(code));
      localStorage.setItem("ss1.country-atlas.lang", JSON.stringify(code));
      localStorage.setItem("ss1.flag-atlas.lang", JSON.stringify(code));
      localStorage.setItem("ss1.state-atlas.lang", JSON.stringify(code));
      localStorage.setItem("ss1.tooth-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.organ-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.nerve-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.muscle-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.poker-trainer.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.blackjack-trainer.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.mental-math.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.color-trainer.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.fallacy-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.memory-system.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.alphabet-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.timeline-trainer.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.periodic-table.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.cloud-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.meat-cuts.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.philosophy-atlas.lang", JSON.stringify(atlasLang));
      localStorage.setItem("ss1.chess-opening-trainer.lang", JSON.stringify(atlasLang));
    } catch {
      // ignore
    }
  },

  setLanguage(code) {
    if (!window.TodologoI18n[code]) code = "es";
    this.lang = code;
    this.syncLanguageStorage(code);
    this.applyLanguage();
  },

  t(key) {
    const dict = window.TodologoI18n[this.lang] || window.TodologoI18n.es;
    return dict[key] || window.TodologoI18n.es[key] || key;
  },

  localizeField(field) {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (field[this.lang]) return field[this.lang];
    // For Romance languages (pt, fr, it), Spanish is a closer fallback if specific key is omitted; for de/en use en/es
    if (this.lang === "en" || this.lang === "de") return field.en || field.es || "";
    return field.es || field.en || "";
  },

  applyLanguage() {
    document.documentElement.lang = this.lang;
    document.title = this.t("page_doc_title");

    const select = document.getElementById("global-lang-select");
    if (select && select.value !== this.lang) {
      select.value = this.lang;
    }

    document.querySelectorAll("[data-ui]").forEach(el => {
      const key = el.getAttribute("data-ui");
      el.textContent = this.t(key);
    });

    this.renderCatalog();

    if (this.activeTool) {
      const wsTitle = document.getElementById("ws-title");
      if (wsTitle) wsTitle.textContent = this.localizeField(this.activeTool.title);
    }
  },

  updateCounts() {
    const pad2 = (n) => String(n).padStart(2, "0");
    const all = window.TOOLS_CATALOG.length;
    const countCat = (cat) => window.TOOLS_CATALOG.filter(t => t.category === cat).length;

    const setTxt = (id, num) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = pad2(num);
        const li = el.closest("li");
        if (li && id !== "count-all") {
          li.hidden = num === 0;
        }
      }
    };

    setTxt("count-all", all);
    setTxt("count-anatomy", countCat("Anatomy"));
    setTxt("count-games", countCat("Games"));
    setTxt("count-geography", countCat("Geography"));
    setTxt("count-languages", countCat("Languages"));
    setTxt("count-machines", countCat("Machines"));
    setTxt("count-science", countCat("Science"));
  },

  renderCatalog() {
    const grid = document.getElementById("tools-grid");
    if (!grid) return;

    const filtered = window.TOOLS_CATALOG.filter(tool => {
      return this.activeCategory === "all" || tool.category === this.activeCategory;
    });

    const launchText = this.t("launch");

    grid.innerHTML = filtered.map(tool => {
      const title = this.localizeField(tool.title);
      const description = this.localizeField(tool.description);
      const isOnline = String(tool.status).toLowerCase() === "online";
      const statusLabel = isOnline ? this.t("status_online") : this.t("status_beta");
      const href = tool.engine === "standalone" && tool.url
        ? `${tool.url}?lang=${encodeURIComponent(this.lang)}`
        : `#${tool.code}`;

      return `
        <div class="panel">
          <div class="panel-head label">
            <span>${tool.code}</span>
            <span class="panel-meta">${statusLabel}</span>
          </div>
          <h2 class="panel-title">${title}</h2>
          <div class="tool-body">
            <div class="tool-text">
              <p class="description">${description}</p>
              <div class="actions">
                <a class="btn" href="${href}" data-launch-code="${tool.code}">${launchText}</a>
              </div>
            </div>
            <div class="tool-icon" aria-hidden="true">
              <img src="${tool.icon}" alt="" width="320" height="320" decoding="async" />
            </div>
          </div>
        </div>
      `;
    }).join("");

    grid.querySelectorAll("[data-launch-code]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const code = btn.getAttribute("data-launch-code");
        const tool = window.TOOLS_CATALOG.find(t => t.code === code);
        if (!tool) return;
        if (tool.engine === "standalone" && tool.url) {
          // Ensure language is synced right before navigating to standalone tool
          this.syncLanguageStorage(this.lang);
          return; // allow native <a href="...?lang=..."> navigation
        }
        e.preventDefault();
        this.openTool(code, "explore");
      });
    });
  },

  openTool(code, mode = "explore") {
    const tool = window.TOOLS_CATALOG.find(t => t.code === code);
    if (!tool) return;
    if (tool.engine === "standalone" && tool.url) {
      this.syncLanguageStorage(this.lang);
      window.location.href = `${tool.url}?lang=${encodeURIComponent(this.lang)}`;
      return;
    }

    this.activeTool = tool;
    this.activeMode = mode;

    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    const ws = document.getElementById("view-workspace");
    if (ws) ws.classList.add("active");

    const wsCode = document.getElementById("ws-code");
    const wsTitle = document.getElementById("ws-title");
    if (wsCode) wsCode.textContent = tool.code;
    if (wsTitle) wsTitle.textContent = this.localizeField(tool.title);

    document.querySelectorAll(".mode-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-mode") === mode);
    });

    const mountEl = document.getElementById("workspace-mount");
    const localizedTool = Object.assign({}, tool, {
      title: this.localizeField(tool.title),
      description: this.localizeField(tool.description)
    });

    if (tool.engine === "blackjack" && window.BlackjackEngine) {
      window.BlackjackEngine.mount(mountEl, localizedTool, mode);
    } else if (tool.engine === "chess" && window.ChessEngine) {
      window.ChessEngine.mount(mountEl, localizedTool, mode);
    } else if (tool.engine === "poker" && window.PokerEngine) {
      window.PokerEngine.mount(mountEl, localizedTool, mode);
    } else if (tool.engine === "mechanical" && window.MechanicalEngine) {
      window.MechanicalEngine.mount(mountEl, localizedTool, mode);
    } else if (tool.engine === "accent" && window.AccentEngine) {
      window.AccentEngine.mount(mountEl, localizedTool, mode);
    } else if (window.AtlasEngine) {
      window.AtlasEngine.mount(mountEl, localizedTool, mode);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  showCatalog() {
    this.activeTool = null;
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    const cat = document.getElementById("view-catalog");
    if (cat) cat.classList.add("active");
    this.renderCatalog();
  },

  bindEvents() {
    const langSelect = document.getElementById("global-lang-select");
    if (langSelect) {
      langSelect.addEventListener("change", (e) => {
        this.setLanguage(e.target.value);
      });
    }

    const navHome = document.getElementById("nav-home");
    if (navHome) {
      navHome.addEventListener("click", (e) => {
        if (this.activeTool) {
          e.preventDefault();
          this.showCatalog();
        }
      });
    }

    const navTools = document.getElementById("nav-btn-tools");
    if (navTools) {
      navTools.addEventListener("click", () => {
        this.showCatalog();
      });
    }

    const btnBack = document.getElementById("btn-back-catalog");
    if (btnBack) {
      btnBack.addEventListener("click", () => {
        this.showCatalog();
      });
    }

    // Category folder tabs
    document.querySelectorAll(".cat-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".cat-tab").forEach(t => t.removeAttribute("aria-current"));
        tab.setAttribute("aria-current", "page");
        this.activeCategory = tab.getAttribute("data-category") || "all";
        this.renderCatalog();
      });
    });

    // Mode switcher inside internal workspace
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        if (this.activeTool) {
          this.openTool(this.activeTool.code, mode);
        }
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.N1App.init();
});
