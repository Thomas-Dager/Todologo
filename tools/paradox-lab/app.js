(() => {
  'use strict';

  const DATA = window.PARADOX_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const saved = window.SiteProgress ? window.SiteProgress.tool('paradox-lab') : null;
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

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[&/+\-×"'“”‘’().,:·]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function compactAlnum(s) {
    return norm(s).replace(/\s+/g, '');
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

  const VAGUE_INPUTS = {
    'paradoja': { es: 'Especifica el nombre de la paradoja (ej. Simpson, Monty Hall, Penrose).', en: 'Specify which paradox (e.g. Simpson, Monty Hall, Penrose).' },
    'paradox': { es: 'Specify which paradox (e.g. Simpson, Monty Hall, Penrose).', en: 'Specify which paradox (e.g. Simpson, Monty Hall, Penrose).' },
    'infinito': { es: '¿Hotel de Hilbert, Cuerno de Gabriel, Zenón o Banach–Tarski?', en: 'Hilbert Hotel, Gabriel’s Horn, Zeno, or Banach–Tarski?' },
    'infinity': { es: 'Hilbert Hotel, Gabriel’s Horn, Zeno, or Banach–Tarski?', en: 'Hilbert Hotel, Gabriel’s Horn, Zeno, or Banach–Tarski?' },
    'sesgo': { es: '¿Sesgo de colisionador (Berkson), tasa base, confusión (Simpson) o longitud?', en: 'Collider bias (Berkson), base rate, confounding (Simpson), or length bias?' },
    'bias': { es: 'Collider bias, base rate, confounding, or length bias?', en: 'Collider bias, base rate, confounding, or length bias?' },
    'logica': { es: '¿Russell, Mentiroso, Curry, Sorites, Examen sorpresa o Quine?', en: 'Russell, Liar, Curry, Sorites, Unexpected Hanging, or Quine?' },
    'logic': { es: 'Russell, Liar, Curry, Sorites, or Unexpected Hanging?', en: 'Russell, Liar, Curry, Sorites, or Unexpected Hanging?' },
    'bayes': { es: '¿Monty Hall, Falacia del Fiscal o Paradoja del Cuervo?', en: 'Monty Hall, Prosecutor’s Fallacy, or Raven Paradox?' }
  };

  function itemAliasesForTarget(m, tgt) {
    const out = [];
    if (tgt === 'paradox') {
      out.push(m.nameEs, m.nameEn);
      if (Array.isArray(m.aliases)) out.push.apply(out, m.aliases);
    } else {
      out.push(m.resEs, m.resEn, m.resShort);
      if (Array.isArray(m.resAliases)) out.push.apply(out, m.resAliases);
    }
    return out.filter(Boolean);
  }

  function buildIndexFor(tgt) {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();

    function addRaw(m, raw, fuzzyOk) {
      const k = norm(raw);
      if (!k || k.length < 3 || VAGUE_INPUTS[k]) return;
      if (!exact.has(k)) exact.set(k, m);
      const ck = compactAlnum(raw);
      if (ck && ck.length >= 3 && !VAGUE_INPUTS[ck] && !exact.has(ck)) exact.set(ck, m);
      if (fuzzyOk && k.length >= 6) {
        const sig = m.id + '|' + k;
        if (!seen.has(sig)) {
          seen.add(sig);
          candidates.push({ m, k, ck });
        }
      }
    }

    ITEMS.forEach(m => {
      const prims = tgt === 'paradox' ? [m.nameEs, m.nameEn] : [m.resEs, m.resEn];
      prims.forEach(v => addRaw(m, v, true));
      itemAliasesForTarget(m, tgt).forEach(al => addRaw(m, al, String(al).length >= 6));
    });

    return { exact, candidates };
  }

  let IDX_PARADOX = null;
  let IDX_RESOLUTION = null;
  function getIndex() {
    if (!IDX_PARADOX) IDX_PARADOX = buildIndexFor('paradox');
    if (!IDX_RESOLUTION) IDX_RESOLUTION = buildIndexFor('resolution');
    return S.target === 'resolution' ? IDX_RESOLUTION : IDX_PARADOX;
  }

  const I18N = {
    es: {
      docTitle: 'Paradojas Matemáticas y Lógicas — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'PARADOJAS <span>LAB</span>',
      brandSub: '44 paradojas matemáticas, probabilísticas y lógicas (Simpson, Monty Hall, Penrose, Hilbert)',
      railLabel: 'Ramas',
      railTitle: 'Ramas',
      allCats: 'Todas las ramas',
      searchPlaceholder: 'Buscar Simpson, Monty Hall, Penrose, Hilbert, Bayes…',
      searchAria: 'Buscar paradoja',
      clearSearch: 'Limpiar búsqueda',
      searchEmpty: 'No hay paradojas que coincidan con tu búsqueda.',
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
      lblSet: 'Conjunto',
      setPopular: 'Clásicas',
      setAll: 'Todas',
      lblTarget: 'Preguntar por',
      tgtParadox: 'Paradoja',
      tgtResolution: 'Resolución',
      lblAnswer: 'Responder',
      ansChoose: 'Eligiendo',
      ansType: 'Escribiendo',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      soundOn: 'Sonido: Sí',
      soundOff: 'Sonido: No',
      bestNone: 'Sin marca todavía',
      bestFmt: 'Mejor: {score}/{total} ({acc}%) · {time}',
      knowFmt: 'Dominadas: {n}/{total}',
      keysBtn: 'Teclas',
      howBtn: 'Cómo funciona',
      credit: 'Compendio ilustrado de paradojas formales de estadística, infinito, lógica y física.',
      introTitle: 'Laboratorio de Paradojas',
      intro1: 'Explora paradojas famosas que rompen la intuición diaria: Simpson (reversión estadística), Monty Hall con 100 puertas, Hotel Infinito de Hilbert, Escalera de Penrose o Paradoja de Braess.',
      intro2: 'En «Preguntar por Paradoja», reconoce el fenómeno desde su diagrama SVG y enunciado; en «Resolución», identifica la clave matemática que explica por qué no hay contradicción real.',
      intro3: 'Cambia entre Aprender (con cola adaptativa de repaso) y Examen cronometrado.',
      keysTitle: 'Atajos de teclado',
      keysItems: [
        '<kbd>1</kbd>–<kbd>4</kbd> Elegir opción en quiz',
        '<kbd>Enter</kbd> / <kbd>Espacio</kbd> / <kbd>→</kbd> Siguiente tarjeta',
        '<kbd>H</kbd> Mostrar pista al escribir',
        '<kbd>←</kbd> <kbd>→</kbd> Navegar en Explorar',
        '<kbd>P</kbd> Pasar de Explorar a Aprender',
        '<kbd>Esc</kbd> Cerrar diálogo o ficha'
      ],
      studyPrompt: 'Explora diagramas y resoluciones · Pulsa cualquier paradoja',
      studyMetaAll: 'Todas las paradojas ({n})',
      studyMetaCat: '{cat} · {n} paradojas',
      detailEyebrow: 'EXPLORAR · PARADOJA {i}/{n}',
      practiceEyebrow: 'APRENDER · {cat}',
      testEyebrow: 'EXAMEN ({i}/{n}) · {cat}',
      askPromptParadox: '¿Qué paradoja o dilema representa? ({n})',
      askPromptResolution: '¿Cuál es su clave matemática o resolución? ({n})',
      rightEyebrow: 'CORRECTO',
      wrongEyebrow: 'ERA: {ans}',
      vagueEyebrow: 'RESPUESTA IMPRECISA',
      hintLabel: 'Pista',
      giveUpLabel: 'Revelar',
      typePlaceholderParadox: 'Ej: Simpson, Monty Hall, Hilbert…',
      typePlaceholderResolution: 'Ej: Variable de confusión, biyección…',
      submitLabel: 'Comprobar',
      nextLabel: 'Siguiente',
      finishLabel: 'Ver resultado',
      backGridLabel: '← Volver al índice',
      prevLabel: '← Anterior',
      nextCardLabel: 'Siguiente →',
      practiceBtnLabel: 'Entrenar esta rama',
      practiceDoneTitle: '¡Rama dominada!',
      practiceDoneMeta: 'Completaste todas las paradojas de «{cat}».',
      reviewEyebrow: 'EXAMEN FINALIZADO · {cat}',
      reviewPillPerfect: 'Razonamiento impecable',
      reviewPillGood: 'Gran intuición',
      reviewPillRetry: 'Sigue entrenando',
      resScoreTitle: 'Puntuación',
      resAccTitle: 'Acierto',
      resTimeTitle: 'Tiempo',
      resRetryMissed: 'Repasar fallos ({n})',
      resNewTest: 'Nuevo examen',
      resExplore: 'Volver a explorar',
      resOkFoot: 'Aciertos: {n}',
      resBadFoot: 'Fallos: {n}',
      resHintFoot: 'Pulsa cualquier fallo para ver su diagrama y clave',
      missTitle: 'Paradojas para repasar:',
      resPerfect: '¡100%! Intuición matemática a prueba de falacias.',
      yourAnswer: 'Tu respuesta: {ans}',
      factField: 'Área',
      factOrigin: 'Origen',
      factKey: 'Clave',
      help: {
        rail: ['Ramas', 'Elige entre Probabilidad y Datos, Infinito y Geometría, Lógica o Decisión y Física.'],
        mode: ['Modos', 'Explorar permite leer diagramas y resoluciones; Aprender repite fallos; Examen evalúa sin repeticiones.'],
        set: ['Conjunto', 'Clásicas (~25) prioriza los referentes famosos; Todas (44) cubre paradojas avanzadas de análisis, ZFC y termodinámica.'],
        target: ['Objetivo', 'Paradoja pide nombrar el fenómeno desde su diagrama; Resolución evalúa la explicación formal detrás.'],
        answer: ['Respuesta', 'Eligiendo da 4 opciones distintas; Escribiendo acepta el nombre clave o abreviatura con tolerancia ortográfica.']
      }
    },
    en: {
      docTitle: 'Mathematical & Logical Paradoxes — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'PARADOX <span>LAB</span>',
      brandSub: '44 math, probability & logic paradoxes (Simpson, Monty Hall, Penrose, Hilbert)',
      railLabel: 'Branches',
      railTitle: 'Branches',
      allCats: 'All branches',
      searchPlaceholder: 'Search Simpson, Monty Hall, Penrose, Hilbert, Bayes…',
      searchAria: 'Search paradox',
      clearSearch: 'Clear search',
      searchEmpty: 'No paradoxes match your search.',
      settings: 'Settings',
      cleanExit: 'Exit clean view',
      lblAcc: 'Accuracy',
      lblTime: 'Time',
      lblStreak: 'Streak',
      done: 'Done',
      lblLang: 'Language',
      lblMode: 'Mode',
      modeStudy: 'Explore',
      modePractice: 'Practice',
      modeTest: 'Test',
      lblSet: 'Deck',
      setPopular: 'Core',
      setAll: 'All',
      lblTarget: 'Ask for',
      tgtParadox: 'Paradox',
      tgtResolution: 'Resolution',
      lblAnswer: 'Answer by',
      ansChoose: 'Choices',
      ansType: 'Typing',
      restart: 'Restart',
      cleanView: 'Clean view',
      soundOn: 'Sound: On',
      soundOff: 'Sound: Off',
      bestNone: 'No best run yet',
      bestFmt: 'Best: {score}/{total} ({acc}%) · {time}',
      knowFmt: 'Mastered: {n}/{total}',
      keysBtn: 'Shortcuts',
      howBtn: 'How it works',
      credit: 'Visual guide to classic paradoxes in statistics, infinity, formal logic, and physics.',
      introTitle: 'Math & Logic Paradox Lab',
      intro1: 'Explore counter-intuitive landmarks: Simpson’s trend reversal, 100-door Monty Hall, Hilbert’s Grand Hotel, the Penrose staircase, and Braess’s network trap.',
      intro2: 'In "Ask for Paradox", identify the phenomenon from its SVG schematic and premise; in "Resolution", pinpoint the formal theorem or mechanism that resolves it.',
      intro3: 'Switch between adaptive Practice and timed Test mode.',
      keysTitle: 'Keyboard shortcuts',
      keysItems: [
        '<kbd>1</kbd>–<kbd>4</kbd> Pick option in quiz',
        '<kbd>Enter</kbd> / <kbd>Space</kbd> / <kbd>→</kbd> Next card',
        '<kbd>H</kbd> Show letter hint while typing',
        '<kbd>←</kbd> <kbd>→</kbd> Step cards in Explore',
        '<kbd>P</kbd> Switch from Explore to Practice',
        '<kbd>Esc</kbd> Close modal, drawer or detail view'
      ],
      studyPrompt: 'Explore visual paradoxes & resolutions · Click any card',
      studyMetaAll: 'All paradoxes ({n})',
      studyMetaCat: '{cat} · {n} paradoxes',
      detailEyebrow: 'EXPLORE · PARADOX {i}/{n}',
      practiceEyebrow: 'PRACTICE · {cat}',
      testEyebrow: 'TEST ({i}/{n}) · {cat}',
      askPromptParadox: 'Which paradox is illustrated here? ({n})',
      askPromptResolution: 'What is the formal resolution? ({n})',
      rightEyebrow: 'CORRECT',
      wrongEyebrow: 'ANSWER WAS: {ans}',
      vagueEyebrow: 'BE MORE SPECIFIC',
      hintLabel: 'Hint',
      giveUpLabel: 'Reveal',
      typePlaceholderParadox: 'e.g. Simpson, Monty Hall, Hilbert…',
      typePlaceholderResolution: 'e.g. Confounding variable, bijection…',
      submitLabel: 'Check',
      nextLabel: 'Next',
      finishLabel: 'See results',
      backGridLabel: '← Back to grid',
      prevLabel: '← Prev',
      nextCardLabel: 'Next →',
      practiceBtnLabel: 'Practice this branch',
      practiceDoneTitle: 'Branch complete!',
      practiceDoneMeta: 'You mastered every paradox in "{cat}".',
      reviewEyebrow: 'TEST COMPLETE · {cat}',
      reviewPillPerfect: 'Logician perfection',
      reviewPillGood: 'Sharp intuition',
      reviewPillRetry: 'Keep exploring',
      resScoreTitle: 'Score',
      resAccTitle: 'Accuracy',
      resTimeTitle: 'Time',
      resRetryMissed: 'Practice missed ({n})',
      resNewTest: 'New test',
      resExplore: 'Back to explore',
      resOkFoot: 'Correct: {n}',
      resBadFoot: 'Missed: {n}',
      resHintFoot: 'Click any missed card to inspect its diagram and key',
      missTitle: 'Paradoxes to review:',
      resPerfect: '100%! Immune to statistical and logical traps.',
      yourAnswer: 'Your answer: {ans}',
      factField: 'Field',
      factOrigin: 'Origin',
      factKey: 'Resolution',
      help: {
        rail: ['Branches', 'Filter between Probability, Infinity & Geometry, Logic, or Decisions & Physics.'],
        mode: ['Modes', 'Explore lets you inspect every diagram; Practice replays misses; Test grades a full run.'],
        set: ['Deck', 'Core (~25) covers essential landmarks; All (44) adds deeper topology, set theory, and thermodynamics.'],
        target: ['Target', 'Paradox asks to name the classic problem; Resolution asks for the underlying mathematical fix.'],
        answer: ['Response', 'Choices shows 4 distinct options; Typing matches core names and aliases with typo tolerance.']
      }
    }
  };

  function t(key, vars) {
    const dict = I18N[LANG] || I18N.es;
    let s = dict[key];
    if (s == null) s = I18N.es[key] || key;
    if (typeof s === 'string' && vars) {
      Object.keys(vars).forEach(k => { s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k])); });
    }
    return s;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function maskText(text, targetStr) {
    if (!text || !targetStr) return text || '';
    const escaped = String(targetStr).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return String(text).replace(new RegExp(escaped, 'gi'), '___');
  }

  const S = {
    mode: readSaved('mode', 'study'),
    set: readSaved('set', 'popular'),
    target: readSaved('target', 'paradox'),
    answer: readSaved('answer', 'choose'),
    cat: readSaved('cat', 'all'),
    sound: readSaved('sound', true) !== false,
    exploreQuery: '',
    studyAt: null,
    queue: [],
    current: null,
    opts: [],
    answered: false,
    hintUsed: 0,
    totalCount: 0,
    doneCount: 0,
    rightCount: 0,
    streak: 0,
    elapsedSec: 0,
    missed: [],
    knownIds: new Set(readSaved('knownIds', []) || [])
  };

  const el = {
    homeLink: document.getElementById('homeLink'),
    toolMark: document.getElementById('toolMark'),
    brandSub: document.getElementById('brandSub'),
    rail: document.getElementById('rail'),
    railTitle: document.getElementById('railTitle'),
    railList: document.getElementById('railList'),
    prompt: document.getElementById('prompt'),
    pEyebrow: document.getElementById('pEyebrow'),
    pName: document.getElementById('pName'),
    pMeta: document.getElementById('pMeta'),
    pBarWrap: document.getElementById('pBarWrap'),
    pBar: document.getElementById('pBar'),
    reviewPanel: document.getElementById('reviewPanel'),
    gridBar: document.getElementById('gridBar'),
    exploreSearch: document.getElementById('exploreSearch'),
    exploreClear: document.getElementById('exploreClear'),
    exploreCount: document.getElementById('exploreCount'),
    stageBox: document.getElementById('stageBox'),
    view: document.getElementById('view'),
    actions: document.getElementById('actions'),
    settingsBtn: document.getElementById('settingsBtn'),
    cleanExit: document.getElementById('cleanExit'),
    stats: document.getElementById('stats'),
    lblAcc: document.getElementById('lblAcc'),
    lblTime: document.getElementById('lblTime'),
    lblStreak: document.getElementById('lblStreak'),
    sAcc: document.getElementById('sAcc'),
    sTime: document.getElementById('sTime'),
    sStreak: document.getElementById('sStreak'),
    panel: document.getElementById('panel'),
    closeSheet: document.getElementById('closeSheet'),
    lblLang: document.getElementById('lblLang'),
    langSel: document.getElementById('langSel'),
    lblMode: document.getElementById('lblMode'),
    modeSeg: document.getElementById('modeSeg'),
    lblSet: document.getElementById('lblSet'),
    setSeg: document.getElementById('setSeg'),
    targetBox: document.getElementById('targetBox'),
    lblTarget: document.getElementById('lblTarget'),
    targetSeg: document.getElementById('targetSeg'),
    answerBox: document.getElementById('answerBox'),
    lblAnswer: document.getElementById('lblAnswer'),
    answerSeg: document.getElementById('answerSeg'),
    restartBtn: document.getElementById('restartBtn'),
    cleanBtn: document.getElementById('cleanBtn'),
    soundBtn: document.getElementById('soundBtn'),
    best: document.getElementById('best'),
    know: document.getElementById('know'),
    keysBtn: document.getElementById('keysBtn'),
    howBtn: document.getElementById('howBtn'),
    creditLine: document.getElementById('creditLine'),
    intro: document.getElementById('intro'),
    introTitle: document.getElementById('introTitle'),
    intro1: document.getElementById('intro1'),
    intro2: document.getElementById('intro2'),
    intro3: document.getElementById('intro3'),
    introClose: document.getElementById('introClose'),
    keysModal: document.getElementById('keysModal'),
    keysTitle: document.getElementById('keysTitle'),
    keysList: document.getElementById('keysList'),
    keysClose: document.getElementById('keysClose')
  };

  let timerHandle = null;
  let flashTimer = null;
  let helpBoxEl = null;

  let audioCtx = null;
  function playTone(ok) {
    if (!S.sound) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = ok ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(ok ? 523 : 196, now);
      if (ok) osc.frequency.exponentialRampToValueAtTime(784, now + 0.09);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch (_) {}
  }

  function catLabel(catId) {
    if (catId === 'all') return t('allCats');
    const c = CAT_BY_ID[catId];
    return c ? (LANG === 'en' ? c.en : c.es) : catId;
  }

  function itemName(m) {
    return LANG === 'en' ? (m.nameEn || m.nameEs) : (m.nameEs || m.nameEn);
  }

  function itemRes(m) {
    return LANG === 'en' ? (m.resEn || m.resEs) : (m.resEs || m.resEn);
  }

  function itemTarget(m, tgt) {
    return (tgt || S.target) === 'resolution' ? itemRes(m) : itemName(m);
  }

  function itemField(m) {
    return LANG === 'en' ? (m.fieldEn || m.fieldEs) : (m.fieldEs || m.fieldEn);
  }

  function itemCue(m) {
    return LANG === 'en' ? (m.cueEn || m.cueEs) : (m.cueEs || m.cueEn);
  }

  function itemNote(m) {
    return LANG === 'en' ? (m.noteEn || m.noteEs) : (m.noteEs || m.noteEn);
  }

  function pool(forceSet) {
    const setMode = forceSet || S.set;
    return ITEMS.filter(m => {
      if (setMode === 'popular' && !m.pop) return false;
      if (S.cat !== 'all' && m.cat !== S.cat) return false;
      return true;
    });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function fmtTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function clearTimers() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    if (flashTimer) { clearTimeout(flashTimer); flashTimer = null; }
    el.stageBox.classList.remove('flash-ok', 'flash-bad');
  }

  function startClock() {
    clearInterval(timerHandle);
    timerHandle = setInterval(() => {
      S.elapsedSec += 1;
      el.sTime.textContent = fmtTime(S.elapsedSec);
    }, 1000);
  }

  function updateStats() {
    const pct = S.doneCount ? Math.round((S.rightCount / S.doneCount) * 100) : null;
    el.sAcc.textContent = pct == null ? '–' : pct + '%';
    el.sTime.textContent = fmtTime(S.elapsedSec);
    el.sStreak.textContent = String(S.streak);
    if (S.totalCount > 0 && S.mode !== 'study') {
      el.pBarWrap.classList.remove('is-off');
      el.pBar.style.width = Math.min(100, Math.round((S.doneCount / S.totalCount) * 100)) + '%';
    } else {
      el.pBarWrap.classList.add('is-off');
      el.pBar.style.width = '0%';
    }
  }

  function renderDiagramSvg(m) {
    const kind = m.kind || 'card';
    if (kind === 'simpson') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Trend reversal diagram">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<line x1="42" y1="120" x2="395" y2="120" stroke="#33475a"/>' +
        '<line x1="42" y1="18" x2="42" y2="120" stroke="#33475a"/>' +
        '<line x1="65" y1="104" x2="175" y2="66" stroke="#5fd39a" stroke-width="3"/>' +
        '<circle cx="75" cy="100" r="4" fill="#5fd39a"/><circle cx="115" cy="86" r="4" fill="#5fd39a"/><circle cx="165" cy="70" r="4" fill="#5fd39a"/>' +
        '<line x1="230" y1="62" x2="355" y2="26" stroke="#6fd0e8" stroke-width="3"/>' +
        '<circle cx="240" cy="58" r="4" fill="#6fd0e8"/><circle cx="290" cy="44" r="4" fill="#6fd0e8"/><circle cx="345" cy="29" r="4" fill="#6fd0e8"/>' +
        '<line x1="75" y1="42" x2="345" y2="96" stroke="#ff7a6b" stroke-width="2.5" stroke-dasharray="6 4"/>' +
        '<text x="115" y="114" fill="#5fd39a" font-family="IBM Plex Mono" font-size="9.5" text-anchor="middle">Subgroup 1 (+)</text>' +
        '<text x="290" y="21" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="9.5" text-anchor="middle">Subgroup 2 (+)</text>' +
        '<text x="225" y="92" fill="#ff7a6b" font-family="IBM Plex Mono" font-size="10" font-weight="600">Pooled trend (-)</text>' +
      '</svg>';
    }
    if (kind === 'monty100') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="100 doors probability diagram">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<rect x="22" y="24" width="68" height="90" rx="7" fill="#101f2b" stroke="#6fd0e8" stroke-width="1.8"/>' +
        '<text x="56" y="58" fill="#ecdec2" font-family="IBM Plex Mono" font-size="13" font-weight="600" text-anchor="middle">#1</text>' +
        '<text x="56" y="88" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="11" text-anchor="middle">1 / 100</text>' +
        '<rect x="110" y="42" width="176" height="54" rx="7" fill="#0c131a" stroke="#223140" stroke-dasharray="4 3"/>' +
        '<text x="198" y="66" fill="#8d9ca9" font-family="IBM Plex Mono" font-size="10.5" text-anchor="middle">98 empty doors opened</text>' +
        '<text x="198" y="82" fill="#ff7a6b" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">0% · eliminated</text>' +
        '<rect x="308" y="24" width="88" height="90" rx="7" fill="#102923" stroke="#5fd39a" stroke-width="2"/>' +
        '<text x="352" y="58" fill="#ecdec2" font-family="IBM Plex Mono" font-size="13" font-weight="600" text-anchor="middle">#73</text>' +
        '<text x="352" y="88" fill="#5fd39a" font-family="IBM Plex Mono" font-size="12" font-weight="600" text-anchor="middle">99 / 100</text>' +
      '</svg>';
    }
    if (kind === 'hilbert') {
      const rooms = [1, 2, 3, 4].map(n => {
        const x = 24 + (n - 1) * 92;
        return '<rect x="' + x + '" y="46" width="66" height="48" rx="7" fill="#101c26" stroke="#6fd0e8"/>' +
          '<text x="' + (x + 33) + '" y="68" fill="#ecdec2" font-family="IBM Plex Mono" font-size="11" font-weight="600" text-anchor="middle">Rm ' + n + '</text>' +
          '<text x="' + (x + 33) + '" y="84" fill="#5fd39a" font-family="IBM Plex Mono" font-size="9.5" text-anchor="middle">' + n + ' -> ' + (n + 1) + '</text>' +
          '<path d="M ' + (x + 48) + ' 34 Q ' + (x + 78) + ' 14 ' + (x + 104) + ' 34" fill="none" stroke="#f0cf6a" stroke-width="1.5"/>';
      }).join('');
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Infinite hotel room shift">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        rooms +
        '<text x="210" y="122" fill="#8d9ca9" font-family="IBM Plex Mono" font-size="11" text-anchor="middle">Rm 1 free &lt;- n -> n+1 ··· (∞)</text>' +
      '</svg>';
    }
    if (kind === 'penrose') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Impossible 4-flight loop staircase">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<polygon points="210,18 320,66 210,122 100,66" fill="#101b24" stroke="#6fd0e8" stroke-width="2"/>' +
        '<polygon points="210,44 268,69 210,98 152,69" fill="#080e14" stroke="#33475a" stroke-width="1.5"/>' +
        '<path d="M128 60 L152 48 L152 55 L178 42 L178 49 L206 34" fill="none" stroke="#ecdec2" stroke-width="2"/>' +
        '<path d="M214 34 L244 48 L244 55 L270 66 L270 72 L296 68" fill="none" stroke="#ecdec2" stroke-width="2"/>' +
        '<path d="M292 78 L266 91 L266 98 L240 109 L212 115" fill="none" stroke="#f0cf6a" stroke-width="2"/>' +
        '<path d="M204 114 L178 102 L152 89 L126 75" fill="none" stroke="#5fd39a" stroke-width="2"/>' +
        '<text x="348" y="34" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="10">Σ Δz = +4</text>' +
        '<text x="348" y="50" fill="#ff7a6b" font-family="IBM Plex Mono" font-size="10">Loop Δz = 0</text>' +
      '</svg>';
    }
    if (kind === 'gabriel') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="1/x funnel cross-section">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<ellipse cx="76" cy="70" rx="16" ry="44" fill="rgba(111,208,232,0.14)" stroke="#6fd0e8" stroke-width="2"/>' +
        '<path d="M76 26 Q 150 62 396 67" fill="none" stroke="#ecdec2" stroke-width="2"/>' +
        '<path d="M76 114 Q 150 78 396 73" fill="none" stroke="#ecdec2" stroke-width="2"/>' +
        '<line x1="56" y1="70" x2="402" y2="70" stroke="#33475a" stroke-dasharray="4 3"/>' +
        '<text x="245" y="32" fill="#5fd39a" font-family="IBM Plex Mono" font-size="11">∫(1/x²)dx => V = π</text>' +
        '<text x="245" y="120" fill="#ff7a6b" font-family="IBM Plex Mono" font-size="11">∫(1/x)dx => A = ∞</text>' +
      '</svg>';
    }
    if (kind === 'braess') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Network routing graph">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<line x1="65" y1="70" x2="210" y2="26" stroke="#6fd0e8" stroke-width="2"/>' +
        '<line x1="210" y1="26" x2="355" y2="70" stroke="#8d9ca9" stroke-width="2"/>' +
        '<line x1="65" y1="70" x2="210" y2="114" stroke="#8d9ca9" stroke-width="2"/>' +
        '<line x1="210" y1="114" x2="355" y2="70" stroke="#6fd0e8" stroke-width="2"/>' +
        '<line x1="210" y1="26" x2="210" y2="114" stroke="#f0cf6a" stroke-width="2.5" stroke-dasharray="5 3"/>' +
        '<circle cx="65" cy="70" r="13" fill="#121b23" stroke="#ecdec2"/><text x="65" y="74" fill="#ecdec2" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">S</text>' +
        '<circle cx="210" cy="26" r="12" fill="#121b23" stroke="#6fd0e8"/><text x="210" y="30" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">A</text>' +
        '<circle cx="210" cy="114" r="12" fill="#121b23" stroke="#6fd0e8"/><text x="210" y="118" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">B</text>' +
        '<circle cx="355" cy="70" r="13" fill="#121b23" stroke="#5fd39a"/><text x="355" y="74" fill="#5fd39a" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">T</text>' +
        '<text x="220" y="74" fill="#f0cf6a" font-family="IBM Plex Mono" font-size="10">cost 0!</text>' +
        '<text x="122" y="42" fill="#8d9ca9" font-family="IBM Plex Mono" font-size="9.5">t = n/100</text>' +
        '<text x="122" y="106" fill="#8d9ca9" font-family="IBM Plex Mono" font-size="9.5">45 min</text>' +
      '</svg>';
    }
    if (kind === 'birthday') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Collision probability curve">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<line x1="48" y1="116" x2="388" y2="116" stroke="#33475a"/>' +
        '<line x1="48" y1="20" x2="48" y2="116" stroke="#33475a"/>' +
        '<path d="M48 116 Q 115 110 165 68 T 300 26 L 380 22" fill="none" stroke="#6fd0e8" stroke-width="2.5"/>' +
        '<line x1="48" y1="68" x2="165" y2="68" stroke="#5fd39a" stroke-dasharray="4 3"/>' +
        '<line x1="165" y1="68" x2="165" y2="116" stroke="#5fd39a" stroke-dasharray="4 3"/>' +
        '<circle cx="165" cy="68" r="5" fill="#5fd39a"/>' +
        '<text x="174" y="64" fill="#5fd39a" font-family="IBM Plex Mono" font-size="10.5" font-weight="600">n=23 -> 50.7%</text>' +
        '<text x="300" y="42" fill="#ecdec2" font-family="IBM Plex Mono" font-size="10">n=57 -> 99%</text>' +
      '</svg>';
    }
    if (kind === 'berkson' || kind === 'collider2') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Selection cutoff bias diagram">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<line x1="56" y1="118" x2="375" y2="118" stroke="#33475a"/>' +
        '<line x1="56" y1="18" x2="56" y2="118" stroke="#33475a"/>' +
        '<polygon points="90,118 280,22 370,22 370,118" fill="rgba(111,208,232,0.09)"/>' +
        '<line x1="90" y1="118" x2="280" y2="22" stroke="#ff7a6b" stroke-width="2" stroke-dasharray="5 3"/>' +
        '<circle cx="135" cy="96" r="4" fill="#6fd0e8"/><circle cx="185" cy="82" r="4" fill="#6fd0e8"/>' +
        '<circle cx="245" cy="54" r="4" fill="#6fd0e8"/><circle cx="315" cy="36" r="4" fill="#6fd0e8"/>' +
        '<circle cx="95" cy="65" r="3" fill="#33475a"/><circle cx="115" cy="40" r="3" fill="#33475a"/>' +
        '<text x="275" y="104" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="10">Observed (X+Y ≥ k)</text>' +
        '<text x="155" y="34" fill="#ff7a6b" font-family="IBM Plex Mono" font-size="10">Filtered out</text>' +
      '</svg>';
    }
    if (kind === 'zeno' || kind === 'stpeter') {
      const bars = ['1/2', '1/4', '1/8', '1/16'].map((lbl, idx) => {
        const w = 180 / Math.pow(2, idx);
        const x = 36 + [0, 180, 270, 315][idx];
        return '<rect x="' + x + '" y="48" width="' + (w - 3) + '" height="44" rx="4" fill="#102530" stroke="#6fd0e8"/>' +
          '<text x="' + (x + w / 2 - 1) + '" y="74" fill="#ecdec2" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">' + lbl + '</text>';
      }).join('');
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Geometric step series">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        bars +
        '<text x="210" y="116" fill="#5fd39a" font-family="IBM Plex Mono" font-size="11" text-anchor="middle">' + esc(m.badge) + '</text>' +
      '</svg>';
    }
    if (kind === 'russell') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Self-membership paradox loop">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<circle cx="145" cy="70" r="42" fill="rgba(111,208,232,0.09)" stroke="#6fd0e8" stroke-width="2"/>' +
        '<circle cx="275" cy="70" r="42" fill="rgba(255,122,107,0.09)" stroke="#ff7a6b" stroke-width="2"/>' +
        '<text x="145" y="74" fill="#5fd39a" font-family="IBM Plex Mono" font-size="12" font-weight="600" text-anchor="middle">True</text>' +
        '<text x="275" y="74" fill="#ff7a6b" font-family="IBM Plex Mono" font-size="12" font-weight="600" text-anchor="middle">False</text>' +
        '<path d="M188 54 C 210 30 210 30 232 54" fill="none" stroke="#ecdec2" stroke-width="2"/>' +
        '<path d="M232 86 C 210 110 210 110 188 86" fill="none" stroke="#ecdec2" stroke-width="2"/>' +
        '<text x="210" y="24" fill="#f0cf6a" font-family="IBM Plex Mono" font-size="10.5" text-anchor="middle">' + esc(m.badge) + '</text>' +
      '</svg>';
    }
    if (kind === 'coins') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Two rolling coins">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<circle cx="170" cy="70" r="32" fill="#101f2b" stroke="#8d9ca9" stroke-width="2"/>' +
        '<circle cx="234" cy="70" r="32" fill="#102530" stroke="#6fd0e8" stroke-width="2"/>' +
        '<circle cx="170" cy="70" r="64" fill="none" stroke="#5fd39a" stroke-dasharray="5 3"/>' +
        '<text x="170" y="74" fill="#8d9ca9" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">Fixed r</text>' +
        '<text x="234" y="74" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">Spin r</text>' +
        '<text x="332" y="74" fill="#5fd39a" font-family="IBM Plex Mono" font-size="11" text-anchor="middle">2 full turns</text>' +
      '</svg>';
    }
    if (kind === 'twins') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Spacetime worldlines">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<line x1="150" y1="120" x2="150" y2="20" stroke="#5fd39a" stroke-width="3"/>' +
        '<polyline points="150,120 290,70 150,20" fill="none" stroke="#6fd0e8" stroke-width="2.5"/>' +
        '<circle cx="290" cy="70" r="5" fill="#ff7a6b"/>' +
        '<text x="95" y="74" fill="#5fd39a" font-family="IBM Plex Mono" font-size="10">Inertial</text>' +
        '<text x="302" y="74" fill="#ff7a6b" font-family="IBM Plex Mono" font-size="10">Turnaround Δv</text>' +
      '</svg>';
    }
    if (kind === 'olbers') {
      return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Deep sky shell diagram">' +
        '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
        '<circle cx="210" cy="70" r="18" fill="none" stroke="#6fd0e8" stroke-dasharray="3 3"/>' +
        '<circle cx="210" cy="70" r="38" fill="none" stroke="#33475a" stroke-dasharray="3 3"/>' +
        '<circle cx="210" cy="70" r="58" fill="none" stroke="#223140"/>' +
        '<circle cx="210" cy="70" r="4" fill="#ecdec2"/>' +
        '<circle cx="170" cy="48" r="2.5" fill="#f0cf6a"/><circle cx="255" cy="90" r="2.5" fill="#f0cf6a"/><circle cx="242" cy="38" r="2" fill="#5fd39a"/><circle cx="145" cy="95" r="2" fill="#6fd0e8"/>' +
        '<text x="210" y="128" fill="#8d9ca9" font-family="IBM Plex Mono" font-size="10" text-anchor="middle">' + esc(m.badge) + '</text>' +
      '</svg>';
    }
    // Generic clean formal schematic
    return '<svg class="px-svg" viewBox="0 0 420 140" role="img" aria-label="Mathematical schematic">' +
      '<rect x="2" y="2" width="416" height="136" rx="8" fill="#080e14" stroke="#1d2b38"/>' +
      '<rect x="34" y="34" width="352" height="72" rx="10" fill="#0e1720" stroke="#33475a" stroke-width="1.5"/>' +
      '<text x="210" y="66" fill="#ecdec2" font-family="IBM Plex Mono" font-size="17" font-weight="600" text-anchor="middle">' + esc(m.badge) + '</text>' +
      '<text x="210" y="88" fill="#6fd0e8" font-family="IBM Plex Mono" font-size="11" text-anchor="middle">' + esc(itemField(m) + ' · ' + m.origin) + '</text>' +
    '</svg>';
  }

  function renderParadoxPlate(m, reveal) {
    let cueText = reveal ? itemNote(m) : itemCue(m);
    if (!reveal) {
      cueText = maskText(cueText, itemTarget(m, 'paradox'));
      cueText = maskText(cueText, itemTarget(m, 'resolution'));
      if (m.resShort) cueText = maskText(cueText, m.resShort);
    }
    const rightBadge = reveal ? (m.resShort || itemRes(m)) : itemField(m);
    const leftBadge = reveal ? m.origin : catLabel(m.cat);

    return '<div class="px-plate">' +
      '<div class="px-head">' +
        '<div class="px-badges"><span class="pxbadge">' + esc(leftBadge) + '</span><span class="pxbadge is-key">' + esc(rightBadge) + '</span></div>' +
        '<div class="px-badges"><span class="pxbadge">' + esc(m.badge) + '</span></div>' +
      '</div>' +
      '<div class="px-svg-box">' + renderDiagramSvg(m) + '</div>' +
      '<div class="px-cue"><b>' + esc(reveal ? (LANG === 'en' ? 'KEY' : 'CLAVE') : '?') + '</b><span>' + esc(cueText) + '</span></div>' +
    '</div>';
  }

  function studyGrid() {
    S.studyAt = null;
    clearTimers();
    el.prompt.className = 'prompt';
    el.reviewPanel.hidden = true;
    el.pEyebrow.textContent = t('modeStudy').toUpperCase();
    el.pName.textContent = S.cat === 'all' ? t('allCats') : catLabel(S.cat);
    const items = pool();
    el.pMeta.textContent = S.cat === 'all' ? t('studyMetaAll', { n: items.length }) : t('studyMetaCat', { cat: catLabel(S.cat), n: items.length });
    el.gridBar.hidden = false;

    const q = norm(S.exploreQuery);
    el.exploreClear.hidden = !S.exploreQuery;
    const filtered = !q ? items : items.filter(m => {
      const hay = [m.nameEs, m.nameEn, m.resEs, m.resEn, m.cueEs, m.cueEn, m.fieldEs, m.fieldEn, m.badge, catLabel(m.cat)].join(' ');
      return norm(hay).includes(q);
    });
    el.exploreCount.textContent = filtered.length + '/' + items.length;

    const groups = S.cat === 'all'
      ? CATEGORIES.map(c => ({ cat: c, rows: filtered.filter(x => x.cat === c.id) })).filter(g => g.rows.length)
      : [{ cat: CAT_BY_ID[S.cat], rows: filtered }];

    const grid = document.createElement('div');
    grid.className = 'grid';
    if (!filtered.length) {
      grid.innerHTML = '<div class="grid-empty">' + esc(t('searchEmpty')) + '</div>';
    } else {
      groups.forEach(g => {
        if (S.cat === 'all' && g.cat) {
          const hd = document.createElement('div');
          hd.className = 'head';
          hd.innerHTML = '<span>' + esc(LANG === 'en' ? g.cat.en : g.cat.es) + '</span><span>' + esc(g.cat.era) + ' · ' + g.rows.length + '</span>';
          grid.appendChild(hd);
        }
        g.rows.forEach(m => {
          const card = document.createElement('button');
          card.type = 'button';
          card.className = 'pcard' + (S.knownIds.has(m.id) ? ' is-known' : '');
          card.setAttribute('data-id', m.id);
          card.innerHTML = '<div class="thumb">' +
            '<span class="fld-pill">' + esc(itemField(m)) + '</span>' +
            '<span class="sym-main">' + esc(m.badge) + '</span>' +
            '<span class="res-tag">' + esc(m.resShort || m.origin) + '</span>' +
          '</div><div class="lbl"><b>' + esc(itemName(m)) + '</b></div>';
          card.addEventListener('click', () => studyOne(m.id));
          grid.appendChild(card);
        });
      });
    }

    el.view.textContent = '';
    el.view.appendChild(grid);

    el.actions.className = 'actions row';
    el.actions.innerHTML = '';
    const goPractice = document.createElement('button');
    goPractice.type = 'button';
    goPractice.className = 'act primary';
    goPractice.textContent = t('practiceBtnLabel');
    goPractice.addEventListener('click', () => setMode('practice'));
    el.actions.appendChild(goPractice);
    updateStats();
    renderRail();
  }

  function studyOne(id) {
    const m = BY_ID[id];
    if (!m) { studyGrid(); return; }
    S.studyAt = id;
    el.gridBar.hidden = true;
    el.prompt.className = 'prompt';
    el.reviewPanel.hidden = true;

    const list = pool();
    const idx = Math.max(0, list.findIndex(x => x.id === id));
    el.pEyebrow.textContent = t('detailEyebrow', { i: idx + 1, n: list.length });
    el.pName.textContent = itemName(m);
    el.pMeta.textContent = itemCue(m);

    const facts = [
      '<span><b>' + esc(t('factField')) + ':</b> ' + esc(itemField(m)) + '</span>',
      '<span><b>' + esc(t('factOrigin')) + ':</b> ' + esc(m.origin) + '</span>',
      '<span><b>' + esc(t('factKey')) + ':</b> ' + esc(itemRes(m)) + '</span>'
    ];

    el.view.innerHTML = '<div class="detail">' +
      '<div class="show">' + renderParadoxPlate(m, true) + '</div>' +
      '<div class="spec-wrap"><div class="facts">' + facts.join('') + '</div><p class="fact-note">' + esc(itemNote(m)) + '</p></div>' +
    '</div>';

    el.actions.className = 'actions row';
    el.actions.innerHTML = '';
    const back = document.createElement('button'); back.type = 'button'; back.className = 'act'; back.textContent = t('backGridLabel');
    back.addEventListener('click', studyGrid);
    const prev = document.createElement('button'); prev.type = 'button'; prev.className = 'act'; prev.textContent = t('prevLabel');
    prev.addEventListener('click', () => stepStudy(-1));
    const next = document.createElement('button'); next.type = 'button'; next.className = 'act primary'; next.textContent = t('nextCardLabel');
    next.addEventListener('click', () => stepStudy(1));
    el.actions.appendChild(back);
    el.actions.appendChild(prev);
    el.actions.appendChild(next);
    renderRail();
  }

  function stepStudy(delta) {
    const list = pool();
    if (!list.length) return;
    const idx = list.findIndex(x => x.id === S.studyAt);
    const nextIdx = idx < 0 ? 0 : (idx + delta + list.length) % list.length;
    studyOne(list[nextIdx].id);
  }

  function choices(q) {
    const usedLabels = new Set();
    usedLabels.add(norm(itemTarget(q, S.target)));
    const chosen = [q];
    const preferredIds = Array.isArray(DATA.LOOKALIKES[q.id]) ? DATA.LOOKALIKES[q.id] : [];
    const sameCat = shuffle(ITEMS.filter(x => x.id !== q.id && x.cat === q.cat));
    const others = shuffle(ITEMS.filter(x => x.id !== q.id && x.cat !== q.cat));
    const candidates = preferredIds.map(id => BY_ID[id]).filter(Boolean).concat(sameCat, others);

    for (let i = 0; i < candidates.length && chosen.length < 4; i++) {
      const c = candidates[i];
      const lbl = norm(itemTarget(c, S.target));
      if (!lbl || usedLabels.has(lbl)) continue;
      usedLabels.add(lbl);
      chosen.push(c);
    }
    return shuffle(chosen);
  }

  function checkAnswer(input, targetItem) {
    const k = norm(input);
    const ck = compactAlnum(input);
    if (!k) return { ok: false, reason: 'empty' };
    if (VAGUE_INPUTS[k]) return { ok: false, vague: VAGUE_INPUTS[k][LANG] || VAGUE_INPUTS[k].es };

    if (targetItem) {
      const aliases = itemAliasesForTarget(targetItem, S.target);
      for (let i = 0; i < aliases.length; i++) {
        const ak = norm(aliases[i]);
        const ack = compactAlnum(aliases[i]);
        if ((ak && ak === k) || (ack && ack === ck)) {
          return { ok: true, exact: true, match: targetItem };
        }
      }
      if (k.length >= 6) {
        const prim = norm(itemTarget(targetItem, S.target));
        const maxD = prim.length >= 12 ? 2 : 1;
        if (editDist(k, prim) <= maxD) return { ok: true, fuzzy: true, match: targetItem };
      }
    }

    const idx = getIndex();
    const direct = idx.exact.get(k) || idx.exact.get(ck);
    if (direct) {
      const isOk = targetItem ? direct.id === targetItem.id : true;
      return { ok: isOk, exact: true, match: direct };
    }

    if (k.length >= 6) {
      let best = null;
      let bestD = Infinity;
      idx.candidates.forEach(cand => {
        const d = Math.min(editDist(k, cand.k), editDist(ck, cand.ck));
        const maxD = cand.k.length >= 12 ? 2 : 1;
        if (d <= maxD && d < bestD) { bestD = d; best = cand.m; }
      });
      if (best) {
        const isOk = targetItem ? best.id === targetItem.id : true;
        return { ok: isOk, fuzzy: true, match: best };
      }
    }
    return { ok: false, match: null };
  }

  function renderQuizQuestion(q) {
    S.current = q;
    S.answered = false;
    S.hintUsed = 0;
    el.gridBar.hidden = true;
    el.reviewPanel.hidden = true;
    el.prompt.className = 'prompt';

    el.pEyebrow.textContent = S.mode === 'test'
      ? t('testEyebrow', { i: S.doneCount + 1, n: S.totalCount, cat: catLabel(S.cat) })
      : t('practiceEyebrow', { cat: catLabel(q.cat) });

    if (S.target === 'resolution') {
      el.pName.textContent = LANG === 'en' ? q.promptResEn : q.promptResEs;
      el.pMeta.textContent = t('askPromptResolution', { n: S.queue.length + 1 });
    } else {
      el.pName.textContent = maskText(itemCue(q), itemName(q));
      el.pMeta.textContent = t('askPromptParadox', { n: S.queue.length + 1 });
    }

    el.view.innerHTML = '<div class="show">' + renderParadoxPlate(q, false) + '</div>';

    el.actions.innerHTML = '';
    if (S.answer === 'choose') {
      el.actions.className = 'actions';
      S.opts = choices(q);
      S.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'act';
        btn.setAttribute('data-idx', String(i));
        btn.innerHTML = '<kbd>' + (i + 1) + '</kbd><span class="txt">' + esc(itemTarget(opt, S.target)) + '</span>';
        btn.addEventListener('click', () => submitChoice(opt, btn));
        el.actions.appendChild(btn);
      });
    } else {
      el.actions.className = 'actions row';
      const box = document.createElement('div');
      box.className = 'typebox';
      const inp = document.createElement('input');
      inp.id = 'typeInput';
      inp.type = 'text';
      inp.autocomplete = 'off';
      inp.spellcheck = false;
      inp.placeholder = S.target === 'resolution' ? t('typePlaceholderResolution') : t('typePlaceholderParadox');
      const sub = document.createElement('button');
      sub.type = 'button';
      sub.className = 'act primary';
      sub.id = 'submitTypeBtn';
      sub.textContent = t('submitLabel');
      const hintBtn = document.createElement('button');
      hintBtn.type = 'button';
      hintBtn.className = 'act';
      hintBtn.id = 'hintBtn';
      hintBtn.textContent = t('hintLabel');
      const giveUpBtn = document.createElement('button');
      giveUpBtn.type = 'button';
      giveUpBtn.className = 'act';
      giveUpBtn.id = 'giveUpBtn';
      giveUpBtn.textContent = t('giveUpLabel');

      sub.addEventListener('click', () => submitTyping(inp.value));
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); submitTyping(inp.value); } });
      hintBtn.addEventListener('click', showHint);
      giveUpBtn.addEventListener('click', () => resolveAnswer(false, t('giveUpLabel')));

      box.appendChild(inp);
      box.appendChild(sub);
      el.actions.appendChild(box);
      el.actions.appendChild(hintBtn);
      el.actions.appendChild(giveUpBtn);
      if (inp.focus) try { inp.focus(); } catch (_) {}
    }

    updateStats();
    renderRail();
  }

  function showHint() {
    if (S.answered || !S.current || S.answer !== 'type') return;
    const ans = itemTarget(S.current, S.target);
    S.hintUsed += 1;
    const nReveal = Math.min(ans.length, S.hintUsed * 3);
    const masked = ans.slice(0, nReveal) + ans.slice(nReveal).replace(/[^\s/·\-()]/g, '_');
    el.pMeta.innerHTML = '<span class="letters">' + esc(masked) + '</span>';
  }

  function submitChoice(opt, btn) {
    if (S.answered || !S.current) return;
    const isOk = opt.id === S.current.id;
    const buttons = el.actions.querySelectorAll('button.act');
    buttons.forEach((b, i) => {
      b.disabled = true;
      const o = S.opts[i];
      if (o && o.id === S.current.id) b.classList.add('is-right');
      else if (b === btn && !isOk) b.classList.add('is-wrong');
    });
    resolveAnswer(isOk, itemTarget(opt, S.target));
  }

  function submitTyping(rawVal) {
    if (S.answered || !S.current) return;
    const res = checkAnswer(rawVal, S.current);
    if (res.vague) {
      el.prompt.className = 'prompt is-warn';
      el.pEyebrow.textContent = t('vagueEyebrow');
      el.pMeta.textContent = res.vague;
      return;
    }
    if (!String(rawVal || '').trim()) return;
    resolveAnswer(Boolean(res.ok), String(rawVal).trim());
  }

  function resolveAnswer(isOk, userAns) {
    if (S.answered || !S.current) return;
    S.answered = true;
    const q = S.current;
    S.doneCount += 1;

    if (isOk) {
      S.rightCount += 1;
      S.streak += 1;
      S.knownIds.add(q.id);
      writeSaved('knownIds', Array.from(S.knownIds));
    } else {
      S.streak = 0;
      S.missed.push({ item: q, userAns: userAns || '–' });
      if (S.mode === 'practice') {
        const reinsertAt = Math.min(S.queue.length, 2 + Math.floor(Math.random() * 2));
        S.queue.splice(reinsertAt, 0, q);
      }
    }

    playTone(isOk);
    el.stageBox.classList.remove('flash-ok', 'flash-bad');
    el.stageBox.classList.add(isOk ? 'flash-ok' : 'flash-bad');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => el.stageBox.classList.remove('flash-ok', 'flash-bad'), 450);

    el.prompt.className = 'prompt ' + (isOk ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = isOk ? t('rightEyebrow') : t('wrongEyebrow', { ans: itemTarget(q, S.target) });
    el.pMeta.textContent = itemName(q) + ' · ' + itemRes(q);
    el.view.innerHTML = '<div class="show">' + renderParadoxPlate(q, true) + '</div>';

    if (S.answer === 'type') {
      el.actions.innerHTML = '';
      el.actions.className = 'actions row';
    }

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'act primary';
    nextBtn.id = 'nextQuestionBtn';
    const isLastTest = S.mode === 'test' && S.queue.length === 0;
    nextBtn.textContent = isLastTest ? t('finishLabel') : t('nextLabel');
    nextBtn.addEventListener('click', nextQuestion);
    el.actions.appendChild(nextBtn);

    renderPanelMeta();
    updateStats();
    renderRail();
  }

  function nextQuestion() {
    if (!S.queue.length) {
      if (S.mode === 'test') finishTest();
      else finishPractice();
      return;
    }
    const next = S.queue.shift();
    renderQuizQuestion(next);
  }

  function startPractice(customItems) {
    clearTimers();
    S.studyAt = null;
    const base = Array.isArray(customItems) && customItems.length ? customItems.slice() : pool();
    const items = base.length ? base : ITEMS.slice();
    S.queue = shuffle(items);
    S.totalCount = S.queue.length;
    S.doneCount = 0;
    S.rightCount = 0;
    S.streak = 0;
    S.elapsedSec = 0;
    S.missed = [];
    startClock();
    nextQuestion();
  }

  function startTest() {
    clearTimers();
    S.studyAt = null;
    const base = pool();
    const items = base.length ? base : ITEMS.slice();
    S.queue = shuffle(items).slice(0, Math.min(20, items.length));
    S.totalCount = S.queue.length;
    S.doneCount = 0;
    S.rightCount = 0;
    S.streak = 0;
    S.elapsedSec = 0;
    S.missed = [];
    startClock();
    nextQuestion();
  }

  function finishPractice() {
    clearTimers();
    S.current = null;
    el.prompt.className = 'prompt is-ok';
    el.pEyebrow.textContent = t('modePractice').toUpperCase();
    el.pName.textContent = t('practiceDoneTitle');
    el.pMeta.textContent = t('practiceDoneMeta', { cat: catLabel(S.cat) });
    el.view.innerHTML = '<div class="summary"><p class="note">' + esc(t('resPerfect')) + '</p></div>';
    el.actions.className = 'actions row';
    el.actions.innerHTML = '';
    const r = document.createElement('button'); r.type = 'button'; r.className = 'act primary'; r.textContent = t('restart');
    r.addEventListener('click', () => startPractice());
    const b = document.createElement('button'); b.type = 'button'; b.className = 'act'; b.textContent = t('resExplore');
    b.addEventListener('click', () => setMode('study'));
    el.actions.appendChild(r);
    el.actions.appendChild(b);
    updateStats();
  }

  function finishTest() {
    clearTimers();
    S.current = null;
    const total = Math.max(1, S.totalCount);
    const acc = Math.round((S.rightCount / total) * 100);
    const bestKey = 'best.' + S.cat + '.' + S.set + '.' + S.target;
    const prevBest = readSaved(bestKey, null);
    if (!prevBest || S.rightCount > prevBest.score || (S.rightCount === prevBest.score && S.elapsedSec < prevBest.sec)) {
      writeSaved(bestKey, { score: S.rightCount, total: S.totalCount, acc, sec: S.elapsedSec });
    }

    const seenMiss = new Set();
    const missUnique = S.missed.filter(e => {
      if (!e.item || seenMiss.has(e.item.id)) return false;
      seenMiss.add(e.item.id);
      return true;
    });

    const pillText = acc === 100 ? t('reviewPillPerfect') : (acc >= 70 ? t('reviewPillGood') : t('reviewPillRetry'));
    el.prompt.className = 'prompt is-review ' + (acc >= 70 ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = t('reviewEyebrow', { cat: catLabel(S.cat) });
    el.reviewPanel.hidden = false;
    el.reviewPanel.innerHTML =
      '<div class="res-main">' +
        '<div class="res-score"><b>' + S.rightCount + '</b><span>/' + S.totalCount + '</span></div>' +
        '<div class="res-tiles">' +
          '<div><b>' + acc + '%</b><span>' + esc(t('resAccTitle')) + '</span></div>' +
          '<div><b>' + fmtTime(S.elapsedSec) + '</b><span>' + esc(t('resTimeTitle')) + '</span></div>' +
          '<div><b>' + S.streak + '</b><span>' + esc(t('lblStreak')) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="res-actions">' +
        (missUnique.length ? '<button type="button" class="btn primary" id="retryMissedBtn">' + esc(t('resRetryMissed', { n: missUnique.length })) + '</button>' : '') +
        '<button type="button" class="btn ' + (missUnique.length ? '' : 'primary') + '" id="newTestBtn">' + esc(t('resNewTest')) + '</button>' +
        '<button type="button" class="btn" id="resExploreBtn">' + esc(t('resExplore')) + '</button>' +
      '</div>' +
      '<div class="res-foot">' +
        '<span class="key ok"><i></i><b>' + esc(t('resOkFoot', { n: S.rightCount })) + '</b></span>' +
        '<span class="key bad"><i></i><b>' + esc(t('resBadFoot', { n: S.missed.length })) + '</b></span>' +
        '<span class="rhint">' + esc(t('resHintFoot')) + '</span>' +
      '</div>';

    let oldPill = el.prompt.querySelector('.pill');
    if (!oldPill) { oldPill = document.createElement('span'); oldPill.className = 'pill'; el.prompt.appendChild(oldPill); }
    oldPill.textContent = pillText;

    const rmb = document.getElementById('retryMissedBtn');
    const ntb = document.getElementById('newTestBtn');
    const reb = document.getElementById('resExploreBtn');
    if (rmb) rmb.addEventListener('click', () => { S.mode = 'practice'; writeSaved('mode', 'practice'); syncControls(); startPractice(missUnique.map(x => x.item)); });
    if (ntb) ntb.addEventListener('click', () => startTest());
    if (reb) reb.addEventListener('click', () => setMode('study'));

    const sum = document.createElement('div');
    sum.className = 'summary';
    if (missUnique.length) {
      sum.innerHTML = '<p class="note">' + esc(t('missTitle')) + '</p><div class="misses">' +
        missUnique.map(entry => {
          const m = entry.item;
          return '<button type="button" data-id="' + esc(m.id) + '">' +
            '<div class="thumb">' +
              '<span class="sym-main">' + esc(m.badge) + '</span>' +
              '<span class="res-tag">' + esc(m.resShort || m.origin) + '</span>' +
            '</div>' +
            '<div class="lbl"><b>' + esc(itemName(m)) + '</b><small>' + esc(itemTarget(m, S.target)) + ' · ' + esc(t('yourAnswer', { ans: entry.userAns })) + '</small></div>' +
          '</button>';
        }).join('') +
      '</div>';
      sum.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          S.mode = 'study';
          writeSaved('mode', 'study');
          syncControls();
          studyOne(btn.getAttribute('data-id'));
        });
      });
    } else {
      sum.innerHTML = '<p class="note">' + esc(t('resPerfect')) + '</p>';
    }

    el.view.textContent = '';
    el.view.appendChild(sum);
    el.actions.className = 'actions row';
    el.actions.innerHTML = '';
    renderPanelMeta();
    updateStats();
  }

  function setMode(m) {
    if (m !== 'study' && m !== 'practice' && m !== 'test') return;
    S.mode = m; writeSaved('mode', m); restart();
  }

  function setTarget(tgt) {
    if (tgt !== 'paradox' && tgt !== 'resolution') return;
    S.target = tgt;
    writeSaved('target', tgt);
    syncControls();
    if (S.mode !== 'study' && S.current && !S.answered) {
      renderQuizQuestion(S.current);
    } else if (S.mode === 'study') {
      if (S.studyAt) studyOne(S.studyAt); else studyGrid();
    }
  }

  function restart() {
    clearTimers();
    const oldPill = el.prompt.querySelector('.pill');
    if (oldPill) oldPill.remove();
    syncControls();
    if (S.mode === 'study') { S.current = null; S.elapsedSec = 0; studyGrid(); }
    else if (S.mode === 'practice') startPractice();
    else startTest();
  }

  function applyStaticLabels() {
    document.documentElement.lang = LANG;
    document.title = t('docTitle');
    el.homeLink.setAttribute('aria-label', t('homeLabel'));
    el.homeLink.title = '← ' + t('homeLabel');
    el.toolMark.innerHTML = t('markHtml');
    el.brandSub.textContent = t('brandSub');
    el.rail.setAttribute('aria-label', t('railLabel'));
    el.railTitle.textContent = t('railTitle');
    el.exploreSearch.placeholder = t('searchPlaceholder');
    el.exploreSearch.setAttribute('aria-label', t('searchAria'));
    el.exploreClear.setAttribute('aria-label', t('clearSearch'));
    el.settingsBtn.textContent = t('settings');
    el.cleanExit.textContent = t('cleanExit');
    el.lblAcc.textContent = t('lblAcc');
    el.lblTime.textContent = t('lblTime');
    el.lblStreak.textContent = t('lblStreak');
    el.closeSheet.textContent = t('done');
    const lblLangTag = el.lblLang.querySelector('label');
    if (lblLangTag) lblLangTag.textContent = t('lblLang');
    else el.lblLang.textContent = t('lblLang');
    el.langSel.value = LANG;
    el.lblMode.textContent = t('lblMode');
    const modeBtns = el.modeSeg.querySelectorAll('button');
    if (modeBtns[0]) modeBtns[0].textContent = t('modeStudy');
    if (modeBtns[1]) modeBtns[1].textContent = t('modePractice');
    if (modeBtns[2]) modeBtns[2].textContent = t('modeTest');
    el.lblSet.textContent = t('lblSet');
    const setBtns = el.setSeg.querySelectorAll('button');
    if (setBtns[0]) setBtns[0].textContent = t('setPopular');
    if (setBtns[1]) setBtns[1].textContent = t('setAll');
    el.lblTarget.textContent = t('lblTarget');
    const tgtBtns = el.targetSeg.querySelectorAll('button');
    if (tgtBtns[0]) tgtBtns[0].textContent = t('tgtParadox');
    if (tgtBtns[1]) tgtBtns[1].textContent = t('tgtResolution');
    el.lblAnswer.textContent = t('lblAnswer');
    const ansBtns = el.answerSeg.querySelectorAll('button');
    if (ansBtns[0]) ansBtns[0].textContent = t('ansChoose');
    if (ansBtns[1]) ansBtns[1].textContent = t('ansType');
    el.restartBtn.textContent = t('restart');
    el.cleanBtn.textContent = t('cleanView');
    el.soundBtn.textContent = S.sound ? t('soundOn') : t('soundOff');
    el.soundBtn.setAttribute('aria-pressed', String(S.sound));
    el.keysBtn.textContent = t('keysBtn');
    el.howBtn.textContent = t('howBtn');
    el.creditLine.textContent = t('credit');
    el.introTitle.textContent = t('introTitle');
    el.intro1.textContent = t('intro1');
    el.intro2.textContent = t('intro2');
    el.intro3.textContent = t('intro3');
    el.keysTitle.textContent = t('keysTitle');
    el.keysList.innerHTML = t('keysItems').map(li => '<li>' + li + '</li>').join('');
  }

  function renderPanelMeta() {
    const bestKey = 'best.' + S.cat + '.' + S.set + '.' + S.target;
    const b = readSaved(bestKey, null);
    el.best.innerHTML = b ? '<b>' + esc(t('bestFmt', { score: b.score, total: b.total, acc: b.acc, time: fmtTime(b.sec) })) + '</b>' : esc(t('bestNone'));
    el.know.textContent = t('knowFmt', { n: S.knownIds.size, total: ITEMS.length });
  }

  function syncControls() {
    applyStaticLabels();
    el.modeSeg.querySelectorAll('button[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.mode)));
    el.setSeg.querySelectorAll('button[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.set)));
    el.targetSeg.querySelectorAll('button[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.target)));
    el.answerSeg.querySelectorAll('button[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === S.answer)));
    el.targetBox.classList.toggle('is-off', S.mode === 'study');
    el.answerBox.classList.toggle('is-off', S.mode === 'study');
    el.stats.classList.toggle('is-off', S.mode === 'study');
    renderPanelMeta();
  }

  function renderRail() {
    const allItems = ITEMS.filter(m => S.set !== 'popular' || m.pop);
    const list = [{ id: 'all', es: t('allCats'), en: t('allCats'), era: S.set === 'popular' ? 'Clásicas' : 'Completas' }].concat(CATEGORIES);
    el.railList.innerHTML = '';
    list.forEach(c => {
      const catItems = c.id === 'all' ? allItems : allItems.filter(m => m.cat === c.id);
      if (!catItems.length) return;
      const known = catItems.filter(m => S.knownIds.has(m.id)).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rg';
      btn.setAttribute('data-cat', c.id);
      btn.setAttribute('aria-pressed', String(S.cat === c.id));
      btn.innerHTML = '<span class="r-txt"><span>' + esc(c.id === 'all' ? t('allCats') : (LANG === 'en' ? c.en : c.es)) + '</span>' +
        '<span class="r-era">' + esc(c.era || '') + '</span></span>' +
        '<em class="' + (known === catItems.length && catItems.length ? 'done' : '') + '">' + known + '/' + catItems.length + '</em>';
      btn.addEventListener('click', () => {
        S.cat = c.id;
        writeSaved('cat', S.cat);
        restart();
      });
      el.railList.appendChild(btn);
    });
  }

  function setLang(newLang) {
    if (newLang !== 'es' && newLang !== 'en') return;
    LANG = newLang;
    writeSaved('lang', LANG);
    try { if (window.localStorage) window.localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    syncControls();
    if (S.mode === 'study') {
      if (S.studyAt) studyOne(S.studyAt); else studyGrid();
    } else if (S.current && !S.answered) {
      renderQuizQuestion(S.current);
    } else if (S.current && S.answered) {
      el.pEyebrow.textContent = el.prompt.classList.contains('is-ok') ? t('rightEyebrow') : t('wrongEyebrow', { ans: itemTarget(S.current, S.target) });
      el.view.innerHTML = '<div class="show">' + renderParadoxPlate(S.current, true) + '</div>';
    }
  }

  function closeHelpBox() {
    if (helpBoxEl) { helpBoxEl.remove(); helpBoxEl = null; }
    document.querySelectorAll('.help[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }

  function openHelp(btn) {
    const key = btn.getAttribute('data-help');
    const info = (I18N[LANG] && I18N[LANG].help && I18N[LANG].help[key]) || I18N.es.help[key];
    if (!info) return;
    if (helpBoxEl && helpBoxEl.getAttribute('data-for') === key) { closeHelpBox(); return; }
    closeHelpBox();
    btn.setAttribute('aria-expanded', 'true');
    helpBoxEl = document.createElement('div');
    helpBoxEl.className = 'helpbox';
    helpBoxEl.setAttribute('data-for', key);
    helpBoxEl.innerHTML = '<b>' + esc(info[0]) + '</b><p>' + esc(info[1]) + '</p>';
    document.body.appendChild(helpBoxEl);
    if (btn.getBoundingClientRect) {
      const r = btn.getBoundingClientRect();
      helpBoxEl.style.top = Math.min(window.innerHeight - 130, Math.max(12, r.bottom + 8)) + 'px';
      helpBoxEl.style.left = Math.min(window.innerWidth - 320, Math.max(12, r.left - 20)) + 'px';
    }
  }

  el.langSel.addEventListener('change', () => setLang(el.langSel.value));
  el.modeSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (b) setMode(b.dataset.v);
  });
  el.setSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!b) return;
    S.set = b.dataset.v; writeSaved('set', S.set); restart();
  });
  el.targetSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (b) setTarget(b.dataset.v);
  });
  el.answerSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!b) return;
    S.answer = b.dataset.v; writeSaved('answer', S.answer);
    if (S.mode !== 'study' && S.current && !S.answered) { syncControls(); renderQuizQuestion(S.current); }
    else syncControls();
  });
  el.restartBtn.addEventListener('click', restart);
  el.cleanBtn.addEventListener('click', () => document.body.classList.add('clean'));
  el.cleanExit.addEventListener('click', () => document.body.classList.remove('clean'));
  el.settingsBtn.addEventListener('click', () => document.body.classList.add('sheet-open'));
  el.closeSheet.addEventListener('click', () => document.body.classList.remove('sheet-open'));
  el.soundBtn.addEventListener('click', () => { S.sound = !S.sound; writeSaved('sound', S.sound); syncControls(); });
  el.exploreSearch.addEventListener('input', () => {
    S.exploreQuery = el.exploreSearch.value || '';
    if (S.mode === 'study' && !S.studyAt) studyGrid();
  });
  el.exploreClear.addEventListener('click', () => {
    S.exploreQuery = ''; el.exploreSearch.value = '';
    if (S.mode === 'study' && !S.studyAt) studyGrid();
    if (el.exploreSearch.focus) try { el.exploreSearch.focus(); } catch (_) {}
  });
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
    if (S.answered && (ev.key === 'Enter' || ev.key === 'ArrowRight' || ev.key === ' ')) {
      ev.preventDefault(); nextQuestion(); return;
    }
    if (!S.answered && S.answer === 'choose' && ev.key >= '1' && ev.key <= '4') {
      const idx = Number(ev.key) - 1;
      const btn = el.actions.querySelector('button.act[data-idx="' + idx + '"]');
      if (S.opts[idx] && btn) submitChoice(S.opts[idx], btn);
    } else if (!S.answered && S.answer === 'type' && (ev.key === 'h' || ev.key === 'H')) {
      showHint();
    }
  });

  window.PX = {
    norm, checkAnswer, setLang, setMode, setTarget, restart,
    studyGrid, studyOne, submitChoice, submitTyping, finishTest, choices, pool,
    getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
