(() => {
  'use strict';

  const DATA = window.EAR_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const saved = window.SiteProgress ? window.SiteProgress.tool('ear-trainer') : null;
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
      .replace(/[&/+\-×"'“”‘’().,:·♭♯°ø]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function digitsOf(s) {
    return String(s || '').replace(/\D/g, '');
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

  const VAGUE_MAP = {
    'segunda': { es: '¿2ª menor (m2) o 2ª mayor (M2)?', en: 'Minor 2nd (m2) or Major 2nd (M2)?' },
    'second': { es: '¿2ª menor (m2) o 2ª mayor (M2)?', en: 'Minor 2nd (m2) or Major 2nd (M2)?' },
    'tercera': { es: '¿3ª menor (m3) o 3ª mayor (M3)?', en: 'Minor 3rd (m3) or Major 3rd (M3)?' },
    'third': { es: '¿3ª menor (m3) o 3ª mayor (M3)?', en: 'Minor 3rd (m3) or Major 3rd (M3)?' },
    'sexta': { es: '¿6ª menor (m6) o 6ª mayor (M6)?', en: 'Minor 6th (m6) or Major 6th (M6)?' },
    'sixth': { es: '¿6ª menor (m6) o 6ª mayor (M6)?', en: 'Minor 6th (m6) or Major 6th (M6)?' },
    'septima': { es: '¿7ª menor (m7) o 7ª mayor (M7)?', en: 'Minor 7th (m7) or Major 7th (M7)?' },
    'seventh': { es: '¿7ª menor (m7) o 7ª mayor (M7)?', en: 'Minor 7th (m7) or Major 7th (M7)?' },
    'acorde': { es: 'Especifica tipo (Tríada Mayor, Menor, Disminuida, Maj7, Dom7…).', en: 'Specify quality (Major triad, Minor triad, Diminished, Maj7, Dom7…).' },
    'triada': { es: '¿Tríada Mayor, Menor, Disminuida o Aumentada?', en: 'Major, Minor, Diminished, or Augmented triad?' },
    'triad': { es: '¿Tríada Mayor, Menor, Disminuida o Aumentada?', en: 'Major, Minor, Diminished, or Augmented triad?' },
    'escala': { es: 'Indica qué escala o modo es (Mayor, Menor Natural, Armónica, Dórico…).', en: 'Specify which scale or mode (Major, Natural Minor, Harmonic, Dorian…).' },
    'scale': { es: 'Indica qué escala o modo es (Major, Natural Minor, Harmonic, Dorian…).', en: 'Specify which scale or mode (Major, Natural Minor, Harmonic, Dorian…).' },
    'do': { es: '¿Do4 Sol (C4 Treble), Do4 Fa (C4 Bass), Do5 (C5) o Do3 (C3)?', en: 'Middle C Treble (C4 Sol), C4 Bass, C5, or C3?' },
    'c': { es: 'Indica octava/clave (ej. C4 Sol, C4 Fa, C5, C3).', en: 'Specify octave/clef (e.g. C4 Treble, C4 Bass, C5, C3).' },
    'c4': { es: '¿C4 en Clave de Sol o C4 en Clave de Fa?', en: 'C4 in Treble clef or C4 in Bass clef?' },
    'do4': { es: '¿Do4 en Clave de Sol o Do4 en Clave de Fa?', en: 'Middle C in Treble clef or Bass clef?' },
    'do central': { es: '¿En Clave de Sol o Clave de Fa?', en: 'Treble clef or Bass clef?' },
    'sol': { es: '¿Sol4 (G4) o Sol2 (G2)?', en: 'G4 (Treble) or G2 (Bass)?' },
    'fa': { es: '¿Fa5 (F5) o Fa3 (F3)?', en: 'F5 (Treble) or F3 (Bass)?' },
    'la': { es: '¿La4 (A4 · 440 Hz) o La3 (A3)?', en: 'A4 (440 Hz) or A3 (Bass)?' }
  };

  const CASE_SENSITIVE_MAP = new Map();
  ITEMS.forEach(m => {
    if (m.caseToken) CASE_SENSITIVE_MAP.set(m.caseToken, m);
  });

  function makeIndex() {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();

    function addRaw(m, raw, allowFuzzy) {
      const k = norm(raw);
      if (!k || k.length < 2 || VAGUE_MAP[k]) return;
      // Avoid case-ambiguous 2-char symbols like m2/M2/m3/M3/m6/M6/m7/M7 colliding in case-insensitive map
      if (m.caseToken && k === m.caseToken.toLowerCase()) return;
      if (!exact.has(k)) exact.set(k, m);
      if (allowFuzzy && k.length >= 6) {
        const sig = m.id + '|' + k;
        if (!seen.has(sig)) {
          seen.add(sig);
          candidates.push({ item: m, key: k, digits: digitsOf(k) });
        }
      }
    }

    function addField(m, str) {
      if (!str) return;
      addRaw(m, str, true);
      const stripped = String(str).replace(/\([^)]*\)/g, ' ').trim();
      if (stripped && stripped !== str) addRaw(m, stripped, true);
    }

    ITEMS.forEach(m => {
      addField(m, m.name && m.name.es);
      addField(m, m.name && m.name.en);
      if (m.shortCode && !m.caseToken) {
        String(m.shortCode).split('/').forEach(part => addRaw(m, part, false));
      }
      (m.aka || []).forEach(a => addRaw(m, a, norm(a).length >= 6));
    });
    return { exact, candidates };
  }

  const INDEX = makeIndex();

  function checkAnswer(raw, target) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) return { status: 'empty' };

    if (CASE_SENSITIVE_MAP.has(trimmed)) {
      const matched = CASE_SENSITIVE_MAP.get(trimmed);
      return matched.id === target.id
        ? { status: 'right', item: target }
        : { status: 'wrong', matched };
    }

    const q = norm(trimmed);
    if (!q) return { status: 'empty' };
    if (VAGUE_MAP[q]) {
      return { status: 'vague', msg: VAGUE_MAP[q][LANG] || VAGUE_MAP[q].es };
    }

    const direct = INDEX.exact.get(q);
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
      const limit = c.key.length >= 11 ? 2 : (c.key.length >= 6 ? 1 : 0);
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

  const I18N = {
    es: {
      docTitle: 'Entrenador de Oído Musical e Intervalos — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'OÍDO <span>MUSICAL</span>',
      brandSub: 'Intervalos, acordes, progresiones y lectura en clave de Sol y Fa',
      railLabel: 'Categorías musicales',
      railTitle: 'Categorías',
      allCats: 'Todo el entrenamiento',
      searchPlaceholder: 'Buscar intervalo, acorde, canción guía o nota (Sol4, Do4)…',
      searchAria: 'Buscar ejercicio',
      clearSearch: 'Limpiar búsqueda',
      noMatches: 'Sin ejercicios que coincidan con tu búsqueda.',
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
      setPopular: 'Esenciales',
      setAll: 'Todos',
      lblCue: 'Guía visual',
      cueVisual: 'Con pentagrama',
      cueBlind: 'Solo oído',
      lblAnswer: 'Responder',
      ansChoose: 'Eligiendo',
      ansType: 'Escribiendo',
      restart: 'Reiniciar',
      cleanBtn: 'Vista limpia',
      soundYes: 'Sonido: Sí',
      soundNo: 'Sonido: No',
      keysBtn: 'Teclas',
      howBtn: 'Cómo funciona',
      creditLine: 'Síntesis WebAudio temperada (La4 = 440 Hz) y pentagrama SVG. Adaptado para Todologo.',
      introTitle: 'Entrena oído y lectura',
      intro1: 'Pulsa <b>Reproducir audio</b> (o tecla <kbd>R</kbd>) para escuchar intervalos melódicos, acordes simultáneos, progresiones o notas en clave de Sol y Fa.',
      intro2: 'Toca cualquier tecla del teclado interactivo para comparar afinación al instante; activa <b>Solo oído</b> para entrenar sin apoyo en partitura ni piano.',
      intro3: 'Al escribir siglas cortas recuerda respetar mayúsculas para distinguir menor/Mayor (ej. <b>m3</b> = 3ª menor, <b>M3</b> = 3ª mayor).',
      keysTitle: 'Teclas',
      eyebrowExplore: '{set} · Explorar',
      eyebrowLearn: '{set} · Aprender',
      eyebrowTest: '{set} · Examen',
      eyebrowDetail: '{cat} · Ficha {idx}/{n}',
      eyebrowSummary: 'Resultado del examen',
      promptStaff: '¿Qué nota aparece en el pentagrama?',
      promptEar: 'Escucha e identifica qué suena',
      countModels: '{n} ejercicios',
      studyThese: 'Aprender estas',
      allList: 'Todas',
      prev: '← Anterior',
      next: 'Siguiente →',
      hint: 'Pista',
      check: 'Comprobar',
      playBtn: 'Reproducir audio',
      blindTitle: 'Modo Solo oído',
      blindSub: 'Pulsa R o "Reproducir audio" para escuchar antes de responder.',
      clefTreble: 'Clave de Sol (𝄞)',
      clefBass: 'Clave de Fa (𝄢)',
      typePlaceholder: 'Ej. P5, M3, Tríada Mayor, Sol4…',
      okEyebrow: '¡Correcto!',
      badEyebrow: 'Era: {name}',
      warnEyebrow: 'Especifica tu respuesta',
      specCode: 'Símbolo',
      specFormula: 'Estructura',
      specSong: 'Canción / Guía',
      specClef: 'Clave',
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
      resClickMiss: 'Toca un fallo para escuchar su audio y ver partitura.',
      missTitle: 'Ejercicios para repasar',
      yourAnswer: 'Tu respuesta: {ans}',
      hintPrefix: 'Pista:',
      help: {
        rail: ['Bloques musicales', 'Elige entre Intervalos melódicos, Tríadas/Séptimas, Progresiones/Escalas o Lectura rápida en clave de Sol y Fa.'],
        mode: ['Modos', 'Explorar permite escuchar y tocar el piano libremente; Aprender refuerza fallos; Examen cronometra la ronda.'],
        cue: ['Guía visual', 'Con pentagrama muestra las notas en partitura y teclado (sin delatar el nombre); Solo oído oculta la notación para oído puro.']
      },
      keys: [
        ['R / Espacio', 'Reproducir audio del ejercicio'],
        ['1 – 4', 'Elegir opción de respuesta'],
        ['H', 'Mostrar pista al escribir'],
        ['Enter / →', 'Siguiente ejercicio tras responder'],
        ['P', 'Pasar de Explorar a Aprender'],
        ['Esc', 'Volver a catálogo o cerrar modal']
      ]
    },
    en: {
      docTitle: 'Musical Ear & Interval Trainer — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'EAR <span>TRAINER</span>',
      brandSub: 'Intervals, chords, progressions & Treble/Bass staff reading',
      railLabel: 'Music categories',
      railTitle: 'Categories',
      allCats: 'All training modules',
      searchPlaceholder: 'Search interval, chord, reference song or note (G4, C4)…',
      searchAria: 'Search exercise',
      clearSearch: 'Clear search',
      noMatches: 'No exercises match your search.',
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
      lblSet: 'Set',
      setPopular: 'Core',
      setAll: 'All',
      lblCue: 'Visual guide',
      cueVisual: 'With staff',
      cueBlind: 'Ear only',
      lblAnswer: 'Answer',
      ansChoose: 'Multiple choice',
      ansType: 'Typing',
      restart: 'Restart',
      cleanBtn: 'Clean view',
      soundYes: 'Sound: On',
      soundNo: 'Sound: Off',
      keysBtn: 'Keys',
      howBtn: 'How it works',
      creditLine: 'Equal-temperament WebAudio synthesizer (A4 = 440 Hz) & SVG notation. Built for Todologo.',
      introTitle: 'Train ear & sight reading',
      intro1: 'Press <b>Play Audio</b> (or <kbd>R</kbd>) to hear melodic intervals, harmonic chords, tonal progressions, or Treble/Bass staff notes.',
      intro2: 'Click any key on the interactive piano to compare pitches; turn on <b>Ear only</b> to hide staff notation until you answer.',
      intro3: 'Short interval codes are case-sensitive (<b>m3</b> = minor 3rd, <b>M3</b> = Major 3rd).',
      keysTitle: 'Shortcuts',
      eyebrowExplore: '{set} · Explore',
      eyebrowLearn: '{set} · Learn',
      eyebrowTest: '{set} · Test',
      eyebrowDetail: '{cat} · Card {idx}/{n}',
      eyebrowSummary: 'Exam summary',
      promptStaff: 'Name this note on the staff',
      promptEar: 'Listen and identify the sound',
      countModels: '{n} items',
      studyThese: 'Learn these',
      allList: 'All',
      prev: '← Previous',
      next: 'Next →',
      hint: 'Hint',
      check: 'Check',
      playBtn: 'Play Audio',
      blindTitle: 'Ear-Only Mode',
      blindSub: 'Press R or "Play Audio" to listen before answering.',
      clefTreble: 'Treble Clef (𝄞)',
      clefBass: 'Bass Clef (𝄢)',
      typePlaceholder: 'e.g. P5, M3, Major Triad, G4…',
      okEyebrow: 'Correct!',
      badEyebrow: 'Answer: {name}',
      warnEyebrow: 'Be more specific',
      specCode: 'Symbol',
      specFormula: 'Structure',
      specSong: 'Mnemonic cue',
      specClef: 'Clef',
      wikiLabel: 'Wikipedia entry',
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
      resClickMiss: 'Click a missed item to listen and check notation.',
      missTitle: 'Items to review',
      yourAnswer: 'You answered: {ans}',
      hintPrefix: 'Hint:',
      help: {
        rail: ['Music modules', 'Practice melodic intervals, triads & 7th chords, chord progressions & modes, or Treble/Bass sight reading.'],
        mode: ['Modes', 'Explore lets you inspect notation and play notes; Learn drills misses; Test times a full round.'],
        cue: ['Visual guide', 'With staff displays notes without spoiling their names; Ear only masks notation for pure auditory recognition.']
      },
      keys: [
        ['R / Space', 'Replay exercise audio'],
        ['1 – 4', 'Pick an option'],
        ['H', 'Show typing hint'],
        ['Enter / →', 'Advance after answer'],
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
    cueBox: $('cueBox'), lblCue: $('lblCue'), cueSeg: $('cueSeg'),
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
    const seen = new Set([target.id]);
    shuffle((LOOKUP_LOOKALIKES[target.id] || []).slice()).forEach(id => {
      const m = BY_ID[id];
      if (m && !seen.has(m.id) && out.length < 4) { seen.add(m.id); out.push(m); }
    });
    const sameCat = shuffle(ITEMS.filter(m => m.category === target.category && m.id !== target.id));
    for (let i = 0; i < sameCat.length && out.length < 4; i++) {
      if (!seen.has(sameCat[i].id)) { seen.add(sameCat[i].id); out.push(sameCat[i]); }
    }
    const rest = shuffle(ITEMS);
    for (let i = 0; i < rest.length && out.length < 4; i++) {
      if (!seen.has(rest[i].id)) { seen.add(rest[i].id); out.push(rest[i]); }
    }
    return shuffle(out);
  }

  const S = {
    mode: readSaved('mode', 'study'),
    set: readSaved('set', 'all'),
    category: readSaved('category', 'all'),
    cue: readSaved('cue', 'visual'),
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
  if (S.cue !== 'visual' && S.cue !== 'blind') S.cue = 'visual';
  if (S.answer !== 'choose' && S.answer !== 'type') S.answer = 'choose';

  let audioCtx = null;
  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  function scheduleNote(ctx, midi, whenSec, durSec, peakGain) {
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const gain = ctx.createGain();
    oscA.type = 'triangle';
    oscB.type = 'sine';
    const f = midiToFreq(midi);
    oscA.frequency.setValueAtTime(f, whenSec);
    oscB.frequency.setValueAtTime(f * 2, whenSec);
    gain.gain.setValueAtTime(0.0001, whenSec);
    gain.gain.linearRampToValueAtTime(peakGain, whenSec + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, whenSec + durSec);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.18, whenSec);
    oscA.connect(gain);
    oscB.connect(subGain);
    subGain.connect(gain);
    gain.connect(ctx.destination);
    oscA.start(whenSec);
    oscB.start(whenSec);
    oscA.stop(whenSec + durSec + 0.03);
    oscB.stop(whenSec + durSec + 0.03);
  }

  function playMidi(midi, dur = 0.55) {
    if (!S.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      scheduleNote(audioCtx, midi, audioCtx.currentTime, dur, 0.16);
    } catch (_) {}
  }

  function playItemAudio(m) {
    if (!S.sound || !m || !m.semitones) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime + 0.02;
      if (m.playMode === 'note') {
        scheduleNote(audioCtx, m.semitones[0], now, 0.9, 0.18);
      } else if (m.playMode === 'harmonic') {
        m.semitones.forEach((n, idx) => scheduleNote(audioCtx, n, now + idx * 0.05, 1.05, 0.1));
      } else if (m.playMode === 'sequence') {
        m.semitones.forEach((chord, cIdx) => {
          const t0 = now + cIdx * 0.52;
          chord.forEach(n => scheduleNote(audioCtx, n, t0, 0.48, 0.09));
        });
      } else {
        m.semitones.forEach((n, idx) => scheduleNote(audioCtx, n, now + idx * 0.28, 0.44, 0.14));
      }
      const btn = $('playAudioBtn');
      if (btn) {
        btn.classList.add('is-playing');
        setTimeout(() => btn.classList.remove('is-playing'), 380);
      }
    } catch (_) {}
  }

  function tone(ok) {
    if (!S.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      scheduleNote(audioCtx, ok ? 76 : 52, now, 0.16, 0.06);
      if (ok) scheduleNote(audioCtx, 83, now + 0.08, 0.16, 0.06);
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
    const scope = S.set + ':' + S.category + ':' + S.cue, b = S.best[scope];
    if (b && typeof b.pct === 'number') {
      el.best.innerHTML = esc(t('bestLabel', { scope: catLabel(S.category) })) +
        ' <b>' + b.pct + '%</b> (' + fmtTime(b.time || 0) + ')';
    } else {
      el.best.textContent = t('bestNone');
    }
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
        S.category = btn.getAttribute('data-cat');
        writeSaved('category', S.category);
        if (btn.scrollIntoView) try { btn.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } catch (_) {}
        restart();
      });
    });
  }

  function buildStaffSvg(m) {
    const isBass = m.clef === 'bass';
    const baseStep = isBass ? -10 : 2;
    let lines = '';
    for (let i = 0; i < 5; i++) {
      const y = 84 - i * 12;
      lines += '<line x1="28" y1="' + y + '" x2="512" y2="' + y + '" stroke="#33475a" stroke-width="1.5"/>';
    }
    const clefText = isBass
      ? '<text x="54" y="64" text-anchor="middle" fill="#6fd0e8" font-family="serif" font-size="48">𝄢</text>'
      : '<text x="54" y="79" text-anchor="middle" fill="#6fd0e8" font-family="serif" font-size="60">𝄞</text>';

    const cols = Array.from(new Set((m.notes || []).map(n => n.col || 0))).length || 1;
    let notesSvg = '';
    (m.notes || []).forEach(n => {
      const y = 84 - (n.step - baseStep) * 6;
      const x = cols === 1 ? 280 : (175 + (n.col || 0) * Math.min(82, 260 / Math.max(1, cols - 1)));
      if (y >= 95) {
        notesSvg += '<line x1="' + (x - 16) + '" y1="96" x2="' + (x + 16) + '" y2="96" stroke="#8d9ca9" stroke-width="1.6"/>';
      } else if (y <= 25) {
        notesSvg += '<line x1="' + (x - 16) + '" y1="24" x2="' + (x + 16) + '" y2="24" stroke="#8d9ca9" stroke-width="1.6"/>';
      }
      if (n.acc === 'sharp' || n.acc === 'flat') {
        const sym = n.acc === 'sharp' ? '♯' : '♭';
        notesSvg += '<text x="' + (x - 18) + '" y="' + (y + 5) + '" fill="#ecdec2" font-family="serif" font-size="18" font-weight="700">' + sym + '</text>';
      }
      notesSvg += '<ellipse cx="' + x + '" cy="' + y + '" rx="8.5" ry="6" transform="rotate(-14 ' + x + ' ' + y + ')" fill="#6fd0e8" stroke="#ecdec2" stroke-width="1.4"/>';
      const stemDown = n.step > (baseStep + 4);
      notesSvg += stemDown
        ? '<line x1="' + (x - 7.5) + '" y1="' + y + '" x2="' + (x - 7.5) + '" y2="' + (y + 30) + '" stroke="#ecdec2" stroke-width="1.6"/>'
        : '<line x1="' + (x + 7.5) + '" y1="' + y + '" x2="' + (x + 7.5) + '" y2="' + (y - 30) + '" stroke="#ecdec2" stroke-width="1.6"/>';
    });

    return '<svg class="staff-svg" viewBox="0 0 540 120" role="img" aria-label="Musical Staff">' +
      lines + clefText + notesSvg +
    '</svg>';
  }

  function flattenActiveMidis(m) {
    if (!m || !m.semitones) return new Set();
    const out = new Set();
    m.semitones.forEach(entry => {
      if (Array.isArray(entry)) entry.forEach(n => out.add(n));
      else out.add(entry);
    });
    return out;
  }

  function buildPianoSvg(m, quizMode) {
    // 2.5 octaves around middle C: C3 (48) to E5 (76), or C2 (36) to C5 (72) for Bass
    const startOct = m.clef === 'bass' ? 36 : 48;
    const blackOffsets = new Set([1, 3, 6, 8, 10]);
    const active = (quizMode && m.category === 'staff-notes') ? new Set() : flattenActiveMidis(m);

    const whiteKeys = [];
    const blackKeys = [];
    let wx = 0;
    const kw = 24;
    for (let midi = startOct; midi <= startOct + 28; midi++) {
      const pc = midi % 12;
      if (!blackOffsets.has(pc)) {
        whiteKeys.push({ midi, x: wx, active: active.has(midi) });
        wx += kw;
      } else {
        blackKeys.push({ midi, x: wx - 8, active: active.has(midi) });
      }
    }

    const totalW = wx;
    let svg = '<svg class="piano-svg" viewBox="0 0 ' + totalW + ' 82" role="img" aria-label="Piano Keyboard">';
    whiteKeys.forEach(k => {
      const fill = k.active ? '#6fd0e8' : '#ecdec2';
      svg += '<rect class="piano-key" data-midi="' + k.midi + '" x="' + k.x + '" y="2" width="' + (kw - 1.5) + '" height="78" rx="3" fill="' + fill + '" stroke="#0b131b" stroke-width="1.2"/>';
    });
    blackKeys.forEach(k => {
      const fill = k.active ? '#5fd39a' : '#131e28';
      svg += '<rect class="piano-key" data-midi="' + k.midi + '" x="' + k.x + '" y="2" width="15" height="48" rx="2.5" fill="' + fill + '" stroke="#090f14" stroke-width="1.2"/>';
    });
    svg += '</svg>';
    return svg;
  }

  function buildEarPlateHtml(m, quizMode) {
    const blind = quizMode && S.cue === 'blind' && m.category !== 'staff-notes';
    const clefText = m.clef === 'bass' ? t('clefBass') : t('clefTreble');
    let staffInner = '';
    if (blind) {
      staffInner = '<div class="blind-card"><b>' + esc(t('blindTitle')) + '</b><small>' + esc(t('blindSub')) + '</small></div>';
    } else {
      staffInner = buildStaffSvg(m);
    }
    return '<div class="ear-top">' +
        '<span class="clef-badge">' + esc(clefText) + '</span>' +
        '<button class="play-audio" type="button" id="playAudioBtn">▶ ' + esc(t('playBtn')) + '</button>' +
      '</div>' +
      '<div class="staff-box">' + staffInner + '</div>' +
      (blind ? '' : '<div class="piano-box">' + buildPianoSvg(m, quizMode) + '</div>');
  }

  function bindEarPlateInteractions(plate, m) {
    const playBtn = plate.querySelector('#playAudioBtn');
    if (playBtn) playBtn.addEventListener('click', () => playItemAudio(m));
    plate.querySelectorAll('.piano-key[data-midi]').forEach(keyEl => {
      keyEl.addEventListener('click', () => {
        const midi = Number(keyEl.getAttribute('data-midi'));
        if (!isNaN(midi)) playMidi(midi, 0.5);
      });
    });
  }

  function buildSpecsHtml(m) {
    const song = (m.songCue && (m.songCue[LANG] || m.songCue.es)) || '';
    const fact = (m.fact && (m.fact[LANG] || m.fact.es)) || '';
    const clefText = m.clef === 'bass' ? t('clefBass') : t('clefTreble');
    return '<div class="facts">' +
      '<span><b>' + esc(t('specCode')) + ':</b> ' + esc(m.shortCode) + '</span>' +
      '<span><b>' + esc(t('specFormula')) + ':</b> ' + esc(m.formula) + '</span>' +
      '<span><b>' + esc(t('specClef')) + ':</b> ' + esc(clefText) + '</span>' +
      (song ? '<span><b>' + esc(t('specSong')) + ':</b> ' + esc(song) + '</span>' : '') +
      '</div>' +
      (fact ? '<p class="fact-note">' + esc(fact) + '</p>' : '');
  }

  function createStagePlate(m, opts) {
    const quiz = !!(opts && opts.quiz);
    const wrap = document.createElement('div');
    wrap.className = quiz ? 'show' : 'detail';
    const show = quiz ? wrap : document.createElement('div');
    if (!quiz) { show.className = 'show'; wrap.appendChild(show); }

    const plate = document.createElement('div');
    plate.className = 'ear-plate';
    plate.innerHTML = buildEarPlateHtml(m, quiz);
    bindEarPlateInteractions(plate, m);
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
        plate.innerHTML = buildEarPlateHtml(m, false);
        bindEarPlateInteractions(plate, m);
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
        nameOf(m, 'es'), nameOf(m, 'en'), m.shortCode, m.formula,
        m.songCue && m.songCue.es, m.songCue && m.songCue.en,
        m.clef === 'bass' ? 'fa bass' : 'sol treble',
        (m.aka || []).join(' '), cat && cat.es, cat && cat.en
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
          const clefMark = m.clef === 'bass' ? '𝄢 Fa' : '𝄞 Sol';
          card.innerHTML =
            '<div class="thumb">' +
              '<span class="clef-tag">' + clefMark + '</span>' +
              '<span class="code-hero">' + esc(m.shortCode) + '</span>' +
              '<span class="mode-tag">♪</span>' +
            '</div>' +
            '<div class="lbl"><b>' + esc(nameOf(m)) + '</b></div>';
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
    el.pEyebrow.textContent = t('eyebrowDetail', { cat: catLabel(m.category), idx: (idx >= 0 ? idx : 0) + 1, n: list.length || 1 });
    el.pName.textContent = nameOf(m);
    el.pMeta.textContent = m.shortCode + ' · ' + m.formula;

    el.view.textContent = '';
    el.view.appendChild(createStagePlate(m, { quiz: false }));

    el.actions.className = 'actions row';
    el.actions.innerHTML =
      '<button class="act" type="button" id="prevCardBtn"><kbd>←</kbd><span class="txt">' + esc(t('prev')) + '</span></button>' +
      '<button class="act" type="button" id="backGridBtn"><kbd>Esc</kbd><span class="txt">' + esc(t('allList')) + '</span></button>' +
      '<button class="act primary" type="button" id="nextCardBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>→</kbd></button>';
    const prevBtn = $('prevCardBtn'), backBtn = $('backGridBtn'), nextBtn = $('nextCardBtn');
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
    el.pName.textContent = m.category === 'staff-notes' ? t('promptStaff') : t('promptEar');
    el.pMeta.innerHTML = '&nbsp;';

    const wrap = createStagePlate(m, { quiz: true });
    el.view.textContent = '';
    el.view.appendChild(wrap);
    S._activeWrap = wrap;

    if (S.answer === 'choose') {
      S.opts = choices(m);
      el.actions.className = 'actions';
      el.actions.innerHTML = S.opts.map((opt, i) =>
        '<button class="act" type="button" data-idx="' + i + '" data-id="' + esc(opt.id) + '">' +
          '<kbd>' + (i + 1) + '</kbd><span class="txt">' + esc(nameOf(opt)) + '</span>' +
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
      const inp = $('typeIn'), go = $('typeGo'), hb = $('hintBtn');
      if (go) go.addEventListener('click', submitTyping);
      if (hb) hb.addEventListener('click', showHint);
      if (inp) {
        inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); submitTyping(); } });
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
    const nm = nameOf(m);
    const cue = (m.songCue && (m.songCue[LANG] || m.songCue.es)) || m.formula;
    const hintStr = S.hintLevel === 1
      ? cue
      : (nm.replace(/[A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/g, (ch, idx) => (idx % 2 === 0 ? ch : '·')) + ' (' + m.shortCode + ')');
    el.pMeta.innerHTML = esc(t('hintPrefix')) + ' <span class="letters">' + esc(hintStr) + '</span>';
  }

  function submitChoice(chosen, clickedBtn) {
    if (!S.current || S.answered || !chosen) return;
    finalizeAnswer(chosen.id === S.current.id, nameOf(chosen), clickedBtn);
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
      S.okCount++; S.streak++;
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
        if (b.getAttribute('data-id') === m.id) b.classList.add('is-right');
        else if (clickedBtn && b === clickedBtn && !right) b.classList.add('is-wrong');
      });
    }

    el.prompt.classList.remove('is-warn', 'is-ok', 'is-bad');
    el.prompt.classList.add(right ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = right ? t('okEyebrow') : t('badEyebrow', { name: nameOf(m) });
    el.pName.textContent = nameOf(m);
    el.pMeta.textContent = right
      ? (m.shortCode + ' · ' + m.formula)
      : (userAns ? t('yourAnswer', { ans: userAns }) : m.formula);

    if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
    if (S.mode === 'practice') updatePracticeQueue(m, right);

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
    const nb = $('nextBtn');
    if (nb) nb.addEventListener('click', nextQuestion);
  }

  function updatePracticeQueue(m, right) {
    const card = S.queue.find(c => c.item.id === m.id) || { item: m, step: 0 };
    S.queue = S.queue.filter(c => c.item.id !== m.id);
    if (right) {
      card.step++;
      if (card.step < 2) S.queue.splice(Math.min(S.queue.length, 4 + card.step * 2), 0, card);
      else S.queue.push(card);
    } else {
      card.step = 0;
      S.queue.splice(Math.min(S.queue.length, 2), 0, card);
    }
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
    S.startTs = Date.now();
    S.elapsedSec = 0;
    S.timerId = setInterval(() => {
      S.elapsedSec = Math.floor((Date.now() - S.startTs) / 1000);
      el.sTime.textContent = fmtTime(S.elapsedSec);
    }, 1000);
  }

  function startPractice(customItems) {
    clearTimers();
    S.mode = 'practice'; writeSaved('mode', 'practice');
    const items = customItems && customItems.length ? customItems : pool();
    S.queue = shuffle(items).map(item => ({ item, step: 0 }));
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
    startTimer(); syncControls(); nextQuestion();
  }

  function startTest() {
    clearTimers();
    S.mode = 'test'; writeSaved('mode', 'test');
    S.deck = shuffle(pool());
    S.deckIdx = -1;
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
    startTimer(); syncControls(); nextQuestion();
  }

  function finishTest() {
    clearTimers();
    S.current = null; S.answered = false;
    el.gridBar.hidden = true;
    const total = S.deck.length || 1;
    const pct = Math.round((S.okCount / total) * 100);
    const scope = S.set + ':' + S.category + ':' + S.cue;
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

    const missUnique = [], seen = new Set();
    S.misses.forEach(e => { if (!seen.has(e.item.id)) { seen.add(e.item.id); missUnique.push(e); } });

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

    const rpb = $('resReplayBtn'), rmb = $('resMissBtn'), reb = $('resExploreBtn');
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
            '<div class="thumb"><span class="code-hero">' + esc(m.shortCode) + '</span></div>' +
            '<div class="lbl"><b>' + esc(nameOf(m)) + '</b><small>' + esc(t('yourAnswer', { ans: entry.userAns })) + '</small></div>' +
          '</button>';
        }).join('') +
      '</div>';
      sum.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          S.mode = 'study'; writeSaved('mode', 'study'); syncControls(); studyOne(btn.getAttribute('data-id'));
        });
      });
    } else {
      sum.innerHTML = '<p class="note">' + esc(t('resPerfect')) + '</p>';
    }
    el.view.textContent = '';
    el.view.appendChild(sum);
    el.actions.className = 'actions row';
    el.actions.innerHTML = '';
    renderPanelMeta(); updateStats();
  }

  function setMode(m) {
    if (m !== 'study' && m !== 'practice' && m !== 'test') return;
    S.mode = m; writeSaved('mode', m); restart();
  }

  function setCue(c) {
    if (c !== 'visual' && c !== 'blind') return;
    S.cue = c; writeSaved('cue', c); syncControls();
    if (S.mode !== 'study' && S.current && !S.answered) renderQuizQuestion(S.current);
  }

  function restart() {
    clearTimers(); syncControls();
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
    if (lblLangTag) lblLangTag.textContent = t('lblLang'); else el.lblLang.textContent = t('lblLang');
    el.langSel.value = LANG;
    el.lblMode.textContent = t('lblMode');
    const mb = el.modeSeg.querySelectorAll('button');
    if (mb[0]) mb[0].textContent = t('modeStudy');
    if (mb[1]) mb[1].textContent = t('modePractice');
    if (mb[2]) mb[2].textContent = t('modeTest');
    el.lblSet.textContent = t('lblSet');
    const sb = el.setSeg.querySelectorAll('button');
    if (sb[0]) sb[0].textContent = t('setPopular');
    if (sb[1]) sb[1].textContent = t('setAll');
    el.lblCue.textContent = t('lblCue');
    const cb = el.cueSeg.querySelectorAll('button');
    if (cb[0]) cb[0].textContent = t('cueVisual');
    if (cb[1]) cb[1].textContent = t('cueBlind');
    el.lblAnswer.textContent = t('lblAnswer');
    const ab = el.answerSeg.querySelectorAll('button');
    if (ab[0]) ab[0].textContent = t('ansChoose');
    if (ab[1]) ab[1].textContent = t('ansType');
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
    el.keysList.innerHTML = t('keys').map(p => '<li><kbd>' + esc(p[0]) + '</kbd> ' + esc(p[1]) + '</li>').join('');
  }

  function syncControls() {
    applyStaticLabels();
    el.modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.mode));
    el.setSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.set));
    el.cueSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.cue));
    el.answerSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.answer));
    el.cueBox.classList.toggle('is-off', S.mode === 'study');
    el.answerBox.classList.toggle('is-off', S.mode === 'study');
    el.soundBtn.setAttribute('aria-pressed', S.sound);
    renderRail(); renderPanelMeta(); updateStats(); updateProgress();
  }

  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    LANG = next; writeSaved('lang', LANG);
    try { if (window.localStorage) window.localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    syncControls();
    if (S.mode === 'study') {
      if (S.studyAt) studyOne(S.studyAt); else studyGrid();
    } else if (S.current && !S.answered) {
      renderQuizQuestion(S.current);
    } else if (S.current && S.answered) {
      if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
      const nb = $('nextBtn');
      if (nb && nb.querySelector('.txt')) nb.querySelector('.txt').textContent = t('next');
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
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (b) setMode(b.dataset.v);
  });
  el.setSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!b) return;
    S.set = b.dataset.v; writeSaved('set', S.set); restart();
  });
  el.cueSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (b) setCue(b.dataset.v);
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

    if (ev.key === 'r' || ev.key === 'R') {
      const m = S.mode === 'study' ? (S.studyAt && BY_ID[S.studyAt]) : S.current;
      if (m) { ev.preventDefault(); playItemAudio(m); return; }
    }
    if (S.mode === 'study') {
      if (S.studyAt && ev.key === 'ArrowLeft') { ev.preventDefault(); stepStudy(-1); }
      else if (S.studyAt && ev.key === 'ArrowRight') { ev.preventDefault(); stepStudy(1); }
      else if (ev.key === 'p' || ev.key === 'P') { ev.preventDefault(); setMode('practice'); }
      return;
    }
    if (S.answered && (ev.key === 'Enter' || ev.key === 'ArrowRight' || ev.key === ' ')) {
      ev.preventDefault(); nextQuestion(); return;
    }
    if (!S.answered && ev.key === ' ' && S.current) {
      ev.preventDefault(); playItemAudio(S.current); return;
    }
    if (!S.answered && S.answer === 'choose' && ev.key >= '1' && ev.key <= '4') {
      const idx = Number(ev.key) - 1;
      const btn = el.actions.querySelector('button.act[data-idx="' + idx + '"]');
      if (S.opts[idx] && btn) submitChoice(S.opts[idx], btn);
    } else if (!S.answered && S.answer === 'type' && (ev.key === 'h' || ev.key === 'H')) {
      showHint();
    }
  });

  window.ET = {
    norm, checkAnswer, setLang, setMode, setCue, restart, playItemAudio, playMidi,
    studyGrid, studyOne, submitChoice, submitTyping, finishTest, choices, pool,
    getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
