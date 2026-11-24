(() => {
  'use strict';

  const DATA = window.PERSPECTIVE_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const saved = window.SiteProgress ? window.SiteProgress.tool('perspective-lab') : null;
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
      .replace(/[&/+\-×"'“”‘’().,:·φ√°⊥]/g, ' ')
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
    'perspectiva': { es: 'Especifica tipo (1P frontal, 2P oblicua, 3P nadir/cenit, atmosférica…).', en: 'Specify which (1P, 2P, 3P nadir/zenith, atmospheric…).' },
    'perspective': { es: 'Specify type (1P, 2P, 3P, atmospheric…).', en: 'Specify which (1P, 2P, 3P nadir/zenith, atmospheric…).' },
    'puntos de fuga': { es: '¿1, 2, 3 (nadir o cenit) o 5 puntos?', en: '1, 2, 3 (nadir/zenith), or 5 vanishing points?' },
    'horizonte': { es: '¿Horizonte a nivel de ojos, alto, bajo o plano holandés?', en: 'Eye-level, high, low, or Dutch angle horizon?' },
    'sombra': { es: '¿Núcleo de sombra, terminador, proyectada o de contacto (AO)?', en: 'Core shadow, terminator, cast shadow, or ambient occlusion?' },
    'luz': { es: '¿Luz reflejada, Rembrandt, contraluz o especular?', en: 'Bounce light, Rembrandt, rim backlight, or specular?' },
    'composicion': { es: 'Especifica regla (tercios, proporción áurea, piramidal, radial…).', en: 'Specify rule (thirds, golden ratio, pyramid, radial…).' }
  };

  function makeIndex() {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();

    function addRaw(m, raw) {
      const k = norm(raw);
      if (!k || k.length < 2 || VAGUE_MAP[k]) return;
      if (!exact.has(k)) exact.set(k, m);
      if (k.length >= 6) {
        const sig = m.id + '|' + k;
        if (!seen.has(sig)) { seen.add(sig); candidates.push({ item: m, key: k, digits: digitsOf(k) }); }
      }
    }
    function addField(m, str) {
      if (!str) return;
      addRaw(m, str);
      addRaw(m, String(str).replace(/\([^)]*\)/g, ' '));
    }

    ITEMS.forEach(m => {
      addField(m, m.name && m.name.es);
      addField(m, m.name && m.name.en);
      (m.aka || []).forEach(a => addRaw(m, a));
    });
    return { exact, candidates };
  }

  const INDEX = makeIndex();
  const STOPWORDS = new Set(['para', 'sobre', 'hacia', 'entre', 'desde', 'todo', 'toda', 'todos', 'cerca', 'lejos', 'with', 'from', 'into', 'this', 'that', 'plus', 'over']);

  function checkAnswer(raw, target) {
    const q = norm(raw);
    if (!q) return { status: 'empty' };

    if (S.target === 'principle') {
      const hitProto = INDEX.exact.get(q);
      if (hitProto && hitProto.id === target.id) {
        return {
          status: 'vague',
          msg: LANG === 'en'
            ? 'That is the concept name — explain its geometric/visual rule.'
            : 'Ese es el nombre del concepto — describe su regla geométrica o visual.'
        };
      }
      const rEs = norm(target.rule && target.rule.es);
      const rEn = norm(target.rule && target.rule.en);
      if (q === rEs || q === rEn) return { status: 'right', item: target };
      const ruleWords = new Set((rEs + ' ' + rEn).split(' ').filter(w => w.length >= 4 && !STOPWORDS.has(w)));
      const qWords = q.split(' ').filter(w => w.length >= 4 && !STOPWORDS.has(w));
      let matches = 0;
      for (const qw of qWords) {
        for (const rw of ruleWords) {
          if (qw === rw || (rw.length >= 6 && editDist(qw, rw) <= 1)) { matches++; break; }
        }
      }
      if (matches >= 1) return { status: 'right', item: target };
      return { status: 'wrong', matched: null };
    }

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
    let bestItem = null, bestDist = 99, targetDist = 99;
    for (let i = 0; i < INDEX.candidates.length; i++) {
      const c = INDEX.candidates[i];
      if ((c.digits || qDigits) && c.digits !== qDigits) continue;
      const limit = c.key.length >= 10 ? 2 : (c.key.length >= 6 ? 1 : 0);
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

  function drawBlueprintInner(m, quizMode) {
    const k = m.diagramKind || '1p';
    const mask = quizMode && S.target === 'concept';
    const l1 = mask ? 'VP' : 'PF';
    const uid = m.id.replace(/[^a-z0-9]/g, '');

    if (k === '1p') {
      return '<line x1="20" y1="78" x2="520" y2="78" stroke="#6fd0e8" stroke-width="1.4" stroke-dasharray="5 4"/>' +
        '<g stroke="#33475a" stroke-width="1.2">' +
          '<line x1="270" y1="78" x2="80" y2="180"/><line x1="270" y1="78" x2="460" y2="180"/>' +
          '<line x1="270" y1="78" x2="140" y2="30"/><line x1="270" y1="78" x2="400" y2="30"/>' +
        '</g>' +
        '<rect x="175" y="102" width="76" height="58" fill="rgba(111,208,232,0.12)" stroke="#ecdec2" stroke-width="2"/>' +
        '<polygon points="251,102 270,92 270,136 251,160" fill="rgba(95,211,154,0.16)" stroke="#6fd0e8" stroke-width="1.8"/>' +
        '<polygon points="175,102 214,92 270,92 251,102" fill="rgba(236,222,194,0.14)" stroke="#ecdec2" stroke-width="1.6"/>' +
        '<circle cx="270" cy="78" r="5" fill="#5fd39a"/><text x="270" y="66" text-anchor="middle" fill="#5fd39a" font-family="monospace" font-size="11">' + l1 + '</text>';
    }
    if (k === '2p') {
      return '<line x1="20" y1="75" x2="520" y2="75" stroke="#6fd0e8" stroke-width="1.4" stroke-dasharray="5 4"/>' +
        '<g stroke="#33475a" stroke-width="1.2">' +
          '<line x1="56" y1="75" x2="270" y2="96"/><line x1="56" y1="75" x2="270" y2="168"/>' +
          '<line x1="484" y1="75" x2="270" y2="96"/><line x1="484" y1="75" x2="270" y2="168"/>' +
        '</g>' +
        '<polygon points="270,96 346,89 346,142 270,168 194,142 194,89" fill="rgba(111,208,232,0.14)" stroke="#ecdec2" stroke-width="2" stroke-linejoin="round"/>' +
        '<line x1="270" y1="96" x2="270" y2="168" stroke="#ecdec2" stroke-width="2"/>' +
        '<circle cx="56" cy="75" r="4.5" fill="#5fd39a"/><circle cx="484" cy="75" r="4.5" fill="#5fd39a"/>';
    }
    if (k === '3p-nadir' || k === '3p-zenith') {
      const up = k === '3p-zenith';
      const hy = up ? 168 : 34;
      const vy = up ? 24 : 186;
      return '<line x1="20" y1="' + hy + '" x2="520" y2="' + hy + '" stroke="#6fd0e8" stroke-width="1.3" stroke-dasharray="5 4"/>' +
        '<g stroke="#33475a" stroke-width="1.1">' +
          '<line x1="270" y1="' + vy + '" x2="188" y2="' + (up ? 156 : 52) + '"/>' +
          '<line x1="270" y1="' + vy + '" x2="352" y2="' + (up ? 156 : 52) + '"/>' +
          '<line x1="270" y1="' + vy + '" x2="270" y2="' + hy + '"/>' +
        '</g>' +
        (up
          ? '<polygon points="270,58 318,74 342,150 270,164 198,150 222,74" fill="rgba(111,208,232,0.16)" stroke="#ecdec2" stroke-width="2"/>'
          : '<polygon points="270,48 346,66 318,148 270,162 222,148 194,66" fill="rgba(111,208,232,0.16)" stroke="#ecdec2" stroke-width="2"/>') +
        '<circle cx="62" cy="' + hy + '" r="4" fill="#5fd39a"/><circle cx="478" cy="' + hy + '" r="4" fill="#5fd39a"/><circle cx="270" cy="' + vy + '" r="4.5" fill="#f0cf6a"/>';
    }
    if (k === '5p-curv') {
      return '<circle cx="270" cy="105" r="88" fill="rgba(111,208,232,0.06)" stroke="#6fd0e8" stroke-width="1.6"/>' +
        '<line x1="182" y1="105" x2="358" y2="105" stroke="#33475a" stroke-width="1.3"/>' +
        '<line x1="270" y1="17" x2="270" y2="193" stroke="#33475a" stroke-width="1.3"/>' +
        '<path d="M188 74 Q270 105 352 74 M188 136 Q270 105 352 136 M236 24 Q270 105 236 186 M304 24 Q270 105 304 186" fill="none" stroke="#ecdec2" stroke-width="1.6"/>' +
        '<circle cx="270" cy="105" r="4" fill="#5fd39a"/>';
    }
    if (k === 'iso') {
      return '<g stroke="#33475a" stroke-width="1.2" stroke-dasharray="3 3">' +
          '<line x1="150" y1="168" x2="390" y2="42"/><line x1="390" y1="168" x2="150" y2="42"/>' +
        '</g>' +
        '<polygon points="270,48 334,85 334,148 270,185 206,148 206,85" fill="rgba(95,211,154,0.14)" stroke="#ecdec2" stroke-width="2"/>' +
        '<path d="M206 85 L270 122 L334 85 M270 122 V185" fill="none" stroke="#6fd0e8" stroke-width="2"/>';
    }
    if (k === 'foreshorten' || k === 'ellipse') {
      return '<line x1="115" y1="105" x2="425" y2="105" stroke="#5fd39a" stroke-width="1.4" stroke-dasharray="4 3"/>' +
        '<ellipse cx="180" cy="105" rx="22" ry="52" fill="rgba(111,208,232,0.14)" stroke="#ecdec2" stroke-width="2"/>' +
        '<ellipse cx="265" cy="105" rx="20" ry="46" fill="none" stroke="#6fd0e8" stroke-width="1.6"/>' +
        '<ellipse cx="350" cy="105" rx="16" ry="38" fill="rgba(111,208,232,0.1)" stroke="#ecdec2" stroke-width="2"/>' +
        '<line x1="180" y1="53" x2="350" y2="67" stroke="#ecdec2" stroke-width="1.8"/><line x1="180" y1="157" x2="350" y2="143" stroke="#ecdec2" stroke-width="1.8"/>';
    }
    if (k === 'diagonals' || k === 'incline' || k === 'cone') {
      if (k === 'incline') {
        return '<line x1="20" y1="140" x2="520" y2="140" stroke="#6fd0e8" stroke-width="1.4" stroke-dasharray="4 3"/>' +
          '<circle cx="430" cy="140" r="4" fill="#5fd39a"/><circle cx="430" cy="36" r="4.5" fill="#f0cf6a"/>' +
          '<line x1="430" y1="36" x2="430" y2="140" stroke="#f0cf6a" stroke-width="1.3" stroke-dasharray="3 3"/>' +
          '<polygon points="150,156 320,88 320,148 150,174" fill="rgba(111,208,232,0.16)" stroke="#ecdec2" stroke-width="2"/>' +
          '<line x1="320" y1="88" x2="430" y2="36" stroke="#f0cf6a" stroke-width="1.3"/>';
      }
      if (k === 'cone') {
        return '<circle cx="270" cy="105" r="76" fill="none" stroke="#5fd39a" stroke-width="1.8" stroke-dasharray="5 4"/>' +
          '<line x1="270" y1="196" x2="180" y2="40" stroke="#6fd0e8" stroke-width="1.6"/>' +
          '<line x1="270" y1="196" x2="360" y2="40" stroke="#6fd0e8" stroke-width="1.6"/>' +
          '<circle cx="270" cy="196" r="5" fill="#f0cf6a"/>' +
          '<text x="270" y="109" text-anchor="middle" fill="#ecdec2" font-family="monospace" font-size="14" font-weight="700">60°</text>';
      }
      return '<polygon points="110,165 250,48 420,48 340,165" fill="rgba(111,208,232,0.08)" stroke="#ecdec2" stroke-width="2"/>' +
        '<line x1="110" y1="165" x2="420" y2="48" stroke="#6fd0e8" stroke-width="1.6"/>' +
        '<line x1="250" y1="48" x2="340" y2="165" stroke="#6fd0e8" stroke-width="1.6"/>' +
        '<line x1="286" y1="48" x2="228" y2="165" stroke="#5fd39a" stroke-width="1.8"/>';
    }
    if (k.startsWith('horizon-') || k === 'worms-eye' || k === 'birds-eye' || k === 'dutch' || k === 'station' || k === 'aerial' || k === 'warm-cool' || k === 'overlap' || k === 'scale') {
      if (k === 'dutch') {
        return '<line x1="40" y1="158" x2="500" y2="52" stroke="#ff7a6b" stroke-width="2" stroke-dasharray="6 4"/>' +
          '<g transform="rotate(-13 270 105)"><rect x="210" y="68" width="120" height="74" fill="rgba(255,122,107,0.12)" stroke="#ecdec2" stroke-width="2"/></g>';
      }
      if (k === 'aerial' || k === 'warm-cool') {
        return '<path d="M20 185 L130 98 L230 142 L340 84 L520 185 Z" fill="' + (k === 'warm-cool' ? '#25384b' : '#182430') + '" stroke="#33475a" stroke-width="1.2"/>' +
          '<path d="M20 192 L155 128 L275 162 L390 116 L520 192 Z" fill="' + (k === 'warm-cool' ? '#3d4f63' : '#263847') + '"/>' +
          '<path d="M20 198 L195 148 L350 176 L520 152 V200 H20 Z" fill="' + (k === 'warm-cool' ? '#c57c4b' : '#4a647a') + '" opacity="0.85"/>';
      }
      if (k === 'overlap') {
        return '<rect x="255" y="45" width="130" height="100" rx="8" fill="#182634" stroke="#6fd0e8" stroke-width="2"/>' +
          '<rect x="180" y="75" width="140" height="100" rx="8" fill="#1c2f40" stroke="#ecdec2" stroke-width="2.4"/>' +
          '<circle cx="195" cy="115" r="36" fill="#101a24" stroke="#5fd39a" stroke-width="2.4"/>';
      }
      if (k === 'scale') {
        return '<line x1="20" y1="54" x2="520" y2="54" stroke="#6fd0e8" stroke-width="1.3" stroke-dasharray="4 4"/>' +
          '<rect x="75" y="44" width="60" height="140" fill="rgba(111,208,232,0.16)" stroke="#ecdec2" stroke-width="2"/>' +
          '<rect x="200" y="50" width="42" height="96" fill="rgba(111,208,232,0.14)" stroke="#ecdec2" stroke-width="1.8"/>' +
          '<rect x="305" y="52" width="26" height="60" fill="rgba(111,208,232,0.12)" stroke="#6fd0e8" stroke-width="1.6"/>' +
          '<rect x="388" y="53" width="14" height="34" fill="rgba(111,208,232,0.1)" stroke="#6fd0e8" stroke-width="1.4"/>';
      }
      const hy = k === 'horizon-low' ? 162 : (k === 'horizon-high' ? 42 : (k === 'birds-eye' ? 24 : (k === 'worms-eye' ? 186 : 96)));
      return '<line x1="20" y1="' + hy + '" x2="520" y2="' + hy + '" stroke="#5fd39a" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<g stroke="#ecdec2" stroke-width="2" fill="rgba(111,208,232,0.14)">' +
          '<circle cx="160" cy="' + hy + '" r="10"/><line x1="160" y1="' + (hy + 10) + '" x2="160" y2="' + Math.min(198, hy + 72) + '"/>' +
          '<circle cx="340" cy="' + hy + '" r="7"/><line x1="340" y1="' + (hy + 7) + '" x2="340" y2="' + Math.min(198, hy + 46) + '"/>' +
        '</g>';
    }
    if (k === 'thirds' || k === 'golden' || k === 'golden-tri' || k === 'rabatment' || k === 'symmetry' || k === 'leading' || k === 'pyramid' || k === 'radial' || k === 'negative' || k === 'balance' || k === 'frame') {
      if (k === 'thirds') {
        return '<rect x="70" y="20" width="400" height="170" fill="none" stroke="#33475a" stroke-width="1.6"/>' +
          '<line x1="203" y1="20" x2="203" y2="190" stroke="#6fd0e8" stroke-width="1.5"/>' +
          '<line x1="337" y1="20" x2="337" y2="190" stroke="#6fd0e8" stroke-width="1.5"/>' +
          '<line x1="70" y1="76" x2="470" y2="76" stroke="#6fd0e8" stroke-width="1.5"/>' +
          '<line x1="70" y1="133" x2="470" y2="133" stroke="#6fd0e8" stroke-width="1.5"/>' +
          '<circle cx="203" cy="76" r="6" fill="#5fd39a"/><circle cx="337" cy="76" r="4" fill="#ecdec2"/>' +
          '<circle cx="203" cy="133" r="4" fill="#ecdec2"/><circle cx="337" cy="133" r="4" fill="#ecdec2"/>';
      }
      if (k === 'golden' || k === 'rabatment') {
        return '<rect x="115" y="18" width="310" height="174" fill="none" stroke="#ecdec2" stroke-width="1.8"/>' +
          '<line x1="289" y1="18" x2="289" y2="192" stroke="#6fd0e8" stroke-width="1.5"/>' +
          (k === 'rabatment'
            ? '<line x1="251" y1="18" x2="251" y2="192" stroke="#5fd39a" stroke-width="1.5" stroke-dasharray="4 3"/>'
            : '<path d="M115 192 A174 174 0 0 1 289 18 A136 136 0 0 1 425 154 A38 38 0 0 1 387 192 A24 24 0 0 1 363 168" fill="none" stroke="#f0cf6a" stroke-width="2.2"/>');
      }
      if (k === 'golden-tri' || k === 'symmetry') {
        return '<rect x="90" y="20" width="360" height="170" fill="none" stroke="#33475a" stroke-width="1.6"/>' +
          '<line x1="90" y1="190" x2="450" y2="20" stroke="#6fd0e8" stroke-width="1.8"/>' +
          '<line x1="90" y1="20" x2="174" y2="150" stroke="#5fd39a" stroke-width="1.6"/>' +
          '<line x1="450" y1="190" x2="366" y2="60" stroke="#5fd39a" stroke-width="1.6"/>' +
          (k === 'symmetry' ? '<line x1="90" y1="20" x2="450" y2="190" stroke="#f0cf6a" stroke-width="1.3" stroke-dasharray="4 3"/>' : '');
      }
      if (k === 'pyramid') {
        return '<polygon points="270,26 420,180 120,180" fill="rgba(111,208,232,0.14)" stroke="#ecdec2" stroke-width="2.4" stroke-linejoin="round"/>' +
          '<circle cx="270" cy="64" r="14" fill="#f0cf6a" opacity="0.85"/>';
      }
      if (k === 'radial') {
        return '<g stroke="#6fd0e8" stroke-width="1.4">' +
          '<line x1="270" y1="105" x2="80" y2="20"/><line x1="270" y1="105" x2="460" y2="20"/>' +
          '<line x1="270" y1="105" x2="80" y2="190"/><line x1="270" y1="105" x2="460" y2="190"/>' +
          '<line x1="270" y1="105" x2="270" y2="15"/><line x1="270" y1="105" x2="270" y2="195"/>' +
        '</g><circle cx="270" cy="105" r="18" fill="#0d1722" stroke="#f0cf6a" stroke-width="2.5"/>';
      }
      if (k === 'negative' || k === 'balance') {
        return '<rect x="75" y="22" width="390" height="166" fill="#090e14" stroke="#33475a" stroke-width="1.5"/>' +
          (k === 'negative'
            ? '<circle cx="408" cy="142" r="14" fill="#ecdec2"/>'
            : '<rect x="145" y="65" width="110" height="90" rx="8" fill="#2c3e50" stroke="#8d9ca9" stroke-width="1.5"/><circle cx="422" cy="108" r="14" fill="#ff7a6b"/>');
      }
      if (k === 'frame') {
        return '<rect x="70" y="16" width="400" height="178" fill="#0b1118" stroke="#33475a" stroke-width="1.5"/>' +
          '<path d="M160 194 V72 Q270 16 380 72 V194 Z" fill="#132230" stroke="#6fd0e8" stroke-width="2"/>' +
          '<circle cx="270" cy="128" r="18" fill="#ecdec2"/>';
      }
      // leading lines
      return '<path d="M80 192 Q210 132 340 76 M460 192 Q350 132 340 76" fill="none" stroke="#6fd0e8" stroke-width="2.2"/>' +
        '<circle cx="340" cy="76" r="10" fill="#5fd39a"/>';
    }

    // Light & Shadow 3D Volume Diagram
    const gradId = 'g' + uid;
    if (k === 'rim') {
      return '<defs><radialGradient id="' + gradId + '" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#1d2b38"/><stop offset="88%" stop-color="#0b1218"/><stop offset="100%" stop-color="#6fd0e8"/></radialGradient></defs>' +
        '<circle cx="270" cy="105" r="64" fill="url(#' + gradId + ')" stroke="#6fd0e8" stroke-width="3"/>';
    }
    if (k === 'rembrandt') {
      return '<rect x="195" y="34" width="150" height="142" rx="60" fill="#101820" stroke="#33475a" stroke-width="1.6"/>' +
        '<path d="M195 45 L268 45 L268 175 L195 175 Z" fill="#d9c6a3" opacity="0.72"/>' +
        '<polygon points="282,110 318,110 296,144" fill="#f0cf6a" opacity="0.92"/>';
    }
    const baseSphere =
      '<defs><radialGradient id="' + gradId + '" cx="34%" cy="32%" r="68%">' +
        '<stop offset="0%" stop-color="#f7f0df"/>' +
        '<stop offset="28%" stop-color="#b9b19d"/>' +
        '<stop offset="68%" stop-color="#222d38"/>' +
        '<stop offset="90%" stop-color="#111820"/>' +
        '<stop offset="100%" stop-color="' + (k === 'sss' ? '#d4624b' : (k === 'bounce' ? '#3f5b6e' : '#1b2632')) + '"/>' +
      '</radialGradient></defs>' +
      '<ellipse cx="322" cy="164" rx="88" ry="18" fill="#05080b" opacity="0.88"/>' +
      '<circle cx="255" cy="102" r="64" fill="url(#' + gradId + ')" stroke="#33475a" stroke-width="1.2"/>' +
      '<line x1="125" y1="32" x2="188" y2="68" stroke="#f0cf6a" stroke-width="2" stroke-linecap="round"/>' +
      '<polygon points="194,71 182,71 188,61" fill="#f0cf6a"/>';
    if (k === 'terminator' || k === 'core') {
      return baseSphere + '<path d="M236 42 Q298 92 272 162" fill="none" stroke="' + (k === 'terminator' ? '#6fd0e8' : '#ff7a6b') + '" stroke-width="2.6" stroke-dasharray="5 3"/>';
    }
    if (k === 'ao') {
      return baseSphere + '<ellipse cx="255" cy="166" rx="34" ry="6" fill="#000" stroke="#ff7a6b" stroke-width="1.6"/>';
    }
    return baseSphere;
  }

  function buildPerspPlateHtml(m, quizMode) {
    const mask = quizMode && S.target === 'concept';
    const cat = CAT_BY_ID[m.category];
    const catTitle = (cat && (cat[LANG] || cat.es)) || '';
    const rule = (m.rule && (m.rule[LANG] || m.rule.es)) || '';
    const showRule = quizMode && S.target === 'principle' ? t('maskedRule') : rule;
    const codeBadge = mask ? '???' : m.shortCode;

    return '<div class="persp-head">' +
        '<span class="pbadge">' + esc(catTitle) + '</span>' +
        '<span class="pbadge">' + esc(codeBadge) + '</span>' +
      '</div>' +
      '<div class="blueprint-box">' +
        '<svg class="blueprint-svg" viewBox="0 0 540 210" role="img" aria-label="Perspective Diagram">' +
          drawBlueprintInner(m, quizMode) +
        '</svg>' +
      '</div>' +
      '<div class="rule-banner">' + esc(showRule) + '</div>';
  }

  function buildSpecsHtml(m) {
    const cat = CAT_BY_ID[m.category];
    const catTitle = (cat && (cat[LANG] || cat.es)) || '';
    const rule = (m.rule && (m.rule[LANG] || m.rule.es)) || '';
    const fact = (m.fact && (m.fact[LANG] || m.fact.es)) || '';
    return '<div class="facts">' +
      '<span><b>' + esc(t('specBlock')) + ':</b> ' + esc(catTitle) + '</span>' +
      '<span><b>' + esc(t('specCode')) + ':</b> ' + esc(m.shortCode) + '</span>' +
      '<span><b>' + esc(t('specRule')) + ':</b> ' + esc(rule) + '</span>' +
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
    plate.className = 'persp-plate';
    plate.innerHTML = buildPerspPlateHtml(m, quiz);
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
        plate.innerHTML = buildPerspPlateHtml(m, false);
        wrap.className = 'detail';
        const innerShow = document.createElement('div');
        innerShow.className = 'show';
        innerShow.appendChild(plate);
        wrap.textContent = ''; wrap.appendChild(innerShow);
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

  const I18N = {
    es: {
      docTitle: 'Teoría de la Perspectiva y Composición — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'PERSPECTIVA <span>Y LUZ</span>',
      brandSub: 'Puntos de fuga (1P/2P/3P), horizonte, proporción áurea y claroscuro',
      railLabel: 'Módulos visuales',
      railTitle: 'Bloques',
      allCats: 'Todos los bloques',
      searchPlaceholder: 'Buscar fuga, tercios, áurea, terminador o Rembrandt…',
      searchAria: 'Buscar principio visual',
      clearSearch: 'Limpiar búsqueda',
      noMatches: 'Sin conceptos que coincidan con tu búsqueda.',
      settings: 'Ajustes', cleanExit: 'Salir de vista limpia',
      lblAcc: 'Acierto', lblTime: 'Tiempo', lblStreak: 'Racha', done: 'Listo',
      lblLang: 'Idioma', lblMode: 'Modo',
      modeStudy: 'Explorar', modePractice: 'Aprender', modeTest: 'Examen',
      lblSet: 'Conceptos', setPopular: 'Esenciales', setAll: 'Todos',
      lblTarget: 'Preguntar por', tgtConcept: 'Concepto', tgtPrinciple: 'Principio',
      lblAnswer: 'Responder', ansChoose: 'Eligiendo', ansType: 'Escribiendo',
      restart: 'Reiniciar', cleanBtn: 'Vista limpia',
      soundYes: 'Sonido: Sí', soundNo: 'Sonido: No', keysBtn: 'Teclas', howBtn: 'Cómo funciona',
      creditLine: 'Esquemas geométricos SVG de dibujo técnico, composición y sombreado 3D. Adaptado para Todologo.',
      introTitle: 'Perspectiva y composición',
      intro1: 'Analiza la convergencia de rayos hacia <b>1, 2 y 3 puntos de fuga</b>, la proyección isométrica, la proporción áurea y la anatomía de luz y sombra.',
      intro2: 'Cambia entre <b>Concepto</b> (identificar la técnica viendo su plano geométrico) y <b>Principio</b> (recordar la regla espacial exacta).',
      intro3: 'Cada ficha incluye diagrama limpio de ingeniería visual para estudiar el trazo sin distracciones.',
      keysTitle: 'Teclas',
      eyebrowExplore: '{set} · Explorar', eyebrowLearn: '{set} · Aprender', eyebrowTest: '{set} · Examen',
      eyebrowDetail: '{cat} · Ficha {idx}/{n}', eyebrowSummary: 'Resultado del examen',
      promptConcept: '¿Qué principio geométrico o visual muestra el plano?',
      promptPrinciple: '¿Cuál es la regla de "{name}"?',
      countModels: '{n} conceptos', studyThese: 'Aprender estas', allList: 'Todas',
      prev: '← Anterior', next: 'Siguiente →', hint: 'Pista', check: 'Comprobar',
      typeConceptPh: 'Ej. 2 puntos de fuga, Escorzo, Regla de los tercios…',
      typePrinciplePh: 'Describe brevemente la regla visual…',
      maskedRule: 'Principio geométrico oculto hasta responder',
      okEyebrow: '¡Correcto!', badEyebrow: 'Era: {name}', warnEyebrow: 'Aclara el concepto',
      specBlock: 'Bloque', specCode: 'Notación', specRule: 'Principio', wikiLabel: 'Ver en Wikipedia',
      bestLabel: 'Mejor marca ({scope}):', bestNone: 'Aún sin examen completado aquí.', knowLabel: 'Dominadas: {k}/{n}',
      resAcc: 'Acierto', resTime: 'Tiempo', resStreak: 'Mejor racha',
      resPlayAgain: 'Repetir examen', resStudyMisses: 'Repasar {n} fallos', resExplore: 'Volver a explorar',
      resKeyOk: 'Aciertos: {n}', resKeyBad: 'Fallos: {n}', resPerfect: '¡Puntaje perfecto sin errores!',
      resClickMiss: 'Toca un concepto fallado para revisar su plano.', missTitle: 'Conceptos para repasar',
      yourAnswer: 'Tu respuesta: {ans}', hintPrefix: 'Pista:',
      help: {
        rail: ['Bloques visuales', 'Explora Puntos de Fuga (1P–5P), Cámara/Horizonte, Composición/Áurea y Luz/Sombra.'],
        mode: ['Modos', 'Explorar muestra los planos técnicos; Aprender refuerza fallos; Examen cronometra una ronda.'],
        target: ['Preguntar por', 'Concepto pide el nombre mirando el diagrama; Principio pregunta la regla de un concepto.']
      },
      keys: [
        ['1 – 4', 'Elegir opción'], ['H', 'Mostrar pista al escribir'],
        ['Enter / →', 'Siguiente plano tras responder'], ['← / →', 'Navegar en Explorar'],
        ['P', 'Pasar a Aprender'], ['Esc', 'Volver a catálogo o cerrar modal']
      ]
    },
    en: {
      docTitle: 'Perspective & Composition Lab — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'PERSPECTIVE <span>LAB</span>',
      brandSub: 'Vanishing points (1P/2P/3P), horizon, golden ratio & form lighting',
      railLabel: 'Visual modules', railTitle: 'Modules', allCats: 'All modules',
      searchPlaceholder: 'Search VP, thirds, golden ratio, terminator or Rembrandt…',
      searchAria: 'Search visual concept', clearSearch: 'Clear search',
      noMatches: 'No concepts match your search.', settings: 'Settings', cleanExit: 'Exit clean view',
      lblAcc: 'Accuracy', lblTime: 'Time', lblStreak: 'Streak', done: 'Done',
      lblLang: 'Language', lblMode: 'Mode',
      modeStudy: 'Explore', modePractice: 'Learn', modeTest: 'Test',
      lblSet: 'Concepts', setPopular: 'Core', setAll: 'All',
      lblTarget: 'Quiz target', tgtConcept: 'Concept', tgtPrinciple: 'Principle',
      lblAnswer: 'Answer', ansChoose: 'Multiple choice', ansType: 'Typing',
      restart: 'Restart', cleanBtn: 'Clean view',
      soundYes: 'Sound: On', soundNo: 'Sound: Off', keysBtn: 'Keys', howBtn: 'How it works',
      creditLine: 'Vector technical perspective, composition & form-shading diagrams built for Todologo.',
      introTitle: 'Perspective & composition',
      intro1: 'Study converging rays across <b>1-, 2-, and 3-point perspective</b>, isometric geometry, golden ratio, and 3D light-shadow modeling.',
      intro2: 'Switch between <b>Concept</b> (identify technique from blueprint) and <b>Principle</b> (recall its underlying spatial rule).',
      intro3: 'Every diagram renders pure geometric sightlines cleanly on any screen.',
      keysTitle: 'Shortcuts',
      eyebrowExplore: '{set} · Explore', eyebrowLearn: '{set} · Learn', eyebrowTest: '{set} · Test',
      eyebrowDetail: '{cat} · Card {idx}/{n}', eyebrowSummary: 'Exam summary',
      promptConcept: 'Which perspective or visual rule does this show?',
      promptPrinciple: 'What is the core principle of "{name}"?',
      countModels: '{n} concepts', studyThese: 'Learn these', allList: 'All',
      prev: '← Previous', next: 'Next →', hint: 'Hint', check: 'Check',
      typeConceptPh: 'e.g. Two-Point, Foreshortening, Rule of Thirds…',
      typePrinciplePh: 'Briefly state the visual rule…',
      maskedRule: 'Geometric principle hidden until answered',
      okEyebrow: 'Correct!', badEyebrow: 'Answer: {name}', warnEyebrow: 'Clarify concept',
      specBlock: 'Module', specCode: 'Notation', specRule: 'Principle', wikiLabel: 'Wikipedia entry',
      bestLabel: 'Best score ({scope}):', bestNone: 'No completed test yet for this module.', knowLabel: 'Mastered: {k}/{n}',
      resAcc: 'Accuracy', resTime: 'Time', resStreak: 'Best streak',
      resPlayAgain: 'Run again', resStudyMisses: 'Review {n} misses', resExplore: 'Back to explore',
      resKeyOk: 'Correct: {n}', resKeyBad: 'Missed: {n}', resPerfect: 'Perfect score — zero misses!',
      resClickMiss: 'Click a missed concept to inspect its diagram.', missTitle: 'Concepts to review',
      yourAnswer: 'You answered: {ans}', hintPrefix: 'Hint:',
      help: {
        rail: ['Visual modules', 'Filter between Vanishing Points, Horizon & Camera, Composition/Golden Ratio, or Light & Shadow.'],
        mode: ['Modes', 'Explore lets you inspect geometric blueprints; Learn drills misses; Test runs a timed exam.'],
        target: ['Quiz target', 'Concept asks the technique name from its blueprint; Principle tests the underlying rule.']
      },
      keys: [
        ['1 – 4', 'Pick an option'], ['H', 'Show typing hint'],
        ['Enter / →', 'Advance after answer'], ['← / →', 'Step cards in Explore'],
        ['P', 'Jump to Learn'], ['Esc', 'Back to grid or close dialog']
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

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function catLabel(id) { if (id === 'all') return t('allCats'); const c = CAT_BY_ID[id]; return c ? (c[LANG] || c.es || c.id) : id; }
  function setLabel(v) { return v === 'popular' ? t('setPopular') : t('setAll'); }

  const LOOKUP_LOOKALIKES = Object.create(null);
  (DATA.LOOKALIKES || []).forEach(g => g.forEach(id => {
    if (!LOOKUP_LOOKALIKES[id]) LOOKUP_LOOKALIKES[id] = [];
    g.forEach(o => { if (o !== id && LOOKUP_LOOKALIKES[id].indexOf(o) === -1) LOOKUP_LOOKALIKES[id].push(o); });
  }));
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
    return a;
  }
  function pool(cat, setVal) {
    const useCat = cat != null ? cat : S.category, useSet = setVal != null ? setVal : S.set;
    let list = ITEMS.filter(m => (useCat === 'all' || m.category === useCat) && (useSet !== 'popular' || m.pop));
    if (!list.length) list = ITEMS.filter(m => useCat === 'all' || m.category === useCat);
    return list;
  }
  function choices(target) {
    const out = [target], seen = new Set([target.id]), byPrin = S.target === 'principle', seenR = new Set([norm(target.rule[LANG])]);
    function canUse(c) { return c && !seen.has(c.id) && (!byPrin || !seenR.has(norm(c.rule[LANG]))); }
    function take(c) { seen.add(c.id); seenR.add(norm(c.rule[LANG])); out.push(c); }
    shuffle((LOOKUP_LOOKALIKES[target.id] || []).slice()).forEach(id => { if (out.length < 4 && canUse(BY_ID[id])) take(BY_ID[id]); });
    const sameCat = shuffle(ITEMS.filter(m => m.category === target.category && m.id !== target.id));
    for (let i = 0; i < sameCat.length && out.length < 4; i++) if (canUse(sameCat[i])) take(sameCat[i]);
    const rest = shuffle(ITEMS);
    for (let i = 0; i < rest.length && out.length < 4; i++) if (canUse(rest[i])) take(rest[i]);
    return shuffle(out);
  }

  const S = {
    mode: readSaved('mode', 'study'), set: readSaved('set', 'all'), category: readSaved('category', 'all'),
    target: readSaved('target', 'concept'), answer: readSaved('answer', 'choose'), sound: readSaved('sound', true),
    known: readSaved('known', {}) || {}, best: readSaved('best', {}) || {},
    studyAt: null, exploreQuery: '', queue: [], deck: [], deckIdx: 0,
    current: null, opts: [], answered: false, hintLevel: 0,
    okCount: 0, totalAnswered: 0, streak: 0, bestStreak: 0, misses: [],
    startTs: 0, elapsedSec: 0, timerId: null, autoNextId: null
  };
  if (S.mode !== 'study' && S.mode !== 'practice' && S.mode !== 'test') S.mode = 'study';
  if (S.set !== 'popular' && S.set !== 'all') S.set = 'all';
  if (S.category !== 'all' && !CAT_BY_ID[S.category]) S.category = 'all';
  if (S.target !== 'concept' && S.target !== 'principle') S.target = 'concept';
  if (S.answer !== 'choose' && S.answer !== 'type') S.answer = 'choose';

  let audioCtx = null;
  function tone(ok) {
    if (!S.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx(); if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime, osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(ok ? 540 : 210, now);
      if (ok) osc.frequency.exponentialRampToValueAtTime(760, now + 0.08); else osc.frequency.exponentialRampToValueAtTime(160, now + 0.14);
      gain.gain.setValueAtTime(0.001, now); gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.22);
    } catch (_) {}
  }
  function clearTimers() { if (S.timerId) { clearInterval(S.timerId); S.timerId = null; } if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; } }
  function fmtTime(sec) { const s = Math.max(0, Math.floor(sec)), m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  function updateStats() {
    el.stats.classList.toggle('is-off', S.mode === 'study');
    el.sAcc.textContent = S.totalAnswered ? Math.round((S.okCount / S.totalAnswered) * 100) + '%' : '–';
    el.sTime.textContent = fmtTime(S.elapsedSec); el.sStreak.textContent = String(S.streak);
  }
  function updateProgress() {
    if (S.mode === 'test' && S.deck.length) { el.pBarWrap.classList.remove('is-off'); el.pBar.style.width = Math.min(100, Math.round((S.deckIdx / S.deck.length) * 100)) + '%'; }
    else if (S.mode === 'practice') { const p = pool(), k = p.filter(m => S.known[m.id]).length; el.pBarWrap.classList.remove('is-off'); el.pBar.style.width = (p.length ? Math.round((k / p.length) * 100) : 0) + '%'; }
    else { el.pBarWrap.classList.add('is-off'); el.pBar.style.width = '0%'; }
  }
  function renderPanelMeta() {
    const scope = S.set + ':' + S.category + ':' + S.target, b = S.best[scope];
    if (b && typeof b.pct === 'number') el.best.innerHTML = esc(t('bestLabel', { scope: catLabel(S.category) })) + ' <b>' + b.pct + '%</b> (' + fmtTime(b.time || 0) + ')';
    else el.best.textContent = t('bestNone');
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
    el.railList.querySelectorAll('button.rg').forEach(btn => btn.addEventListener('click', () => {
      S.category = btn.getAttribute('data-cat'); writeSaved('category', S.category);
      if (btn.scrollIntoView) try { btn.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } catch (_) {}
      restart();
    }));
  }
  function clearPromptFeedback() { el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn', 'is-review'); el.reviewPanel.hidden = true; el.reviewPanel.innerHTML = ''; el.stageBox.classList.remove('flash-ok', 'flash-bad'); }
  function flashStage(ok) { el.stageBox.classList.remove('flash-ok', 'flash-bad'); el.stageBox.classList.add(ok ? 'flash-ok' : 'flash-bad'); setTimeout(() => el.stageBox.classList.remove('flash-ok', 'flash-bad'), 450); }
  function filteredGridList(baseList) {
    const q = norm(S.exploreQuery); if (!q) return baseList;
    const tokens = q.split(' ').filter(Boolean);
    return baseList.filter(m => {
      const cat = CAT_BY_ID[m.category];
      const hay = norm([nameOf(m, 'es'), nameOf(m, 'en'), m.shortCode, m.rule && m.rule.es, m.rule && m.rule.en, (m.aka || []).join(' '), cat && cat.es, cat && cat.en].join(' '));
      return tokens.every(tok => hay.indexOf(tok) !== -1);
    });
  }

  function studyGrid() {
    S.studyAt = null; clearPromptFeedback();
    el.pEyebrow.textContent = t('eyebrowExplore', { set: setLabel(S.set) }); el.pName.textContent = catLabel(S.category);
    const full = pool(), filtered = filteredGridList(full);
    el.pMeta.textContent = t('countModels', { n: full.length });
    el.gridBar.hidden = false; el.exploreClear.hidden = !S.exploreQuery.trim(); el.exploreCount.textContent = filtered.length + ' / ' + full.length;
    const grid = document.createElement('div'); grid.className = 'grid';
    if (!filtered.length) {
      grid.innerHTML = '<div class="grid-empty">' + esc(t('noMatches')) + '</div>';
    } else {
      const cats = S.category === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === S.category);
      cats.forEach(cat => {
        const rows = filtered.filter(m => m.category === cat.id); if (!rows.length) return;
        const head = document.createElement('div'); head.className = 'head'; head.innerHTML = '<span>' + esc(cat[LANG] || cat.es) + '</span><span>' + rows.length + '</span>';
        grid.appendChild(head);
        rows.forEach(m => {
          const card = document.createElement('button'); card.type = 'button'; card.className = 'pcard' + (S.known[m.id] ? ' is-known' : ''); card.setAttribute('data-id', m.id);
          card.innerHTML = '<div class="thumb"><svg viewBox="0 0 540 210" aria-hidden="true">' + drawBlueprintInner(m, false) + '</svg><span class="code-tag">' + esc(m.shortCode) + '</span></div>' +
            '<div class="lbl"><b>' + esc(nameOf(m)) + '</b></div>';
          card.addEventListener('click', () => studyOne(m.id));
          grid.appendChild(card);
        });
      });
    }
    el.view.textContent = ''; el.view.appendChild(grid);
    el.actions.className = 'actions row';
    el.actions.innerHTML = '<button class="act primary" type="button" id="goLearnBtn"><kbd>P</kbd><span class="txt">' + esc(t('studyThese')) + '</span></button>';
    if ($('goLearnBtn')) $('goLearnBtn').addEventListener('click', () => setMode('practice'));
    updateStats(); updateProgress();
  }

  function studyOne(id) {
    const m = BY_ID[id]; if (!m) return studyGrid();
    S.studyAt = id; clearPromptFeedback(); el.gridBar.hidden = true;
    const list = filteredGridList(pool()), idx = list.findIndex(x => x.id === id);
    el.pEyebrow.textContent = t('eyebrowDetail', { cat: catLabel(m.category), idx: (idx >= 0 ? idx : 0) + 1, n: list.length || 1 });
    el.pName.textContent = nameOf(m); el.pMeta.textContent = m.shortCode;
    el.view.textContent = ''; el.view.appendChild(createStagePlate(m, { quiz: false }));
    el.actions.className = 'actions row';
    el.actions.innerHTML = '<button class="act" type="button" id="prevCardBtn"><kbd>←</kbd><span class="txt">' + esc(t('prev')) + '</span></button>' +
      '<button class="act" type="button" id="backGridBtn"><kbd>Esc</kbd><span class="txt">' + esc(t('allList')) + '</span></button>' +
      '<button class="act primary" type="button" id="nextCardBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>→</kbd></button>';
    if ($('prevCardBtn')) $('prevCardBtn').addEventListener('click', () => stepStudy(-1));
    if ($('backGridBtn')) $('backGridBtn').addEventListener('click', studyGrid);
    if ($('nextCardBtn')) $('nextCardBtn').addEventListener('click', () => stepStudy(1));
  }

  function stepStudy(delta) { const list = filteredGridList(pool()); if (!list.length) return studyGrid(); const idx = list.findIndex(x => x.id === S.studyAt); studyOne(list[idx < 0 ? 0 : (idx + delta + list.length) % list.length].id); }

  function renderQuizQuestion(m) {
    S.current = m; S.answered = false; S.hintLevel = 0; clearPromptFeedback(); el.gridBar.hidden = true;
    const tgtTag = S.target === 'principle' ? t('tgtPrinciple') : t('tgtConcept');
    el.pEyebrow.textContent = (S.mode === 'test' ? t('eyebrowTest', { set: setLabel(S.set) }) + ' · ' + (S.deckIdx + 1) + '/' + S.deck.length : t('eyebrowLearn', { set: setLabel(S.set) }) + ' · ' + catLabel(S.category)) + ' · ' + tgtTag;
    if (S.target === 'principle') { el.pName.textContent = t('promptPrinciple', { name: nameOf(m) }); el.pMeta.textContent = m.shortCode; }
    else { el.pName.textContent = t('promptConcept'); el.pMeta.innerHTML = '&nbsp;'; }
    const wrap = createStagePlate(m, { quiz: true }); el.view.textContent = ''; el.view.appendChild(wrap); S._activeWrap = wrap;
    if (S.answer === 'choose') {
      S.opts = choices(m); el.actions.className = 'actions';
      el.actions.innerHTML = S.opts.map((opt, i) => '<button class="act" type="button" data-idx="' + i + '" data-id="' + esc(opt.id) + '"><kbd>' + (i + 1) + '</kbd><span class="txt">' + esc(S.target === 'principle' ? (opt.rule[LANG] || opt.rule.es) : nameOf(opt)) + '</span></button>').join('');
      el.actions.querySelectorAll('button.act').forEach(btn => btn.addEventListener('click', () => submitChoice(S.opts[Number(btn.getAttribute('data-idx'))], btn)));
    } else {
      S.opts = []; el.actions.className = 'actions row';
      el.actions.innerHTML = '<div class="typebox"><input id="typeIn" type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(S.target === 'principle' ? t('typePrinciplePh') : t('typeConceptPh')) + '"><button class="act primary" type="button" id="typeGo">' + esc(t('check')) + '</button><button class="act" type="button" id="hintBtn">' + esc(t('hint')) + '</button></div>';
      if ($('typeGo')) $('typeGo').addEventListener('click', submitTyping);
      if ($('hintBtn')) $('hintBtn').addEventListener('click', showHint);
      if ($('typeIn')) $('typeIn').addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); submitTyping(); } });
    }
    updateStats(); updateProgress();
  }

  function showHint() {
    if (!S.current || S.answered) return;
    S.hintLevel++;
    const m = S.current;
    const h = S.target === 'principle'
      ? (m.rule[LANG] || '').slice(0, 18) + '…'
      : (S.hintLevel === 1 ? m.shortCode : nameOf(m).replace(/[A-Za-zÀ-ÿ]/g, (ch, idx) => (idx % 2 === 0 ? ch : '·')));
    el.pMeta.innerHTML = esc(t('hintPrefix')) + ' <span class="letters">' + esc(h) + '</span>';
  }
  function submitChoice(chosen, clickedBtn) {
    if (!S.current || S.answered || !chosen) return;
    const right = S.target === 'principle' ? norm(chosen.rule[LANG]) === norm(S.current.rule[LANG]) : chosen.id === S.current.id;
    finalizeAnswer(right, S.target === 'principle' ? chosen.rule[LANG] : nameOf(chosen), clickedBtn);
  }
  function submitTyping() {
    if (!S.current || S.answered) return;
    const inp = $('typeIn'), raw = inp ? inp.value : '', res = checkAnswer(raw, S.current);
    if (res.status === 'empty') return;
    if (res.status === 'vague') { el.prompt.classList.remove('is-ok', 'is-bad'); el.prompt.classList.add('is-warn'); el.pEyebrow.textContent = t('warnEyebrow'); el.pMeta.textContent = res.msg; return; }
    finalizeAnswer(res.status === 'right', raw.trim(), null);
  }
  function finalizeAnswer(right, userAns, clickedBtn) {
    const m = S.current; S.answered = true; S.totalAnswered++; tone(right); flashStage(right);
    if (right) { S.okCount++; S.streak++; if (S.streak > S.bestStreak) S.bestStreak = S.streak; S.known[m.id] = true; writeSaved('known', S.known); }
    else { S.streak = 0; S.misses.push({ item: m, userAns: userAns || '–' }); }
    if (S.answer === 'choose') {
      el.actions.querySelectorAll('button.act[data-id]').forEach(b => {
        b.disabled = true; const opt = BY_ID[b.getAttribute('data-id')];
        if (opt && (S.target === 'principle' ? norm(opt.rule[LANG]) === norm(m.rule[LANG]) : opt.id === m.id)) b.classList.add('is-right');
        else if (clickedBtn && b === clickedBtn && !right) b.classList.add('is-wrong');
      });
    }
    const ansFull = S.target === 'principle' ? (m.rule[LANG] || m.rule.es) : nameOf(m);
    el.prompt.classList.remove('is-warn', 'is-ok', 'is-bad'); el.prompt.classList.add(right ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = right ? t('okEyebrow') : t('badEyebrow', { name: ansFull });
    el.pName.textContent = nameOf(m); el.pMeta.textContent = right ? (m.rule[LANG] || m.shortCode) : (userAns ? t('yourAnswer', { ans: userAns }) : m.rule[LANG]);
    if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal();
    if (S.mode === 'practice') {
      const card = S.queue.find(c => c.item.id === m.id) || { item: m, step: 0 }; S.queue = S.queue.filter(c => c.item.id !== m.id);
      if (right) { card.step++; S.queue.splice(Math.min(S.queue.length, card.step < 2 ? 4 + card.step * 2 : S.queue.length), 0, card); }
      else { card.step = 0; S.queue.splice(Math.min(S.queue.length, 2), 0, card); }
    }
    renderRail(); renderPanelMeta(); updateStats(); updateProgress();
    if (!$('nextBtn')) {
      if (S.answer === 'type') { el.actions.className = 'actions row'; el.actions.innerHTML = '<button class="act primary" type="button" id="nextBtn"><span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd></button>'; }
      else { const b = document.createElement('button'); b.type = 'button'; b.id = 'nextBtn'; b.className = 'act primary'; b.style.gridColumn = '1 / -1'; b.innerHTML = '<span class="txt">' + esc(t('next')) + '</span><kbd>Enter</kbd>'; el.actions.appendChild(b); }
      if ($('nextBtn')) $('nextBtn').addEventListener('click', nextQuestion);
    }
    if (S.mode === 'test') { if (S.autoNextId) clearTimeout(S.autoNextId); S.autoNextId = setTimeout(nextQuestion, 850); }
  }
  function nextQuestion() {
    if (S.autoNextId) { clearTimeout(S.autoNextId); S.autoNextId = null; }
    if (S.mode === 'test') { S.deckIdx++; if (S.deckIdx >= S.deck.length) return finishTest(); renderQuizQuestion(S.deck[S.deckIdx]); }
    else if (S.mode === 'practice') { if (!S.queue.length) S.queue = shuffle(pool()).map(item => ({ item, step: 0 })); const next = S.queue[0]; if (!next) return studyGrid(); renderQuizQuestion(next.item); }
  }
  function startTimer() { if (S.timerId) clearInterval(S.timerId); S.startTs = Date.now(); S.elapsedSec = 0; S.timerId = setInterval(() => { S.elapsedSec = Math.floor((Date.now() - S.startTs) / 1000); el.sTime.textContent = fmtTime(S.elapsedSec); }, 1000); }
  function startPractice(customItems) { clearTimers(); S.mode = 'practice'; writeSaved('mode', 'practice'); S.queue = shuffle(customItems && customItems.length ? customItems : pool()).map(item => ({ item, step: 0 })); S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = []; startTimer(); syncControls(); nextQuestion(); }
  function startTest() { clearTimers(); S.mode = 'test'; writeSaved('mode', 'test'); S.deck = shuffle(pool()); S.deckIdx = -1; S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = []; startTimer(); syncControls(); nextQuestion(); }
  function finishTest() {
    clearTimers(); S.current = null; S.answered = false; el.gridBar.hidden = true;
    const total = S.deck.length || 1, pct = Math.round((S.okCount / total) * 100);
    const scope = S.set + ':' + S.category + ':' + S.target, prev = S.best[scope];
    if (!prev || pct > prev.pct || (pct === prev.pct && S.elapsedSec < prev.time)) { S.best[scope] = { pct, time: S.elapsedSec }; writeSaved('best', S.best); }
    el.pBarWrap.classList.remove('is-off'); el.pBar.style.width = '100%';
    el.prompt.classList.remove('is-ok', 'is-bad', 'is-warn'); el.prompt.classList.add('is-review'); el.pEyebrow.textContent = t('eyebrowSummary');
    const missUnique = [], seen = new Set(); S.misses.forEach(e => { if (!seen.has(e.item.id)) { seen.add(e.item.id); missUnique.push(e); } });
    el.reviewPanel.hidden = false;
    el.reviewPanel.innerHTML = '<div class="res-main"><div class="res-score"><b>' + S.okCount + '</b><span>/' + total + '</span></div>' +
      '<div class="res-tiles"><div><b>' + pct + '%</b><span>' + esc(t('resAcc')) + '</span></div><div><b>' + fmtTime(S.elapsedSec) + '</b><span>' + esc(t('resTime')) + '</span></div><div><b>' + S.bestStreak + '</b><span>' + esc(t('resStreak')) + '</span></div></div></div>' +
      '<div class="res-actions"><button class="btn primary" type="button" id="resReplayBtn">' + esc(t('resPlayAgain')) + '</button>' + (missUnique.length ? '<button class="btn" type="button" id="resMissBtn">' + esc(t('resStudyMisses', { n: missUnique.length })) + '</button>' : '<button class="btn" type="button" id="resExploreBtn">' + esc(t('resExplore')) + '</button>') + '</div>' +
      '<div class="res-foot"><span class="key ok"><i></i><b>' + esc(t('resKeyOk', { n: S.okCount })) + '</b></span><span class="key bad"><i></i><b>' + esc(t('resKeyBad', { n: total - S.okCount })) + '</b></span><span class="rhint">' + esc(missUnique.length ? t('resClickMiss') : t('resPerfect')) + '</span></div>';
    if ($('resReplayBtn')) $('resReplayBtn').addEventListener('click', startTest);
    if ($('resMissBtn')) $('resMissBtn').addEventListener('click', () => startPractice(missUnique.map(x => x.item)));
    if ($('resExploreBtn')) $('resExploreBtn').addEventListener('click', () => setMode('study'));
    const sum = document.createElement('div'); sum.className = 'summary';
    if (missUnique.length) {
      sum.innerHTML = '<p class="note">' + esc(t('missTitle')) + '</p><div class="misses">' + missUnique.map(entry => '<button type="button" data-id="' + esc(entry.item.id) + '"><div class="thumb"><svg viewBox="0 0 540 210">' + drawBlueprintInner(entry.item, false) + '</svg></div><div class="lbl"><b>' + esc(nameOf(entry.item)) + '</b><small>' + esc(t('yourAnswer', { ans: entry.userAns })) + '</small></div></button>').join('') + '</div>';
      sum.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', () => { S.mode = 'study'; writeSaved('mode', 'study'); syncControls(); studyOne(btn.getAttribute('data-id')); }));
    } else sum.innerHTML = '<p class="note">' + esc(t('resPerfect')) + '</p>';
    el.view.textContent = ''; el.view.appendChild(sum); el.actions.className = 'actions row'; el.actions.innerHTML = ''; renderPanelMeta(); updateStats();
  }
  function setMode(m) { if (m === 'study' || m === 'practice' || m === 'test') { S.mode = m; writeSaved('mode', m); restart(); } }
  function setTarget(tgt) { if (tgt === 'concept' || tgt === 'principle') { S.target = tgt; writeSaved('target', tgt); syncControls(); if (S.mode !== 'study' && S.current && !S.answered) renderQuizQuestion(S.current); } }
  function restart() { clearTimers(); syncControls(); if (S.mode === 'study') { S.current = null; S.elapsedSec = 0; studyGrid(); } else if (S.mode === 'practice') startPractice(); else startTest(); }
  function applyStaticLabels() {
    document.documentElement.lang = LANG; document.title = t('docTitle');
    el.homeLink.setAttribute('aria-label', t('homeLabel')); el.homeLink.title = '← ' + t('homeLabel');
    el.toolMark.innerHTML = t('markHtml'); el.brandSub.textContent = t('brandSub');
    el.rail.setAttribute('aria-label', t('railLabel')); el.railTitle.textContent = t('railTitle');
    el.exploreSearch.placeholder = t('searchPlaceholder'); el.exploreSearch.setAttribute('aria-label', t('searchAria')); el.exploreClear.setAttribute('aria-label', t('clearSearch'));
    el.settingsBtn.textContent = t('settings'); el.cleanExit.textContent = t('cleanExit');
    el.lblAcc.textContent = t('lblAcc'); el.lblTime.textContent = t('lblTime'); el.lblStreak.textContent = t('lblStreak'); el.closeSheet.textContent = t('done');
    const lTag = el.lblLang.querySelector('label'); if (lTag) lTag.textContent = t('lblLang'); else el.lblLang.textContent = t('lblLang'); el.langSel.value = LANG;
    el.lblMode.textContent = t('lblMode'); const mb = el.modeSeg.querySelectorAll('button'); if (mb[0]) mb[0].textContent = t('modeStudy'); if (mb[1]) mb[1].textContent = t('modePractice'); if (mb[2]) mb[2].textContent = t('modeTest');
    el.lblSet.textContent = t('lblSet'); const sb = el.setSeg.querySelectorAll('button'); if (sb[0]) sb[0].textContent = t('setPopular'); if (sb[1]) sb[1].textContent = t('setAll');
    el.lblTarget.textContent = t('lblTarget'); const tb = el.targetSeg.querySelectorAll('button'); if (tb[0]) tb[0].textContent = t('tgtConcept'); if (tb[1]) tb[1].textContent = t('tgtPrinciple');
    el.lblAnswer.textContent = t('lblAnswer'); const ab = el.answerSeg.querySelectorAll('button'); if (ab[0]) ab[0].textContent = t('ansChoose'); if (ab[1]) ab[1].textContent = t('ansType');
    el.restartBtn.textContent = t('restart'); el.cleanBtn.textContent = t('cleanBtn'); el.soundBtn.textContent = S.sound ? t('soundYes') : t('soundNo');
    el.keysBtn.textContent = t('keysBtn'); el.howBtn.textContent = t('howBtn'); el.creditLine.textContent = t('creditLine');
    el.introTitle.textContent = t('introTitle'); el.intro1.innerHTML = t('intro1'); el.intro2.innerHTML = t('intro2'); el.intro3.innerHTML = t('intro3');
    el.keysTitle.textContent = t('keysTitle'); el.keysList.innerHTML = t('keys').map(p => '<li><kbd>' + esc(p[0]) + '</kbd> ' + esc(p[1]) + '</li>').join('');
  }
  function syncControls() {
    applyStaticLabels();
    el.modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.mode));
    el.setSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.set));
    el.targetSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.target));
    el.answerSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === S.answer));
    el.answerBox.classList.toggle('is-off', S.mode === 'study'); el.soundBtn.setAttribute('aria-pressed', S.sound);
    renderRail(); renderPanelMeta(); updateStats(); updateProgress();
  }
  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    LANG = next; writeSaved('lang', LANG); try { if (window.localStorage) window.localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    syncControls();
    if (S.mode === 'study') { if (S.studyAt) studyOne(S.studyAt); else studyGrid(); }
    else if (S.current && !S.answered) renderQuizQuestion(S.current);
    else if (S.current && S.answered) { if (S._activeWrap && S._activeWrap.reveal) S._activeWrap.reveal(); const nb = $('nextBtn'); if (nb && nb.querySelector('.txt')) nb.querySelector('.txt').textContent = t('next'); }
  }
  let helpBoxEl = null;
  function closeHelpBox() { if (helpBoxEl && helpBoxEl.parentNode) helpBoxEl.parentNode.removeChild(helpBoxEl); helpBoxEl = null; document.querySelectorAll('.help[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false')); }
  function openHelp(btn) {
    const info = t('help')[btn.getAttribute('data-help')]; if (!info) return;
    if (helpBoxEl && btn.getAttribute('aria-expanded') === 'true') { closeHelpBox(); return; }
    closeHelpBox(); btn.setAttribute('aria-expanded', 'true'); helpBoxEl = document.createElement('div'); helpBoxEl.className = 'helpbox'; helpBoxEl.innerHTML = '<b>' + esc(info[0]) + '</b><p>' + esc(info[1]) + '</p>';
    document.body.appendChild(helpBoxEl);
    if (btn.getBoundingClientRect) { const r = btn.getBoundingClientRect(); helpBoxEl.style.top = Math.min(window.innerHeight - 130, Math.max(12, r.bottom + 8)) + 'px'; helpBoxEl.style.left = Math.min(window.innerWidth - 320, Math.max(12, r.left - 20)) + 'px'; }
  }

  el.langSel.addEventListener('change', () => setLang(el.langSel.value));
  el.modeSeg.addEventListener('click', ev => { const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (b) setMode(b.dataset.v); });
  el.setSeg.addEventListener('click', ev => { const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (!b) return; S.set = b.dataset.v; writeSaved('set', S.set); restart(); });
  el.targetSeg.addEventListener('click', ev => { const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (b) setTarget(b.dataset.v); });
  el.answerSeg.addEventListener('click', ev => { const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null; if (!b) return; S.answer = b.dataset.v; writeSaved('answer', S.answer); if (S.mode !== 'study' && S.current && !S.answered) { syncControls(); renderQuizQuestion(S.current); } else syncControls(); });
  el.restartBtn.addEventListener('click', restart); el.cleanBtn.addEventListener('click', () => document.body.classList.add('clean')); el.cleanExit.addEventListener('click', () => document.body.classList.remove('clean'));
  el.settingsBtn.addEventListener('click', () => document.body.classList.add('sheet-open')); el.closeSheet.addEventListener('click', () => document.body.classList.remove('sheet-open'));
  el.soundBtn.addEventListener('click', () => { S.sound = !S.sound; writeSaved('sound', S.sound); syncControls(); });
  el.exploreSearch.addEventListener('input', () => { S.exploreQuery = el.exploreSearch.value || ''; if (S.mode === 'study' && !S.studyAt) studyGrid(); });
  el.exploreClear.addEventListener('click', () => { S.exploreQuery = ''; el.exploreSearch.value = ''; if (S.mode === 'study' && !S.studyAt) studyGrid(); });
  el.howBtn.addEventListener('click', () => { el.intro.hidden = false; }); el.introClose.addEventListener('click', () => { el.intro.hidden = true; }); el.intro.addEventListener('click', ev => { if (ev.target === el.intro) el.intro.hidden = true; });
  el.keysBtn.addEventListener('click', () => { el.keysModal.hidden = false; }); el.keysClose.addEventListener('click', () => { el.keysModal.hidden = true; }); el.keysModal.addEventListener('click', ev => { if (ev.target === el.keysModal) el.keysModal.hidden = true; });
  document.addEventListener('click', ev => { const hBtn = ev.target && ev.target.closest ? ev.target.closest('.help[data-help]') : null; if (hBtn) { ev.stopPropagation(); openHelp(hBtn); return; } if (helpBoxEl && !helpBoxEl.contains(ev.target)) closeHelpBox(); });
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { closeHelpBox(); if (!el.intro.hidden) { el.intro.hidden = true; return; } if (!el.keysModal.hidden) { el.keysModal.hidden = true; return; } if (document.body.classList.contains('sheet-open')) { document.body.classList.remove('sheet-open'); return; } if (document.body.classList.contains('clean')) { document.body.classList.remove('clean'); return; } if (S.mode === 'study' && S.studyAt) { studyGrid(); return; } }
    const active = document.activeElement; if (active && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA')) return;
    if (S.mode === 'study') { if (S.studyAt && ev.key === 'ArrowLeft') { ev.preventDefault(); stepStudy(-1); } else if (S.studyAt && ev.key === 'ArrowRight') { ev.preventDefault(); stepStudy(1); } else if (ev.key === 'p' || ev.key === 'P') { ev.preventDefault(); setMode('practice'); } return; }
    if (S.answered && (ev.key === 'Enter' || ev.key === 'ArrowRight' || ev.key === ' ')) { ev.preventDefault(); nextQuestion(); return; }
    if (!S.answered && S.answer === 'choose' && ev.key >= '1' && ev.key <= '4') { const idx = Number(ev.key) - 1, btn = el.actions.querySelector('button.act[data-idx="' + idx + '"]'); if (S.opts[idx] && btn) submitChoice(S.opts[idx], btn); }
    else if (!S.answered && S.answer === 'type' && (ev.key === 'h' || ev.key === 'H')) showHint();
  });

  window.PL = {
    norm, checkAnswer, setLang, setMode, setTarget, restart,
    studyGrid, studyOne, submitChoice, submitTyping, finishTest, choices, pool,
    getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
