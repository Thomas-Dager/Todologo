(() => {
  'use strict';

  const DATA = window.ART_DATA;
  if (!DATA) return;

  const ITEMS = DATA.MODELS.slice();
  const BY_ID = Object.create(null);
  ITEMS.forEach(m => { BY_ID[m.id] = m; });
  const CATEGORIES = DATA.CATEGORIES.slice();
  const CAT_BY_ID = Object.create(null);
  CATEGORIES.forEach(c => { CAT_BY_ID[c.id] = c; });

  const saved = window.SiteProgress ? window.SiteProgress.tool('art-movements') : null;
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
    if (typeof m.name === 'object') return m.name[l] || m.name.es || m.name.en || '';
    return m.name || '';
  }

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[&/+\-×"'“”‘’().,:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function artistNorm(m) {
    return norm(typeof m === 'string' ? m : m.artist);
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

  const ARTIST_ALIASES = {
    'leonardo da vinci': ['leonardo da vinci', 'leonardo', 'da vinci'],
    'miguel angel michelangelo': ['miguel angel', 'michelangelo', 'buonarroti', 'miguel angel buonarroti'],
    'sandro botticelli': ['sandro botticelli', 'botticelli'],
    'rafael sanzio': ['rafael sanzio', 'rafael', 'raphael', 'sanzio'],
    'el bosco hieronymus bosch': ['el bosco', 'hieronymus bosch', 'bosch', 'bosco'],
    'pieter brueghel el viejo': ['pieter brueghel el viejo', 'pieter brueghel', 'brueghel', 'bruegel', 'pieter bruegel'],
    'diego velazquez': ['diego velazquez', 'velazquez'],
    'rembrandt van rijn': ['rembrandt van rijn', 'rembrandt'],
    'johannes vermeer': ['johannes vermeer', 'jan vermeer', 'vermeer'],
    'caravaggio': ['caravaggio'],
    'artemisia gentileschi': ['artemisia gentileschi', 'gentileschi', 'artemisia'],
    'el greco': ['el greco', 'greco', 'domenikos theotokopoulos'],
    'peter paul rubens': ['peter paul rubens', 'rubens'],
    'francisco de goya': ['francisco de goya', 'francisco goya', 'goya'],
    'eugene delacroix': ['eugene delacroix', 'delacroix'],
    'caspar david friedrich': ['caspar david friedrich', 'friedrich'],
    'theodore gericault': ['theodore gericault', 'gericault'],
    'j m w turner': ['j m w turner', 'jmw turner', 'william turner', 'turner'],
    'katsushika hokusai': ['katsushika hokusai', 'hokusai'],
    'edouard manet': ['edouard manet', 'manet'],
    'jean francois millet': ['jean francois millet', 'millet'],
    'joaquin sorolla': ['joaquin sorolla', 'sorolla'],
    'ernesto de la carcova': ['ernesto de la carcova', 'de la carcova', 'carcova'],
    'prilidiano pueyrredon': ['prilidiano pueyrredon', 'pueyrredon'],
    'grant wood': ['grant wood', 'wood'],
    'claude monet': ['claude monet', 'monet'],
    'pierre auguste renoir': ['pierre auguste renoir', 'auguste renoir', 'renoir'],
    'edgar degas': ['edgar degas', 'degas'],
    'georges seurat': ['georges seurat', 'seurat'],
    'vincent van gogh': ['vincent van gogh', 'van gogh', 'gogh'],
    'paul cezanne': ['paul cezanne', 'cezanne'],
    'paul gauguin': ['paul gauguin', 'gauguin'],
    'gustav klimt': ['gustav klimt', 'klimt'],
    'edvard munch': ['edvard munch', 'munch'],
    'henri rousseau': ['henri rousseau', 'rousseau'],
    'vasili kandinski': ['vasili kandinski', 'wassily kandinsky', 'kandinski', 'kandinsky'],
    'piet mondrian': ['piet mondrian', 'mondrian'],
    'kazimir malevich': ['kazimir malevich', 'malevich'],
    'franz marc': ['franz marc', 'marc'],
    'amedeo modigliani': ['amedeo modigliani', 'modigliani'],
    'egon schiele': ['egon schiele', 'schiele'],
    'ernst ludwig kirchner': ['ernst ludwig kirchner', 'kirchner'],
    'paul klee': ['paul klee', 'klee'],
    'marc chagall': ['marc chagall', 'chagall'],
    'marcel duchamp': ['marcel duchamp', 'duchamp'],
    'henri de toulouse lautrec': ['henri de toulouse lautrec', 'toulouse lautrec', 'lautrec'],
    'candido lopez': ['candido lopez', 'lopez']
  };

  function makeArtworkIndex() {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();

    function add(m, raw) {
      const k = norm(raw);
      if (!k || k.length < 3) return;
      if (!exact.has(k)) exact.set(k, m);
      const sig = m.id + '|' + k;
      if (!seen.has(sig)) {
        seen.add(sig);
        candidates.push({ item: m, key: k });
      }
      const noArticle = k.replace(/^(la|el|las|los|un|una|the|a|an)\s+/, '').trim();
      if (noArticle && noArticle !== k && noArticle.length >= 4) {
        if (!exact.has(noArticle)) exact.set(noArticle, m);
        const sig2 = m.id + '|' + noArticle;
        if (!seen.has(sig2)) {
          seen.add(sig2);
          candidates.push({ item: m, key: noArticle });
        }
      }
    }

    ITEMS.forEach(m => {
      if (typeof m.name === 'object') {
        add(m, m.name.es);
        add(m, m.name.en);
        add(m, (m.name.es || '').replace(/\([^)]*\)/g, ' '));
        add(m, (m.name.en || '').replace(/\([^)]*\)/g, ' '));
      } else {
        add(m, m.name);
        add(m, String(m.name).replace(/\([^)]*\)/g, ' '));
      }
      (m.aka || []).forEach(a => add(m, a));
    });
    return { exact, candidates };
  }

  function makeArtistIndex() {
    const exact = new Map();
    const candidates = [];
    const seen = new Set();
    ITEMS.forEach(m => {
      const canonical = artistNorm(m);
      const list = [canonical, norm(m.artist.replace(/\([^)]*\)/g, ' ')), ...(ARTIST_ALIASES[canonical] || [])];
      list.forEach(raw => {
        const k = norm(raw);
        if (!k || k.length < 3) return;
        if (!exact.has(k)) exact.set(k, canonical);
        const sig = canonical + '|' + k;
        if (!seen.has(sig)) {
          seen.add(sig);
          candidates.push({ artistKey: canonical, key: k });
        }
      });
    });
    return { exact, candidates };
  }

  const ARTWORK_INDEX = makeArtworkIndex();
  const ARTIST_INDEX = makeArtistIndex();

  const VAGUE_ARTWORK = {
    'pintura': { es: 'Indica el título de la obra.', en: 'Enter the title of the painting.' },
    'cuadro': { es: 'Indica el título de la obra.', en: 'Enter the title of the painting.' },
    'obra': { es: 'Indica el título de la obra.', en: 'Enter the title of the painting.' },
    'painting': { es: 'Indica el título de la obra.', en: 'Enter the title of the painting.' },
    'autorretrato': { es: 'Indica la obra concreta de esta colección.', en: 'Specify the exact artwork in this collection.' }
  };

  function checkAnswer(raw, target) {
    const q = norm(raw);
    if (!q) return { status: 'empty' };

    if (S.target === 'artist') {
      const targetKey = artistNorm(target);
      const directArtist = ARTIST_INDEX.exact.get(q);
      if (directArtist) {
        return directArtist === targetKey
          ? { status: 'right', item: target }
          : { status: 'wrong', matchedArtist: directArtist };
      }
      if ((q === 'manet' || q === 'monet')) {
        return { status: 'wrong' };
      }
      let bestKey = null;
      let bestDist = 99;
      let targetDist = 99;
      for (let i = 0; i < ARTIST_INDEX.candidates.length; i++) {
        const c = ARTIST_INDEX.candidates[i];
        if ((c.key === 'manet' || c.key === 'monet') && q !== c.key) continue;
        const limit = c.key.length >= 9 ? 2 : (c.key.length >= 6 ? 1 : 0);
        if (!limit) continue;
        const d = editDist(q, c.key);
        if (d <= limit) {
          if (d < bestDist) { bestDist = d; bestKey = c.artistKey; }
          if (c.artistKey === targetKey && d < targetDist) { targetDist = d; }
        }
      }
      if (targetDist < 99 && targetDist <= bestDist) return { status: 'right', item: target };
      return { status: 'wrong' };
    }

    if (VAGUE_ARTWORK[q]) {
      return { status: 'vague', msg: VAGUE_ARTWORK[q][LANG] || VAGUE_ARTWORK[q].es };
    }

    const directWork = ARTWORK_INDEX.exact.get(q);
    if (directWork) {
      return directWork.id === target.id
        ? { status: 'right', item: target }
        : { status: 'wrong', matched: directWork };
    }

    if (ARTIST_INDEX.exact.has(q)) {
      return {
        status: 'vague',
        msg: LANG === 'en'
          ? 'That is the painter\'s name — enter the title of the artwork.'
          : 'Ese es el nombre del pintor — escribe el título de la obra.'
      };
    }

    let bestItem = null;
    let bestDist = 99;
    let targetDist = 99;
    for (let i = 0; i < ARTWORK_INDEX.candidates.length; i++) {
      const c = ARTWORK_INDEX.candidates[i];
      const limit = c.key.length >= 9 ? 2 : (c.key.length >= 6 ? 1 : 0);
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
      docTitle: 'Obras de Arte y Pintores — Todologo',
      homeLabel: 'Volver al menú de Todologo',
      markHtml: 'OBRAS <span>DE ARTE</span>',
      brandSub: 'Identifica 52 pinturas maestras, pintores y movimientos',
      railLabel: 'Movimientos',
      railTitle: 'Movimientos',
      allCats: 'Todos los movimientos',
      searchPlaceholder: 'Buscar obra, pintor, museo o año…',
      searchAria: 'Buscar obra de arte',
      clearSearch: 'Limpiar búsqueda',
      noMatches: 'Sin obras que coincidan con tu búsqueda.',
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
      lblSet: 'Obras',
      setPopular: 'Esenciales',
      setAll: 'Todas',
      lblTarget: 'Preguntar por',
      tgtArtwork: 'Obra',
      tgtArtist: 'Pintor',
      lblAnswer: 'Responder',
      ansChoose: 'Eligiendo',
      ansType: 'Escribiendo',
      restart: 'Reiniciar',
      cleanBtn: 'Vista limpia',
      soundYes: 'Sonido: Sí',
      soundNo: 'Sonido: No',
      keysBtn: 'Teclas',
      howBtn: 'Cómo funciona',
      creditLine: 'Obras en Dominio Público vía Wikimedia Commons / Google Art Project. Adaptado para Todologo.',
      introTitle: 'Aprende arte y movimientos',
      intro1: 'Observa el uso de la luz (claroscuro barroco, atmósfera romántica, pincelada impresionista) y el encuadre museográfico completo sin recortes.',
      intro2: 'Cambia entre <b>Obra</b> (adivinar el título) y <b>Pintor</b> (identificar al artista, agrupando pintores con varias obras).',
      intro3: 'En escritura puedes usar títulos en español o inglés y apellidos de pintores reconocidos.',
      keysTitle: 'Teclas',
      eyebrowExplore: '{set} · Explorar',
      eyebrowLearn: '{set} · Aprender',
      eyebrowTest: '{set} · Examen',
      eyebrowDetail: '{cat} · Obra {idx}/{n}',
      eyebrowSummary: 'Resultado del examen',
      promptArtwork: '¿Cómo se titula esta obra?',
      promptArtist: '¿Quién pintó esta obra?',
      countModels: '{n} obras',
      studyThese: 'Aprender estas',
      allList: 'Todas',
      prev: '← Anterior',
      next: 'Siguiente →',
      hint: 'Pista',
      check: 'Comprobar',
      typeWorkPh: 'Ej. La noche estrellada, Las meninas…',
      typeArtistPh: 'Ej. Van Gogh, Velázquez, Monet…',
      quizAlt: 'Pintura por identificar',
      okEyebrow: '¡Correcto!',
      badEyebrow: 'Era: {name}',
      warnEyebrow: 'Falta un detalle',
      specArtist: 'Artista',
      specYear: 'Año',
      specMedium: 'Técnica',
      specMuseum: 'Museo',
      specOrigin: 'Escuela / País',
      wikiLabel: 'Ver obra en Wikipedia',
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
      resClickMiss: 'Toca una obra fallada para estudiarla.',
      missTitle: 'Obras para repasar',
      yourAnswer: 'Tu respuesta: {ans}',
      hintPrefix: 'Pista:',
      help: {
        rail: ['Movimientos', 'Filtra entre Renacimiento y Barroco, Romanticismo y Realismo, Impresionismo y Vanguardias del siglo XX.'],
        mode: ['Modos', 'Explorar permite ver toda la galería en alta resolución; Aprender refuerza fallos; Examen cronometra el conjunto.'],
        target: ['Preguntar por', 'Elige si quieres que el cuestionario te pida el título de la obra o el nombre de su pintor.'],
        set: ['Obras', 'Esenciales selecciona las 29 piezas más universales; Todas abre las 52 pinturas.'],
        answer: ['Responder', 'Eligiendo muestra 4 opciones sin repetir artistas; Escribiendo evalúa títulos en español o inglés y apellidos.']
      },
      keys: [
        ['1 – 4', 'Elegir opción de respuesta'],
        ['H', 'Mostrar pista al escribir'],
        ['Enter / →', 'Siguiente obra tras responder'],
        ['← / →', 'Navegar obras en Explorar'],
        ['P', 'Pasar de Explorar a Aprender'],
        ['Esc', 'Volver a galería o cerrar modal']
      ]
    },
    en: {
      docTitle: 'Art Masterpieces & Painters — Todologo',
      homeLabel: 'Back to Todologo menu',
      markHtml: 'ART <span>GALLERY</span>',
      brandSub: 'Identify 52 masterpieces, painters & art movements',
      railLabel: 'Movements',
      railTitle: 'Movements',
      allCats: 'All movements',
      searchPlaceholder: 'Search painting, artist, museum or year…',
      searchAria: 'Search artwork',
      clearSearch: 'Clear search',
      noMatches: 'No paintings match your search.',
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
      lblSet: 'Works',
      setPopular: 'Core',
      setAll: 'All',
      lblTarget: 'Quiz target',
      tgtArtwork: 'Artwork',
      tgtArtist: 'Painter',
      lblAnswer: 'Answer',
      ansChoose: 'Multiple choice',
      ansType: 'Typing',
      restart: 'Restart',
      cleanBtn: 'Clean view',
      soundYes: 'Sound: On',
      soundNo: 'Sound: Off',
      keysBtn: 'Keys',
      howBtn: 'How it works',
      creditLine: 'Public domain artworks via Wikimedia Commons / Google Art Project. Adapted for Todologo.',
      introTitle: 'Learn art & movements',
      intro1: 'Read lighting and brushwork (Baroque chiaroscuro, Romantic atmosphere, Impressionist strokes) inside full uncropped museum framing.',
      intro2: 'Switch between <b>Artwork</b> (name the painting) and <b>Painter</b> (name the artist, with deduplicated painter choices).',
      intro3: 'Typing accepts both English and Spanish titles as well as well-known painter surnames.',
      keysTitle: 'Shortcuts',
      eyebrowExplore: '{set} · Explore',
      eyebrowLearn: '{set} · Learn',
      eyebrowTest: '{set} · Test',
      eyebrowDetail: '{cat} · Work {idx}/{n}',
      eyebrowSummary: 'Exam summary',
      promptArtwork: 'Name this painting',
      promptArtist: 'Who painted this?',
      countModels: '{n} works',
      studyThese: 'Learn these',
      allList: 'All',
      prev: '← Previous',
      next: 'Next →',
      hint: 'Hint',
      check: 'Check',
      typeWorkPh: 'e.g. The Starry Night, Las Meninas…',
      typeArtistPh: 'e.g. Van Gogh, Velázquez, Monet…',
      quizAlt: 'Painting to identify',
      okEyebrow: 'Correct!',
      badEyebrow: 'Answer: {name}',
      warnEyebrow: 'Need more detail',
      specArtist: 'Artist',
      specYear: 'Year',
      specMedium: 'Medium',
      specMuseum: 'Museum',
      specOrigin: 'Country / School',
      wikiLabel: 'Wikipedia entry',
      bestLabel: 'Best score ({scope}):',
      bestNone: 'No completed exam yet for this filter.',
      knowLabel: 'Mastered: {k}/{n}',
      resAcc: 'Accuracy',
      resTime: 'Time',
      resStreak: 'Best streak',
      resPlayAgain: 'Run again',
      resStudyMisses: 'Review {n} misses',
      resExplore: 'Back to gallery',
      resKeyOk: 'Correct: {n}',
      resKeyBad: 'Missed: {n}',
      resPerfect: 'Perfect score — zero misses!',
      resClickMiss: 'Click any missed work to study it.',
      missTitle: 'Paintings to review',
      yourAnswer: 'You answered: {ans}',
      hintPrefix: 'Hint:',
      help: {
        rail: ['Movements', 'Filter by Renaissance & Baroque, Romanticism & Realism, Impressionism & Post-Impressionism, or 20th-Century Avant-Garde.'],
        mode: ['Modes', 'Explore lets you inspect uncropped paintings; Learn drills missed works; Test runs a timed round.'],
        target: ['Quiz target', 'Choose whether quizzes ask for the artwork title or the painter\'s name.'],
        set: ['Deck size', 'Core highlights 29 canonical works; All includes all 52 paintings.'],
        answer: ['Answer style', 'Select from 4 unique options or type titles / artist names.']
      },
      keys: [
        ['1 – 4', 'Pick an option'],
        ['H', 'Show a typing hint'],
        ['Enter / →', 'Continue after answer'],
        ['← / →', 'Step works in Explore'],
        ['P', 'Jump from Explore to Learn'],
        ['Esc', 'Back to grid or close dialog']
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
    targetBox: $('targetBox'), lblTarget: $('lblTarget'), targetSeg: $('targetSeg'),
    answerBox: $('answerBox'), lblAnswer: $('lblAnswer'), answerSeg: $('answerSeg'),
    restartBtn: $('restartBtn'), cleanBtn: $('cleanBtn'), soundBtn: $('soundBtn'),
    best: $('best'), know: $('know'), keysBtn: $('keysBtn'), howBtn: $('howBtn'), creditLine: $('creditLine'),
    intro: $('intro'), introTitle: $('introTitle'), introClose: $('introClose'), intro1: $('intro1'), intro2: $('intro2'), intro3: $('intro3'),
    keysModal: $('keysModal'), keysTitle: $('keysTitle'), keysClose: $('keysClose'), keysList: $('keysList')
  };

  function flagUrl(iso3) { return iso3 ? '../flag-atlas/flags/' + iso3 + '.svg' : ''; }
  function countryName(iso3) {
    const dict = LANG === 'en' ? DATA.COUNTRIES_EN : DATA.COUNTRIES_ES;
    return (dict && dict[iso3]) || iso3 || '';
  }
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
    let list = ITEMS.filter(m => {
      if (useCat !== 'all' && m.category !== useCat) return false;
      if (useSet === 'popular' && !m.pop) return false;
      return true;
    });
    if (!list.length) list = ITEMS.filter(m => useCat === 'all' || m.category === useCat);
    return list;
  }

  function choices(target) {
    const out = [target];
    const byArtist = S.target === 'artist';
    const seenIds = new Set([target.id]);
    const seenArtists = new Set([artistNorm(target)]);

    function canUse(cand) {
      if (!cand || seenIds.has(cand.id)) return false;
      if (byArtist && seenArtists.has(artistNorm(cand))) return false;
      return true;
    }
    function take(cand) {
      seenIds.add(cand.id);
      seenArtists.add(artistNorm(cand));
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

  const S = {
    mode: readSaved('mode', 'study'),
    set: readSaved('set', 'all'),
    category: readSaved('category', 'all'),
    target: readSaved('target', 'artwork'),
    answer: readSaved('answer', 'choose'),
    sound: readSaved('sound', true),
    known: readSaved('known', {}) || {},
    best: readSaved('best', {}) || {},
    studyAt: null,
    exploreQuery: '',
    queue: [],
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
  if (S.target !== 'artwork' && S.target !== 'artist') S.target = 'artwork';
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
      osc.frequency.setValueAtTime(ok ? 520 : 205, now);
      if (ok) osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
      else osc.frequency.exponentialRampToValueAtTime(155, now + 0.14);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (ok ? 0.18 : 0.22));
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now); osc.stop(now + 0.24);
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
    const scope = S.set + ':' + S.category + ':' + S.target;
    const b = S.best[scope];
    if (b && typeof b.pct === 'number') {
      el.best.innerHTML = esc(t('bestLabel', { scope: catLabel(S.category) })) +
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
      '<span class="r-txt"><span>' + esc(t('allCats')) + '</span><span class="r-era">' + esc(t('countModels', { n: allItems.length })) + '</span></span>' +
      '<em' + (allKnown >= allItems.length && allItems.length ? ' class="done"' : '') + '>' + allKnown + '/' + allItems.length + '</em></button>';
    CATEGORIES.forEach(c => {
      const list = pool(c.id, S.set);
      const k = list.filter(m => S.known[m.id]).length;
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

  function attachPlateImg(plate, m, altText, isQuiz) {
    const img = document.createElement('img');
    img.src = m.photo;
    img.alt = altText;
    if (isQuiz) img.setAttribute('data-quiz', '1');
    img.addEventListener('load', () => img.classList.add('is-in'));
    img.addEventListener('error', () => img.classList.add('is-in'));
    plate.appendChild(img);
    if (img.complete) img.classList.add('is-in');
    return img;
  }

  function buildSpecsHtml(m) {
    const fUrl = flagUrl(m.country);
    const originVal = (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') + esc(countryName(m.country));
    const med = (m.medium && (m.medium[LANG] || m.medium.es)) || '';
    const fact = (m.fact && (m.fact[LANG] || m.fact.es)) || '';
    return '<div class="facts">' +
      '<span><b>' + esc(t('specOrigin')) + ':</b> ' + originVal + '</span>' +
      '<span><b>' + esc(t('specArtist')) + ':</b> ' + esc(m.artist) + '</span>' +
      '<span><b>' + esc(t('specYear')) + ':</b> ' + esc(m.year) + '</span>' +
      '<span><b>' + esc(t('specMedium')) + ':</b> ' + esc(med) + '</span>' +
      '<span><b>' + esc(t('specMuseum')) + ':</b> ' + esc(m.museum) + '</span>' +
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
    plate.className = 'plate';
    const img = attachPlateImg(plate, m, quiz ? t('quizAlt') : nameOf(m), quiz);
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
        img.alt = nameOf(m) + ' — ' + m.artist;
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
        nameOf(m, 'es'), nameOf(m, 'en'), m.artist, m.year, m.museum,
        m.medium && m.medium.es, m.medium && m.medium.en,
        DATA.COUNTRIES_ES[m.country], DATA.COUNTRIES_EN[m.country],
        cat && cat.es, cat && cat.en, (m.aka || []).join(' ')
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
              '<img src="' + esc(m.photo) + '" alt="' + esc(nameOf(m)) + '" loading="lazy">' +
              '<span class="year-tag">' + esc(m.year) + '</span>' +
            '</div>' +
            '<div class="lbl">' +
              (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') +
              '<b>' + esc(nameOf(m)) + '</b>' +
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
    el.pEyebrow.textContent = t('eyebrowDetail', { cat: catLabel(m.category), idx: (idx >= 0 ? idx : 0) + 1, n: list.length || 1 });
    const fUrl = flagUrl(m.country);
    el.pName.innerHTML = (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') + esc(nameOf(m));
    el.pMeta.textContent = m.artist + ' · ' + m.year;

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

    const tgtTag = S.target === 'artist' ? t('tgtArtist') : t('tgtArtwork');
    el.pEyebrow.textContent = (S.mode === 'test'
      ? t('eyebrowTest', { set: setLabel(S.set) }) + ' · ' + (S.deckIdx + 1) + '/' + S.deck.length
      : t('eyebrowLearn', { set: setLabel(S.set) }) + ' · ' + catLabel(S.category)) + ' · ' + tgtTag;
    el.pName.textContent = S.target === 'artist' ? t('promptArtist') : t('promptArtwork');
    el.pMeta.innerHTML = '&nbsp;';

    const wrap = createStagePlate(m, { quiz: true });
    el.view.textContent = '';
    el.view.appendChild(wrap);
    S._activeWrap = wrap;

    if (S.answer === 'choose') {
      S.opts = choices(m);
      el.actions.className = 'actions';
      el.actions.innerHTML = S.opts.map((opt, i) => {
        const label = S.target === 'artist' ? opt.artist : nameOf(opt);
        return '<button class="act" type="button" data-idx="' + i + '" data-id="' + esc(opt.id) + '">' +
          '<kbd>' + (i + 1) + '</kbd><span class="txt">' + esc(label) + '</span>' +
        '</button>';
      }).join('');
      el.actions.querySelectorAll('button.act').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.getAttribute('data-idx'));
          submitChoice(S.opts[i], btn);
        });
      });
    } else {
      S.opts = [];
      const ph = S.target === 'artist' ? t('typeArtistPh') : t('typeWorkPh');
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
    updateStats();
    updateProgress();
  }

  function showHint() {
    if (!S.current || S.answered) return;
    S.hintLevel++;
    const m = S.current;
    const targetText = S.target === 'artist' ? m.artist : nameOf(m);
    const words = targetText.split(/\s+/);
    let hintStr = '';
    if (S.hintLevel === 1) {
      hintStr = words[0].slice(0, Math.min(3, words[0].length)) + '… (' + m.year + ')';
    } else {
      hintStr = targetText.replace(/[A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/g, (ch, idx) => (idx % 2 === 0 ? ch : '·'));
    }
    el.pMeta.innerHTML = esc(t('hintPrefix')) + ' <span class="letters">' + esc(hintStr) + '</span>';
  }

  function submitChoice(chosen, clickedBtn) {
    if (!S.current || S.answered || !chosen) return;
    const right = S.target === 'artist'
      ? artistNorm(chosen) === artistNorm(S.current)
      : chosen.id === S.current.id;
    const ansLabel = S.target === 'artist' ? chosen.artist : nameOf(chosen);
    finalizeAnswer(right, ansLabel, clickedBtn);
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
        const opt = BY_ID[b.getAttribute('data-id')];
        const isTargetBtn = opt && (S.target === 'artist' ? artistNorm(opt) === artistNorm(m) : opt.id === m.id);
        if (isTargetBtn) b.classList.add('is-right');
        else if (clickedBtn && b === clickedBtn && !right) b.classList.add('is-wrong');
      });
    }

    const answerFull = S.target === 'artist' ? m.artist : nameOf(m);
    el.prompt.classList.remove('is-warn', 'is-ok', 'is-bad');
    el.prompt.classList.add(right ? 'is-ok' : 'is-bad');
    el.pEyebrow.textContent = right ? t('okEyebrow') : t('badEyebrow', { name: answerFull });
    const fUrl = flagUrl(m.country);
    el.pName.innerHTML = (fUrl ? '<img class="flag" src="' + esc(fUrl) + '" alt="">' : '') + esc(nameOf(m));
    el.pMeta.textContent = right
      ? (m.artist + ' · ' + m.year)
      : (userAns ? t('yourAnswer', { ans: userAns }) : m.artist + ' · ' + m.year);

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
    S.mode = 'practice';
    writeSaved('mode', 'practice');
    const items = customItems && customItems.length ? customItems : pool();
    S.queue = shuffle(items).map(item => ({ item, step: 0 }));
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
    startTimer();
    syncControls();
    nextQuestion();
  }

  function startTest() {
    clearTimers();
    S.mode = 'test';
    writeSaved('mode', 'test');
    S.deck = shuffle(pool());
    S.deckIdx = -1;
    S.okCount = 0; S.totalAnswered = 0; S.streak = 0; S.bestStreak = 0; S.misses = [];
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
    const scope = S.set + ':' + S.category + ':' + S.target;
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
    S.misses.forEach(entry => {
      if (!seen.has(entry.item.id)) { seen.add(entry.item.id); missUnique.push(entry); }
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
            '<div class="thumb"><img src="' + esc(m.photo) + '" alt="' + esc(nameOf(m)) + '"></div>' +
            '<div class="lbl"><b>' + esc(nameOf(m)) + '</b><small>' + esc(m.artist) + ' · ' + esc(t('yourAnswer', { ans: entry.userAns })) + '</small></div>' +
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

  function setTarget(tgt) {
    if (tgt !== 'artwork' && tgt !== 'artist') return;
    S.target = tgt;
    writeSaved('target', tgt);
    syncControls();
    if (S.mode !== 'study' && S.current && !S.answered) {
      renderQuizQuestion(S.current);
    }
  }

  function restart() {
    clearTimers();
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
    if (tgtBtns[0]) tgtBtns[0].textContent = t('tgtArtwork');
    if (tgtBtns[1]) tgtBtns[1].textContent = t('tgtArtist');
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
    S.set = b.dataset.v;
    writeSaved('set', S.set);
    restart();
  });
  el.targetSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (b) setTarget(b.dataset.v);
  });
  el.answerSeg.addEventListener('click', ev => {
    const b = ev.target && ev.target.closest ? ev.target.closest('button[data-v]') : null;
    if (!b) return;
    S.answer = b.dataset.v;
    writeSaved('answer', S.answer);
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

  window.ART = {
    norm, artistNorm, nameOf, checkAnswer, setLang, setMode, setTarget, restart,
    studyGrid, studyOne, submitChoice, submitTyping, finishTest, choices, pool,
    getState: () => S, ITEMS, CATEGORIES
  };

  restart();
})();
