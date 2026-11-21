/* Entrenador de Color (T021) — Todologo
 * Seis ejercicios progresivos: Matiz en la rueda, Saturación y Luminosidad, Igualar muestra con deslizadores HSL,
 * Lectura de HEX/RGB, Armonías cromáticas y Contraste WCAG.
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const saved = window.SiteProgress
    ? SiteProgress.tool('color-trainer')
    : { get: (k, d) => d, set: () => {} };

  var LANG = 'es';
  (function initLang() {
    let pick = null;
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'es' || q === 'en') pick = q;
    } catch (e) {}
    try {
      if (!pick) {
        const g = localStorage.getItem('todologo.lang');
        if (g === 'es' || g === 'en') pick = g;
      }
    } catch (e) {}
    if (!pick) {
      const s = saved.get('lang', null);
      if (s === 'es' || s === 'en') pick = s;
    }
    LANG = pick || 'es';
    try { localStorage.setItem('todologo.lang', LANG); } catch (e) {}
  })();

  const UI = {
    es: {
      docTitle: 'Entrenador de Color — Todologo',
      brandMark: 'ENTRENADOR <span>DE COLOR</span><sup>T021</sup>',
      brandSub: 'Percepción cromática: HSL, HEX, armonías y contraste',
      railTitle: 'Ejercicios, en orden',
      railPath: 'Avanza en orden. Una marca ✓ significa 90% o más en el Examen.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        study: 'Explora la rueda cromática, los deslizadores HSL y las reglas visuales antes de practicar.',
        practice: 'Entrena tu percepción cromática sin límite de tiempo y revisa el análisis tras cada respuesta.',
        test: '10 retos cromáticos contrarreloj. Consigue 90% o más para marcar el ejercicio como dominado.'
      },
      diffHeading: 'Tolerancia / Nivel',
      diffs: { normal: 'Normal', hard: 'Preciso' },
      statAcc: 'Precisión',
      statTime: 'Tiempo',
      statStreak: 'Racha',
      restart: 'Reiniciar',
      cleanView: 'Vista limpia',
      cleanExit: 'Salir de vista limpia',
      settings: 'Ajustes',
      howItWorks: 'Cómo funciona',
      closeSheet: 'Listo',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> para elegir muestra · <kbd>Enter</kbd> comprobar · <kbd>Espacio</kbd> siguiente',
      credit: 'Todo color en pantalla se descompone en tres preguntas simples: ¿qué familia de matiz es (0°–360°)?, ¿qué tan puro o grisáceo es (Saturación)?, ¿y qué tan claro u oscuro es (Luminosidad)? Parte de Todologo.',
      goPractice: 'Practicar este ejercicio →',
      nextBtn: 'Siguiente',
      checkMatch: 'Comprobar mezcla',
      tryAgain: 'Intentar de nuevo',
      testDone: 'Examen completado',
      passedMsg: '¡Dominado! Lograste al menos 90% de precisión.',
      retryMsg: 'Necesitas 90% (9/10) para marcar este ejercicio. ¡Inténtalo otra vez!',
      bestNone: 'Sin marca de examen todavía en este ejercicio.',
      bestFmt: (pct, s) => `Mejor examen: <b>${pct}%</b> en ${s}s`,
      correctExcl: '¡Correcto!',
      wrongExcl: (ans) => `Respuesta: ${ans}`,
      targetLabel: 'Color objetivo',
      yoursLabel: 'Tu mezcla',
      hueLabel: 'Matiz (H)',
      satLabel: 'Saturación (S)',
      litLabel: 'Luminosidad (L)',
      sampleLabel: 'Muestra',
      baseColorLabel: 'Color base'
    },
    en: {
      docTitle: 'Color Trainer — Todologo',
      brandMark: 'COLOR <span>TRAINER</span><sup>T021</sup>',
      brandSub: 'Chromatic perception: HSL, HEX, harmonies and contrast',
      railTitle: 'Drills, in order',
      railPath: 'Work down the list in order. A ✓ means 90% or higher on the Test.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        study: 'Explore the color wheel, HSL sliders and visual rules before practicing.',
        practice: 'Train your chromatic eye at your own pace with instant visual feedback.',
        test: '10 timed color challenges. Score 90% or higher to earn a checkmark.'
      },
      diffHeading: 'Tolerance / Level',
      diffs: { normal: 'Normal', hard: 'Strict' },
      statAcc: 'Accuracy',
      statTime: 'Time',
      statStreak: 'Streak',
      restart: 'Restart',
      cleanView: 'Clean view',
      cleanExit: 'Exit clean view',
      settings: 'Settings',
      howItWorks: 'How it works',
      closeSheet: 'Done',
      keysHint: '<kbd>1</kbd>–<kbd>4</kbd> to pick option · <kbd>Enter</kbd> submit · <kbd>Space</kbd> next',
      credit: 'Every screen color breaks down into three simple questions: what Hue family is it (0°–360°), how pure or muted is it (Saturation), and how light or dark is it (Lightness). Part of Todologo.',
      goPractice: 'Practice this drill →',
      nextBtn: 'Next',
      checkMatch: 'Check mix',
      tryAgain: 'Run again',
      testDone: 'Test complete',
      passedMsg: 'Mastered! You scored 90% or higher.',
      retryMsg: 'Score 90% (9/10) to earn a tick on this drill. Give it another run!',
      bestNone: 'No test score saved for this drill yet.',
      bestFmt: (pct, s) => `Best test: <b>${pct}%</b> in ${s}s`,
      correctExcl: 'Correct!',
      wrongExcl: (ans) => `Answer: ${ans}`,
      targetLabel: 'Target color',
      yoursLabel: 'Your mix',
      hueLabel: 'Hue (H)',
      satLabel: 'Saturation (S)',
      litLabel: 'Lightness (L)',
      sampleLabel: 'Swatch',
      baseColorLabel: 'Base color'
    }
  };

  const t = () => UI[LANG] || UI.es;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const mod360 = (h) => ((h % 360) + 360) % 360;
  const hueDist = (a, b) => {
    const d = Math.abs(mod360(a) - mod360(b));
    return Math.min(d, 360 - d);
  };

  // ---------------- Utilidades de Color (HSL <-> RGB <-> HEX & WCAG) ----------------
  function hslToRgb(h, s, l) {
    h = mod360(h) / 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function hslToHex(h, s, l) {
    const [r, g, b] = hslToRgb(h, s, l);
    return (
      '#' +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, '0').toUpperCase())
        .join('')
    );
  }

  function relLuminance([r, g, b]) {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  function contrastRatio(rgb1, rgb2) {
    const L1 = relLuminance(rgb1);
    const L2 = relLuminance(rgb2);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Los 12 sectores del círculo cromático
  const WHEEL_SECTORS = [
    { deg: 0, es: 'Rojo (0°)', en: 'Red (0°)', shortEs: 'Rojo', shortEn: 'Red' },
    { deg: 30, es: 'Naranja (30°)', en: 'Orange (30°)', shortEs: 'Naranja', shortEn: 'Orange' },
    { deg: 60, es: 'Amarillo (60°)', en: 'Yellow (60°)', shortEs: 'Amarillo', shortEn: 'Yellow' },
    { deg: 90, es: 'Lima (90°)', en: 'Chartreuse / Lime (90°)', shortEs: 'Lima', shortEn: 'Lime' },
    { deg: 120, es: 'Verde (120°)', en: 'Green (120°)', shortEs: 'Verde', shortEn: 'Green' },
    { deg: 150, es: 'Esmeralda / Menta (150°)', en: 'Spring Green (150°)', shortEs: 'Esmeralda', shortEn: 'Spring Green' },
    { deg: 180, es: 'Cian (180°)', en: 'Cyan (180°)', shortEs: 'Cian', shortEn: 'Cyan' },
    { deg: 210, es: 'Azul celeste (210°)', en: 'Azure (210°)', shortEs: 'Celeste', shortEn: 'Azure' },
    { deg: 240, es: 'Azul puro (240°)', en: 'Blue (240°)', shortEs: 'Azul', shortEn: 'Blue' },
    { deg: 270, es: 'Violeta (270°)', en: 'Violet (270°)', shortEs: 'Violeta', shortEn: 'Violet' },
    { deg: 300, es: 'Magenta (300°)', en: 'Magenta (300°)', shortEs: 'Magenta', shortEn: 'Magenta' },
    { deg: 330, es: 'Rosa / Carmesí (330°)', en: 'Rose / Crimson (330°)', shortEs: 'Rosa', shortEn: 'Rose' }
  ];

  const HARMONIES = [
    {
      id: 'comp',
      es: 'Complementaria (+180°)',
      en: 'Complementary (+180°)',
      offsets: [180],
      descEs: 'Opuestos directos en el círculo (180°). Máximo contraste cromático.',
      descEn: 'Direct opposites on the wheel (180°). Maximum chromatic contrast.'
    },
    {
      id: 'analog',
      es: 'Análoga (±30°)',
      en: 'Analogous (±30°)',
      offsets: [-30, 30],
      descEs: 'Vecinos inmediatos en la rueda (±30°). Transición suave y natural.',
      descEn: 'Immediate neighbors on the wheel (±30°). Smooth, cohesive feel.'
    },
    {
      id: 'triad',
      es: 'Triádica (+120°, +240°)',
      en: 'Triadic (+120°, +240°)',
      offsets: [120, 240],
      descEs: 'Tres colores equidistantes formando un triángulo equilátero (cada 120°).',
      descEn: 'Three equidistant colors forming an equilateral triangle (every 120°).'
    },
    {
      id: 'split',
      es: 'Complementaria dividida (+150°, +210°)',
      en: 'Split-complementary (+150°, +210°)',
      offsets: [150, 210],
      descEs: 'El color base más los dos adyacentes a su opuesto (+150° y +210°).',
      descEn: 'The base color plus the two neighbors of its opposite (+150° and +210°).'
    }
  ];

  // Generador de SVG de Rueda Cromática con marcadores opcionales
  function buildWheelSVG(activeDegs = [], clickable = false) {
    const cx = 105, cy = 105, rOut = 92, rIn = 52;
    let paths = '';
    for (let i = 0; i < 12; i++) {
      const deg = i * 30;
      const a1 = ((deg - 15 - 90) * Math.PI) / 180;
      const a2 = ((deg + 15 - 90) * Math.PI) / 180;
      const x1 = cx + rOut * Math.cos(a1), y1 = cy + rOut * Math.sin(a1);
      const x2 = cx + rOut * Math.cos(a2), y2 = cy + rOut * Math.sin(a2);
      const x3 = cx + rIn * Math.cos(a2), y3 = cy + rIn * Math.sin(a2);
      const x4 = cx + rIn * Math.cos(a1), y4 = cy + rIn * Math.sin(a1);
      const col = `hsl(${deg}, 82%, 52%)`;
      const isMarked = activeDegs.some((d) => hueDist(d, deg) <= 15);
      paths += `<path class="wheel-sector" data-deg="${deg}" d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rOut} ${rOut} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} A ${rIn} ${rIn} 0 0 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z" fill="${col}" stroke="${isMarked ? '#ffffff' : '#0a0f14'}" stroke-width="${isMarked ? '2.5' : '1.4'}"/>`;
    }

    // Líneas y nodos de armonía si hay más de un ángulo activo
    let overlay = '';
    if (activeDegs.length >= 1) {
      const pts = activeDegs.map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        const rMid = (rOut + rIn) / 2;
        return [cx + rMid * Math.cos(a), cy + rMid * Math.sin(a), deg];
      });
      if (pts.length >= 2) {
        const polyPts = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
        overlay += `<polygon points="${polyPts}" fill="rgba(255,255,255,0.12)" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>`;
      }
      pts.forEach((p, idx) => {
        overlay += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${idx === 0 ? 7 : 5.5}" fill="hsl(${p[2]},85%,52%)" stroke="#ffffff" stroke-width="2.2"/>`;
      });
    }

    return `<svg class="wheel-svg" viewBox="0 0 210 210" aria-label="Círculo cromático">${paths}<circle cx="${cx}" cy="${cy}" r="${rIn - 2}" fill="#0b1319" stroke="#223140" stroke-width="1.5"/>${overlay}</svg>`;
  }

  // ---------------- Definición de los 6 ejercicios ----------------
  const DRILLS = [
    {
      id: 'hue-wheel',
      title: { es: 'Matiz en el círculo (0°–360°)', en: 'Hue on the wheel (0°–360°)' },
      sub: {
        es: 'Aprende los 12 ángulos de matiz alrededor del círculo cromático.',
        en: 'Learn the 12 hue angles around the chromatic wheel.'
      },
      ruleHtml: {
        es: '<b>El Matiz (Hue) es un ángulo de 0° a 360°:</b> memoriza los 3 primarios aditivos cada 120° (<code>0° Rojo</code>, <code>120° Verde</code>, <code>240° Azul</code>) y los 3 secundarios en medio (<code>60° Amarillo</code>, <code>180° Cian</code>, <code>300° Magenta</code>). Haz clic en cualquier sector de la rueda para inspeccionarlo.',
        en: '<b>Hue is an angle from 0° to 360°:</b> anchor the 3 additive primaries every 120° (<code>0° Red</code>, <code>120° Green</code>, <code>240° Blue</code>) and the 3 secondaries between them (<code>60° Yellow</code>, <code>180° Cyan</code>, <code>300° Magenta</code>). Click any sector on the wheel to inspect it.'
      }
    },
    {
      id: 'sat-light',
      title: { es: 'Saturación y Luminosidad', en: 'Saturation & Lightness' },
      sub: {
        es: 'Distingue colores puros, pasteles (+blanco), oscuros (+negro) y agrisados.',
        en: 'Distinguish pure colors, tints (+white), shades (+black) and muted tones.'
      },
      ruleHtml: {
        es: 'En el modelo <code>HSL(Matiz, Saturación, Luminosidad)</code>:<br>• <b>Saturación (0%–100%):</b> <code>100%</code> es pigmento puro; <code>0%</code> es un gris neutro sin color.<br>• <b>Luminosidad (0%–100%):</b> <code>0%</code> es negro total, <code>50%</code> es el color en su máxima pureza, y <code>80%–90%</code> produce un color <b>pastel</b> claro.',
        en: 'In <code>HSL(Hue, Saturation, Lightness)</code>:<br>• <b>Saturation (0%–100%):</b> <code>100%</code> is vivid pigment; <code>0%</code> is neutral gray.<br>• <b>Lightness (0%–100%):</b> <code>0%</code> is pure black, <code>50%</code> is full vivid color, and <code>80%–90%</code> gives a light <b>pastel tint</b>.'
      }
    },
    {
      id: 'match-hsl',
      title: { es: 'Igualar el color (HSL)', en: 'Match the swatch (HSL)' },
      sub: {
        es: 'Ajusta Matiz, Saturación y Luminosidad a ojo para clavar el color objetivo.',
        en: 'Tune Hue, Saturation and Lightness by eye to match the target swatch.'
      },
      ruleHtml: {
        es: '<b>Orden mental para igualar cualquier color en 5 segundos:</b><br>1. Ajusta primero el <b>Matiz (H)</b> buscando la familia cromática.<br>2. Ajusta la <b>Luminosidad (L)</b> igualando qué tan claro u oscuro se ve.<br>3. Ajusta por último la <b>Saturación (S)</b> quitando o añadiendo intensidad.',
        en: '<b>3-step sequence to match any color in 5 seconds:</b><br>1. Dial in <b>Hue (H)</b> first to find the color family.<br>2. Match <b>Lightness (L)</b> (how bright or dark it feels).<br>3. Fine-tune <b>Saturation (S)</b> (how vivid or muted it is).'
      }
    },
    {
      id: 'hex-rgb',
      title: { es: 'Lectura de HEX y RGB', en: 'Reading HEX & RGB' },
      sub: {
        es: 'Lee un código #RRGGBB de un vistazo viendo qué canal domina.',
        en: 'Read any #RRGGBB code at a glance by spotting the dominant channels.'
      },
      ruleHtml: {
        es: 'Un código <code>#RRGGBB</code> guarda tres valores de <code>00</code> (0) a <code>FF</code> (255): <b>Rojo, Verde y Azul</b>.<br>• Si <code>R</code> y <code>G</code> son altos y <code>B</code> es bajo (ej. <code>#F4D020</code>) → <b>Amarillo/Dorado</b>.<br>• Si los tres son casi iguales (ej. <code>#64686B</code>) → <b>Gris</b>.<br>• Si los tres son altos (ej. <code>#D8F3DC</code>) → <b>Pastel muy claro</b>.',
        en: 'A <code>#RRGGBB</code> code holds three channels from <code>00</code> (0) to <code>FF</code> (255): <b>Red, Green, Blue</b>.<br>• High <code>R</code> + <code>G</code>, low <code>B</code> (e.g. <code>#F4D020</code>) → <b>Yellow/Gold</b>.<br>• All three nearly equal (e.g. <code>#64686B</code>) → <b>Gray</b>.<br>• All three high (e.g. <code>#D8F3DC</code>) → <b>Light pastel</b>.'
      }
    },
    {
      id: 'harmonies',
      title: { es: 'Armonías cromáticas', en: 'Color harmonies' },
      sub: {
        es: 'Complementarios, análogos, triádicos y complementarios divididos.',
        en: 'Complementary, analogous, triadic and split-complementary palettes.'
      },
      ruleHtml: {
        es: '<b>Las armonías son relaciones geométricas sobre el círculo de 360°:</b><br>• <b>Complementaria:</b> <code>+180°</code> (opuesto directo).<br>• <b>Análoga:</b> <code>±30°</code> (colores vecinos).<br>• <b>Triádica:</b> <code>+120° y +240°</code> (triángulo equilátero).<br>• <b>Complementaria dividida:</b> <code>+150° y +210°</code>.',
        en: '<b>Harmonies are geometric angles on the 360° wheel:</b><br>• <b>Complementary:</b> <code>+180°</code> (direct opposite).<br>• <b>Analogous:</b> <code>±30°</code> (adjacent neighbors).<br>• <b>Triadic:</b> <code>+120° and +240°</code> (equilateral triangle).<br>• <b>Split-complementary:</b> <code>+150° and +210°</code>.'
      }
    },
    {
      id: 'wcag-contrast',
      title: { es: 'Contraste y legibilidad WCAG', en: 'WCAG contrast & legibility' },
      sub: {
        es: 'Evalúa cuándo un texto es legible sobre un fondo según su luminancia.',
        en: 'Judge when text is legible over a background using relative luminance.'
      },
      ruleHtml: {
        es: '<b>El contraste depende sobre todo de la diferencia de Luminosidad (y del canal Verde, que aporta el 71% de la luminancia percibida):</b><br>• <b>WCAG AA (mínimo profesional):</b> relación <code>≥ 4.5 : 1</code> para texto normal.<br>• <b>WCAG AAA (óptimo):</b> relación <code>≥ 7.0 : 1</code>.<br>• Dos colores puros de igual luminosidad pueden vibrar pero tener contraste cercano a <code>1.2 : 1</code> (ilegible).',
        en: '<b>Contrast depends primarily on Lightness difference (and the Green channel, which carries 71% of perceived luminance):</b><br>• <b>WCAG AA (standard):</b> ratio <code>≥ 4.5 : 1</code> for body text.<br>• <b>WCAG AAA (enhanced):</b> ratio <code>≥ 7.0 : 1</code>.'
      }
    }
  ];

  const TEST_LEN = 10;

  const state = {
    drillIdx: 0,
    mode: saved.get('mode', 'study'),
    diff: saved.get('diff', 'normal'),
    bests: saved.get('bests', {}),
    right: 0,
    total: 0,
    streak: 0,
    t0: 0,
    frozen: null,
    answered: false,
    studyHue: 210,
    studyHarmony: 'triad',
    currentQ: null,
    userHSL: { h: 180, s: 50, l: 50 }
  };

  function currentDrill() {
    return DRILLS[state.drillIdx] || DRILLS[0];
  }

  function elapsed() {
    if (state.frozen != null) return state.frozen;
    if (!state.t0) return 0;
    return (Date.now() - state.t0) / 1000;
  }

  function fmtClock(s) {
    s = Math.max(0, Math.floor(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  setInterval(() => {
    if (state.t0 && state.frozen == null) {
      $('sTime').textContent = fmtClock(elapsed());
    }
  }, 400);

  function updateStats() {
    $('sAcc').textContent = state.total ? Math.round((100 * state.right) / state.total) + '%' : '–';
    $('sStreak').textContent = state.streak;
    $('sTime').textContent = fmtClock(elapsed());
  }

  function resetSession() {
    state.right = 0;
    state.total = 0;
    state.streak = 0;
    state.t0 = state.mode === 'study' ? 0 : Date.now();
    state.frozen = null;
    updateStats();
  }

  function applyStaticI18n() {
    const L = t();
    document.documentElement.lang = LANG;
    document.title = L.docTitle;
    $('brandMark').innerHTML = L.brandMark;
    $('brandSub').textContent = L.brandSub;
    $('railTitle').textContent = L.railTitle;
    $('railPath').textContent = L.railPath;
    $('langHeading').textContent = L.langHeading;
    $('langSel').value = LANG;
    $('modeHeading').textContent = L.modeHeading;
    $('diffHeading').textContent = L.diffHeading;
    $('statAccLabel').textContent = L.statAcc;
    $('statTimeLabel').textContent = L.statTime;
    $('statStreakLabel').textContent = L.statStreak;
    $('restartBtn').textContent = L.restart;
    $('cleanBtn').textContent = L.cleanView;
    $('cleanExit').textContent = L.cleanExit;
    $('settingsBtn').textContent = L.settings;
    $('howBtn').textContent = L.howItWorks;
    $('closeSheet').textContent = L.closeSheet;
    $('keysHint').innerHTML = L.keysHint;
    $('creditText').textContent = L.credit;

    document.querySelectorAll('#modeSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.modes[v];
      b.setAttribute('aria-pressed', String(v === state.mode));
    });
    $('modeHint').textContent = L.modeHints[state.mode] || '';

    document.querySelectorAll('#diffSeg button').forEach((b) => {
      const v = b.getAttribute('data-v');
      b.textContent = L.diffs[v];
      b.setAttribute('aria-pressed', String(v === state.diff));
    });

    renderRail();
    renderBest();
  }

  function renderRail() {
    const box = $('railList');
    box.innerHTML = '';
    let nextMarked = false;
    DRILLS.forEach((d, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', String(idx === state.drillIdx));
      const best = state.bests[d.id];
      const passed = best && best.pct >= 90;
      let tagClass = '';
      let tagText = '';
      if (passed) {
        tagClass = 'done';
        tagText = best.pct + '%';
      } else if (!nextMarked) {
        nextMarked = true;
        tagClass = 'next';
        tagText = LANG === 'es' ? 'sig.' : 'next';
      }
      btn.innerHTML = `<span><i>${idx + 1}</i>${d.title[LANG]}</span><em class="${tagClass}">${tagText}</em>`;
      btn.addEventListener('click', () => {
        state.drillIdx = idx;
        resetSession();
        renderAll();
      });
      box.appendChild(btn);
    });
  }

  function renderBest() {
    const d = currentDrill();
    const best = state.bests[d.id];
    $('best').innerHTML = best ? t().bestFmt(best.pct, best.time) : t().bestNone;
  }

  function setPrompt({ eyebrow, name, meta, tip, bar, status }) {
    const p = $('prompt');
    p.classList.toggle('is-ok', status === 'ok');
    p.classList.toggle('is-bad', status === 'bad');
    $('pEyebrow').textContent = eyebrow || '';
    $('pName').textContent = name || '';
    $('pMeta').textContent = meta || '\u00a0';
    $('pBarWrap').classList.toggle('is-off', bar == null);
    if (bar != null) $('pBar').style.width = Math.round(bar * 100) + '%';
    $('pTip').hidden = !tip;
    $('pTip').innerHTML = tip || '';
  }

  // ---------------- MODO ESTUDIAR ----------------
  function renderStudy() {
    const d = currentDrill();
    const L = t();
    $('felt').classList.add('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    setPrompt({
      eyebrow: `${d.title[LANG]} · ${L.modes.study}`,
      name: d.title[LANG],
      meta: d.sub[LANG],
      bar: null,
      status: null
    });

    if (d.id === 'hue-wheel') {
      const sec = WHEEL_SECTORS.find((x) => x.deg === state.studyHue) || WHEEL_SECTORS[0];
      const hex = hslToHex(sec.deg, 82, 52);
      const rows = WHEEL_SECTORS.map(
        (s) =>
          `<tr><td><i class="dot-swatch" style="background:hsl(${s.deg},82%,52%)"></i>${s.deg}°</td><td>${s[LANG]}</td><td>${hslToHex(s.deg, 82, 52)}</td></tr>`
      ).join('');
      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="rule-banner">${d.ruleHtml[LANG]}</div>
          <div class="wheel-wrap">
            ${buildWheelSVG([sec.deg], true)}
            <div class="swatch-card">
              <div class="swatch-box" style="background:hsl(${sec.deg},82%,52%)"></div>
              <div class="swatch-label">${sec[LANG]}</div>
              <div class="swatch-code">HSL(${sec.deg}°, 82%, 52%) · ${hex}</div>
            </div>
          </div>
          <table class="facts">
            <thead><tr><th>${LANG === 'es' ? 'Ángulo' : 'Angle'}</th><th>${LANG === 'es' ? 'Nombre en la rueda' : 'Wheel name'}</th><th>HEX</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
      document.querySelectorAll('.wheel-sector').forEach((el) => {
        el.addEventListener('click', () => {
          state.studyHue = Number(el.getAttribute('data-deg'));
          renderStudy();
        });
      });
    } else if (d.id === 'sat-light' || d.id === 'match-hsl') {
      const { h, s, l } = state.userHSL;
      const hex = hslToHex(h, s, l);
      const [r, g, b] = hslToRgb(h, s, l);
      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="rule-banner">${d.ruleHtml[LANG]}</div>
          <div class="swatch-row">
            <div class="swatch-card" style="max-width:340px">
              <div class="swatch-box" id="liveStudyBox" style="background:hsl(${h},${s}%,${l}%)"></div>
              <div class="swatch-label">${LANG === 'es' ? 'Color interactivo' : 'Interactive swatch'}</div>
              <div class="swatch-code" id="liveStudyCode">HSL(${h}°, ${s}%, ${l}%) · ${hex} · RGB(${r},${g},${b})</div>
            </div>
          </div>
          <div class="sliders-box">
            <div class="slider-row">
              <label>${L.hueLabel}</label>
              <input type="range" id="slH" min="0" max="360" value="${h}" style="background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)">
              <output id="outH">${h}°</output>
            </div>
            <div class="slider-row">
              <label>${L.satLabel}</label>
              <input type="range" id="slS" min="0" max="100" value="${s}" style="background:linear-gradient(to right,hsl(${h},0%,${l}%),hsl(${h},100%,${l}%))">
              <output id="outS">${s}%</output>
            </div>
            <div class="slider-row">
              <label>${L.litLabel}</label>
              <input type="range" id="slL" min="0" max="100" value="${l}" style="background:linear-gradient(to right,#000,hsl(${h},${s}%,50%),#fff)">
              <output id="outL">${l}%</output>
            </div>
          </div>
        </div>
      `;
      const updateLive = () => {
        state.userHSL.h = Number($('slH').value);
        state.userHSL.s = Number($('slS').value);
        state.userHSL.l = Number($('slL').value);
        const { h: nh, s: ns, l: nl } = state.userHSL;
        const nhex = hslToHex(nh, ns, nl);
        const [nr, ng, nb] = hslToRgb(nh, ns, nl);
        $('outH').textContent = nh + '°';
        $('outS').textContent = ns + '%';
        $('outL').textContent = nl + '%';
        $('liveStudyBox').style.background = `hsl(${nh},${ns}%,${nl}%)`;
        $('liveStudyCode').textContent = `HSL(${nh}°, ${ns}%, ${nl}%) · ${nhex} · RGB(${nr},${ng},${nb})`;
        $('slS').style.background = `linear-gradient(to right,hsl(${nh},0%,${nl}%),hsl(${nh},100%,${nl}%))`;
        $('slL').style.background = `linear-gradient(to right,#000,hsl(${nh},${ns}%,50%),#fff)`;
      };
      ['slH', 'slS', 'slL'].forEach((id) => $(id).addEventListener('input', updateLive));
    } else if (d.id === 'hex-rgb') {
      const examples = [
        ['#E63946', 'RGB(230, 57, 70)', LANG === 'es' ? 'R muy alto (E6), G y B bajos → Rojo intenso' : 'High R (E6), low G & B → Vivid Red'],
        ['#2A9D8F', 'RGB(42, 157, 143)', LANG === 'es' ? 'G y B medios-altos, R bajo → Verde azulado (Teal)' : 'Mid-high G & B, low R → Teal'],
        ['#F4A261', 'RGB(244, 162, 97)', LANG === 'es' ? 'R máximo, G medio, B bajo → Naranja cálido' : 'Max R, mid G, low B → Warm Orange'],
        ['#457B9D', 'RGB(69, 123, 157)', LANG === 'es' ? 'B domina, G medio, R bajo → Azul acero' : 'Dominant B, mid G, low R → Steel Blue'],
        ['#D8F3DC', 'RGB(216, 243, 220)', LANG === 'es' ? 'Los 3 altos (>D0) con G ligeramente mayor → Menta pastel' : 'All 3 high (>D0) with slight G lead → Pastel Mint']
      ];
      const rows = examples
        .map(
          (r) =>
            `<tr><td><i class="dot-swatch" style="background:${r[0]}"></i>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`
        )
        .join('');
      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="rule-banner">${d.ruleHtml[LANG]}</div>
          <table class="facts">
            <thead><tr><th>HEX</th><th>RGB (0–255)</th><th>${LANG === 'es' ? 'Cómo leerlo' : 'How to read it'}</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    } else if (d.id === 'harmonies') {
      const harm = HARMONIES.find((x) => x.id === state.studyHarmony) || HARMONIES[0];
      const degs = [state.studyHue, ...harm.offsets.map((o) => mod360(state.studyHue + o))];
      const swatchesHtml = degs
        .map(
          (deg, i) => `
          <div class="swatch-card" style="max-width:160px">
            <div class="swatch-box" style="height:76px;background:hsl(${deg},80%,52%)"></div>
            <div class="swatch-label">${i === 0 ? L.baseColorLabel : `+${mod360(deg - state.studyHue)}°`}</div>
            <div class="swatch-code">${deg}° · ${hslToHex(deg, 80, 52)}</div>
          </div>`
        )
        .join('');
      const tabsHtml = HARMONIES.map(
        (h) =>
          `<button type="button" class="btn ${h.id === harm.id ? 'primary' : ''}" data-harm="${h.id}">${h[LANG]}</button>`
      ).join('');
      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="rule-banner">${d.ruleHtml[LANG]}</div>
          <div class="row" style="justify-content:center">${tabsHtml}</div>
          <div class="wheel-wrap">
            ${buildWheelSVG(degs, true)}
            <div class="swatch-row" style="flex:1">${swatchesHtml}</div>
          </div>
        </div>
      `;
      document.querySelectorAll('[data-harm]').forEach((b) => {
        b.addEventListener('click', () => {
          state.studyHarmony = b.getAttribute('data-harm');
          renderStudy();
        });
      });
      document.querySelectorAll('.wheel-sector').forEach((el) => {
        el.addEventListener('click', () => {
          state.studyHue = Number(el.getAttribute('data-deg'));
          renderStudy();
        });
      });
    } else if (d.id === 'wcag-contrast') {
      const demos = [
        { bg: '#0F172A', fg: '#F8FAFC', label: LANG === 'es' ? 'Óptimo AAA' : 'Optimal AAA' },
        { bg: '#1E3A8A', fg: '#FFFFFF', label: LANG === 'es' ? 'Pasa AA y AAA' : 'Passes AA & AAA' },
        { bg: '#F59E0B', fg: '#FFFFFF', label: LANG === 'es' ? 'Falla AA (Blanco sobre ámbar)' : 'Fails AA (White on amber)' },
        { bg: '#EF4444', fg: '#3B82F6', label: LANG === 'es' ? 'Falla AA (Rojo/Azul igual luz)' : 'Fails AA (Red/Blue equal lightness)' }
      ];
      const cards = demos
        .map((c) => {
          const r1 = [parseInt(c.bg.slice(1, 3), 16), parseInt(c.bg.slice(3, 5), 16), parseInt(c.bg.slice(5, 7), 16)];
          const r2 = [parseInt(c.fg.slice(1, 3), 16), parseInt(c.fg.slice(3, 5), 16), parseInt(c.fg.slice(5, 7), 16)];
          const ratio = contrastRatio(r1, r2).toFixed(2);
          return `
            <div class="contrast-card" style="background:${c.bg};color:${c.fg};cursor:default">
              <strong>${ratio} : 1</strong>
              <span>${c.label}</span>
              <small>${c.fg} / ${c.bg}</small>
            </div>
          `;
        })
        .join('');
      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="rule-banner">${d.ruleHtml[LANG]}</div>
          <div class="contrast-grid">${cards}</div>
        </div>
      `;
    }

    const act = $('actions');
    act.innerHTML = '';
    const goBtn = document.createElement('button');
    goBtn.type = 'button';
    goBtn.className = 'act primary';
    goBtn.textContent = L.goPractice;
    goBtn.addEventListener('click', () => setMode('practice'));
    act.appendChild(goBtn);
  }

  // ---------------- Generadores de preguntas para PRACTICAR / EXAMEN ----------------
  function nextQuestion() {
    const d = currentDrill();
    const L = t();
    $('felt').classList.remove('is-top');
    $('stageBox').classList.remove('flash-ok', 'flash-bad');

    if (state.mode === 'test' && state.total >= TEST_LEN) {
      finishTest();
      return;
    }

    state.answered = false;
    const hard = state.diff === 'hard';
    const progressMeta =
      state.mode === 'test' ? `${state.total + 1} / ${TEST_LEN} · ${d.sub[LANG]}` : d.sub[LANG];

    if (d.id === 'hue-wheel') {
      const target = pick(WHEEL_SECTORS);
      const pool = WHEEL_SECTORS.filter((x) => x.deg !== target.deg);
      const distractors = [];
      while (distractors.length < 3) {
        const cand = pick(pool);
        if (!distractors.includes(cand) && (hard || hueDist(cand.deg, target.deg) >= 60)) {
          distractors.push(cand);
        }
      }
      const options = [target, ...distractors].sort((a, b) => a.deg - b.deg);
      state.currentQ = { type: 'hue', target, options };

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: LANG === 'es' ? '¿Qué matiz y ángulo es este color?' : 'Which hue and angle is this swatch?',
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="swatch-card" style="max-width:260px">
            <div class="swatch-box" style="background:hsl(${target.deg},82%,52%)"></div>
            <div class="swatch-label">${L.sampleLabel}</div>
          </div>
          <div id="wheelFeedback"></div>
        </div>
      `;

      const act = $('actions');
      act.innerHTML = '';
      options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'act';
        b.innerHTML = `${opt[LANG]} <kbd>${idx + 1}</kbd>`;
        b.addEventListener('click', () => {
          const ok = opt.deg === target.deg;
          $('wheelFeedback').innerHTML = buildWheelSVG([target.deg]);
          finalizeChoice(ok, b, target[LANG], options.indexOf(target));
        });
        act.appendChild(b);
      });
    } else if (d.id === 'sat-light') {
      const h = rand(0, 11) * 30;
      const s = pick([15, 40, 70, 95]);
      const l = pick([22, 48, 75, 88]);
      const target = { h, s, l, label: `HSL(${h}°, ${s}%, ${l}%)` };
      const options = [target];
      while (options.length < 4) {
        const os = pick([15, 40, 70, 95]);
        const ol = pick([22, 48, 75, 88]);
        const oh = (h + pick([0, 60, 120, 180])) % 360;
        const lbl = `HSL(${oh}°, ${os}%, ${ol}%)`;
        if (!options.some((x) => x.label === lbl)) {
          options.push({ h: oh, s: os, l: ol, label: lbl });
        }
      }
      options.sort((a, b) => a.label.localeCompare(b.label));
      state.currentQ = { target, options };

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: target.label,
        meta: LANG === 'es' ? 'Elige la muestra que corresponde a estos valores HSL' : 'Pick the swatch matching these HSL values',
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      const gridHtml = options
        .map(
          (opt, idx) => `
          <button type="button" class="swatch-btn" data-idx="${idx}">
            <div class="chip-color" style="background:hsl(${opt.h},${opt.s}%,${opt.l}%)"></div>
            <div class="chip-tag" data-tag="${idx}">[${idx + 1}]</div>
          </button>`
        )
        .join('');

      $('felt').innerHTML = `<div class="color-wrap"><div class="swatch-choices">${gridHtml}</div></div>`;
      $('actions').innerHTML = '';

      document.querySelectorAll('.swatch-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-idx'));
          const chosen = options[idx];
          const ok = chosen.label === target.label;
          document.querySelectorAll('.swatch-btn').forEach((b, i) => {
            b.disabled = true;
            b.querySelector('.chip-tag').textContent = options[i].label;
            if (options[i].label === target.label) b.classList.add('is-right');
            else if (i === idx && !ok) b.classList.add('is-wrong');
          });
          recordOutcome(ok, target.label);
        });
      });
    } else if (d.id === 'match-hsl') {
      const target = {
        h: rand(0, 35) * 10,
        s: rand(3, 9) * 10,
        l: rand(2, 8) * 10
      };
      state.userHSL = { h: 180, s: 50, l: 50 };
      state.currentQ = { target };

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: LANG === 'es' ? 'Iguala el color objetivo con los deslizadores' : 'Match the target swatch using the sliders',
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      const { h, s, l } = state.userHSL;
      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="swatch-row">
            <div class="swatch-card">
              <div class="swatch-box" style="background:hsl(${target.h},${target.s}%,${target.l}%)"></div>
              <div class="swatch-label">${L.targetLabel}</div>
              <div class="swatch-code" id="targetCodeOut">???</div>
            </div>
            <div class="swatch-card">
              <div class="swatch-box" id="userMixBox" style="background:hsl(${h},${s}%,${l}%)"></div>
              <div class="swatch-label">${L.yoursLabel}</div>
              <div class="swatch-code" id="userCodeOut">HSL(${h}°, ${s}%, ${l}%)</div>
            </div>
          </div>
          <div class="sliders-box" id="matchSliders">
            <div class="slider-row">
              <label>${L.hueLabel}</label>
              <input type="range" id="mH" min="0" max="360" value="${h}" style="background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)">
              <output id="moH">${h}°</output>
            </div>
            <div class="slider-row">
              <label>${L.satLabel}</label>
              <input type="range" id="mS" min="0" max="100" value="${s}" style="background:linear-gradient(to right,hsl(${h},0%,${l}%),hsl(${h},100%,${l}%))">
              <output id="moS">${s}%</output>
            </div>
            <div class="slider-row">
              <label>${L.litLabel}</label>
              <input type="range" id="mL" min="0" max="100" value="${l}" style="background:linear-gradient(to right,#000,hsl(${h},${s}%,50%),#fff)">
              <output id="moL">${l}%</output>
            </div>
          </div>
        </div>
      `;

      const updateMix = () => {
        state.userHSL.h = Number($('mH').value);
        state.userHSL.s = Number($('mS').value);
        state.userHSL.l = Number($('mL').value);
        const { h: nh, s: ns, l: nl } = state.userHSL;
        $('moH').textContent = nh + '°';
        $('moS').textContent = ns + '%';
        $('moL').textContent = nl + '%';
        $('userMixBox').style.background = `hsl(${nh},${ns}%,${nl}%)`;
        $('userCodeOut').textContent = `HSL(${nh}°, ${ns}%, ${nl}%)`;
        $('mS').style.background = `linear-gradient(to right,hsl(${nh},0%,${nl}%),hsl(${nh},100%,${nl}%))`;
        $('mL').style.background = `linear-gradient(to right,#000,hsl(${nh},${ns}%,50%),#fff)`;
      };
      ['mH', 'mS', 'mL'].forEach((id) => $(id).addEventListener('input', updateMix));

      const act = $('actions');
      act.innerHTML = '';
      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'act primary';
      checkBtn.innerHTML = `${L.checkMatch} <kbd>Enter</kbd>`;
      checkBtn.addEventListener('click', () => {
        if (state.answered) return;
        const dh = hueDist(state.userHSL.h, target.h);
        const ds = Math.abs(state.userHSL.s - target.s);
        const dl = Math.abs(state.userHSL.l - target.l);
        const maxH = hard ? 22 : 35;
        const maxSL = hard ? 18 : 26;
        const ok = dh <= maxH && ds <= maxSL && dl <= maxSL;
        const score = Math.max(0, Math.round(100 - (dh / 1.8 + ds * 0.4 + dl * 0.5)));
        $('targetCodeOut').textContent = `HSL(${target.h}°, ${target.s}%, ${target.l}%) · ${score}%`;
        ['mH', 'mS', 'mL'].forEach((id) => ($(id).disabled = true));
        act.innerHTML = '';
        recordOutcome(ok, `HSL(${target.h}°, ${target.s}%, ${target.l}%)`);
      });
      act.appendChild(checkBtn);
    } else if (d.id === 'hex-rgb') {
      const makeCol = () => {
        const h = rand(0, 11) * 30;
        const s = pick([20, 65, 88]);
        const l = pick([28, 52, 78]);
        return { h, s, l, hex: hslToHex(h, s, l), rgb: hslToRgb(h, s, l) };
      };
      const target = makeCol();
      const options = [target];
      while (options.length < 4) {
        const c = makeCol();
        if (!options.some((x) => hueDist(x.h, c.h) < 60 && Math.abs(x.l - c.l) < 25)) {
          options.push(c);
        }
      }
      options.sort((a, b) => a.hex.localeCompare(b.hex));
      state.currentQ = { target, options };

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: `${target.hex}  ·  RGB(${target.rgb.join(', ')})`,
        meta: LANG === 'es' ? '¿Qué muestra corresponde a este código hexadecimal?' : 'Which swatch matches this HEX / RGB code?',
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      const gridHtml = options
        .map(
          (opt, idx) => `
          <button type="button" class="swatch-btn" data-idx="${idx}">
            <div class="chip-color" style="background:${opt.hex}"></div>
            <div class="chip-tag">[${idx + 1}]</div>
          </button>`
        )
        .join('');

      $('felt').innerHTML = `<div class="color-wrap"><div class="swatch-choices">${gridHtml}</div></div>`;
      $('actions').innerHTML = '';

      document.querySelectorAll('.swatch-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-idx'));
          const ok = options[idx].hex === target.hex;
          document.querySelectorAll('.swatch-btn').forEach((b, i) => {
            b.disabled = true;
            b.querySelector('.chip-tag').textContent = options[i].hex;
            if (options[i].hex === target.hex) b.classList.add('is-right');
            else if (i === idx && !ok) b.classList.add('is-wrong');
          });
          recordOutcome(ok, target.hex);
        });
      });
    } else if (d.id === 'harmonies') {
      const baseDeg = rand(0, 11) * 30;
      const harm = pick(HARMONIES);
      const targetDeg = mod360(baseDeg + pick(harm.offsets));
      const degsAll = [baseDeg, ...harm.offsets.map((o) => mod360(baseDeg + o))];
      const options = [targetDeg];
      while (options.length < 4) {
        const cand = rand(0, 11) * 30;
        if (!degsAll.includes(cand) && !options.includes(cand)) options.push(cand);
      }
      options.sort((a, b) => a - b);

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: `${harm[LANG]}`,
        meta:
          LANG === 'es'
            ? `Color base: ${baseDeg}°. Elige un color que forme armonía ${harm.es.toLowerCase()}.`
            : `Base color: ${baseDeg}°. Pick a swatch that forms a ${harm.en.toLowerCase()} harmony.`,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      const gridHtml = options
        .map(
          (deg, idx) => `
          <button type="button" class="swatch-btn" data-idx="${idx}">
            <div class="chip-color" style="background:hsl(${deg},82%,52%)"></div>
            <div class="chip-tag">${deg}° [${idx + 1}]</div>
          </button>`
        )
        .join('');

      $('felt').innerHTML = `
        <div class="color-wrap">
          <div class="wheel-wrap" id="harmWheelSlot">
            ${buildWheelSVG([baseDeg])}
            <div class="swatch-card" style="max-width:190px">
              <div class="swatch-box" style="height:82px;background:hsl(${baseDeg},82%,52%)"></div>
              <div class="swatch-label">${L.baseColorLabel} (${baseDeg}°)</div>
            </div>
          </div>
          <div class="swatch-choices">${gridHtml}</div>
        </div>
      `;
      $('actions').innerHTML = '';

      document.querySelectorAll('.swatch-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-idx'));
          const ok = options[idx] === targetDeg;
          $('harmWheelSlot').innerHTML = buildWheelSVG(degsAll);
          document.querySelectorAll('.swatch-btn').forEach((b, i) => {
            b.disabled = true;
            if (options[i] === targetDeg) b.classList.add('is-right');
            else if (i === idx && !ok) b.classList.add('is-wrong');
          });
          recordOutcome(ok, `${targetDeg}°`);
        });
      });
    } else if (d.id === 'wcag-contrast') {
      // 1 pair passes WCAG AA (>= 4.5:1), 3 fail (< 3.2:1)
      const hGood = rand(0, 11) * 30;
      const darkBg = Math.random() < 0.5;
      const goodPair = darkBg
        ? { bg: [hGood, 65, 16], fg: [hGood, 30, 94] }
        : { bg: [hGood, 45, 92], fg: [hGood, 75, 18] };

      const makeBadPair = () => {
        const h1 = rand(0, 11) * 30;
        const h2 = (h1 + pick([0, 60, 120, 180])) % 360;
        const l1 = rand(42, 66);
        const l2 = l1 + rand(-12, 12);
        return { bg: [h1, 75, l1], fg: [h2, 75, l2] };
      };

      const decorate = (pair, isGood) => {
        const bgHex = hslToHex(...pair.bg);
        const fgHex = hslToHex(...pair.fg);
        const ratio = contrastRatio(hslToRgb(...pair.bg), hslToRgb(...pair.fg));
        return { bgHex, fgHex, ratio, isGood };
      };

      const options = [
        decorate(goodPair, true),
        decorate(makeBadPair(), false),
        decorate(makeBadPair(), false),
        decorate(makeBadPair(), false)
      ].sort((a, b) => a.bgHex.localeCompare(b.bgHex));

      setPrompt({
        eyebrow: `${d.title[LANG]} · ${L.modes[state.mode]}`,
        name: LANG === 'es' ? '¿Qué tarjeta cumple el estándar WCAG AA (≥ 4.5 : 1)?' : 'Which card passes WCAG AA contrast (≥ 4.5 : 1)?',
        meta: progressMeta,
        bar: state.mode === 'test' ? state.total / TEST_LEN : null,
        status: null
      });

      const cardsHtml = options
        .map(
          (c, idx) => `
          <button type="button" class="contrast-card" data-idx="${idx}" style="background:${c.bgHex};color:${c.fgHex}">
            <strong>[${idx + 1}] Aa Bb Cc</strong>
            <span>${LANG === 'es' ? 'Texto de lectura en interfaz' : 'Sample interface body copy'}</span>
            <small class="ratio-tag">${c.fgHex} / ${c.bgHex}</small>
          </button>`
        )
        .join('');

      $('felt').innerHTML = `<div class="color-wrap"><div class="contrast-grid">${cardsHtml}</div></div>`;
      $('actions').innerHTML = '';

      document.querySelectorAll('.contrast-card').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-idx'));
          const ok = options[idx].isGood;
          const winner = options.find((x) => x.isGood);
          document.querySelectorAll('.contrast-card').forEach((b, i) => {
            b.disabled = true;
            b.querySelector('.ratio-tag').textContent = `${options[i].ratio.toFixed(2)} : 1 (${options[i].isGood ? 'AA ✓' : '✗'})`;
            if (options[i].isGood) b.classList.add('is-right');
            else if (i === idx && !ok) b.classList.add('is-wrong');
          });
          recordOutcome(ok, `${winner.ratio.toFixed(1)} : 1`);
        });
      });
    }
  }

  function finalizeChoice(isRight, clickedBtn, rightLabel, rightIdx) {
    document.querySelectorAll('#actions .act').forEach((b, i) => {
      b.disabled = true;
      if (i === rightIdx) b.classList.add('is-right');
      else if (b === clickedBtn && !isRight) b.classList.add('is-wrong');
    });
    recordOutcome(isRight, rightLabel);
  }

  function recordOutcome(isRight, rightLabel) {
    if (state.answered) return;
    state.answered = true;
    const L = t();
    state.total++;
    if (isRight) {
      state.right++;
      state.streak++;
    } else {
      state.streak = 0;
    }
    updateStats();

    $('stageBox').classList.add(isRight ? 'flash-ok' : 'flash-bad');
    setPrompt({
      eyebrow: isRight ? L.correctExcl : L.wrongExcl(rightLabel),
      name: rightLabel,
      meta: state.mode === 'test' ? `${state.total} / ${TEST_LEN}` : currentDrill().title[LANG],
      bar: state.mode === 'test' ? state.total / TEST_LEN : null,
      status: isRight ? 'ok' : 'bad'
    });

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'act primary';
    nextBtn.innerHTML = `${L.nextBtn} <kbd>Space</kbd>`;
    nextBtn.addEventListener('click', () => nextQuestion());
    $('actions').appendChild(nextBtn);
  }

  function finishTest() {
    state.frozen = elapsed();
    const L = t();
    const d = currentDrill();
    const pct = Math.round((100 * state.right) / TEST_LEN);
    const timeSec = Math.round(state.frozen);
    const passed = pct >= 90;

    const prev = state.bests[d.id];
    if (!prev || pct > prev.pct || (pct === prev.pct && timeSec < prev.time)) {
      state.bests[d.id] = { pct, time: timeSec };
      saved.set('bests', state.bests);
    }
    renderRail();
    renderBest();

    setPrompt({
      eyebrow: L.testDone,
      name: `${pct}% (${state.right}/${TEST_LEN}) · ${timeSec}s`,
      meta: passed ? L.passedMsg : L.retryMsg,
      bar: 1,
      status: passed ? 'ok' : 'bad'
    });

    $('felt').innerHTML = `
      <div class="color-wrap">
        <div class="swatch-card">
          <div class="swatch-box" style="background:${passed ? 'hsl(152,65%,48%)' : 'hsl(8,78%,58%)'}"></div>
          <div class="swatch-code">${pct}% · ${fmtClock(timeSec)}</div>
        </div>
      </div>
    `;

    const act = $('actions');
    act.innerHTML = '';
    const rBtn = document.createElement('button');
    rBtn.type = 'button';
    rBtn.className = 'act primary';
    rBtn.textContent = L.tryAgain;
    rBtn.addEventListener('click', () => {
      resetSession();
      nextQuestion();
    });
    act.appendChild(rBtn);
  }

  function setMode(m) {
    state.mode = m;
    saved.set('mode', m);
    resetSession();
    renderAll();
  }

  function renderAll() {
    applyStaticI18n();
    if (state.mode === 'study') renderStudy();
    else nextQuestion();
  }

  // ---------------- Eventos ----------------
  $('langSel').addEventListener('change', (e) => {
    LANG = e.target.value === 'en' ? 'en' : 'es';
    saved.set('lang', LANG);
    try { localStorage.setItem('todologo.lang', LANG); } catch (err) {}
    renderAll();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'todologo.lang' && (e.newValue === 'es' || e.newValue === 'en')) {
      LANG = e.newValue;
      renderAll();
    }
  });

  document.querySelectorAll('#modeSeg button').forEach((b) => {
    b.addEventListener('click', () => setMode(b.getAttribute('data-v')));
  });

  document.querySelectorAll('#diffSeg button').forEach((b) => {
    b.addEventListener('click', () => {
      state.diff = b.getAttribute('data-v');
      saved.set('diff', state.diff);
      resetSession();
      renderAll();
    });
  });

  $('restartBtn').addEventListener('click', () => {
    resetSession();
    renderAll();
  });

  $('cleanBtn').addEventListener('click', () => document.body.classList.add('clean'));
  $('cleanExit').addEventListener('click', () => document.body.classList.remove('clean'));
  $('settingsBtn').addEventListener('click', () => document.body.classList.add('sheet-open'));
  $('closeSheet').addEventListener('click', () => document.body.classList.remove('sheet-open'));
  $('howBtn').addEventListener('click', () => { $('intro').hidden = false; });
  $('introGo').addEventListener('click', () => { $('intro').hidden = true; });

  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) {
      if (e.key !== 'Enter') return;
    }
    if (!$('intro').hidden) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $('intro').hidden = true;
      }
      return;
    }
    if (state.mode === 'study') return;

    if (state.answered) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextQuestion();
      }
      return;
    }

    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = Number(e.key) - 1;
      const swatchBtns = document.querySelectorAll('.swatch-btn, .contrast-card');
      if (swatchBtns[idx]) {
        e.preventDefault();
        swatchBtns[idx].click();
        return;
      }
      const actBtns = document.querySelectorAll('#actions .act');
      if (actBtns[idx]) {
        e.preventDefault();
        actBtns[idx].click();
      }
    } else if (e.key === 'Enter') {
      const primary = document.querySelector('#actions .act.primary');
      if (primary) {
        e.preventDefault();
        primary.click();
      }
    }
  });

  resetSession();
  renderAll();
})();
