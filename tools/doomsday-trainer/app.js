(() => {
  'use strict';

  const DATA = window.DOOMSDAY_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const WEEKDAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WEEKDAYS_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const WEEKDAYS_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_NAMES_ES = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const MONTH_NAMES_EN = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function computeDoomsday(year, month, day) {
    const Y = Number(year);
    const M = Number(month);
    const D = Number(day);
    const isLeap = (Y % 4 === 0 && Y % 100 !== 0) || (Y % 400 === 0);
    const centuryAnchor = [2, 0, 5, 3][Math.floor(Y / 100) % 4];
    const y = Y % 100;
    const a = Math.floor(y / 12);
    const b = y % 12;
    const c = Math.floor(b / 4);
    const yearOffset = (a + b + c) % 7;
    const yearDoomsday = (centuryAnchor + yearOffset) % 7;
    const monthAnchors = [0, isLeap ? 4 : 3, isLeap ? 29 : 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12];
    const monthAnchor = monthAnchors[M] || 14;
    const dayDiff = D - monthAnchor;
    const weekdayIndex = (((yearDoomsday + dayDiff) % 7) + 7) % 7;
    return {
      year: Y,
      month: M,
      day: D,
      isLeap,
      centuryAnchor,
      y,
      a,
      b,
      c,
      yearOffset,
      yearDoomsday,
      monthAnchor,
      dayDiff,
      weekdayIndex,
      weekdayEs: WEEKDAYS_ES[weekdayIndex],
      weekdayEn: WEEKDAYS_EN[weekdayIndex]
    };
  }

  const saved = window.SiteProgress ? window.SiteProgress.tool('doomsday-trainer') : null;
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
      .replace(/[&+\-×"'“”‘’().,:·]/g, ' ')
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

  const VAGUE_ANSWERS = {
    'dia': { es: 'Especifica el día exacto (Lunes…Domingo o fecha ancla).', en: 'Specify the exact weekday (Sunday…Saturday or anchor date).' },
    'day': { es: 'Especifica el día exacto (Lunes…Domingo o fecha ancla).', en: 'Specify the exact weekday (Sunday…Saturday or anchor date).' },
    'semana': { es: 'Indica qué día de la semana (Dom, Lun, Mar, Mié, Jue, Vie, Sáb).', en: 'Enter which weekday (Sun, Mon, Tue, Wed, Thu, Fri, Sat).' },
    'week': { es: 'Indica qué día de la semana (Sun, Mon, Tue, Wed, Thu, Fri, Sat).', en: 'Enter which weekday.' },
    'ancla': { es: 'Indica el ancla concreta (siglo 0/2/3/5 o fecha 4/4, 7/11…).', en: 'Specify the exact anchor (century 0/2/3/5 or 4/4, 7/11…).' },
    'anchor': { es: 'Specify the exact anchor (century code or month date 4/4, 7/11…).', en: 'Specify the exact anchor (century code or month date 4/4, 7/11…).' },
    'doomsday': { es: 'Escribe el resultado o día concreto.', en: 'Enter the specific result or weekday.' },
    'fecha': { es: 'Escribe la fecha o número concreto.', en: 'Enter the specific date or number.' },
    'date': { es: 'Enter the specific date or number.', en: 'Enter the specific date or number.' },
    'siglo': { es: 'Indica el código del siglo (20xx->2, 19xx->3, 18xx->5, 17xx->0).', en: 'Give the century anchor (20xx->2, 19xx->3, 18xx->5, 17xx->0).' }
  };

  function itemAliasesForTarget(m, tgt) {
    const out = [];
    if (tgt === 'answer') {
      out.push(m.answerEs, m.answerEn, m.answerShort);
      if (typeof m.weekdayIdx === 'number') {
        out.push(WEEKDAYS_ES[m.weekdayIdx], WEEKDAYS_EN[m.weekdayIdx], WEEKDAYS_SHORT_ES[m.weekdayIdx], WEEKDAYS_SHORT_EN[m.weekdayIdx], String(m.weekdayIdx));
      }
      if (Array.isArray(m.aliases)) out.push.apply(out, m.aliases);
    } else {
      out.push(m.anchorEs, m.anchorEn, m.anchorShort);
      if (Array.isArray(m.anchorAliases)) out.push.apply(out, m.anchorAliases);
    }
    return out.filter(Boolean);
  }

  function buildIndexFor(tgt) {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();

    function addRaw(m, raw, fuzzyOk) {
      const k = norm(raw);
      if (!k || VAGUE_ANSWERS[k]) return;
      if (!exact.has(k)) exact.set(k, m);
      const ck = compactAlnum(raw);
      if (ck && !VAGUE_ANSWERS[ck] && !exact.has(ck)) exact.set(ck, m);
      if (fuzzyOk && k.length >= 5) {
        const sig = m.id + '|' + k;
        if (!seen.has(sig)) {
          seen.add(sig);
          candidates.push({ m, k, ck });
        }
      }
    }

    ITEMS.forEach(m => {
      const prims = tgt === 'answer' ? [m.answerEs, m.answerEn] : [m.anchorEs, m.anchorEn];
      prims.forEach(v => addRaw(m, v, true));
      itemAliasesForTarget(m, tgt).forEach(al => addRaw(m, al, String(al).length >= 5));
    });

    return { exact, candidates };
  }

  let IDX_ANSWER = null;
  let IDX_ANCHOR = null;
  function getIndex() {
    if (!IDX_ANSWER) IDX_ANSWER = buildIndexFor('answer');
    if (!IDX_ANCHOR) IDX_ANCHOR = buildIndexFor('anchor');
    return S.target === 'anchor' ? IDX_ANCHOR : IDX_ANSWER;
  }

  const I18N = {
    es: {
      docTitle: 'Calendario Perpetuo Mental (Doomsday) — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'ALGORITMO <span>DOOMSDAY</span>',
      brandSub: 'Calcula mentalmente en 5 segundos el día de cualquier fecha (método Conway)',
      railLabel: 'Temas',
      railTitle: 'Temas',
      allCats: 'Todos los temas',
      itemsUnit: 'retos',
      searchPlaceholder: 'Buscar fecha (1969, 2089), siglo, mes (7/11) o día…',
      searchAria: 'Buscar fecha o regla Doomsday',
      clearSearch: 'Limpiar búsqueda',
      searchEmpty: 'No hay tarjetas que coincidan con tu búsqueda.',
      calcLbl: 'Simulador Conway:',
      calcRand: 'Fecha aleatoria',
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
      lblTarget: 'Preguntar por',
      tgtAnswer: 'Día / Resultado',
      tgtAnchor: 'Ancla / Regla',
      lblAnswer: 'Responder',
      ansChoose: 'Eligiendo',
      ansType: 'Escribiendo',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      soundOn: 'Sonido: Sí',
      soundOff: 'Sonido: No',
      bestNone: 'Sin marca todavía',
      bestFmt: 'Mejor: {score}/{total} ({acc}%) · {time}',
      knowFmt: 'Dominados: {n}/{total}',
      keysBtn: 'Teclas',
      howBtn: 'Cómo funciona',
      credit: 'Basado en el Algoritmo Doomsday de John H. Conway (1973) y el atajo Fong–Walters.',
      introTitle: 'Algoritmo Doomsday de John Conway',
      intro1: 'Cada año tiene un «día del juicio» (Doomsday): 4/4, 6/6, 8/8, 10/10, 12/12, 5/9, 9/5, 7/11, 11/7 y 3/14 caen TODOS exactamente el mismo día de la semana.',
      intro2: 'Calcula cualquier fecha en 4 pasos: 1) Ancla del siglo (20xx=Mar, 19xx=Mié, 18xx=Vie, 17xx=Dom); 2) Offset del año YY = ⌊YY/12⌋ + YY%12 + ⌊(YY%12)/4⌋; 3) Ancla del año mod 7; 4) Suma días desde el ancla del mes.',
      intro3: 'Usa el simulador en vivo arriba en Explorar para probar tu fecha de nacimiento, 20/07/1969 o 14/03/2089, y entrena con Aprender o Examen.',
      keysTitle: 'Atajos de teclado',
      keysItems: [
        '<kbd>1</kbd>–<kbd>4</kbd> Elegir opción en quiz',
        '<kbd>Enter</kbd> / <kbd>Espacio</kbd> / <kbd>→</kbd> Siguiente reto',
        '<kbd>H</kbd> Mostrar pista al escribir',
        '<kbd>←</kbd> <kbd>→</kbd> Navegar ficha en Explorar',
        '<kbd>P</kbd> Pasar de Explorar a Aprender',
        '<kbd>Esc</kbd> Cerrar modal, panel o vista detalle'
      ],
      studyPrompt: 'Explora los 4 pasos de Conway · Pulsa cualquier tarjeta',
      studyMetaAll: 'Todos los retos ({n})',
      studyMetaCat: '{cat} · {n} retos',
      detailEyebrow: 'EXPLORAR · FICHA DOOMSDAY {i}/{n}',
      practiceEyebrow: 'APRENDER · {cat}',
      testEyebrow: 'EXAMEN ({i}/{n}) · {cat}',
      askPromptAnswer: 'Calcula el día o resultado ({n})',
      askPromptAnchor: 'Identifica ancla / regla ({n})',
      rightEyebrow: 'CORRECTO',
      wrongEyebrow: 'ERA: {ans}',
      vagueEyebrow: 'RESPUESTA IMPRECISA',
      hintLabel: 'Pista',
      giveUpLabel: 'Ver paso a paso',
      typePlaceholderAnswer: 'Ej: Domingo, Martes, 4/4…',
      typePlaceholderAnchor: 'Ej: Código 3, 7-Eleven, 11/7…',
      submitLabel: 'Comprobar',
      nextLabel: 'Siguiente',
      finishLabel: 'Ver resultado',
      backGridLabel: '← Volver al índice',
      prevLabel: '← Anterior',
      nextCardLabel: 'Siguiente →',
      practiceBtnLabel: 'Entrenar este tema',
      practiceDoneTitle: '¡Tema completado!',
      practiceDoneMeta: 'Has dominado todos los retos de «{cat}».',
      reviewEyebrow: 'EXAMEN FINALIZADO · {cat}',
      reviewPillPerfect: 'Cálculo perfecto',
      reviewPillGood: 'Buen cálculo',
      reviewPillRetry: 'Sigue practicando',
      resScoreTitle: 'Puntuación',
      resAccTitle: 'Acierto',
      resTimeTitle: 'Tiempo',
      resRetryMissed: 'Repasar fallos ({n})',
      resNewTest: 'Nuevo examen',
      resExplore: 'Volver a explorar',
      resOkFoot: 'Aciertos: {n}',
      resBadFoot: 'Fallos: {n}',
      resHintFoot: 'Pulsa cualquier fallo para ver los 4 pasos',
      missTitle: 'Tarjetas que conviene repasar:',
      resPerfect: '¡100%! Calculas como John Conway en menos de 5 segundos.',
      yourAnswer: 'Tu respuesta: {ans}',
      factLeap: 'Bisiesto',
      factCommon: 'Año común',
      factCentury: 'Ancla siglo',
      factYearOff: 'Ancla año',
      factMonth: 'Ancla mes',
      factDiff: 'Desfase',
      factRule: 'Regla',
      calcFormat: '<b>{wd}</b> · Siglo {cName} ({cCode}) · Año {yy}: ⌊{yy}/12⌋={a}, resto {b}, ⌊{b}/4⌋={c} -> {ydName} ({yd}) · Mes {mName}: ancla {ma}, Δ={diff} d',
      help: {
        rail: ['Temas Doomsday', 'Domina primero los códigos de siglo y anclas de mes, y luego cronometra fechas históricas reales.'],
        mode: ['Modos', 'Explorar incluye simulador libre; Aprender repite fallos con cola inteligente; Examen cronometra una ronda completa.'],
        set: ['Conjunto', 'Esenciales (~25) prioriza siglos clave, meses básicos y fechas icónicas; Todos (44) añade bisiestos seculares y atajos avanzados.'],
        target: ['Objetivo', 'Día/Resultado pide el día semanal o regla final; Ancla/Regla pregunta qué ancla anual y mensual conecta esa fecha.'],
        answer: ['Respuesta', 'Eligiendo muestra 4 opciones únicas sin duplicados; Escribiendo acepta abreviaturas (dom/sun, 1/4, +1) o el día completo.']
      }
    },
    en: {
      docTitle: 'Mental Perpetual Calendar (Doomsday) — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'DOOMSDAY <span>ALGORITHM</span>',
      brandSub: 'Mentally compute the weekday of any historical or future date in 5 seconds',
      railLabel: 'Topics',
      railTitle: 'Topics',
      allCats: 'All topics',
      itemsUnit: 'drills',
      searchPlaceholder: 'Search date (1969, 2089), century, month (7/11) or day…',
      searchAria: 'Search Doomsday card or date',
      clearSearch: 'Clear search',
      searchEmpty: 'No Doomsday cards match your search.',
      calcLbl: 'Conway Simulator:',
      calcRand: 'Random date',
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
      tgtAnswer: 'Day / Result',
      tgtAnchor: 'Anchor / Rule',
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
      credit: 'Based on John H. Conway’s Doomsday Rule (1973) and the Fong–Walters shortcut.',
      introTitle: 'John Conway’s Doomsday Algorithm',
      intro1: 'Every year shares a recurring weekday called Doomsday: 4/4, 6/6, 8/8, 10/10, 12/12, 5/9, 9/5, 7/11, 11/7, and 3/14 ALL fall on that exact weekday.',
      intro2: 'Solve any date in 4 mental steps: 1) Century anchor (20xx=Tue, 19xx=Wed, 18xx=Fri, 17xx=Sun); 2) Year offset ⌊YY/12⌋ + YY%12 + ⌊(YY%12)/4⌋; 3) Add century+offset mod 7; 4) Count days from the month’s anchor.',
      intro3: 'Use the live simulator in Explore to inspect any birthday, Jul 20 1969, or Mar 14 2089, then drill in Practice or Test.',
      keysTitle: 'Keyboard shortcuts',
      keysItems: [
        '<kbd>1</kbd>–<kbd>4</kbd> Pick option in quiz',
        '<kbd>Enter</kbd> / <kbd>Space</kbd> / <kbd>→</kbd> Next card',
        '<kbd>H</kbd> Show letter hint while typing',
        '<kbd>←</kbd> <kbd>→</kbd> Step cards in Explore',
        '<kbd>P</kbd> Switch from Explore to Practice',
        '<kbd>Esc</kbd> Close modal, drawer or detail view'
      ],
      studyPrompt: 'Explore Conway’s 4-step pipeline · Click any card',
      studyMetaAll: 'All drills ({n})',
      studyMetaCat: '{cat} · {n} drills',
      detailEyebrow: 'EXPLORE · DOOMSDAY CARD {i}/{n}',
      practiceEyebrow: 'PRACTICE · {cat}',
      testEyebrow: 'TEST ({i}/{n}) · {cat}',
      askPromptAnswer: 'Compute weekday or result ({n})',
      askPromptAnchor: 'Identify anchor / rule ({n})',
      rightEyebrow: 'CORRECT',
      wrongEyebrow: 'ANSWER WAS: {ans}',
      vagueEyebrow: 'BE MORE SPECIFIC',
      hintLabel: 'Hint',
      giveUpLabel: 'Show steps',
      typePlaceholderAnswer: 'e.g. Sunday, Tuesday, 4/4…',
      typePlaceholderAnchor: 'e.g. Code 3, 7-Eleven, 11/7…',
      submitLabel: 'Check',
      nextLabel: 'Next',
      finishLabel: 'See results',
      backGridLabel: '← Back to grid',
      prevLabel: '← Prev',
      nextCardLabel: 'Next →',
      practiceBtnLabel: 'Practice this topic',
      practiceDoneTitle: 'Topic complete!',
      practiceDoneMeta: 'You mastered every card in "{cat}".',
      reviewEyebrow: 'TEST COMPLETE · {cat}',
      reviewPillPerfect: 'Grandmaster math',
      reviewPillGood: 'Strong mental speed',
      reviewPillRetry: 'Keep drilling',
      resScoreTitle: 'Score',
      resAccTitle: 'Accuracy',
      resTimeTitle: 'Time',
      resRetryMissed: 'Drill missed ({n})',
      resNewTest: 'New test',
      resExplore: 'Back to explore',
      resOkFoot: 'Correct: {n}',
      resBadFoot: 'Missed: {n}',
      resHintFoot: 'Click any missed card to inspect its 4 steps',
      missTitle: 'Cards to review:',
      resPerfect: '100%! True John Conway speed.',
      yourAnswer: 'Your answer: {ans}',
      factLeap: 'Leap year',
      factCommon: 'Common year',
      factCentury: 'Century anchor',
      factYearOff: 'Year anchor',
      factMonth: 'Month anchor',
      factDiff: 'Offset',
      factRule: 'Rule',
      calcFormat: '<b>{wd}</b> · Century {cName} ({cCode}) · Yr {yy}: ⌊{yy}/12⌋={a}, rem {b}, ⌊{b}/4⌋={c} -> {ydName} ({yd}) · {mName} anchor {ma}, Δ={diff} d',
      help: {
        rail: ['Topics', 'Start with century codes and monthly anchors before sprinting through historical dates.'],
        mode: ['Modes', 'Explore includes the live Conway simulator; Practice replays missed cards; Test times a full run.'],
        set: ['Deck', 'Core (~25) covers essential centuries, month rules, and landmark dates; All (44) adds century leap traps and shortcuts.'],
        target: ['Target', 'Day/Result asks for the final weekday or rule; Anchor/Rule tests which century/year/month anchors connect to the date.'],
        answer: ['Response', 'Choices displays 4 distinct options with zero duplicates; Typing accepts short forms (sun/dom, 1/4) or full names.']
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

  const S = {
    mode: readSaved('mode', 'study'),
    set: readSaved('set', 'popular'),
    target: readSaved('target', 'answer'),
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
    knownIds: new Set(readSaved('knownIds', []) || []),
    calcDateStr: '1969-07-20'
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
    calcBar: document.getElementById('calcBar'),
    calcLbl: document.getElementById('calcLbl'),
    calcDate: document.getElementById('calcDate'),
    randDateBtn: document.getElementById('randDateBtn'),
    calcOut: document.getElementById('calcOut'),
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
      osc.frequency.setValueAtTime(ok ? 587 : 220, now);
      if (ok) osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
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

  function itemTarget(m, tgt) {
    const mode = tgt || S.target;
    if (mode === 'anchor') return LANG === 'en' ? (m.anchorEn || m.anchorEs) : (m.anchorEs || m.anchorEn);
    return LANG === 'en' ? (m.answerEn || m.answerEs) : (m.answerEs || m.answerEn);
  }

  function itemShortTarget(m, tgt) {
    const mode = tgt || S.target;
    return mode === 'anchor' ? (m.anchorShort || itemTarget(m, mode)) : (m.answerShort || itemTarget(m, mode));
  }

  function itemPromptText(m, tgt) {
    const mode = tgt || S.target;
    if (mode === 'anchor') return LANG === 'en' ? (m.promptAnchorEn || m.promptAnswerEn) : (m.promptAnchorEs || m.promptAnswerEs);
    return LANG === 'en' ? (m.promptAnswerEn || m.nameEn) : (m.promptAnswerEs || m.nameEs);
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

  function renderCalculator() {
    const showCalc = S.mode === 'study' && !S.studyAt;
    el.calcBar.hidden = !showCalc;
    if (!showCalc) { el.calcOut.textContent = ''; return; }
    const val = (el.calcDate.value || S.calcDateStr || '1969-07-20').trim();
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
    if (!parts) return;
    const y = Number(parts[1]), m = Number(parts[2]), d = Number(parts[3]);
    if (y < 1583 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return;
    S.calcDateStr = val;
    const r = computeDoomsday(y, m, d);
    const wdList = LANG === 'en' ? WEEKDAYS_EN : WEEKDAYS_ES;
    const wdShort = LANG === 'en' ? WEEKDAYS_SHORT_EN : WEEKDAYS_SHORT_ES;
    const monList = LANG === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_ES;
    el.calcOut.innerHTML = t('calcFormat', {
      wd: wdList[r.weekdayIndex],
      cName: wdShort[r.centuryAnchor],
      cCode: r.centuryAnchor,
      yy: String(r.y).padStart(2, '0'),
      a: r.a,
      b: r.b,
      c: r.c,
      ydName: wdShort[r.yearDoomsday],
      yd: r.yearDoomsday,
      mName: monList[r.month] || r.month,
      ma: r.monthAnchor,
      diff: (r.dayDiff >= 0 ? '+' : '') + r.dayDiff
    });
  }

  function stepTextSvg(m, reveal) {
    const stepLabels = LANG === 'en'
      ? ['1. Century', '2. Year YY', '3. Year Doomsday', '4. Month & Final']
      : ['1. Siglo', '2. Año YY', '3. Ancla Anual', '4. Mes y Día'];
    if (m.date) {
      const r = computeDoomsday(m.date.y, m.date.m, m.date.d);
      const wdShort = LANG === 'en' ? WEEKDAYS_SHORT_EN : WEEKDAYS_SHORT_ES;
      const wdFull = LANG === 'en' ? WEEKDAYS_EN : WEEKDAYS_ES;
      const monName = (LANG === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_ES)[r.month];
      const v1 = reveal ? (Math.floor(r.year / 100) + 'xx -> ' + wdShort[r.centuryAnchor] + ' (' + r.centuryAnchor + ')') : (Math.floor(r.year / 100) + 'xx -> ?');
      const v2 = reveal ? ('YY=' + r.y + ' -> +' + r.yearOffset + ' (' + r.a + '+' + r.b + '+' + r.c + ')') : ('YY=' + String(r.y).padStart(2, '0') + ' -> ?');
      const v3 = reveal ? (wdShort[r.yearDoomsday] + ' (' + r.yearDoomsday + ')') : '?';
      const v4 = reveal ? (monName + ' ' + r.monthAnchor + ' (' + (r.dayDiff >= 0 ? '+' : '') + r.dayDiff + ') -> ' + wdFull[r.weekdayIndex]) : (monName + ' ' + r.day + ' -> ?');
      return [
        { k: stepLabels[0], v: v1, hi: reveal },
        { k: stepLabels[1], v: v2, hi: reveal },
        { k: stepLabels[2], v: v3, hi: reveal },
        { k: stepLabels[3], v: v4, hi: reveal }
      ];
    }
    if (reveal) {
      return [
        { k: stepLabels[0], v: LANG === 'en' ? m.step1En : m.step1Es, hi: true },
        { k: stepLabels[1], v: LANG === 'en' ? m.step2En : m.step2Es, hi: true },
        { k: stepLabels[2], v: LANG === 'en' ? m.step3En : m.step3Es, hi: true },
        { k: stepLabels[3], v: LANG === 'en' ? m.step4En : m.step4Es, hi: true }
      ];
    }
    return [
      { k: stepLabels[0], v: catLabel(m.cat), hi: false },
      { k: stepLabels[1], v: m.badge || 'CONWAY', hi: false },
      { k: stepLabels[2], v: LANG === 'en' ? 'Compute rule -> ?' : 'Calcula regla -> ?', hi: false },
      { k: stepLabels[3], v: '?', hi: false }
    ];
  }

  function renderPipelineSvg(m, reveal) {
    const steps = stepTextSvg(m, reveal);
    const boxes = steps.map((st, idx) => {
      const x = 14 + idx * 145;
      const stroke = st.hi ? '#5fd39a' : '#33475a';
      const fill = st.hi ? '#10242c' : '#0d151d';
      const valColor = st.hi ? '#ecdec2' : '#6fd0e8';
      const arrow = idx < 3
        ? '<path d="M ' + (x + 132) + ' 58 L ' + (x + 143) + ' 58 M ' + (x + 139) + ' 54 L ' + (x + 143) + ' 58 L ' + (x + 139) + ' 62" fill="none" stroke="#6fd0e8" stroke-width="1.6" stroke-linecap="round"/>'
        : '';
      const rawV = String(st.v || '');
      const line1 = rawV.length > 18 ? rawV.slice(0, 17) + '…' : rawV;
      return '<g>' +
        '<rect x="' + x + '" y="22" width="131" height="72" rx="9" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' +
        '<text x="' + (x + 65) + '" y="42" text-anchor="middle" fill="#8d9ca9" font-family="IBM Plex Mono, monospace" font-size="9.5">' + esc(st.k) + '</text>' +
        '<text x="' + (x + 65) + '" y="68" text-anchor="middle" fill="' + valColor + '" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600">' + esc(line1) + '</text>' +
      '</g>' + arrow;
    }).join('');
    return '<svg class="pipe-svg" viewBox="0 0 600 116" role="img" aria-label="Doomsday 4 steps">' +
      '<rect x="2" y="2" width="596" height="112" rx="10" fill="#080e14" stroke="#1d2b38"/>' +
      boxes +
    '</svg>';
  }

  function renderDoomPlate(m, reveal) {
    const wdShorts = LANG === 'en' ? WEEKDAYS_SHORT_EN : WEEKDAYS_SHORT_ES;
    const activeDay = (reveal && typeof m.weekdayIdx === 'number') ? m.weekdayIdx : -1;
    const strip = '<div class="week-strip">' +
      wdShorts.map((lbl, idx) => '<span class="' + (idx === activeDay ? 'is-on' : '') + '">' + esc(idx + ':' + lbl) + '</span>').join('') +
    '</div>';

    let leapBadge = '';
    if (m.date) {
      const r = computeDoomsday(m.date.y, m.date.m, m.date.d);
      leapBadge = '<span class="dbadge ' + (r.isLeap ? 'is-leap' : '') + '">' + esc(r.isLeap ? t('factLeap') : t('factCommon')) + '</span>';
    }
    const leftBadge = '<span class="dbadge">' + esc(reveal ? itemShortTarget(m, S.target) : (m.date ? String(m.date.y).padStart(4, '0') + '-' + String(m.date.m).padStart(2, '0') + '-' + String(m.date.d).padStart(2, '0') : catLabel(m.cat))) + '</span>';

    let formulaText;
    if (reveal) {
      formulaText = itemNote(m);
    } else {
      formulaText = LANG === 'en'
        ? 'Century -> YY offset -> Year Doomsday -> Month delta'
        : 'Siglo -> Offset YY -> Ancla anual -> Delta del mes';
    }

    return '<div class="doom-plate">' +
      '<div class="doom-head">' + strip + '<div class="doom-badges">' + leapBadge + leftBadge + '</div></div>' +
      '<div class="pipe-box">' + renderPipelineSvg(m, reveal) + '</div>' +
      '<div class="doom-formula"><b>CONWAY</b><span>' + esc(formulaText) + '</span></div>' +
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
    renderCalculator();

    const q = norm(S.exploreQuery);
    el.exploreClear.hidden = !S.exploreQuery;
    const filtered = !q ? items : items.filter(m => {
      const hay = [m.nameEs, m.nameEn, m.answerEs, m.answerEn, m.anchorEs, m.anchorEn, m.badge, m.noteEs, m.noteEn, catLabel(m.cat)].join(' ');
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
          card.className = 'dcard' + (S.knownIds.has(m.id) ? ' is-known' : '');
          card.setAttribute('data-id', m.id);
          card.innerHTML = '<div class="thumb">' +
            '<span class="cat-pill">' + esc(CAT_BY_ID[m.cat] ? CAT_BY_ID[m.cat].era : '') + '</span>' +
            '<span class="code-main">' + esc(m.badge || m.id) + '</span>' +
            '<span class="ans-tag">' + esc(itemShortTarget(m, 'answer')) + '</span>' +
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
    el.calcBar.hidden = true;
    el.prompt.className = 'prompt';
    el.reviewPanel.hidden = true;

    const list = pool();
    const idx = Math.max(0, list.findIndex(x => x.id === id));
    el.pEyebrow.textContent = t('detailEyebrow', { i: idx + 1, n: list.length });
    el.pName.textContent = itemName(m);
    el.pMeta.textContent = catLabel(m.cat) + ' · ' + itemTarget(m, 'answer');

    if (m.date) {
      el.calcDate.value = String(m.date.y).padStart(4, '0') + '-' + String(m.date.m).padStart(2, '0') + '-' + String(m.date.d).padStart(2, '0');
    }

    const facts = [];
    if (m.date) {
      const r = computeDoomsday(m.date.y, m.date.m, m.date.d);
      const wd = LANG === 'en' ? WEEKDAYS_EN : WEEKDAYS_ES;
      facts.push('<span><b>' + esc(t('factCentury')) + ':</b> ' + esc(wd[r.centuryAnchor] + ' (' + r.centuryAnchor + ')') + '</span>');
      facts.push('<span><b>' + esc(t('factYearOff')) + ':</b> ' + esc(wd[r.yearDoomsday] + ' (' + r.yearDoomsday + ')') + '</span>');
      facts.push('<span><b>' + esc(t('factMonth')) + ':</b> ' + esc(String(r.monthAnchor)) + '</span>');
      facts.push('<span><b>' + esc(t('factDiff')) + ':</b> ' + esc((r.dayDiff >= 0 ? '+' : '') + r.dayDiff) + '</span>');
    } else {
      facts.push('<span><b>' + esc(t('tgtAnswer')) + ':</b> ' + esc(itemTarget(m, 'answer')) + '</span>');
      facts.push('<span><b>' + esc(t('factRule')) + ':</b> ' + esc(itemTarget(m, 'anchor')) + '</span>');
    }

    el.view.innerHTML = '<div class="detail">' +
      '<div class="show">' + renderDoomPlate(m, true) + '</div>' +
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
    const correctLbl = itemTarget(q, S.target);
    usedLabels.add(norm(correctLbl));
    const chosen = [q];

    const preferredIds = Array.isArray(DATA.LOOKALIKES[q.id]) ? DATA.LOOKALIKES[q.id] : [];
    const sameCat = shuffle(ITEMS.filter(x => x.id !== q.id && x.cat === q.cat));
    const others = shuffle(ITEMS.filter(x => x.id !== q.id && x.cat !== q.cat));
    const candidates = preferredIds.map(id => BY_ID[id]).filter(Boolean).concat(sameCat, others);

    for (let i = 0; i < candidates.length && chosen.length < 4; i++) {
      const c = candidates[i];
      const lbl = itemTarget(c, S.target);
      const nl = norm(lbl);
      if (!nl || usedLabels.has(nl)) continue;
      usedLabels.add(nl);
      chosen.push(c);
    }

    // Fallback synthetic weekday options if a deck has fewer than 4 distinct answers
    if (chosen.length < 4 && S.target === 'answer') {
      const wdList = LANG === 'en' ? WEEKDAYS_EN : WEEKDAYS_ES;
      for (let d = 0; d < 7 && chosen.length < 4; d++) {
        const wd = wdList[d];
        if (usedLabels.has(norm(wd))) continue;
        usedLabels.add(norm(wd));
        chosen.push({
          id: 'syn-wd-' + d,
          answerEs: WEEKDAYS_ES[d],
          answerEn: WEEKDAYS_EN[d],
          anchorEs: WEEKDAYS_ES[d],
          anchorEn: WEEKDAYS_EN[d],
          weekdayIdx: d,
          _synthetic: true
        });
      }
    }

    return shuffle(chosen);
  }

  function checkAnswer(input, targetItem) {
    const k = norm(input);
    const ck = compactAlnum(input);
    if (!k) return { ok: false, reason: 'empty' };
    if (VAGUE_ANSWERS[k]) return { ok: false, vague: VAGUE_ANSWERS[k][LANG] || VAGUE_ANSWERS[k].es };

    // 1) Prioritize checking against the target item's own valid answers (critical when dates share the same weekday!)
    if (targetItem) {
      const targetAliases = itemAliasesForTarget(targetItem, S.target);
      for (let i = 0; i < targetAliases.length; i++) {
        const ak = norm(targetAliases[i]);
        const ack = compactAlnum(targetAliases[i]);
        if ((ak && ak === k) || (ack && ack === ck)) {
          return { ok: true, exact: true, match: targetItem };
        }
      }
      if (k.length >= 5) {
        const prim = norm(itemTarget(targetItem, S.target));
        const maxD = prim.length >= 9 ? 2 : 1;
        if (editDist(k, prim) <= maxD) {
          return { ok: true, fuzzy: true, match: targetItem };
        }
      }
    }

    const idx = getIndex();
    const direct = idx.exact.get(k) || idx.exact.get(ck);
    if (direct) {
      const isOk = targetItem ? (norm(itemTarget(direct, S.target)) === norm(itemTarget(targetItem, S.target))) : true;
      return { ok: isOk, exact: true, match: direct };
    }

    if (k.length >= 5) {
      let best = null;
      let bestD = Infinity;
      idx.candidates.forEach(cand => {
        const d = Math.min(editDist(k, cand.k), editDist(ck, cand.ck));
        const maxD = cand.k.length >= 9 ? 2 : 1;
        if (d <= maxD && d < bestD) { bestD = d; best = cand.m; }
      });
      if (best) {
        const isOk = targetItem ? (norm(itemTarget(best, S.target)) === norm(itemTarget(targetItem, S.target))) : true;
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
    el.calcBar.hidden = true;
    el.reviewPanel.hidden = true;
    el.prompt.className = 'prompt';

    el.pEyebrow.textContent = S.mode === 'test'
      ? t('testEyebrow', { i: S.doneCount + 1, n: S.totalCount, cat: catLabel(S.cat) })
      : t('practiceEyebrow', { cat: catLabel(q.cat) });

    el.pName.textContent = itemPromptText(q, S.target);
    el.pMeta.textContent = S.target === 'anchor'
      ? t('askPromptAnchor', { n: S.queue.length + 1 })
      : t('askPromptAnswer', { n: S.queue.length + 1 });

    el.view.innerHTML = '<div class="show">' + renderDoomPlate(q, false) + '</div>';

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
      inp.placeholder = S.target === 'anchor' ? t('typePlaceholderAnchor') : t('typePlaceholderAnswer');
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
    const nReveal = Math.min(ans.length, S.hintUsed * 2);
    const masked = ans.slice(0, nReveal) + ans.slice(nReveal).replace(/[^\s/·\-()]/g, '_');
    el.pMeta.innerHTML = '<span class="letters">' + esc(masked) + '</span>';
  }

  function submitChoice(opt, btn) {
    if (S.answered || !S.current) return;
    const isOk = opt.id === S.current.id || norm(itemTarget(opt, S.target)) === norm(itemTarget(S.current, S.target));
    const buttons = el.actions.querySelectorAll('button.act');
    buttons.forEach((b, i) => {
      b.disabled = true;
      const o = S.opts[i];
      if (o && (o.id === S.current.id || norm(itemTarget(o, S.target)) === norm(itemTarget(S.current, S.target)))) {
        b.classList.add('is-right');
      } else if (b === btn && !isOk) {
        b.classList.add('is-wrong');
      }
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
    el.pMeta.textContent = itemName(q) + ' · ' + itemTarget(q, 'answer') + ' · ' + itemShortTarget(q, 'anchor');

    // Reveal the full 4-step Conway solution in stage view
    el.view.innerHTML = '<div class="show">' + renderDoomPlate(q, true) + '</div>';

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
              '<span class="code-main">' + esc(m.badge || m.id) + '</span>' +
              '<span class="ans-tag">' + esc(itemShortTarget(m, S.target)) + '</span>' +
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
    if (tgt !== 'answer' && tgt !== 'anchor') return;
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
    el.calcLbl.textContent = t('calcLbl');
    el.randDateBtn.textContent = t('calcRand');
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
    if (tgtBtns[0]) tgtBtns[0].textContent = t('tgtAnswer');
    if (tgtBtns[1]) tgtBtns[1].textContent = t('tgtAnchor');
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
    const list = [{ id: 'all', es: t('allCats'), en: t('allCats'), era: S.set === 'popular' ? 'Esenciales' : 'Completos' }].concat(CATEGORIES);
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
      el.view.innerHTML = '<div class="show">' + renderDoomPlate(S.current, true) + '</div>';
    }
  }

  function pickRandomDate() {
    const samples = ['1969-07-20', '2089-03-14', '1989-11-09', '1810-05-25', '1816-07-09', '1776-07-04', '1944-06-06', '2000-02-29', '2024-02-29', '1900-03-01', '2038-01-19', '1912-04-15'];
    const y = 1750 + Math.floor(Math.random() * 350);
    const m = 1 + Math.floor(Math.random() * 12);
    const maxD = m === 2 ? (((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 29 : 28) : ([4, 6, 9, 11].includes(m) ? 30 : 31);
    const d = 1 + Math.floor(Math.random() * maxD);
    const rndStr = String(y).padStart(4, '0') + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const chosen = Math.random() < 0.35 ? samples[Math.floor(Math.random() * samples.length)] : rndStr;
    el.calcDate.value = chosen;
    renderCalculator();
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
  el.calcDate.addEventListener('input', renderCalculator);
  el.calcDate.addEventListener('change', renderCalculator);
  el.randDateBtn.addEventListener('click', pickRandomDate);
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

  window.DT = {
    computeDoomsday, norm, checkAnswer, setLang, setMode, setTarget, restart,
    studyGrid, studyOne, submitChoice, submitTyping, finishTest, choices, pool,
    getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
