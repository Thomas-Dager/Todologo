(() => {
  'use strict';

  const DATA = window.MYTHOLOGY_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const saved = window.SiteProgress ? window.SiteProgress.tool('mythology-atlas') : null;
  function readSaved(key, fb) { return saved ? saved.get(key, fb) : fb; }
  function writeSaved(key, val) { if (saved) saved.set(key, val); }
  function detectInitialLang() {
    try {
      const shared = window.localStorage && window.localStorage.getItem('todologo.lang');
      if (shared === 'es' || shared === 'en') return shared;
    } catch (_) {}
    const loc = readSaved('lang', null);
    return (loc === 'es' || loc === 'en') ? loc : 'es';
  }

  let LANG = detectInitialLang();

  function nameOf(m, forceLang) {
    const l = forceLang || LANG;
    return typeof m.name === 'object' ? (m.name[l] || m.name.es || m.name.en || '') : (m.name || '');
  }

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[&/+\-×"'“”‘’().,:·]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function editDist(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) d[i][0] = i;
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          v = Math.min(v, d[i - 2][j - 2] + cost);
        }
        d[i][j] = v;
      }
    }
    return d[m][n];
  }

  const VAGUE_DEITY = {
    'sol': { es: '¿Apolo, Ra, Amaterasu o Inti? Indica la deidad.', en: 'Apollo, Ra, Amaterasu, or Inti? Name the deity.' },
    'sun': { es: '¿Apolo, Ra, Amaterasu o Inti?', en: 'Apollo, Ra, Amaterasu, or Inti? Name the deity.' },
    'luna': { es: '¿Artemisa o Tsukuyomi?', en: 'Artemis or Tsukuyomi?' },
    'moon': { es: '¿Artemisa o Tsukuyomi?', en: 'Artemis or Tsukuyomi?' },
    'guerra': { es: '¿Ares, Atenea, Týr, Huitzilopochtli o Sekhmet?', en: 'Ares, Athena, Týr, Huitzilopochtli, or Sekhmet?' },
    'war': { es: '¿Ares, Atenea, Týr, Huitzilopochtli o Sekhmet?', en: 'Ares, Athena, Týr, Huitzilopochtli, or Sekhmet?' },
    'inframundo': { es: '¿Hades, Osiris, Anubis, Hel o Mictlantecuhtli?', en: 'Hades, Osiris, Anubis, Hel, or Mictlantecuhtli?' },
    'underworld': { es: '¿Hades, Osiris, Anubis, Hel o Mictlantecuhtli?', en: 'Hades, Osiris, Anubis, Hel, or Mictlantecuhtli?' },
    'trueno': { es: '¿Zeus, Thor o Indra?', en: 'Zeus, Thor, or Indra?' },
    'thunder': { es: '¿Zeus, Thor o Indra?', en: 'Zeus, Thor, or Indra?' },
    'dios': { es: 'Escribe el nombre propio de la deidad.', en: 'Enter the specific deity name.' }
  };

  function makeDeityIndex() {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();

    function addRaw(m, raw) {
      const k = norm(raw);
      if (!k || k.length < 2 || VAGUE_DEITY[k]) return;
      if (!exact.has(k)) exact.set(k, m);
      if (k.length >= 5) {
        const sig = m.id + '|' + k;
        if (!seen.has(sig)) { seen.add(sig); candidates.push({ item: m, key: k }); }
      }
    }

    function addField(m, str) {
      if (!str) return;
      addRaw(m, str);
      const stripped = String(str).replace(/\([^)]*\)/g, ' ');
      addRaw(m, stripped);
      const parens = String(str).match(/\(([^)]+)\)/g) || [];
      parens.forEach(p => addRaw(m, p.slice(1, -1)));
    }

    ITEMS.forEach(m => {
      addField(m, m.name && m.name.es);
      addField(m, m.name && m.name.en);
      (m.aka || []).forEach(a => addRaw(m, a));
    });
    return { exact, candidates };
  }

  const DEITY_INDEX = makeDeityIndex();

  const STOPWORDS = new Set(['el', 'la', 'los', 'las', 'de', 'del', 'y', 'o', 'en', 'con', 'un', 'una', 'the', 'of', 'and', 'or', 'in', 'by', 'god', 'dios', 'diosa', 'goddess', 'rule', 'roma', 'rome', 'nordico', 'norse', 'egipto', 'egypt', 'japon', 'japan', 'vedico', 'vedic', 'grecia', 'greece']);

  function targetEquivTokens(m) {
    const src = [
      m.domain && m.domain.es, m.domain && m.domain.en,
      m.equivalents && m.equivalents.es, m.equivalents && m.equivalents.en
    ].join(' ');
    const words = norm(src).split(' ').filter(w => w.length >= 4 && !STOPWORDS.has(w));
    return Array.from(new Set(words));
  }

  function checkAnswer(raw, target) {
    const q = norm(raw);
    if (!q) return { status: 'empty' };

    if (S.target === 'equivalent') {
      const directDeity = DEITY_INDEX.exact.get(q);
      if (directDeity && directDeity.id === target.id) {
        return {
          status: 'vague',
          msg: LANG === 'en'
            ? 'That is the deity\'s own name — type its domain or cross-cultural equivalent.'
            : 'Ese es el nombre de la deidad — escribe su dominio o equivalente.'
        };
      }
      const domEs = norm(target.domain && target.domain.es);
      const domEn = norm(target.domain && target.domain.en);
      if (q === domEs || q === domEn) return { status: 'right', item: target };
      const toks = targetEquivTokens(target);
      const qWords = q.split(' ').filter(w => w.length >= 4 && !STOPWORDS.has(w));
      for (const qw of qWords) {
        for (const tw of toks) {
          if (qw === tw || (tw.length >= 6 && editDist(qw, tw) <= 1)) {
            return { status: 'right', item: target };
          }
        }
      }
      return { status: 'wrong', matched: null };
    }

    if (VAGUE_DEITY[q]) {
      return { status: 'vague', msg: VAGUE_DEITY[q][LANG] || VAGUE_DEITY[q].es };
    }

    const direct = DEITY_INDEX.exact.get(q);
    if (direct) {
      return direct.id === target.id
        ? { status: 'right', item: target }
        : { status: 'wrong', matched: direct };
    }

    let bestItem = null, bestDist = 99, targetDist = 99;
    for (let i = 0; i < DEITY_INDEX.candidates.length; i++) {
      const c = DEITY_INDEX.candidates[i];
      const limit = c.key.length >= 9 ? 2 : (c.key.length >= 5 ? 1 : 0);
      if (!limit) continue;
      const d = editDist(q, c.key);
      if (d <= limit) {
        if (d < bestDist) { bestDist = d; bestItem = c.item; }
        if (c.item.id === target.id && d < targetDist) { targetDist = d; }
      }
    }
    if (targetDist < 99 && targetDist <= bestDist) return { status: 'right', item: target };
    if (bestItem && bestItem.id !== target.id) return { status: 'wrong', matched: bestItem };
    return { status: 'wrong', matched: null };
  }

  function escRe(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function maskText(text, m, quizTarget) {
    let out = String(text == null ? '' : text);
    if (!quizTarget) return out;
    if (quizTarget === 'deity') {
      const toks = new Set();
      [nameOf(m, 'es'), nameOf(m, 'en'), ...(m.aka || [])].forEach(s => {
        if (!s) return;
        toks.add(String(s).trim());
        const stripped = String(s).replace(/\([^)]*\)/g, ' ').trim();
        if (stripped.length >= 2) toks.add(stripped);
        const parens = String(s).match(/\(([^)]+)\)/g) || [];
        parens.forEach(p => { if (p.length >= 4) toks.add(p.slice(1, -1).trim()); });
      });
      Array.from(toks).filter(x => x.length >= 2).sort((a, b) => b.length - a.length).forEach(tok => {
        const reStr = tok.length <= 4 ? '(?<![A-Za-zÀ-ÿ])' + escRe(tok) + '(?![A-Za-zÀ-ÿ])' : escRe(tok);
        try { out = out.replace(new RegExp(reStr, 'gi'), '[ ??? ]'); }
        catch (_) { out = out.replace(new RegExp(escRe(tok), 'gi'), '[ ??? ]'); }
      });
    } else if (quizTarget === 'equivalent') {
      [m.domain && m.domain.es, m.domain && m.domain.en, m.equivalents && m.equivalents.es, m.equivalents && m.equivalents.en]
        .filter(Boolean)
        .forEach(s => {
          out = out.replace(new RegExp(escRe(s), 'gi'), '[ ??? ]');
        });
    }
    return out;
  }

  const I18N = {
    es: {
      docTitle: 'Mitologías Comparadas — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'MITOLOGÍAS <span>COMPARADAS</span>',
      brandSub: 'Mapa de 48 deidades: panteones, atributos artísticos y equivalencias',
      railLabel: 'Panteones',
      railTitle: 'Panteones',
      allCats: 'Todos los panteones',
      searchPlaceholder: 'Buscar deidad, atributo (tridente, chacal), dominio o equivalente…',
      searchAria: 'Buscar deidad',
      clearSearch: 'Limpiar búsqueda',
      noMatches: 'Sin deidades que coincidan con tu búsqueda.',
      settings: 'Ajustes',
      cleanExit: 'Salir de vista limpia',
      lblAcc: 'Acierto',
      lblTime: 'Tiempo',
      lblStreak: 'Racha',
      done: 'Listo',
      lblLang: 'Idioma',
      lblMode: 'Modo',
      modeStudy: 'Explorar',
      modePractice: 'Aprender',
      modeTest: 'Examen',
      lblSet: 'Deidades',
      setPopular: 'Esenciales',
      setAll: 'Todas',
      lblTarget: 'Preguntar por',
      tgtDeity: 'Deidad',
      tgtEquiv: 'Equivalencia',
      lblAnswer: 'Responder',
      ansChoose: 'Eligiendo',
      ansType: 'Escribiendo',
      restart: 'Reiniciar',
      cleanBtn: 'Vista limpia',
      soundYes: 'Sonido: Sí',
      soundNo: 'Sonido: No',
      keysBtn: 'Teclas',
      howBtn: 'Cómo funciona',
      creditLine: 'Iconografía vectorial comparada entre tradiciones mitológicas. Adaptado para Todologo.',
      introTitle: 'Mitologías comparadas',
      intro1: 'Identifica dioses en esculturas, códices y templos por sus <b>atributos iconográficos</b> (rayo, tridente, balanza, búho, espejo de obsidiana) y descubre su paralelo en otras culturas.',
      intro2: 'Alterna entre <b>Deidad</b> (reconocer al dios a partir de sus símbolos y equivalentes) y <b>Equivalencia</b> (asociar dominio y dioses paralelos).',
      intro3: 'En escritura se aceptan nombres griegos/romanos (ej. Zeus o Júpiter, Atenea o Minerva) con tolerancia ortográfica.',
      keysTitle: 'Teclas',
      eyebrowExplore: '{set} · Explorar',
      eyebrowLearn: '{set} · Aprender',
      eyebrowTest: '{set} · Examen',
      eyebrowDetail: '{cat} · Deidad {idx}/{n}',
      eyebrowSummary: 'Resultado del examen',
      promptDeity: '¿Qué deidad lleva estos atributos?',
      promptEquiv: '¿Qué dominio y equivalencia tiene {name}?',
      countModels: '{n} deidades',
      studyThese: 'Aprender estas',
      allList: 'Todas',
      prev: '← Anterior',
      next: 'Siguiente →',
      hint: 'Pista',
      check: 'Comprobar',
      typeDeityPh: 'Ej. Atenea, Anubis, Quetzalcóatl, Odín…',
      typeEquivPh: 'Ej. Júpiter, Trueno, Sabiduría, Inframundo…',
      cueDomain: 'Dominio',
      cueSymbols: 'Iconografía en el arte',
      cueEquiv: 'Paralelos entre culturas',
      cueRealm: 'Morada sagrada',
      maskedCue: 'Oculto hasta responder',
      okEyebrow: '¡Correcto!',
      badEyebrow: 'Era: {name}',
      warnEyebrow: 'Aclara tu respuesta',
      specPantheon: 'Tradición',
      specDomain: 'Dominio',
      specSymbols: 'Atributos',
      specEquiv: 'Equivalencias',
      specRealm: 'Reino / Sede',
      wikiLabel: 'Ver en Wikipedia',
      bestLabel: 'Mejor marca ({scope}):',
      bestNone: 'Aún sin examen completado aquí.',
      knowLabel: 'Dominadas: {k}/{n}',
      resAcc: 'Acierto',
      resTime: 'Tiempo',
      resStreak: 'Mejor racha',
      resPlayAgain: 'Repetir examen',
      resStudyMisses: 'Repasar {n} fallos',
      resExplore: 'Volver a explorar',
      resKeyOk: 'Aciertos: {n}',
      resKeyBad: 'Fallos: {n}',
      resPerfect: '¡Puntaje perfecto sin errores!',
      resClickMiss: 'Toca una deidad para revisar su iconografía.',
      missTitle: 'Deidades para repasar',
      yourAnswer: 'Tu respuesta: {ans}',
      hintPrefix: 'Pista:',
      help: {
        rail: ['Panteones del mundo', 'Filtra entre Grecia/Roma, Nórdica/Celta, Antiguo Egipto y Japón/Mesoamérica/Andes/Védica.'],
        mode: ['Modos', 'Explorar permite consultar el mapa comparado; Aprender repite fallos; Examen cronometra una ronda.'],
        target: ['Preguntar por', 'Deidad oculta el nombre del dios y muestra símbolos; Equivalencia pregunta el dominio o paralelo cultural de una deidad.']
      },
      keys: [
        ['1 – 4', 'Elegir opción'],
        ['H', 'Mostrar pista al escribir'],
        ['Enter / →', 'Siguiente ficha tras responder'],
        ['← / →', 'Navegar deidades en Explorar'],
        ['P', 'Pasar de Explorar a Aprender'],
        ['Esc', 'Volver a catálogo o cerrar modal']
      ]
    },
    en: {
      docTitle: 'Comparative Mythology Atlas — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'MYTHOLOGY <span>ATLAS</span>',
      brandSub: 'Map of 48 deities: pantheons, art iconography & parallels',
      railLabel: 'Pantheons',
      railTitle: 'Pantheons',
      allCats: 'All pantheons',
      searchPlaceholder: 'Search deity, symbol (trident, jackal), domain or parallel…',
      searchAria: 'Search deity',
      clearSearch: 'Clear search',
      noMatches: 'No deities match your search.',
      settings: 'Settings',
      cleanExit: 'Exit clean view',
      lblAcc: 'Accuracy',
      lblTime: 'Time',
      lblStreak: 'Streak',
      done: 'Done',
      lblLang: 'Language',
      lblMode: 'Mode',
      modeStudy: 'Explore',
      modePractice: 'Learn',
      modeTest: 'Test',
      lblSet: 'Deities',
      setPopular: 'Core',
      setAll: 'All',
      lblTarget: 'Quiz target',
      tgtDeity: 'Deity',
      tgtEquiv: 'Parallels',
      lblAnswer: 'Answer',
      ansChoose: 'Multiple choice',
      ansType: 'Typing',
      restart: 'Restart',
      cleanBtn: 'Clean view',
      soundYes: 'Sound: On',
      soundNo: 'Sound: Off',
      keysBtn: 'Keys',
      howBtn: 'How it works',
      creditLine: 'Vector iconography & comparative mythology schema built for Todologo.',
      introTitle: 'Comparative mythology',
      intro1: 'Identify deities across sculptures, codices, and temples by their <b>iconographic attributes</b> (lightning bolt, trident, owl, obsidian mirror) and cross-cultural parallels.',
      intro2: 'Toggle between <b>Deity</b> (name the god from symbols & equivalents) and <b>Parallels</b> (match domain and equivalent gods).',
      intro3: 'Typing accepts both Greek and Roman names (e.g. Zeus or Jupiter, Athena or Minerva) with typo tolerance.',
      keysTitle: 'Shortcuts',
      eyebrowExplore: '{set} · Explore',
      eyebrowLearn: '{set} · Learn',
      eyebrowTest: '{set} · Test',
      eyebrowDetail: '{cat} · Deity {idx}/{n}',
      eyebrowSummary: 'Exam summary',
      promptDeity: 'Which deity carries these attributes?',
      promptEquiv: 'Which domain & equivalent belongs to {name}?',
      countModels: '{n} deities',
      studyThese: 'Learn these',
      allList: 'All',
      prev: '← Previous',
      next: 'Next →',
      hint: 'Hint',
      check: 'Check',
      typeDeityPh: 'e.g. Athena, Anubis, Quetzalcoatl, Odin…',
      typeEquivPh: 'e.g. Jupiter, Thunder, Wisdom, Underworld…',
      cueDomain: 'Domain',
      cueSymbols: 'Iconography in art',
      cueEquiv: 'Cross-cultural parallels',
      cueRealm: 'Sacred realm',
      maskedCue: 'Hidden until answered',
      okEyebrow: 'Correct!',
      badEyebrow: 'Answer: {name}',
      warnEyebrow: 'Clarify answer',
      specPantheon: 'Tradition',
      specDomain: 'Domain',
      specSymbols: 'Attributes',
      specEquiv: 'Equivalents',
      specRealm: 'Realm / Seat',
      wikiLabel: 'Wikipedia entry',
      bestLabel: 'Best score ({scope}):',
      bestNone: 'No completed test yet for this pantheon.',
      knowLabel: 'Mastered: {k}/{n}',
      resAcc: 'Accuracy',
      resTime: 'Time',
      resStreak: 'Best streak',
      resPlayAgain: 'Run again',
      resStudyMisses: 'Review {n} misses',
      resExplore: 'Back to explore',
      resKeyOk: 'Correct: {n}',
      resKeyBad: 'Missed: {n}',
      resPerfect: 'Perfect score — zero misses!',
      resClickMiss: 'Click a missed deity to inspect its iconography.',
      missTitle: 'Deities to review',
      yourAnswer: 'You answered: {ans}',
      hintPrefix: 'Hint:',
      help: {
        rail: ['World pantheons', 'Filter between Greek/Roman, Norse/Celtic, Ancient Egypt, and Japan/Mesoamerica/Andes/Vedic.'],
        mode: ['Modes', 'Explore shows iconography & equivalents; Learn repeats misses; Test runs a timed exam.'],
        target: ['Quiz target', 'Deity hides the name and tests art symbols; Parallels asks for domain and equivalent gods.']
      },
      keys: [
        ['1 – 4', 'Pick an option'],
        ['H', 'Show typing hint'],
        ['Enter / →', 'Advance after answer'],
        ['← / →', 'Step deities in Explore'],
        ['P', 'Jump from Explore to Learn'],
        ['Esc', 'Back to grid or close dialog']
      ]
    }
  };

  function t(key, vars) {
    const table = I18N[LANG] || I18N.es;
    let str = table[key] != null ? table[key] : (I18N.es[key] || key);
    if (vars) Object.keys(vars).forEach(k => { str = String(str).replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
    return str;
  }

  function $(id) { return document.getElementById(id); }
  const el = {
    homeLink: $('homeLink'), toolMark: $('toolMark'), brandSub: $('brandSub'),
    rail: $('rail'), railTitle: $('railTitle'), railList: $('railList'),
    prompt: $('prompt'), pEyebrow: $('pEyebrow'), pName: $('pName'), pMeta: $('pMeta'),
    pBarWrap: $('pBarWrap'), pBar: $('pBar'), reviewPanel: $('reviewPanel'),
    gridBar: $('gridBar'), exploreSearch: $('exploreSearch'), exploreClear: $('exploreClear'), exploreCount: $('exploreCount'),
    stageBox: $('stageBox'), view: $('view'), actions: $('actions'),
    settingsBtn: $('settingsBtn'), cleanExit: $('cleanExit'),
    stats: $('stats'), lblAcc: $('lblAcc'), sAcc: $('sAcc'), lblTime: $('lblTime'), sTime: $('sTime'), lblStreak: $('lblStreak'), sStreak: $('sStreak'),
    panel: $('panel'), closeSheet: $('closeSheet'), lblLang: $('lblLang'), langSel: $('langSel'),
    lblMode: $('lblMode'), modeSeg: $('modeSeg'), lblSet: $('lblSet'), setSeg: $('setSeg'),
    targetBox: $('targetBox'), lblTarget: $('lblTarget'), targetSeg: $('targetSeg'),
    answerBox: $('answerBox'), lblAnswer: $('lblAnswer'), answerSeg: $('answerSeg'),
    restartBtn: $('restartBtn'), cleanBtn: $('cleanBtn'), soundBtn: $('soundBtn'),
    best: $('best'), know: $('know'), keysBtn: $('keysBtn'), howBtn: $('howBtn'), creditLine: $('creditLine'),
    intro: $('intro'), introTitle: $('introTitle'), introClose: $('introClose'), intro1: $('intro1'), intro2: $('intro2'), intro3: $('intro3'),
    keysModal: $('keysModal'), keysTitle: $('keysTitle'), keysClose: $('keysClose'), keysList: $('keysList')
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function catLabel(id) {
    if (id === 'all') return t('allCats');
    const c = CAT_BY_ID[id];
    return c ? (c[LANG] || c.es || c.id) : id;
  }
  function setLabel(v) { return v === 'popular' ? t('setPopular') : t('setAll'); }

  const LOOKUP_LOOKALIKES = Object.create(null);
  (DATA.LOOKALIKES || []).forEach(g => g.forEach(id => {
    if (!LOOKUP_LOOKALIKES[id]) LOOKUP_LOOKALIKES[id] = [];
    g.forEach(o => { if (o !== id && LOOKUP_LOOKALIKES[id].indexOf(o) === -1) LOOKUP_LOOKALIKES[id].push(o); });
  }));

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pool(cat, setVal) {
    const useCat = cat != null ? cat : S.category;
    const useSet = setVal != null ? setVal : S.set;
    let list = ITEMS.filter(m => (useCat === 'all' || m.category === useCat) && (useSet !== 'popular' || m.pop));
    if (!list.length) list = ITEMS.filter(m => useCat === 'all' || m.category === useCat);
    return list;
  }

  function choices(target) {
    const out = [target];
    const seenIds = new Set([target.id]);
    const seenDomains = new Set([norm(target.domain[LANG])]);
    const byEquiv = S.target === 'equivalent';

    function canUse(cand) {
      if (!cand || seenIds.has(cand.id)) return false;
      if (byEquiv && seenDomains.has(norm(cand.domain[LANG]))) return false;
      return true;
    }
    function take(cand) {
      seenIds.add(cand.id);
      seenDomains.add(norm(cand.domain[LANG]));
      out.push(cand);
    }

    shuffle((LOOKUP_LOOKALIKES[target.id] || []).slice()).forEach(id => {
      if (out.length < 4 && canUse(BY_ID[id])) take(BY_ID[id]);
    });
    const sameCat = shuffle(ITEMS.filter(m => m.category === target.category && m.id !== target.id));
    for (let i = 0; i < sameCat.length && out.length < 4; i++) {
      if (canUse(sameCat[i])) take(sameCat[i]);
    }
    const rest = shuffle(ITEMS);
    for (let i = 0; i < rest.length && out.length < 4; i++) {
      if (canUse(rest[i])) take(rest[i]);
    }
    return shuffle(out);
  }

  function motifGlyphSvg(motif, compact) {
    const icon = (motif && motif.icon) || 'sun';
    const col = (motif && motif.accent) || '#6fd0e8';
    const shapes = {
      bolt: '<polyline points="35,14 23,32 31,32 27,50" fill="none" stroke="' + col + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>',
      crown: '<path d="M16 44 L16 24 L26 32 L32 18 L38 32 L48 24 L48 44 Z" fill="rgba(236,222,194,0.14)" stroke="' + col + '" stroke-width="2.6" stroke-linejoin="round"/>',
      trident: '<path d="M32 14 V50 M22 18 V29 Q22 34 32 34 Q42 34 42 29 V18" fill="none" stroke="' + col + '" stroke-width="2.8" stroke-linecap="round"/>',
      owl: '<circle cx="32" cy="33" r="15" fill="none" stroke="' + col + '" stroke-width="2.5"/><circle cx="26" cy="29" r="3" fill="' + col + '"/><circle cx="38" cy="29" r="3" fill="' + col + '"/><path d="M30 35 L32 39 L34 35" fill="' + col + '"/>',
      lyre: '<path d="M22 16 Q18 32 25 46 H39 Q46 32 42 16 M22 20 H42 M28 20 V46 M32 20 V46 M36 20 V46" fill="none" stroke="' + col + '" stroke-width="2.2" stroke-linecap="round"/>',
      moon: '<path d="M39 17 A16 16 0 1 0 39 47 A12 12 0 1 1 39 17 Z" fill="rgba(111,208,232,0.18)" stroke="' + col + '" stroke-width="2.4"/>',
      shell: '<path d="M32 48 L16 30 Q24 16 32 16 Q40 16 48 30 Z M32 48 V16 M32 48 L23 21 M32 48 L41 21" fill="none" stroke="' + col + '" stroke-width="2.2" stroke-linejoin="round"/>',
      spear: '<line x1="18" y1="48" x2="46" y2="16" stroke="' + col + '" stroke-width="2.8" stroke-linecap="round"/><polygon points="48,14 38,17 45,24" fill="' + col + '"/>',
      wings: '<path d="M32 46 V16 M16 26 Q24 18 32 26 Q40 18 48 26 M20 34 Q27 28 32 34 Q37 28 44 34" fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linecap="round"/>',
      bident: '<path d="M32 34 V50 M24 16 V30 Q24 34 32 34 Q40 34 40 30 V16" fill="none" stroke="' + col + '" stroke-width="2.8" stroke-linecap="round"/>',
      anvil: '<path d="M16 26 H46 L42 36 H22 Z M25 36 L22 46 H42 L39 36" fill="rgba(240,207,106,0.15)" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round"/>',
      vine: '<path d="M22 44 Q32 20 42 44 M28 32 A6 6 0 1 0 36 32" fill="none" stroke="' + col + '" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="20" r="4" fill="' + col + '"/>',
      raven: '<path d="M16 28 Q26 18 32 30 Q38 18 48 28 Q38 36 32 46 Q26 36 16 28 Z" fill="rgba(111,208,232,0.16)" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round"/>',
      hammer: '<rect x="18" y="18" width="28" height="15" rx="3" fill="rgba(111,208,232,0.18)" stroke="' + col + '" stroke-width="2.5"/><line x1="32" y1="33" x2="32" y2="49" stroke="#ecdec2" stroke-width="3" stroke-linecap="round"/>',
      cat: '<path d="M22 28 L24 16 L30 24 H34 L40 16 L42 28 Q46 38 32 46 Q18 38 22 28 Z" fill="rgba(95,211,154,0.14)" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round"/>',
      mask: '<path d="M20 20 Q32 16 44 20 L42 40 Q32 48 22 40 Z" fill="rgba(255,122,107,0.14)" stroke="' + col + '" stroke-width="2.4"/><line x1="25" y1="29" x2="29" y2="29" stroke="' + col + '" stroke-width="2.5"/><line x1="35" y1="29" x2="39" y2="29" stroke="' + col + '" stroke-width="2.5"/>',
      sword: '<line x1="32" y1="14" x2="32" y2="48" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/><line x1="22" y1="39" x2="42" y2="39" stroke="#ecdec2" stroke-width="2.8" stroke-linecap="round"/>',
      horn: '<path d="M18 20 Q28 42 46 36 Q48 28 39 27 Q32 32 23 18 Z" fill="rgba(240,207,106,0.18)" stroke="' + col + '" stroke-width="2.3" stroke-linejoin="round"/>',
      sun: '<circle cx="32" cy="32" r="10" fill="rgba(240,207,106,0.22)" stroke="' + col + '" stroke-width="2.5"/><g stroke="' + col + '" stroke-width="2.2" stroke-linecap="round"><line x1="32" y1="13" x2="32" y2="18"/><line x1="32" y1="46" x2="32" y2="51"/><line x1="13" y1="32" x2="18" y2="32"/><line x1="46" y1="32" x2="51" y2="32"/></g>',
      skull: '<circle cx="32" cy="28" r="12" fill="rgba(236,222,194,0.12)" stroke="' + col + '" stroke-width="2.3"/><rect x="26" y="38" width="12" height="8" rx="2" fill="none" stroke="' + col + '" stroke-width="2"/><circle cx="27" cy="27" r="2.2" fill="' + col + '"/><circle cx="37" cy="27" r="2.2" fill="' + col + '"/>',
      grain: '<path d="M32 48 V18 M32 40 L22 33 M32 32 L42 25 M32 26 L22 19 M32 42 L42 36" fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linecap="round"/>',
      ankh: '<circle cx="32" cy="22" r="7" fill="none" stroke="' + col + '" stroke-width="2.8"/><line x1="32" y1="29" x2="32" y2="49" stroke="' + col + '" stroke-width="2.8" stroke-linecap="round"/><line x1="21" y1="34" x2="43" y2="34" stroke="' + col + '" stroke-width="2.8" stroke-linecap="round"/>',
      eye: '<path d="M14 31 Q32 17 50 31 Q32 45 14 31 Z" fill="rgba(111,208,232,0.14)" stroke="' + col + '" stroke-width="2.4"/><circle cx="32" cy="31" r="5.5" fill="' + col + '"/><path d="M27 40 L25 49 M36 39 Q40 44 43 49" fill="none" stroke="' + col + '" stroke-width="2.2" stroke-linecap="round"/>',
      scales: '<line x1="32" y1="15" x2="32" y2="47" stroke="#ecdec2" stroke-width="2.4"/><line x1="17" y1="22" x2="47" y2="22" stroke="' + col + '" stroke-width="2.6"/><path d="M17 22 L12 36 H22 Z M47 22 L42 36 H52 Z" fill="rgba(111,208,232,0.18)" stroke="' + col + '" stroke-width="1.8"/>',
      ibis: '<path d="M24 44 L26 26 Q28 18 35 20 L48 26 L36 27 Q38 38 24 44 Z" fill="rgba(236,222,194,0.14)" stroke="' + col + '" stroke-width="2.3" stroke-linejoin="round"/>',
      serpent: '<path d="M18 42 Q24 18 32 32 Q40 46 46 22" fill="none" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/><circle cx="46" cy="21" r="4" fill="#5fd39a"/>',
      rain: '<path d="M18 28 Q22 18 32 19 Q42 18 46 28 Z" fill="rgba(111,208,232,0.22)" stroke="' + col + '" stroke-width="2.2"/><g stroke="' + col + '" stroke-width="2.3" stroke-linecap="round"><line x1="24" y1="35" x2="21" y2="44"/><line x1="32" y1="35" x2="29" y2="44"/><line x1="40" y1="35" x2="37" y2="44"/></g>'
    };
    const inner = shapes[icon] || shapes.sun;
    return '<svg viewBox="0 0 64 64" width="' + (compact ? 42 : 76) + '" height="' + (compact ? 42 : 76) + '" aria-hidden="true">' + inner + '</svg>';
  }

  function buildMythPlateHtml(m, quizTarget) {
    const pantheon = (m.pantheon && (m.pantheon[LANG] || m.pantheon.es)) || '';
    const realm = maskText((m.realm && (m.realm[LANG] || m.realm.es)) || '', m, quizTarget);
    const hideDomain = quizTarget === 'equivalent';
    const dom = hideDomain ? t('maskedCue') : maskText((m.domain && (m.domain[LANG] || m.domain.es)) || '', m, quizTarget);
    const sym = maskText((m.symbols && (m.symbols[LANG] || m.symbols.es)) || '', m, quizTarget);
    const eqv = hideDomain ? t('maskedCue') : maskText((m.equivalents && (m.equivalents[LANG] || m.equivalents.es)) || '', m, quizTarget);

    const centerDiagram = '<svg class="myth-svg" viewBox="0 0 540 160" role="img" aria-label="Mythology Emblem Diagram">' +
      '<polygon points="150,36 270,12 390,36" fill="rgba(111,208,232,0.09)" stroke="#33475a" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<line x1="168" y1="40" x2="168" y2="140" stroke="#223140" stroke-width="5"/>' +
      '<line x1="372" y1="40" x2="372" y2="140" stroke="#223140" stroke-width="5"/>' +
      '<rect x="148" y="140" width="244" height="8" rx="3" fill="#223140"/>' +
      '<circle cx="270" cy="88" r="46" fill="#0d1722" stroke="' + ((m.motif && m.motif.accent) || '#6fd0e8') + '" stroke-width="2" stroke-dasharray="5 4"/>' +
      '<g transform="translate(232,50)">' + motifGlyphSvg(m.motif, false) + '</g>' +
    '</svg>';

    return '<div class="myth-head">' +
        '<span class="mbadge">' + esc(pantheon) + '</span>' +
        '<span class="mbadge">' + esc(realm) + '</span>' +
      '</div>' +
      '<div class="myth-svg-box">' + centerDiagram + '</div>' +
      '<div class="myth-cues">' +
        '<div class="myth-cue"><small>' + esc(t('cueSymbols')) + '</small>' + esc(sym) + '</div>' +
        '<div class="myth-cue"><small>' + esc(t('cueDomain')) + '</small>' + esc(dom) + '</div>' +
      '</div>' +
      '<div class="myth-cue"><small>' + esc(t('cueEquiv')) + '</small>' + esc(eqv) + '</div>';
  }

  function buildSpecsHtml(m) {
    const pan = (m.pantheon && (m.pantheon[LANG] || m.pantheon.es)) || '';
    const dom = (m.domain && (m.domain[LANG] || m.domain.es)) || '';
    const sym = (m.symbols && (m.symbols[LANG] || m.symbols.es)) || '';
    const eqv = (m.equivalents && (m.equivalents[LANG] || m.equivalents.es)) || '';
    const rlm = (m.realm && (m.realm[LANG] || m.realm.es)) || '';
    const fact = (m.fact && (m.fact[LANG] || m.fact.es)) || '';
    return '<div class="facts">' +
      '<span><b>' + esc(t('specPantheon')) + ':</b> ' + esc(pan) + '</span>' +
      '<span><b>' + esc(t('specDomain')) + ':</b> ' + esc(dom) + '</span>' +
      '<span><b>' + esc(t('specSymbols')) + ':</b> ' + esc(sym) + '</span>' +
      '<span><b>' + esc(t('specEquiv')) + ':</b> ' + esc(eqv) + '</span>' +
      '<span><b>' + esc(t('specRealm')) + ':</b> ' + esc(rlm) + '</span>' +
      '</div>' +
      (fact ? '<p class="fact-note">' + esc(fact) + '</p>' : '');
  }

  function createStagePlate(m, opts) {
    const quiz = !!(opts && opts.quiz);
    const quizTarget = quiz ? S.target : null;
    const wrap = document.createElement('div');
    wrap.className = quiz ? 'show' : 'detail';
    const show = quiz ? wrap : document.createElement('div');
    if (!quiz) { show.className = 'show'; wrap.appendChild(show); }

    const plate = document.createElement('div');
    plate.className = 'myth-plate';
    plate.innerHTML = buildMythPlateHtml(m, quizTarget);
    show.appendChild(plate);

    if (!quiz) {
      if (m.wiki) {
        const cl = document.createElement('div');
        cl.className = 'credit-line';
        cl.innerHTML = '<a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(m.wiki) + '" target="_blank" rel="noopener noreferrer">' + esc(t('wikiLabel')) + ' ↗</a>';
        show.appendChild(cl);
      }
      const sw = document.createElement('div');
      sw.className = 'spec-wrap';
      sw.innerHTML = buildSpecsHtml(m);
      wrap.appendChild(sw);
    } else {
      wrap.reveal = function () {
        plate.innerHTML = buildMythPlateHtml(m, null);
        wrap.className = 'detail';
        const innerShow = document.createElement('div');
        innerShow.className = 'show';
        innerShow.appendChild(plate);
        wrap.textContent = '';
        wrap.appendChild(innerShow);
        if (m.wiki) {
          const cl = document.createElement('div');
          cl.className = 'credit-line';
          cl.innerHTML = '<a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(m.wiki) + '" target="_blank" rel="noopener noreferrer">' + esc(t('wikiLabel')) + ' ↗</a>';
          innerShow.appendChild(cl);
        }
        const sw = document.createElement('div');
        sw.className = 'spec-wrap';
        sw.innerHTML = buildSpecsHtml(m);
        wrap.appendChild(sw);
      };
    }
    return wrap;
  }

  const S = {
    mode: readSaved('mode', 'study'),
    set: readSaved('set', 'all'),
    category: readSaved('category', 'all'),
    target: readSaved('target', 'deity'),
    answer: readSaved('answer', 'choose'),
    sound: readSaved('sound', true),
    known: readSaved('known', {}) || {},
    best: readSaved('best', {}) || {},
    studyAt: null, exploreQuery: '',
    queue: [], deck: [], deckIdx: 0,
    current: null, opts: [], answered: false, hintLevel: 0,
    okCount: 0, totalAnswered: 0, streak: 0, bestStreak: 0, misses: [],
    startTs: 0, elapsedSec: 0, timerId: null, autoNextId: null
  };

  if (S.mode !== 'study' && S.mode !== 'practice' && S.mode !== 'test') S.mode = 'study';
  if (S.set !== 'popular' && S.set !== 'all') S.set = 'all';
  if (S.category !== 'all' && !CAT_BY_ID[S.category]) S.category = 'all';
  if (S.target !== 'deity' && S.target !== 'equivalent') S.target = 'deity';
  if (S.answer !== 'choose' && S.answer !== 'type') S.answer = 'choose';

  let audioCtx = null;
  function tone(ok) {
    if (!S.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(ok ? 540 : 210, now);
      if (ok) osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);
      else osc.frequency.exponentialRampToValueAtTime(160, now + 0.14);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now); osc.stop(now + 0.22);
    } catch (_) {}
  }

  function clearTimers() {
    if (S.timerId) { clearInterval(S.timerId); S.timerId = null; }
    if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; }
  }
  function fmtTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60), r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  function updateStats() {
    el.stats.classList.toggle('is-off', S.mode === 'study');
    el.sAcc.textContent = S.totalAnswered ? Math.round((S.okCount / S.totalAnswered) * 100) + '%' : '–';
    el.sTime.textContent = fmtTime(S.elapsedSec);
    el.sStreak.textContent = String(S.streak);
  }
  function updateProgress() {
    if (S.mode === 'test' && S.deck.length) {
      el.pBarWrap.classList.remove('is-off');
      el.pBar.style.width = Math.min(100, Math.round((S.deckIdx / S.deck.length) * 100)) + '%';
    } else if (S.mode === 'practice') {
      const p = pool(), k = p.filter(m => S.known[m.id]).length;
      el.pBarWrap.classList.remove('is-off');
      el.pBar.style.width = (p.length ? Math.round((k / p.length) * 100) : 0) + '%';
    } else {
      el.pBarWrap.classList.add('is-off');
      el.pBar.style.width = '0%';
    }
  }
  function renderPanelMeta() {
    const scope = S.set + ':' + S.category + ':' + S.target, b = S.best[scope];
    if (b && typeof b.pct === 'number') {
      el.best.innerHTML = esc(t('bestLabel', { scope: catLabel(S.category) })) +
        ' <b>' + b.pct + '%</b> (' + fmtTime(b.time || 0) + ')';
    } else el.best.textContent = t('bestNone');
    const p = pool(), k = p.filter(m => S.known[m.id]).length;
    el.know.textContent = t('knowLabel', { k, n: p.length });
  }
  function renderRail() {
    const allItems = pool('all', S.set), allKnown = allItems.filter(m => S.known[m.id]).length;
    let html = '<button class="rg" type="button" data-cat="all" aria-pressed="' + (S.category === 'all') + '">' +
      '<span class="r-txt"><span>' + esc(t('allCats')) + '</span><span class="r-era">' + esc(t('countModels', { n: allItems.length })) + '</span></span>' +
      '<em' + (allKnown >= allItems.length && allItems.length ? ' class="done"' : '') + '>' + allKnown + '/' + allItems.length + '</em></button>';
    CATEGORIES.forEach(c => {
      const list = pool(c.id, S.set), k = list.filter(m => S.known[m.id]).length;
      html += '<button class="rg" type="button" data-cat="' + esc(c.id) + '" aria-pressed="' + (S.category === c.id) + '">' +
        '<span class="r-txt"><span>' + esc(c[LANG] || c.es) + '</span><span class="r-era">' + esc(c.era || '') + '</span></span>' +
        '<em' + (k >= list.length && list.length ? ' class="done"' : '') + '>' + k + '/' + list.length + '</em></button>';
    });
    el.railList.innerHTML = html;
    el.railList.querySelectorAll('button.rg').forEach(btn => {
      btn.addEventListener('click', () => {
        S.category = btn.getAttribute('data-cat'); writeSaved('category', S.category);
        if (btn.scrollIntoView) try { btn.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } catch (_) {}
        restart();
      });
    });
  }
  function clearPromptFeedback() {
    el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn', 'is-review');
    el.reviewPanel.hidden = true; el.reviewPanel.innerHTML = '';
    el.stageBox.classList.remove('flash-ok', 'flash-bad');
  }
  function flashStage(ok) {
    el.stageBox.classList.remove('flash-ok', 'flash-bad');
    el.stageBox.classList.add(ok ? 'flash-ok' : 'flash-bad');
    setTimeout(() => el.stageBox.classList.remove('flash-ok', 'flash-bad'), 450);
  }
  function filteredGridList(baseList) {
    const q = norm(S.exploreQuery);
    if (!q) return baseList;
    const tokens = q.split(' ').filter(Boolean);
    return baseList.filter(m => {
      const cat = CAT_BY_ID[m.category];
      const hay = norm([
        nameOf(m, 'es'), nameOf(m, 'en'),
        m.pantheon && m.pantheon.es, m.pantheon && m.pantheon.en,
        m.domain && m.domain.es, m.domain && m.domain.en,
        m.symbols && m.symbols.es, m.symbols && m.symbols.en,
        m.equivalents && m.equivalents.es, m.equivalents && m.equivalents.en,
        (m.aka || []).join(' '), cat && cat.es, cat && cat.en
      ].join(' '));
      return tokens.every(tok => hay.indexOf(tok) !== -1);
    });
  }

  function studyGrid() {
    S.studyAt = null; clearPromptFeedback();
    el.pEyebrow.textContent = t('eyebrowExplore', { set: setLabel(S.set) });
    el.pName.textContent = catLabel(S.category);
    const full = pool(), filtered = filteredGridList(full);
    el.pMeta.textContent = t('countModels', { n: full.length });
    el.gridBar.hidden = false;
    el.exploreClear.hidden = !S.exploreQuery.trim();
    el.exploreCount.textContent = filtered.length + ' / ' + full.length;

    const grid = document.createElement('div');
    grid.className = 'grid';
    if (!filtered.length) {
      grid.innerHTML = '<div class="grid-empty">' + esc(t('noMatches')) + '</div>';
    } else {
      const cats = S.category === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === S.category);
      cats.forEach(cat => {
        const rows = filtered.filter(m => m.category === cat.id);
        if (!rows.length) return;
        const head = document.createElement('div');
        head.className = 'head';
        head.innerHTML = '<span>' + esc(cat[LANG] || cat.es) + '</span><span>' + rows.length + '</span>';
        grid.appendChild(head);
        rows.forEach(m => {
          const card = document.createElement('button');
          card.type = 'button';
          card.className = 'pcard' + (S.known[m.id] ? ' is-known' : '');
          card.setAttribute('data-id', m.id);
          const pan = (m.pantheon && (m.pantheon[LANG] || m.pantheon.es)) || '';
          const dom = (m.domain && (m.domain[LANG] || m.domain.es)) || '';
          card.innerHTML =
            '<div class="thumb">' +
              '<span class="pan-tag">' + esc(pan.split('(')[0].trim()) + '</span>' +
              motifGlyphSvg(m.motif, true) +
            '</div>' +
            '<div class="lbl"><b>' + esc(nameOf(m)) + '</b><small>' + esc(dom) + '</small></div>';
          card.addEventListener('click', () => studyOne(m.id));
          grid.appendChild(card);
        });
      });
    }

    el.view.textContent = ''; el.view.appendChild(grid);
    el.actions.className = 'actions row';
    el.actions.innerHTML = '<button class="act primary" type="button" id="goLearnBtn"><kbd>P</kbd><span class="txt">' + esc(t('studyThese')) + '</span></button>';
    const gl = $('goLearnBtn'); if (gl) gl.addEventListener('click', () => setMode('practice'));
    updateStats(); updateProgress();
  }

  function studyOne(id) {
    const m = BY_ID[id];
    if (!m) return studyGrid();
    S.studyAt = id; clearPromptFeedback(); el.gridBar.hidden = true;
    const list = filteredGridList(pool()), idx = list.findIndex(x => x.id === id);
    el.pEyebrow.textContent = t('eyebrowDetail', { cat: catLabel(m.category), idx: (idx >= 0 ? idx : 0) + 1, n: list.length || 1 });
    el.pName.textContent = nameOf(m);
    el.pMeta.textContent = (m.pantheon[LANG] || m.pantheon.es) + ' · ' + (m.domain[LANG] || m.domain.es);
    el.view.textContent = ''; el.view.appendChild(createStagePlate(m, { quiz: false }));
    el.actions.className = 'actions row';
    el.actions.innerHTML =
      '<button class="act" type="button" id="prevCardBtn"><kbd>←</kbd><span class="txt">' + esc(t('prev')) + '</span></button>' +
      '<button class="act" type="button" id="backGridBtn"><kbd>Esc</kbd><span class="txt">' + esc(t('allList')) + '</span></button>' +
      '<button class="act primary" type="button" id="nextCardBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>→</kbd></button>';
    if ($('prevCardBtn')) $('prevCardBtn').addEventListener('click', () => stepStudy(-1));
    if ($('backGridBtn')) $('backGridBtn').addEventListener('click', studyGrid);
    if ($('nextCardBtn')) $('nextCardBtn').addEventListener('click', () => stepStudy(1));
  }

  function stepStudy(delta) {
    const list = filteredGridList(pool());
    if (!list.length) return studyGrid();
    const idx = list.findIndex(x => x.id === S.studyAt);
    studyOne(list[idx < 0 ? 0 : (idx + delta + list.length) % list.length].id);
  }

  function renderQuizQuestion(m) {
    S.current = m; S.answered = false; S.hintLevel = 0;
    clearPromptFeedback(); el.gridBar.hidden = true;
    const tgtTag = S.target === 'equivalent' ? t('tgtEquiv') : t('tgtDeity');
    el.pEyebrow.textContent = (S.mode === 'test'
      ? t('eyebrowTest', { set: setLabel(S.set) }) + ' · ' + (S.deckIdx + 1) + '/' + S.deck.length
      : t('eyebrowLearn', { set: setLabel(S.set) }) + ' · ' + catLabel(S.category)) + ' · ' + tgtTag;

    if (S.target === 'equivalent') {
      el.pName.textContent = t('promptEquiv', { name: nameOf(m) });
      el.pMeta.textContent = (m.pantheon && (m.pantheon[LANG] || m.pantheon.es)) || '';
    } else {
      el.pName.textContent = t('promptDeity');
      el.pMeta.innerHTML = '&nbsp;';
    }

    const wrap = createStagePlate(m, { quiz: true });
    el.view.textContent = ''; el.view.appendChild(wrap);
    S._activeWrap = wrap;

    if (S.answer === 'choose') {
      S.opts = choices(m);
      el.actions.className = 'actions';
      el.actions.innerHTML = S.opts.map((opt, i) => {
        const label = S.target === 'equivalent' ? (opt.domain[LANG] || opt.domain.es) : nameOf(opt);
        return '<button class="act" type="button" data-idx="' + i + '" data-id="' + esc(opt.id) + '">' +
          '<kbd>' + (i + 1) + '</kbd><span class="txt">' + esc(label) + '</span>' +
        '</button>';
      }).join('');
      el.actions.querySelectorAll('button.act').forEach(btn => {
        btn.addEventListener('click', () => submitChoice(S.opts[Number(btn.getAttribute('data-idx'))], btn));
      });
    } else {
      S.opts = [];
      const ph = S.target === 'equivalent' ? t('typeEquivPh') : t('typeDeityPh');
      el.actions.className = 'actions row';
      el.actions.innerHTML =
        '<div class="typebox">' +
          '<input id="typeIn" type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(ph) + '">' +
          '<button class="act primary" type="button" id="typeGo">' + esc(t('check')) + '</button>' +
          '<button class="act" type="button" id="hintBtn">' + esc(t('hint')) + '</button>' +
        '</div>';
      const inp = $('typeIn'), go = $('typeGo'), hb = $('hintBtn');
      if (go) go.addEventListener('click', submitTyping);
      if (hb) hb.addEventListener('click', showHint);
      if (inp) {
        inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); submitTyping(); } });
        if (inp.focus) try { inp.focus(); } catch (_) {}
      }
    }
    updateStats(); updateProgress();
  }

  function showHint() {
    if (!S.current || S.answered) return;
    S.hintLevel++;
    const m = S.current;
    let hintStr = '';
    if (S.target === 'equivalent') {
      hintStr = (m.equivalents[LANG] || '').slice(0, 22) + '…';
    } else {
      const nm = nameOf(m);
      hintStr = S.hintLevel === 1
        ? (nm.slice(0, Math.min(3, nm.length)) + '… · ' + (m.pantheon[LANG] || m.pantheon.es))
        : nm.replace(/[A-Za-zÀ-ÿ]/g, (ch, idx) => (idx % 2 === 0 ? ch : '·'));
    }
    el.pMeta.innerHTML = esc(t('hintPrefix')) + ' <span class="letters">' + esc(hintStr) + '</span>';
  }

  function submitChoice(chosen, clickedBtn) {
    if (!S.current || S.answered || !chosen) return;
    const right = S.target === 'equivalent'
      ? norm(chosen.domain[LANG]) === norm(S.current.domain[LANG])
      : chosen.id === S.current.id;
    const ansLabel = S.target === 'equivalent' ? (chosen.domain[LANG] || chosen.domain.es) : nameOf(chosen);
    finalizeAnswer(right, ansLabel, clickedBtn);
  }

  function submitTyping() {
    if (!S.current || S.answered) return;
    const inp = $('typeIn'), raw = inp ? inp.value : '';
    const res = checkAnswer(raw, S.current);
    if (res.status === 'empty') { if (inp && inp.focus) try { inp.focus(); } catch (_) {} return; }
    if (res.status === 'vague') {
      el.prompt.classList.remove('is-ok', 'is-bad'); el.prompt.classList.add('is-warn');
      el.pEyebrow.textContent = t('warnEyebrow'); el.pMeta.textContent = res.msg;
      if (inp && inp.focus) try { inp.focus(); } catch (_) {}
      return;
    }
    finalizeAnswer(res.status === 'right', raw.trim(), null);
  }

  function finalizeAnswer(right, userAns, clickedBtn) {
    const m = S.current; S.answered = true; S.totalAnswered++;
    tone(right); flashStage(right);
    if (right) {
      S.okCount++; S.streak++; if (S.streak > S.bestStreak) S.bestStreak = S.streak;
      S.known[m.id] = true; writeSaved('known', S.known);
    } else {
      S.streak = 0; S.misses.push({ item: m, userAns: userAns || '–' });
    }
    if (S.answer === 'choose') {
      el.actions.querySelectorAll('button.act[data-id]').forEach(b => {
        b.disabled = true;
        const opt = BY_ID[b.getAttribute('data-id')];
        const isTargetBtn = opt && (S.target === 'equivalent' ? norm(opt.domain[LANG]) === norm(m.domain[LANG]) : opt.id === m.id);
        if (isTargetBtn) b.classList.add('is-right');
        else if (clickedBtn && b === clickedBtn && !right) b.classList.add('is-wrong');
      });
    }
    const answerFull = S.target === 'equivalent' ? (m.domain[LANG] || m.domain.es) : nameOf(m);
    el.prompt.classList.remove('is-warn', 'is-ok', 'is-bad'); el.prompt.classList.add(right ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = right ? t('okEyebrow') : t('badEyebrow', { name: answerFull });
    el.pName.textContent = nameOf(m);
    el.pMeta.textContent = right ? (m.equivalents[LANG] || m.domain[LANG]) : (userAns ? t('yourAnswer', { ans: userAns }) : m.domain[LANG]);

    if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
    if (S.mode === 'practice') updatePracticeQueue(m, right);
    renderRail(); renderPanelMeta(); updateStats(); updateProgress();
    showNextButton();
    if (S.mode === 'test') {
      if (S.autoNextId) clearTimeout(S.autoNextId);
      S.autoNextId = setTimeout(nextQuestion, 850);
    }
  }

  function showNextButton() {
    if ($('nextBtn')) return;
    if (S.answer === 'type') {
      el.actions.className = 'actions row';
      el.actions.innerHTML = '<button class="act primary" type="button" id="nextBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd></button>';
    } else {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.id = 'nextBtn'; btn.className = 'act primary'; btn.style.gridColumn = '1 / -1';
      btn.innerHTML = '<span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd>';
      el.actions.appendChild(btn);
    }
    if ($('nextBtn')) $('nextBtn').addEventListener('click', nextQuestion);
  }

  function updatePracticeQueue(m, right) {
    const card = S.queue.find(c => c.item.id === m.id) || { item: m, step: 0 };
    S.queue = S.queue.filter(c => c.item.id !== m.id);
    if (right) { card.step++; S.queue.splice(Math.min(S.queue.length, card.step < 2 ? 4 + card.step * 2 : S.queue.length), 0, card); }
    else { card.step = 0; S.queue.splice(Math.min(S.queue.length, 2), 0, card); }
  }

  function nextQuestion() {
    if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; }
    if (S.mode === 'test') {
      S.deckIdx++;
      if (S.deckIdx >= S.deck.length) return finishTest();
      renderQuizQuestion(S.deck[S.deckIdx]);
    } else if (S.mode === 'practice') {
      if (!S.queue.length) S.queue = shuffle(pool()).map(item => ({ item, step: 0 }));
      const next = S.queue[0];
      if (!next) return studyGrid();
      renderQuizQuestion(next.item);
    }
  }

  function startTimer() {
    if (S.timerId) clearInterval(S.timerId);
    S.startTs = Date.now(); S.elapsedSec = 0;
    S.timerId = setInterval(() => { S.elapsedSec = Math.floor((Date.now() - S.startTs) / 1000); el.sTime.textContent = fmtTime(S.elapsedSec); }, 1000);
  }
  function startPractice(customItems) {
    clearTimers(); S.mode = 'practice'; writeSaved('mode', 'practice');
    S.queue = shuffle(customItems && customItems.length ? customItems : pool()).map(item => ({ item, step: 0 }));
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
    startTimer(); syncControls(); nextQuestion();
  }
  function startTest() {
    clearTimers(); S.mode = 'test'; writeSaved('mode', 'test');
    S.deck = shuffle(pool()); S.deckIdx = -1;
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
    startTimer(); syncControls(); nextQuestion();
  }
  function finishTest() {
    clearTimers(); S.current = null; S.answered = false; el.gridBar.hidden = true;
    const total = S.deck.length || 1, pct = Math.round((S.okCount / total) * 100);
    const scope = S.set + ':' + S.category + ':' + S.target, prev = S.best[scope];
    if (!prev || pct > prev.pct || (pct === prev.pct && S.elapsedSec < prev.time)) {
      S.best[scope] = { pct, time: S.elapsedSec }; writeSaved('best', S.best);
    }
    el.pBarWrap.classList.remove('is-off'); el.pBar.style.width = '100%';
    el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn'); el.prompt.classList.add('is-review');
    el.pEyebrow.textContent = t('eyebrowSummary');
    const missUnique = [], seen = new Set();
    S.misses.forEach(e => { if (!seen.has(e.item.id)) { seen.add(e.item.id); missUnique.push(e); } });
    el.reviewPanel.hidden = false;
    el.reviewPanel.innerHTML =
      '<div class="res-main"><div class="res-score"><b>' + S.okCount + '</b><span>/' + total + '</span></div>' +
      '<div class="res-tiles"><div><b>' + pct + '%</b><span>' + esc(t('resAcc')) + '</span></div><div><b>' + fmtTime(S.elapsedSec) + '</b><span>' + esc(t('resTime')) + '</span></div><div><b>' + S.bestStreak + '</b><span>' + esc(t('resStreak')) + '</span></div></div></div>' +
      '<div class="res-actions"><button class="btn primary" type="button" id="resReplayBtn">' + esc(t('resPlayAgain')) + '</button>' +
      (missUnique.length ? '<button class="btn" type="button" id="resMissBtn">' + esc(t('resStudyMisses', { n: missUnique.length })) + '</button>' : '<button class="btn" type="button" id="resExploreBtn">' + esc(t('resExplore')) + '</button>') + '</div>' +
      '<div class="res-foot"><span class="key ok"><i></i><b>' + esc(t('resKeyOk', { n: S.okCount })) + '</b></span><span class="key bad"><i></i><b>' + esc(t('resKeyBad', { n: total - S.okCount })) + '</b></span><span class="rhint">' + esc(missUnique.length ? t('resClickMiss') : t('resPerfect')) + '</span></div>';
    if ($('resReplayBtn')) $('resReplayBtn').addEventListener('click', startTest);
    if ($('resMissBtn')) $('resMissBtn').addEventListener('click', () => startPractice(missUnique.map(x => x.item)));
    if ($('resExploreBtn')) $('resExploreBtn').addEventListener('click', () => setMode('study'));
    const sum = document.createElement('div'); sum.className = 'summary';
    if (missUnique.length) {
      sum.innerHTML = '<p class="note">' + esc(t('missTitle')) + '</p><div class="misses">' +
        missUnique.map(entry => '<button type="button" data-id="' + esc(entry.item.id) + '"><div class="thumb">' + motifGlyphSvg(entry.item.motif, true) + '</div><div class="lbl"><b>' + esc(nameOf(entry.item)) + '</b><small>' + esc(t('yourAnswer', { ans: entry.userAns })) + '</small></div></button>').join('') +
      '</div>';
      sum.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', () => {
        S.mode = 'study'; writeSaved('mode', 'study'); syncControls(); studyOne(btn.getAttribute('data-id'));
      }));
    } else sum.innerHTML = '<p class="note">' + esc(t('resPerfect')) + '</p>';
    el.view.textContent = ''; el.view.appendChild(sum); el.actions.className = 'actions row'; el.actions.innerHTML = '';
    renderPanelMeta(); updateStats();
  }

  function setMode(m) { if (m === 'study' || m === 'practice' || m === 'test') { S.mode = m; writeSaved('mode', m); restart(); } }
  function setTarget(tgt) {
    if (tgt !== 'deity' && tgt !== 'equivalent') return;
    S.target = tgt; writeSaved('target', tgt); syncControls();
    if (S.mode !== 'study' && S.current && !S.answered) renderQuizQuestion(S.current);
  }
  function restart() {
    clearTimers(); syncControls();
    if (S.mode === 'study') { S.current = null; S.elapsedSec = 0; studyGrid(); }
    else if (S.mode === 'practice') startPractice();
    else startTest();
  }

  function applyStaticLabels() {
    document.documentElement.lang = LANG; document.title = t('docTitle');
    el.homeLink.setAttribute('aria-label', t('homeLabel')); el.homeLink.title = '← ' + t('homeLabel');
    el.toolMark.innerHTML = t('markHtml'); el.brandSub.textContent = t('brandSub');
    el.rail.setAttribute('aria-label', t('railLabel')); el.railTitle.textContent = t('railTitle');
    el.exploreSearch.placeholder = t('searchPlaceholder'); el.exploreSearch.setAttribute('aria-label', t('searchAria'));
    el.exploreClear.setAttribute('aria-label', t('clearSearch'));
    el.settingsBtn.textContent = t('settings'); el.cleanExit.textContent = t('cleanExit');
    el.lblAcc.textContent = t('lblAcc'); el.lblTime.textContent = t('lblTime'); el.lblStreak.textContent = t('lblStreak');
    el.closeSheet.textContent = t('done');
    const lTag = el.lblLang.querySelector('label'); if (lTag) lTag.textContent = t('lblLang'); else el.lblLang.textContent = t('lblLang');
    el.langSel.value = LANG;
    el.lblMode.textContent = t('lblMode');
    const mb = el.modeSeg.querySelectorAll('button');
    if (mb[0]) mb[0].textContent = t('modeStudy'); if (mb[1]) mb[1].textContent = t('modePractice'); if (mb[2]) mb[2].textContent = t('modeTest');
    el.lblSet.textContent = t('lblSet');
    const sb = el.setSeg.querySelectorAll('button'); if (sb[0]) sb[0].textContent = t('setPopular'); if (sb[1]) sb[1].textContent = t('setAll');
    el.lblTarget.textContent = t('lblTarget');
    const tb = el.targetSeg.querySelectorAll('button'); if (tb[0]) tb[0].textContent = t('tgtDeity'); if (tb[1]) tb[1].textContent = t('tgtEquiv');
    el.lblAnswer.textContent = t('lblAnswer');
    const ab = el.answerSeg.querySelectorAll('button'); if (ab[0]) ab[0].textContent = t('ansChoose'); if (ab[1]) ab[1].textContent = t('ansType');
    el.restartBtn.textContent = t('restart'); el.cleanBtn.textContent = t('cleanBtn');
    el.soundBtn.textContent = S.sound ? t('soundYes') : t('soundNo');
    el.keysBtn.textContent = t('keysBtn'); el.howBtn.textContent = t('howBtn'); el.creditLine.textContent = t('creditLine');
    el.introTitle.textContent = t('introTitle'); el.intro1.innerHTML = t('intro1'); el.intro2.innerHTML = t('intro2'); el.intro3.innerHTML = t('intro3');
    el.keysTitle.textContent = t('keysTitle');
    el.keysList.innerHTML = t('keys').map(p => '<li><kbd>' + esc(p[0]) + '</kbd> ' + esc(p[1]) + '</li>').join('');
  }

  function syncControls() {
    applyStaticLabels();
    el.modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.mode));
    el.setSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.set));
    el.targetSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.target));
    el.answerSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.answer));
    el.answerBox.classList.toggle('is-off', S.mode === 'study');
    el.soundBtn.setAttribute('aria-pressed', S.sound);
    renderRail(); renderPanelMeta(); updateStats(); updateProgress();
  }

  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    LANG = next; writeSaved('lang', LANG);
    try { if (window.localStorage) window.localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    syncControls();
    if (S.mode === 'study') { if (S.studyAt) studyOne(S.studyAt); else studyGrid(); }
    else if (S.current && !S.answered) renderQuizQuestion(S.current);
    else if (S.current && S.answered) {
      if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
      const nb = $('nextBtn'); if (nb && nb.querySelector('.txt')) nb.querySelector('.txt').textContent = t('next');
    }
  }

  let helpBoxEl = null;
  function closeHelpBox() {
    if (helpBoxEl && helpBoxEl.parentNode) helpBoxEl.parentNode.removeChild(helpBoxEl);
    helpBoxEl = null;
    document.querySelectorAll('.help[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  function openHelp(btn) {
    const info = t('help')[btn.getAttribute('data-help')];
    if (!info) return;
    if (helpBoxEl && btn.getAttribute('aria-expanded') === 'true') { closeHelpBox(); return; }
    closeHelpBox(); btn.setAttribute('aria-expanded', 'true');
    helpBoxEl = document.createElement('div'); helpBoxEl.className = 'helpbox';
    helpBoxEl.innerHTML = '<b>' + esc(info[0]) + '</b><p>' + esc(info[1]) + '</p>';
    document.body.appendChild(helpBoxEl);
    if (btn.getBoundingClientRect) {
      const r = btn.getBoundingClientRect();
      helpBoxEl.style.top = Math.min(window.innerHeight - 130, Math.max(12, r.bottom + 8)) + 'px';
      helpBoxEl.style.left = Math.min(window.innerWidth - 320, Math.max(12, r.left - 20)) + 'px';
    }
  }

  el.langSel.addEventListener('change', () => setLang(el.langSel.value));
  el.modeSeg.addEventListener('click', ev => { const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (b) setMode(b.dataset.v); });
  el.setSeg.addEventListener('click', ev => { const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (!b) return; S.set = b.dataset.v; writeSaved('set', S.set); restart(); });
  el.targetSeg.addEventListener('click', ev => { const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (b) setTarget(b.dataset.v); });
  el.answerSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (!b) return;
    S.answer = b.dataset.v; writeSaved('answer', S.answer);
    if (S.mode !== 'study' && S.current && !S.answered) { syncControls(); renderQuizQuestion(S.current); } else syncControls();
  });
  el.restartBtn.addEventListener('click', restart);
  el.cleanBtn.addEventListener('click', () => document.body.classList.add('clean'));
  el.cleanExit.addEventListener('click', () => document.body.classList.remove('clean'));
  el.settingsBtn.addEventListener('click', () => document.body.classList.add('sheet-open'));
  el.closeSheet.addEventListener('click', () => document.body.classList.remove('sheet-open'));
  el.soundBtn.addEventListener('click', () => { S.sound = !S.sound; writeSaved('sound', S.sound); syncControls(); });
  el.exploreSearch.addEventListener('input', () => { S.exploreQuery = el.exploreSearch.value || ''; if (S.mode === 'study' && !S.studyAt) studyGrid(); });
  el.exploreClear.addEventListener('click', () => { S.exploreQuery = ''; el.exploreSearch.value = ''; if (S.mode === 'study' && !S.studyAt) studyGrid(); });
  el.howBtn.addEventListener('click', () => { el.intro.hidden = false; });
  el.introClose.addEventListener('click', () => { el.intro.hidden = true; });
  el.intro.addEventListener('click', ev => { if (ev.target === el.intro) el.intro.hidden = true; });
  el.keysBtn.addEventListener('click', () => { el.keysModal.hidden = false; });
  el.keysClose.addEventListener('click', () => { el.keysModal.hidden = true; });
  el.keysModal.addEventListener('click', ev => { if (ev.target === el.keysModal) el.keysModal.hidden = true; });

  document.addEventListener('click', ev => {
    const hBtn = ev.target && ev.target.closest ? ev.target.closest('.help[data-help]') : null;
    if (hBtn) { ev.stopPropagation(); openHelp(hBtn); return; }
    if (helpBoxEl && !helpBoxEl.contains(ev.target)) closeHelpBox();
  });
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') {
      closeHelpBox();
      if (!el.intro.hidden) { el.intro.hidden = true; return; }
      if (!el.keysModal.hidden) { el.keysModal.hidden = true; return; }
      if (document.body.classList.contains('sheet-open')) { document.body.classList.remove('sheet-open'); return; }
      if (document.body.classList.contains('clean')) { document.body.classList.remove('clean'); return; }
      if (S.mode === 'study' && S.studyAt) { studyGrid(); return; }
    }
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA')) return;
    if (S.mode === 'study') {
      if (S.studyAt && ev.key === 'ArrowLeft') { ev.preventDefault(); stepStudy(-1); }
      else if (S.studyAt && ev.key === 'ArrowRight') { ev.preventDefault(); stepStudy(1); }
      else if (ev.key === 'p' || ev.key === 'P') { ev.preventDefault(); setMode('practice'); }
      return;
    }
    if (S.answered && (ev.key === 'Enter' || ev.key === 'ArrowRight' || ev.key === ' ')) { ev.preventDefault(); nextQuestion(); return; }
    if (!S.answered && S.answer === 'choose' && ev.key >= '1' && ev.key <= '4') {
      const idx = Number(ev.key) - 1, btn = el.actions.querySelector('button.act[data-idx="' + idx + '"]');
      if (S.opts[idx] && btn) submitChoice(S.opts[idx], btn);
    } else if (!S.answered && S.answer === 'type' && (ev.key === 'h' || ev.key === 'H')) showHint();
  });

  window.MA = {
    norm, checkAnswer, setLang, setMode, setTarget, restart,
    studyGrid, studyOne, submitChoice, submitTyping, finishTest, choices, pool,
    getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
