(() => {
  'use strict';

  const DATA = window.AIRCRAFT_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const saved = window.SiteProgress ? window.SiteProgress.tool('aircraft-spotter') : null;
  function readSaved(key, fb) {
    return saved ? saved.get(key, fb) : fb;
  }
  function writeSaved(key, val) {
    if (saved) saved.set(key, val);
  }
  function detectInitialLang() {
    try {
      const shared = window.localStorage && window.localStorage.getItem('todologo.lang');
      if (shared === 'es' || shared === 'en') return shared;
    } catch (_) {}
    const loc = readSaved('lang', null);
    if (loc === 'es' || loc === 'en') return loc;
    return 'es';
  }

  let LANG = detectInitialLang();

  const VAGUE_MAP = {
    'boeing': {
      es: 'Boeing fabrica varios modelos (737, 747, 777, 787…): indica el número.',
      en: 'Boeing makes several models (737, 747, 777, 787…): specify the number.'
    },
    'airbus': {
      es: 'Airbus tiene varios modelos (A220, A320, A330, A350, A380…): indica cuál.',
      en: 'Airbus builds several jets (A220, A320, A330, A350, A380…): specify which.'
    },
    'lockheed': {
      es: 'Lockheed diseñó varios aviones (L-1011, C-130, SR-71, F-22, F-35): especifica.',
      en: 'Lockheed built multiple aircraft (L-1011, C-130, SR-71, F-22, F-35): be specific.'
    },
    'lockheed martin': {
      es: 'Especifica el modelo de Lockheed Martin (C-130, F-16, F-22, F-35…).',
      en: 'Specify which Lockheed Martin aircraft (C-130, F-16, F-22, F-35…).'
    },
    'mcdonnell douglas': {
      es: 'Especifica el modelo de McDonnell Douglas (MD-80, MD-11, F-15, F/A-18).',
      en: 'Specify the McDonnell Douglas model (MD-80, MD-11, F-15, F/A-18).'
    },
    'douglas': {
      es: 'Especifica el modelo Douglas (DC-3, MD-80, MD-11…).',
      en: 'Specify the Douglas model (DC-3, MD-80, MD-11…).'
    },
    'boeing 737': {
      es: 'Hay dos variantes en el atlas: ¿Boeing 737 NG o Boeing 737 MAX?',
      en: 'Two 737 variants appear here: Boeing 737 NG or Boeing 737 MAX?'
    },
    '737': {
      es: '¿737 NG o 737 MAX? Escribe la variante exacta.',
      en: '737 NG or 737 MAX? Enter the exact variant.'
    },
    'airbus a320': {
      es: '¿A320ceo clásico o A320neo / A321neo?',
      en: 'Classic A320ceo or A320neo / A321neo?'
    },
    'embraer': {
      es: 'Indica el modelo de Embraer (E190 / E195).',
      en: 'Include the Embraer model number (E190 / E195).'
    },
    'caza': { es: 'Indica el modelo exacto del caza.', en: 'Name the specific fighter model.' },
    'fighter': { es: 'Indica el modelo exacto del caza.', en: 'Name the specific fighter model.' },
    'avion': { es: 'Indica el modelo exacto de aeronave.', en: 'Enter the exact aircraft model.' },
    'aircraft': { es: 'Indica el modelo exacto de aeronave.', en: 'Enter the exact aircraft model.' },
    'helicoptero': { es: '¿UH-60 Black Hawk o AH-64 Apache?', en: 'UH-60 Black Hawk or AH-64 Apache?' },
    'helicopter': { es: '¿UH-60 Black Hawk o AH-64 Apache?', en: 'UH-60 Black Hawk or AH-64 Apache?' }
  };

  const I18N = {
    es: {
      docTitle: 'Aviones Comerciales y Cazas — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'AVIONES <span>DEL MUNDO</span>',
      brandSub: 'Identifica 52 aviones comerciales, cargueros y cazas',
      railLabel: 'Categorías',
      railTitle: 'Categorías',
      allCats: 'Todas las categorías',
      allCatsEra: '52 modelos',
      searchPlaceholder: 'Buscar avión, fabricante, motor o año…',
      searchAria: 'Buscar aeronave',
      clearSearch: 'Limpiar búsqueda',
      noMatches: 'Sin aeronaves que coincidan con la búsqueda.',
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
      lblSet: 'Aeronaves',
      setPopular: 'Esenciales',
      setAll: 'Todos',
      lblAnswer: 'Responder',
      ansChoose: 'Eligiendo',
      ansType: 'Escribiendo',
      restart: 'Reiniciar',
      cleanBtn: 'Vista limpia',
      soundYes: 'Sonido: Sí',
      soundNo: 'Sonido: No',
      keysBtn: 'Teclas',
      howBtn: 'Cómo funciona',
      creditLine: 'Fotografías vía Wikimedia Commons (CC / Dominio Público). Adaptado para Todologo.',
      introTitle: 'Cómo reconocer aviones',
      intro1: 'Fíjate primero en la configuración de motores (bimotor bajo el ala, cuatrimotor, cola en T) y la forma de winglets y ventanillas de cabina.',
      intro2: 'Usa <b>Explorar</b> para estudiar fichas técnicas con buscador en vivo, <b>Aprender</b> para repasar los fallos con repetición espaciada y <b>Examen</b> para ponerte a prueba sin pistas.',
      intro3: 'En escritura tolerante se permiten pequeños errores tipográficos, pero los dígitos del modelo (como 737 vs 777 o A320 vs A350) deben coincidir.',
      keysTitle: 'Teclas',
      eyebrowExplore: '{set} · Explorar',
      eyebrowLearn: '{set} · Aprender',
      eyebrowTest: '{set} · Examen',
      eyebrowDetail: '{cat} · Ficha {idx}/{n}',
      eyebrowSummary: 'Resultado del examen',
      promptLearn: '¿Qué aeronave es?',
      promptReviewDone: '¡Completado!',
      countModels: '{n} aeronaves',
      studyThese: 'Aprender estas',
      allList: 'Todas',
      prev: '← Anterior',
      next: 'Siguiente →',
      hint: 'Pista',
      check: 'Comprobar',
      typePlaceholder: 'Ej. Boeing 747, F-22, Concorde…',
      quizAlt: 'Aeronave por identificar',
      okEyebrow: '¡Correcto!',
      badEyebrow: 'Era: {name}',
      warnEyebrow: 'Sé más específico',
      specMaker: 'Fabricante',
      specYear: 'Primer vuelo',
      specEngines: 'Motores',
      specSpeed: 'Velocidad',
      specRole: 'Rol',
      specOrigin: 'Origen',
      wikiLabel: 'Ver artículo en Wikipedia',
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
      resClickMiss: 'Toca un fallo para ver su ficha.',
      missTitle: 'Aeronaves para repasar',
      yourAnswer: 'Tu respuesta: {ans}',
      hintPrefix: 'Pista:',
      help: {
        rail: ['Categorías', 'Filtra entre comerciales de pasillo único, fuselaje ancho, cazas modernos o aviones históricos y helicópteros.'],
        mode: ['Modos', 'Explorar muestra el catálogo con buscador; Aprender refuerza los errores; Examen cronometra una ronda completa.'],
        set: ['Conjunto', 'Esenciales reúne los modelos más icónicos; Todos incluye la colección completa de 52 aeronaves.'],
        answer: ['Responder', 'Elige entre 4 opciones o escribe el nombre del avión con tolerancia ortográfica.']
      },
      keys: [
        ['1 – 4', 'Elegir opción de respuesta'],
        ['H', 'Mostrar una pista al escribir'],
        ['Enter / →', 'Siguiente aeronave tras responder'],
        ['← / →', 'Navegar fichas en Explorar'],
        ['P', 'Pasar de Explorar a Aprender'],
        ['Esc', 'Volver al catálogo o cerrar modal']
      ]
    },
    en: {
      docTitle: 'Commercial Jets & Fighters — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'AIRCRAFT <span>SPOTTER</span>',
      brandSub: 'Identify 52 commercial airliners, cargo lifters & fighters',
      railLabel: 'Categories',
      railTitle: 'Categories',
      allCats: 'All categories',
      allCatsEra: '52 models',
      searchPlaceholder: 'Search aircraft, maker, engine or year…',
      searchAria: 'Search aircraft',
      clearSearch: 'Clear search',
      noMatches: 'No aircraft match your search.',
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
      lblSet: 'Aircraft',
      setPopular: 'Core',
      setAll: 'All',
      lblAnswer: 'Answer',
      ansChoose: 'Multiple choice',
      ansType: 'Typing',
      restart: 'Restart',
      cleanBtn: 'Clean view',
      soundYes: 'Sound: On',
      soundNo: 'Sound: Off',
      keysBtn: 'Keys',
      howBtn: 'How it works',
      creditLine: 'Photos via Wikimedia Commons (CC / Public Domain). Adapted for Todologo.',
      introTitle: 'How to spot aircraft',
      intro1: 'Look first at engine layout (underwing twin, quadjet, T-tail) and distinctive wingtip winglets or cockpit brow windows.',
      intro2: 'Use <b>Explore</b> to browse specs with live search, <b>Learn</b> for spaced repetition on misses, and <b>Test</b> for a timed full run.',
      intro3: 'Typing tolerates minor spelling typos, but model numbers (such as 737 vs 777 or A320 vs A350) must match.',
      keysTitle: 'Shortcuts',
      eyebrowExplore: '{set} · Explore',
      eyebrowLearn: '{set} · Learn',
      eyebrowTest: '{set} · Test',
      eyebrowDetail: '{cat} · Card {idx}/{n}',
      eyebrowSummary: 'Exam summary',
      promptLearn: 'Which aircraft is this?',
      promptReviewDone: 'Complete!',
      countModels: '{n} aircraft',
      studyThese: 'Learn these',
      allList: 'All',
      prev: '← Previous',
      next: 'Next →',
      hint: 'Hint',
      check: 'Check',
      typePlaceholder: 'e.g. Boeing 747, F-22, Concorde…',
      quizAlt: 'Aircraft to identify',
      okEyebrow: 'Correct!',
      badEyebrow: 'Answer: {name}',
      warnEyebrow: 'Be more specific',
      specMaker: 'Manufacturer',
      specYear: 'First flight',
      specEngines: 'Engines',
      specSpeed: 'Speed',
      specRole: 'Role',
      specOrigin: 'Origin',
      wikiLabel: 'Wikipedia article',
      bestLabel: 'Best score ({scope}):',
      bestNone: 'No completed test yet for this filter.',
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
      resClickMiss: 'Click a miss to inspect its card.',
      missTitle: 'Aircraft to review',
      yourAnswer: 'You answered: {ans}',
      hintPrefix: 'Hint:',
      help: {
        rail: ['Categories', 'Filter between narrowbody airliners, widebodies & cargo, stealth fighters, or historic props & helicopters.'],
        mode: ['Modes', 'Explore lets you browse specs; Learn repeats misses using spaced repetition; Test runs a timed exam.'],
        set: ['Deck size', 'Core focuses on the most iconic airframes; All unlocks all 52 aircraft.'],
        answer: ['Answer style', 'Pick from 4 multiple-choice options or type the aircraft name with typo tolerance.']
      },
      keys: [
        ['1 – 4', 'Pick a choice'],
        ['H', 'Show a typing hint'],
        ['Enter / →', 'Advance after feedback'],
        ['← / →', 'Step between cards in Explore'],
        ['P', 'Jump from Explore to Learn'],
        ['Esc', 'Back to grid or close overlay']
      ]
    }
  };

  function t(key, vars) {
    const table = I18N[LANG] || I18N.es;
    let str = table[key] != null ? table[key] : (I18N.es[key] || key);
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = String(str).replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
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
    answerBox: $('answerBox'), lblAnswer: $('lblAnswer'), answerSeg: $('answerSeg'),
    restartBtn: $('restartBtn'), cleanBtn: $('cleanBtn'), soundBtn: $('soundBtn'),
    best: $('best'), know: $('know'), keysBtn: $('keysBtn'), howBtn: $('howBtn'), creditLine: $('creditLine'),
    intro: $('intro'), introTitle: $('introTitle'), introClose: $('introClose'), intro1: $('intro1'), intro2: $('intro2'), intro3: $('intro3'),
    keysModal: $('keysModal'), keysTitle: $('keysTitle'), keysClose: $('keysClose'), keysList: $('keysList')
  };

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[&/+\-×"'“”‘’().,:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function compactAlnum(s) {
    return norm(s).replace(/\s+/g, '');
  }

  function digitsOf(s) {
    return String(s || '').replace(/\D/g, '');
  }

  function editDist(a, b) {
    const m = a.length;
    const n = b.length;
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

  function makeIndex() {
    const exact = new Map();
    const candidates = [];
    const seenPair = new Set();

    function addAlias(m, raw, strictAlias) {
      const k = norm(raw);
      if (!k || k.length < 2 || VAGUE_MAP[k]) return;
      if (!exact.has(k)) exact.set(k, m);
      const ck = compactAlnum(raw);
      if (ck && ck !== k && ck.length >= 2 && !VAGUE_MAP[ck] && !exact.has(ck)) {
        exact.set(ck, m);
      }
      if (!strictAlias) {
        const sig = m.id + '|' + k;
        if (!seenPair.has(sig)) {
          seenPair.add(sig);
          candidates.push({ item: m, key: k, digits: digitsOf(k) });
        }
      }
    }

    ITEMS.forEach(m => {
      addAlias(m, m.name, false);
      const noParen = m.name.replace(/\([^)]*\)/g, ' ').trim();
      if (noParen && noParen !== m.name) addAlias(m, noParen, false);
      (m.aka || []).forEach(a => addAlias(m, a, false));
      const noMaker = noParen.replace(new RegExp('^' + m.maker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+', 'i'), '').trim();
      if (noMaker && norm(noMaker).length >= 3 && !/^\d+$/.test(norm(noMaker))) {
        addAlias(m, noMaker, false);
      }
    });
    return { exact, candidates };
  }

  const INDEX = makeIndex();

  function checkAnswer(raw, target) {
    const q = norm(raw);
    if (!q) return { status: 'empty' };
    if (VAGUE_MAP[q]) {
      return { status: 'vague', msg: VAGUE_MAP[q][LANG] || VAGUE_MAP[q].es };
    }
    const qCompact = compactAlnum(raw);
    if (VAGUE_MAP[qCompact]) {
      return { status: 'vague', msg: VAGUE_MAP[qCompact][LANG] || VAGUE_MAP[qCompact].es };
    }

    const direct = INDEX.exact.get(q) || INDEX.exact.get(qCompact);
    if (direct) {
      return direct.id === target.id
        ? { status: 'right', item: target }
        : { status: 'wrong', matched: direct };
    }

    const qDigits = digitsOf(q);
    let bestItem = null;
    let bestDist = 99;
    let targetDist = 99;

    for (let i = 0; i < INDEX.candidates.length; i++) {
      const c = INDEX.candidates[i];
      if ((c.digits || qDigits) && c.digits !== qDigits) continue;
      const limit = c.key.length >= 9 ? 2 : (c.key.length >= 5 ? 1 : 0);
      if (!limit) continue;
      const d = editDist(q, c.key);
      if (d <= limit) {
        if (d < bestDist) {
          bestDist = d;
          bestItem = c.item;
        }
        if (c.item.id === target.id && d < targetDist) {
          targetDist = d;
        }
      }
    }

    if (targetDist < 99 && targetDist <= bestDist) {
      return { status: 'right', item: target };
    }
    if (bestItem && bestItem.id !== target.id) {
      return { status: 'wrong', matched: bestItem };
    }
    return { status: 'wrong', matched: null };
  }

  function flagUrl(iso3) {
    return iso3 ? '../flag-atlas/flags/' + iso3 + '.svg' : '';
  }

  function countryName(iso3) {
    const dict = LANG === 'en' ? DATA.COUNTRIES_EN : DATA.COUNTRIES_ES;
    return (dict && dict[iso3]) || iso3 || '';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function catLabel(id) {
    if (id === 'all') return t('allCats');
    const c = CAT_BY_ID[id];
    return c ? (c[LANG] || c.es || c.id) : id;
  }

  function setLabel(setVal) {
    return setVal === 'popular' ? t('setPopular') : t('setAll');
  }

  const LOOKUP_LOOKALIKES = Object.create(null);
  (DATA.LOOKALIKES || []).forEach(group => {
    group.forEach(id => {
      if (!LOOKUP_LOOKALIKES[id]) LOOKUP_LOOKALIKES[id] = [];
      group.forEach(other => {
        if (other !== id && LOOKUP_LOOKALIKES[id].indexOf(other) === -1) {
          LOOKUP_LOOKALIKES[id].push(other);
        }
      });
    });
  });

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
    let list = ITEMS.filter(m => {
      if (useCat !== 'all' && m.category !== useCat) return false;
      if (useSet === 'popular' && !m.pop) return false;
      return true;
    });
    if (!list.length) {
      list = ITEMS.filter(m => useCat === 'all' || m.category === useCat);
    }
    return list;
  }

  function choices(target) {
    const out = [target];
    const seen = new Set([target.id]);
    const sameCat = shuffle(ITEMS.filter(m => m.category === target.category && m.id !== target.id));
    const lookIds = shuffle((LOOKUP_LOOKALIKES[target.id] || []).slice());
    lookIds.forEach(id => {
      const m = BY_ID[id];
      if (m && !seen.has(m.id) && out.length < 4) {
        seen.add(m.id);
        out.push(m);
      }
    });
    for (let i = 0; i < sameCat.length && out.length < 4; i++) {
      if (!seen.has(sameCat[i].id)) {
        seen.add(sameCat[i].id);
        out.push(sameCat[i]);
      }
    }
    const rest = shuffle(ITEMS);
    for (let i = 0; i < rest.length && out.length < 4; i++) {
      if (!seen.has(rest[i].id)) {
        seen.add(rest[i].id);
        out.push(rest[i]);
      }
    }
    return shuffle(out);
  }

  const S = {
    mode: readSaved('mode', 'study'),
    set: readSaved('set', 'all'),
    category: readSaved('category', 'all'),
    answer: readSaved('answer', 'choose'),
    sound: readSaved('sound', true),
    known: readSaved('known', {}) || {},
    best: readSaved('best', {}) || {},
    studyAt: null,
    exploreQuery: '',
    queue: [],
    step: 0,
    deck: [],
    deckIdx: 0,
    current: null,
    opts: [],
    answered: false,
    hintLevel: 0,
    okCount: 0,
    totalAnswered: 0,
    streak: 0,
    bestStreak: 0,
    misses: [],
    startTs: 0,
    elapsedSec: 0,
    timerId: null,
    autoNextId: null
  };

  if (S.mode !== 'study' && S.mode !== 'practice' && S.mode !== 'test') S.mode = 'study';
  if (S.set !== 'popular' && S.set !== 'all') S.set = 'all';
  if (S.category !== 'all' && !CAT_BY_ID[S.category]) S.category = 'all';
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
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(ok ? 540 : 210, now);
      if (ok) osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);
      else osc.frequency.exponentialRampToValueAtTime(160, now + 0.14);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (ok ? 0.18 : 0.22));
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (_) {}
  }

  function clearTimers() {
    if (S.timerId) { clearInterval(S.timerId); S.timerId = null; }
    if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; }
  }

  function fmtTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function updateStats() {
    const off = S.mode === 'study';
    el.stats.classList.toggle('is-off', off);
    el.sAcc.textContent = S.totalAnswered ? Math.round((S.okCount / S.totalAnswered) * 100) + '%' : '–';
    el.sTime.textContent = fmtTime(S.elapsedSec);
    el.sStreak.textContent = String(S.streak);
  }

  function updateProgress() {
    if (S.mode === 'test' && S.deck.length) {
      el.pBarWrap.classList.remove('is-off');
      const pct = Math.min(100, Math.round((S.deckIdx / S.deck.length) * 100));
      el.pBar.style.width = pct + '%';
    } else if (S.mode === 'practice') {
      const p = pool();
      const k = p.filter(m => S.known[m.id]).length;
      el.pBarWrap.classList.remove('is-off');
      el.pBar.style.width = (p.length ? Math.round((k / p.length) * 100) : 0) + '%';
    } else {
      el.pBarWrap.classList.add('is-off');
      el.pBar.style.width = '0%';
    }
  }

  function renderPanelMeta() {
    const scope = S.set + ':' + S.category;
    const b = S.best[scope];
    if (b && typeof b.pct === 'number') {
      el.best.innerHTML = esc(t('bestLabel', { scope: setLabel(S.set) + ' · ' + catLabel(S.category) })) +
        ' <b>' + b.pct + '%</b> (' + fmtTime(b.time || 0) + ')';
    } else {
      el.best.textContent = t('bestNone');
    }
    const curPool = pool();
    const knownCount = curPool.filter(m => S.known[m.id]).length;
    el.know.textContent = t('knowLabel', { k: knownCount, n: curPool.length });
  }

  function renderRail() {
    const allItems = pool('all', S.set);
    const allKnown = allItems.filter(m => S.known[m.id]).length;
    let html = '<button class="rg" type="button" data-cat="all" aria-pressed="' + (S.category === 'all') + '">' +
      '<span class="r-txt"><span>' + esc(t('allCats')) + '</span><span class="r-era">' + esc(allItems.length + (LANG === 'en' ? ' aircraft' : ' modelos')) + '</span></span>' +
      '<em' + (allKnown >= allItems.length && allItems.length ? ' class="done"' : '') + '>' + allKnown + '/' + allItems.length + '</em></button>';
    CATEGORIES.forEach(c => {
      const list = pool(c.id, S.set);
      const k = list.filter(m => S.known[m.id]).length;
      const active = S.category === c.id;
      html += '<button class="rg" type="button" data-cat="' + esc(c.id) + '" aria-pressed="' + active + '">' +
        '<span class="r-txt"><span>' + esc(c[LANG] || c.es) + '</span><span class="r-era">' + esc(c.era || '') + '</span></span>' +
        '<em' + (k >= list.length && list.length ? ' class="done"' : '') + '>' + k + '/' + list.length + '</em></button>';
    });
    el.railList.innerHTML = html;
    el.railList.querySelectorAll('button.rg').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        if (!cat) return;
        S.category = cat;
        writeSaved('category', S.category);
        if (btn.scrollIntoView) try { btn.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } catch (_) {}
        restart();
      });
    });
  }

  function attachPlateImg(plate, m, altText, isQuiz) {
    const img = document.createElement('img');
    img.src = m.photo;
    img.alt = altText;
    if (isQuiz) img.setAttribute('data-quiz', '1');
    img.addEventListener('load', () => img.classList.add('is-in'));
    img.addEventListener('error', () => {
      img.classList.add('is-in');
    });
    plate.appendChild(img);
    if (img.complete) img.classList.add('is-in');
    return img;
  }

  function buildSpecsHtml(m) {
    const fUrl = flagUrl(m.country);
    const cName = countryName(m.country);
    const originVal = (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') + esc(cName);
    const fact = (m.fact && (m.fact[LANG] || m.fact.es)) || '';
    const engines = (m.engines && (m.engines[LANG] || m.engines.es)) || '';
    const role = (m.role && (m.role[LANG] || m.role.es)) || '';
    return '<div class="facts">' +
      '<span><b>' + esc(t('specOrigin')) + ':</b> ' + originVal + '</span>' +
      '<span><b>' + esc(t('specMaker')) + ':</b> ' + esc(m.maker) + '</span>' +
      '<span><b>' + esc(t('specYear')) + ':</b> ' + esc(m.year) + '</span>' +
      '<span><b>' + esc(t('specEngines')) + ':</b> ' + esc(engines) + '</span>' +
      '<span><b>' + esc(t('specSpeed')) + ':</b> ' + esc(m.speed) + '</span>' +
      '<span><b>' + esc(t('specRole')) + ':</b> ' + esc(role) + '</span>' +
      '</div>' +
      (fact ? '<p class="fact-note">' + esc(fact) + '</p>' : '');
  }

  function createStagePlate(m, opts) {
    const quiz = !!(opts && opts.quiz);
    const wrap = document.createElement('div');
    wrap.className = quiz ? 'show' : 'detail';

    const show = quiz ? wrap : document.createElement('div');
    if (!quiz) {
      show.className = 'show';
      wrap.appendChild(show);
    }

    const plate = document.createElement('div');
    plate.className = 'plate';
    const alt = quiz ? t('quizAlt') : m.name;
    const img = attachPlateImg(plate, m, alt, quiz);
    show.appendChild(plate);

    function appendCredit() {
      if (!m.wiki || show.querySelector('.credit-line')) return;
      const cl = document.createElement('div');
      cl.className = 'credit-line';
      const wikiHref = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(m.wiki);
      cl.innerHTML = '<a href="' + esc(wikiHref) + '" target="_blank" rel="noopener noreferrer">' + esc(t('wikiLabel')) + ' ↗</a>';
      show.appendChild(cl);
    }

    if (!quiz) {
      appendCredit();
      const sw = document.createElement('div');
      sw.className = 'spec-wrap';
      sw.innerHTML = buildSpecsHtml(m);
      wrap.appendChild(sw);
    } else {
      wrap.reveal = function () {
        img.alt = m.name;
        img.removeAttribute('data-quiz');
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

  function clearPromptFeedback() {
    el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn', 'is-review');
    el.reviewPanel.hidden = true;
    el.reviewPanel.innerHTML = '';
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
        m.name,
        m.maker,
        m.year,
        m.speed,
        m.engines && m.engines.es,
        m.engines && m.engines.en,
        m.role && m.role.es,
        m.role && m.role.en,
        countryName(m.country),
        DATA.COUNTRIES_ES[m.country],
        DATA.COUNTRIES_EN[m.country],
        cat && cat.es,
        cat && cat.en,
        (m.aka || []).join(' ')
      ].join(' '));
      return tokens.every(tok => hay.indexOf(tok) !== -1);
    });
  }

  function studyGrid() {
    S.studyAt = null;
    clearPromptFeedback();
    el.pEyebrow.textContent = t('eyebrowExplore', { set: setLabel(S.set) });
    el.pName.textContent = catLabel(S.category);
    const full = pool();
    const filtered = filteredGridList(full);
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
          const fUrl = flagUrl(m.country);
          card.innerHTML =
            '<div class="thumb">' +
              '<img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy">' +
              '<span class="year-tag">' + esc(m.year) + '</span>' +
            '</div>' +
            '<div class="lbl">' +
              (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') +
              '<b>' + esc(m.name) + '</b>' +
            '</div>';
          card.addEventListener('click', () => studyOne(m.id));
          grid.appendChild(card);
        });
      });
    }

    el.view.textContent = '';
    el.view.appendChild(grid);
    el.actions.className = 'actions row';
    el.actions.innerHTML = '<button class="act primary" type="button" id="goLearnBtn"><kbd>P</kbd><span class="txt">' + esc(t('studyThese')) + '</span></button>';
    const gl = $('goLearnBtn');
    if (gl) gl.addEventListener('click', () => setMode('practice'));
    updateStats();
    updateProgress();
  }

  function studyOne(id) {
    const m = BY_ID[id];
    if (!m) return studyGrid();
    S.studyAt = id;
    clearPromptFeedback();
    el.gridBar.hidden = true;

    const list = filteredGridList(pool());
    const idx = list.findIndex(x => x.id === id);
    const pos = idx >= 0 ? idx : 0;
    const total = list.length || 1;
    el.pEyebrow.textContent = t('eyebrowDetail', { cat: catLabel(m.category), idx: pos + 1, n: total });
    const fUrl = flagUrl(m.country);
    el.pName.innerHTML = (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') + esc(m.name);
    el.pMeta.textContent = m.maker + ' · ' + m.year;

    el.view.textContent = '';
    el.view.appendChild(createStagePlate(m, { quiz: false }));

    el.actions.className = 'actions row';
    el.actions.innerHTML =
      '<button class="act" type="button" id="prevCardBtn"><kbd>←</kbd><span class="txt">' + esc(t('prev')) + '</span></button>' +
      '<button class="act" type="button" id="backGridBtn"><kbd>Esc</kbd><span class="txt">' + esc(t('allList')) + '</span></button>' +
      '<button class="act primary" type="button" id="nextCardBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>→</kbd></button>';

    const prevBtn = $('prevCardBtn');
    const backBtn = $('backGridBtn');
    const nextBtn = $('nextCardBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => stepStudy(-1));
    if (backBtn) backBtn.addEventListener('click', studyGrid);
    if (nextBtn) nextBtn.addEventListener('click', () => stepStudy(1));
  }

  function stepStudy(delta) {
    const list = filteredGridList(pool());
    if (!list.length) return studyGrid();
    const idx = list.findIndex(x => x.id === S.studyAt);
    const nextIdx = idx < 0 ? 0 : (idx + delta + list.length) % list.length;
    studyOne(list[nextIdx].id);
  }

  function renderQuizQuestion(m) {
    S.current = m;
    S.answered = false;
    S.hintLevel = 0;
    clearPromptFeedback();
    el.gridBar.hidden = true;

    el.pEyebrow.textContent = S.mode === 'test'
      ? t('eyebrowTest', { set: setLabel(S.set) }) + ' · ' + (S.deckIdx + 1) + '/' + S.deck.length
      : t('eyebrowLearn', { set: setLabel(S.set) }) + ' · ' + catLabel(S.category);
    el.pName.textContent = t('promptLearn');
    el.pMeta.innerHTML = '&nbsp;';

    const plateWrap = createStagePlate(m, { quiz: true });
    el.view.textContent = '';
    el.view.appendChild(plateWrap);
    S._activeWrap = plateWrap;

    if (S.answer === 'choose') {
      S.opts = choices(m);
      el.actions.className = 'actions';
      el.actions.innerHTML = S.opts.map((opt, i) =>
        '<button class="act" type="button" data-idx="' + i + '" data-id="' + esc(opt.id) + '">' +
          '<kbd>' + (i + 1) + '</kbd><span class="txt">' + esc(opt.name) + '</span>' +
        '</button>'
      ).join('');
      el.actions.querySelectorAll('button.act').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.getAttribute('data-idx'));
          submitChoice(S.opts[i], btn);
        });
      });
    } else {
      S.opts = [];
      el.actions.className = 'actions row';
      el.actions.innerHTML =
        '<div class="typebox">' +
          '<input id="typeIn" type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(t('typePlaceholder')) + '">' +
          '<button class="act primary" type="button" id="typeGo">' + esc(t('check')) + '</button>' +
          '<button class="act" type="button" id="hintBtn">' + esc(t('hint')) + '</button>' +
        '</div>';
      const inp = $('typeIn');
      const go = $('typeGo');
      const hb = $('hintBtn');
      if (go) go.addEventListener('click', submitTyping);
      if (hb) hb.addEventListener('click', showHint);
      if (inp) {
        inp.addEventListener('keydown', ev => {
          if (ev.key === 'Enter') { ev.preventDefault(); submitTyping(); }
        });
        if (inp.focus) try { inp.focus(); } catch (_) {}
      }
    }
    updateStats();
    updateProgress();
  }

  function showHint() {
    if (!S.current || S.answered) return;
    S.hintLevel++;
    const m = S.current;
    const words = m.name.split(/\s+/);
    let hintStr = '';
    if (S.hintLevel === 1) {
      hintStr = words[0].slice(0, Math.min(3, words[0].length)) + '… · ' + m.engines[LANG] + ' (' + m.year + ')';
    } else {
      const masked = m.name.replace(/[A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/g, (ch, idx) => (idx % 2 === 0 ? ch : '·'));
      hintStr = masked;
    }
    el.pMeta.innerHTML = esc(t('hintPrefix')) + ' <span class="letters">' + esc(hintStr) + '</span>';
  }

  function submitChoice(chosen, clickedBtn) {
    if (!S.current || S.answered || !chosen) return;
    const right = chosen.id === S.current.id;
    finalizeAnswer(right, chosen.name, clickedBtn);
  }

  function submitTyping() {
    if (!S.current || S.answered) return;
    const inp = $('typeIn');
    const raw = inp ? inp.value : '';
    const res = checkAnswer(raw, S.current);
    if (res.status === 'empty') {
      if (inp && inp.focus) try { inp.focus(); } catch (_) {}
      return;
    }
    if (res.status === 'vague') {
      el.prompt.classList.remove('is-ok', 'is-bad');
      el.prompt.classList.add('is-warn');
      el.pEyebrow.textContent = t('warnEyebrow');
      el.pMeta.textContent = res.msg;
      if (inp && inp.focus) try { inp.focus(); } catch (_) {}
      return;
    }
    finalizeAnswer(res.status === 'right', raw.trim(), null);
  }

  function finalizeAnswer(right, userAns, clickedBtn) {
    const m = S.current;
    S.answered = true;
    S.totalAnswered++;
    tone(right);
    flashStage(right);

    if (right) {
      S.okCount++;
      S.streak++;
      if (S.streak > S.bestStreak) S.bestStreak = S.streak;
      S.known[m.id] = true;
      writeSaved('known', S.known);
    } else {
      S.streak = 0;
      S.misses.push({ item: m, userAns: userAns || '–' });
    }

    if (S.answer === 'choose') {
      el.actions.querySelectorAll('button.act[data-id]').forEach(b => {
        b.disabled = true;
        const bid = b.getAttribute('data-id');
        if (bid === m.id) b.classList.add('is-right');
        else if (clickedBtn && b === clickedBtn && !right) b.classList.add('is-wrong');
      });
    }

    el.prompt.classList.remove('is-warn', 'is-ok', 'is-bad');
    el.prompt.classList.add(right ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = right ? t('okEyebrow') : t('badEyebrow', { name: m.name });
    const fUrl = flagUrl(m.country);
    el.pName.innerHTML = (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') + esc(m.name);
    el.pMeta.textContent = right
      ? (m.maker + ' · ' + m.year)
      : (userAns ? t('yourAnswer', { ans: userAns }) : m.maker + ' · ' + m.year);

    if (S._activeWrap && S._activeWrap.reveal) {
      S._activeWrap.reveal();
    }

    if (S.mode === 'practice') {
      updatePracticeQueue(m, right);
    }

    renderRail();
    renderPanelMeta();
    updateStats();
    updateProgress();

    if (S.mode === 'test') {
      showNextButton();
      if (S.autoNextId) clearTimeout(S.autoNextId);
      S.autoNextId = setTimeout(nextQuestion, 850);
    } else {
      showNextButton();
    }
  }

  function showNextButton() {
    const existing = $('nextBtn');
    if (existing) return;
    if (S.answer === 'type') {
      el.actions.className = 'actions row';
      el.actions.innerHTML = '<button class="act primary" type="button" id="nextBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd></button>';
    } else {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'nextBtn';
      btn.className = 'act primary';
      btn.style.gridColumn = '1 / -1';
      btn.innerHTML = '<span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd>';
      el.actions.appendChild(btn);
    }
    const nb = $('nextBtn');
    if (nb) nb.addEventListener('click', nextQuestion);
  }

  function updatePracticeQueue(m, right) {
    const card = S.queue.find(c => c.item.id === m.id) || { item: m, step: 0 };
    if (right) {
      card.step++;
      S.queue = S.queue.filter(c => c.item.id !== m.id);
      if (card.step < 2) {
        const at = Math.min(S.queue.length, 4 + card.step * 2);
        S.queue.splice(at, 0, card);
      } else {
        S.queue.push(card);
      }
    } else {
      card.step = 0;
      S.queue = S.queue.filter(c => c.item.id !== m.id);
      const at = Math.min(S.queue.length, 2);
      S.queue.splice(at, 0, card);
    }
  }

  function nextQuestion() {
    if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; }
    if (S.mode === 'test') {
      S.deckIdx++;
      if (S.deckIdx >= S.deck.length) {
        return finishTest();
      }
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
    S.startTs = Date.now();
    S.elapsedSec = 0;
    S.timerId = setInterval(() => {
      S.elapsedSec = Math.floor((Date.now() - S.startTs) / 1000);
      el.sTime.textContent = fmtTime(S.elapsedSec);
    }, 1000);
  }

  function startPractice(customItems) {
    clearTimers();
    S.mode = 'practice';
    writeSaved('mode', S.mode);
    const items = customItems && customItems.length ? customItems : pool();
    S.queue = shuffle(items).map(item => ({ item, step: 0 }));
    S.okCount = 0;
    S.totalAnswered = 0;
    S.streak = 0;
    S.bestStreak = 0;
    S.misses = [];
    startTimer();
    syncControls();
    nextQuestion();
  }

  function startTest() {
    clearTimers();
    S.mode = 'test';
    writeSaved('mode', S.mode);
    S.deck = shuffle(pool());
    S.deckIdx = -1;
    S.okCount = 0;
    S.totalAnswered = 0;
    S.streak = 0;
    S.bestStreak = 0;
    S.misses = [];
    startTimer();
    syncControls();
    nextQuestion();
  }

  function finishTest() {
    clearTimers();
    S.current = null;
    S.answered = false;
    el.gridBar.hidden = true;
    const total = S.deck.length || 1;
    const pct = Math.round((S.okCount / total) * 100);
    const scope = S.set + ':' + S.category;
    const prevBest = S.best[scope];
    if (!prevBest || pct > prevBest.pct || (pct === prevBest.pct && S.elapsedSec < prevBest.time)) {
      S.best[scope] = { pct, time: S.elapsedSec };
      writeSaved('best', S.best);
    }

    el.pBarWrap.classList.remove('is-off');
    el.pBar.style.width = '100%';
    el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn');
    el.prompt.classList.add('is-review');
    el.pEyebrow.textContent = t('eyebrowSummary');

    const missUnique = [];
    const missSeen = new Set();
    S.misses.forEach(entry => {
      if (!missSeen.has(entry.item.id)) {
        missSeen.add(entry.item.id);
        missUnique.push(entry);
      }
    });

    el.reviewPanel.hidden = false;
    el.reviewPanel.innerHTML =
      '<div class="res-main">' +
        '<div class="res-score"><b>' + S.okCount + '</b><span>/' + total + '</span></div>' +
        '<div class="res-tiles">' +
          '<div><b>' + pct + '%</b><span>' + esc(t('resAcc')) + '</span></div>' +
          '<div><b>' + fmtTime(S.elapsedSec) + '</b><span>' + esc(t('resTime')) + '</span></div>' +
          '<div><b>' + S.bestStreak + '</b><span>' + esc(t('resStreak')) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="res-actions">' +
        '<button class="btn primary" type="button" id="resReplayBtn">' + esc(t('resPlayAgain')) + '</button>' +
        (missUnique.length
          ? '<button class="btn" type="button" id="resMissBtn">' + esc(t('resStudyMisses', { n: missUnique.length })) + '</button>'
          : '<button class="btn" type="button" id="resExploreBtn">' + esc(t('resExplore')) + '</button>') +
      '</div>' +
      '<div class="res-foot">' +
        '<span class="key ok"><i></i><b>' + esc(t('resKeyOk', { n: S.okCount })) + '</b></span>' +
        '<span class="key bad"><i></i><b>' + esc(t('resKeyBad', { n: total - S.okCount })) + '</b></span>' +
        '<span class="rhint">' + esc(missUnique.length ? t('resClickMiss') : t('resPerfect')) + '</span>' +
      '</div>';

    const rpb = $('resReplayBtn');
    const rmb = $('resMissBtn');
    const reb = $('resExploreBtn');
    if (rpb) rpb.addEventListener('click', startTest);
    if (rmb) rmb.addEventListener('click', () => startPractice(missUnique.map(x => x.item)));
    if (reb) reb.addEventListener('click', () => setMode('study'));

    const sum = document.createElement('div');
    sum.className = 'summary';
    if (missUnique.length) {
      sum.innerHTML = '<p class="note">' + esc(t('missTitle')) + '</p><div class="misses">' +
        missUnique.map(entry => {
          const m = entry.item;
          return '<button type="button" data-id="' + esc(m.id) + '">' +
            '<div class="thumb"><img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '"></div>' +
            '<div class="lbl"><b>' + esc(m.name) + '</b><small>' + esc(t('yourAnswer', { ans: entry.userAns })) + '</small></div>' +
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
    S.mode = m;
    writeSaved('mode', m);
    restart();
  }

  function restart() {
    clearTimers();
    syncControls();
    if (S.mode === 'study') {
      S.current = null;
      S.elapsedSec = 0;
      studyGrid();
    } else if (S.mode === 'practice') {
      startPractice();
    } else {
      startTest();
    }
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
    el.lblAnswer.textContent = t('lblAnswer');
    const ansBtns = el.answerSeg.querySelectorAll('button');
    if (ansBtns[0]) ansBtns[0].textContent = t('ansChoose');
    if (ansBtns[1]) ansBtns[1].textContent = t('ansType');
    el.restartBtn.textContent = t('restart');
    el.cleanBtn.textContent = t('cleanBtn');
    el.soundBtn.textContent = S.sound ? t('soundYes') : t('soundNo');
    el.keysBtn.textContent = t('keysBtn');
    el.howBtn.textContent = t('howBtn');
    el.creditLine.textContent = t('creditLine');
    el.introTitle.textContent = t('introTitle');
    el.intro1.innerHTML = t('intro1');
    el.intro2.innerHTML = t('intro2');
    el.intro3.innerHTML = t('intro3');
    el.keysTitle.textContent = t('keysTitle');
    el.keysList.innerHTML = t('keys').map(pair =>
      '<li><kbd>' + esc(pair[0]) + '</kbd> ' + esc(pair[1]) + '</li>'
    ).join('');
  }

  function syncControls() {
    applyStaticLabels();
    el.modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.mode));
    el.setSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.set));
    el.answerSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.answer));
    el.answerBox.classList.toggle('is-off', S.mode === 'study');
    el.soundBtn.setAttribute('aria-pressed', S.sound);
    renderRail();
    renderPanelMeta();
    updateStats();
    updateProgress();
  }

  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    LANG = next;
    writeSaved('lang', LANG);
    try { if (window.localStorage) window.localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    syncControls();
    if (S.mode === 'study') {
      if (S.studyAt) studyOne(S.studyAt);
      else studyGrid();
    } else if (S.current && !S.answered) {
      renderQuizQuestion(S.current);
    } else if (S.current && S.answered) {
      if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
      const nb = $('nextBtn');
      if (nb) {
        const span = nb.querySelector('.txt');
        if (span) span.textContent = t('next');
      }
    }
  }

  let helpBoxEl = null;
  function closeHelpBox() {
    if (helpBoxEl && helpBoxEl.parentNode) helpBoxEl.parentNode.removeChild(helpBoxEl);
    helpBoxEl = null;
    document.querySelectorAll('.help[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  function openHelp(btn) {
    const key = btn.getAttribute('data-help');
    const info = t('help')[key];
    if (!info) return;
    if (helpBoxEl && btn.getAttribute('aria-expanded') === 'true') {
      closeHelpBox();
      return;
    }
    closeHelpBox();
    btn.setAttribute('aria-expanded', 'true');
    helpBoxEl = document.createElement('div');
    helpBoxEl.className = 'helpbox';
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
    const btn = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (btn) setMode(btn.dataset.v);
  });
  el.setSeg.addEventListener('click', ev => {
    const btn = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!btn) return;
    S.set = btn.dataset.v;
    writeSaved('set', S.set);
    restart();
  });
  el.answerSeg.addEventListener('click', ev => {
    const btn = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!btn) return;
    S.answer = btn.dataset.v;
    writeSaved('answer', S.answer);
    if (S.mode !== 'study' && S.current && !S.answered) {
      syncControls();
      renderQuizQuestion(S.current);
    } else {
      syncControls();
    }
  });
  el.restartBtn.addEventListener('click', restart);
  el.cleanBtn.addEventListener('click', () => document.body.classList.add('clean'));
  el.cleanExit.addEventListener('click', () => document.body.classList.remove('clean'));
  el.settingsBtn.addEventListener('click', () => document.body.classList.add('sheet-open'));
  el.closeSheet.addEventListener('click', () => document.body.classList.remove('sheet-open'));
  el.soundBtn.addEventListener('click', () => {
    S.sound = !S.sound;
    writeSaved('sound', S.sound);
    syncControls();
  });
  el.exploreSearch.addEventListener('input', () => {
    S.exploreQuery = el.exploreSearch.value || '';
    if (S.mode === 'study' && !S.studyAt) studyGrid();
  });
  el.exploreClear.addEventListener('click', () => {
    S.exploreQuery = '';
    el.exploreSearch.value = '';
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
    const typing = active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA');
    if (typing) return;

    if (S.mode === 'study') {
      if (S.studyAt && ev.key === 'ArrowLeft') { ev.preventDefault(); stepStudy(-1); }
      else if (S.studyAt && ev.key === 'ArrowRight') { ev.preventDefault(); stepStudy(1); }
      else if (ev.key === 'p' || ev.key === 'P') { ev.preventDefault(); setMode('practice'); }
      return;
    }

    if (S.answered && (ev.key === 'Enter' || ev.key === 'ArrowRight' || ev.key === ' ')) {
      ev.preventDefault();
      nextQuestion();
      return;
    }
    if (!S.answered && S.answer === 'choose' && ev.key >= '1' && ev.key <= '4') {
      const idx = Number(ev.key) - 1;
      const btn = el.actions.querySelector('button.act[data-idx="' + idx + '"]');
      if (S.opts[idx] && btn) submitChoice(S.opts[idx], btn);
    } else if (!S.answered && S.answer === 'type' && (ev.key === 'h' || ev.key === 'H')) {
      showHint();
    }
  });

  window.AS = {
    norm, checkAnswer, setLang, setMode, restart, studyGrid, studyOne,
    submitChoice, submitTyping, finishTest, choices, pool, getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
