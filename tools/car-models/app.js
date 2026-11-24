/* Modelos Icónicos de Autos (T031) — Todologo
 * 48 automóviles legendarios (32 imprescindibles / 48 totales) en 6 épocas históricas.
 * Modos: Explorar, Aprender (Eligiendo / Escribiendo con repetición espaciada) y Examen.
 */
(function () {
  'use strict';

  var DATA = window.CAR_MODELS_DATA;
  if (!DATA) return;

  var CATEGORIES = DATA.CATEGORIES;
  var LOOKALIKES = DATA.LOOKALIKES;
  var MODELS = DATA.MODELS;

  var $ = function (id) { return document.getElementById(id); };
  var saved = window.SiteProgress
    ? window.SiteProgress.tool('car-models')
    : {
        get: function (k, d) {
          try { var v = localStorage.getItem('todologo.car-models.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
        },
        set: function (k, v) {
          try { localStorage.setItem('todologo.car-models.' + k, JSON.stringify(v)); } catch (e) {}
        }
      };

  var UI = {
    es: {
      page_title: 'Modelos de Autos',
      mark_a: 'MODELOS',
      mark_b: 'DE AUTOS',
      sub: 'Aprende {n} modelos por diseño, historia e identidad',
      home_aria: 'Volver al menú de Todologo',
      groups_aria: 'Colecciones de autos',
      groups_title: 'Colecciones',
      all_eras: 'Todas las colecciones',
      set: 'Modelos',
      'set.popular': 'Imprescindibles',
      'set.all': 'Todos',
      answer: 'Responder',
      answer_choose: 'Eligiendo',
      answer_type: 'Escribiendo',
      how: 'Cómo funciona',
      credit: 'Fotografías vía Wikimedia Commons · Banderas y emblemas integrados de Todologo.',
      intro_title: 'Aprende 220 modelos de autos',
      intro_1: '<b>{n} modelos</b> organizados en 4 grandes bloques: <b>Clásicos 50s–90s</b>, <b>Clásicos de Argentina y LATAM</b>, <b>Modernos, SUVs y Pick-ups</b> y <b>Deportivos, EVs y Superautos</b>. Empieza con los <b>{p} imprescindibles</b> o desbloquea los {n}.',
      intro_2: 'En <b>Aprender</b> responde eligiendo entre rivales parecidos o escribiendo el nombre/apodo (ej. «300 SL», «F40», «Fitito», «Torino», «Cybertruck»); los fallos vuelven pronto hasta fijarlos.',
      intro_3: 'Atajos de teclado: 1–4 para elegir, Espacio o Enter para avanzar, P para pasar de Explorar a Aprender.',
      which_model: '¿Qué modelo es este?',
      type_meta: 'Escribe la marca o modelo clave (ej. 300 SL, F40, Miura) · Enter para comprobar',
      pick_meta: 'Elige entre 4 opciones · teclas 1–4',
      type_ph: 'Escribe el modelo (ej. Ferrari F40, 300 SL…)',
      type_aria: 'Nombre del modelo de auto',
      check: 'Comprobar',
      hint: 'Pista',
      skip: 'Saltar',
      show_answer: 'Ver respuesta',
      next: 'Siguiente',
      key_space: 'Espacio',
      again: 'Repaso',
      correct: 'Correcto',
      correct_spelled: 'Correcto · {name}',
      correct_hinted: 'Correcto (con pista)',
      you_said: 'Marcaste {name}',
      you_said_short: 'Dijiste {name}',
      not_a_model: '«{text}» no coincide',
      not_quite: 'Casi',
      the_answer: 'La respuesta',
      to_come_back: '{n} para repasar',
      which_one: '¿Qué {word}?',
      be_specific: 'Sé más específico',
      test_was: 'Era',
      skipped: 'Saltada',
      nothing_missed: 'No fallaste ningún modelo.',
      missed_below: 'Pulsa cualquier tarjeta para estudiarlo o repasa tus fallos.',
      all_models: 'Todos los modelos',
      prev_model: 'Anterior',
      next_model: 'Siguiente',
      learn_these: 'Aprender estos',
      nothing_here: 'No hay modelos en este filtro.',
      n_models: { one: '{n} modelo', other: '{n} modelos' },
      n_of: '{i} de {n}',
      spec_year: 'Año',
      spec_engine: 'Motor',
      spec_power: 'Potencia',
      spec_speed: 'Vel. máx.',
      spec_designer: 'Diseño',
      photo_alt: 'Fotografía de {name}',
      photo_alt_quiz: 'Automóvil para identificar',
      commons: 'Wikimedia Commons',
      photo_credit_quiz: 'Fotografía archivada · haz tu elección para revelar detalles',
      photo_credit_open: 'Fotografía vía {src}',
      best_test: 'Mejor examen: <b>{score}/{total}</b> · {time}',
      no_test: 'Sin examen completado todavía.',
      search_ph: 'Buscar modelo, marca, año o apodo (ej. Fitito, F40, Falcon)…',
      search_aria: 'Buscar modelo de auto',
      search_clear: 'Limpiar búsqueda',
      search_empty: 'No se encontraron modelos para «{q}».',
      search_count: '{n} visibles',
      rail_help: 'Filtra entre las 4 grandes colecciones: Clásicos 50s–90s, Clásicos de Argentina y LATAM, Modernos/SUVs/Pick-ups y Deportivos/EVs/Superautos.',
      'mode_hint.study': 'Explora los {n} coches con buscador instantáneo, ficha técnica y rasgos visuales.',
      'mode_hint.practice': 'Repetición espaciada sobre los {n} modelos: los fallos vuelven pronto.',
      'mode_hint.test': 'Recorrido cronometrado por los {n} modelos sin pistas.',
      'set_hint.popular': 'Los {n} modelos más representativos e icónicos de todas las épocas.',
      'set_hint.all': 'La enciclopedia completa de {n} modelos.',
      'answer_hint.choose': '4 opciones seleccionadas entre coches de estilo o época similar.',
      'answer_hint.type': 'Escribe tú el modelo; acepta apodos famosos («Gullwing», «F40», «R34») y tolera pequeños errores al teclear.',
      keys_study: '<kbd>←</kbd> <kbd>→</kbd> navegar · <kbd>Esc</kbd> volver · <kbd>P</kbd> aprender',
      keys_choose: '<kbd>1</kbd>–<kbd>4</kbd> elegir · <kbd>Espacio</kbd> / <kbd>Enter</kbd> siguiente',
      keys_type: '<kbd>Enter</kbd> comprobar o avanzar',
      shell: {
        acc: 'Acierto',
        time: 'Tiempo',
        streak: 'Racha',
        done: 'Listo',
        lang_title: 'Idioma',
        mode: 'Modo',
        mode_study: 'Explorar',
        mode_practice: 'Aprender',
        mode_test: 'Examen',
        restart: 'Reiniciar',
        clean: 'Vista limpia',
        exit_clean: 'Salir de vista limpia',
        settings: 'Ajustes',
        sound_title: 'Sonido',
        keys: 'Teclas',
        best_badge: '¡Nuevo récord!',
        test_complete: 'Examen completado',
        again: 'Repetir examen',
        misses: 'Repasar fallos',
        know: 'Dominados: {n} / {m}'
      }
    },
    en: {
      page_title: 'Car Models',
      mark_a: 'CAR',
      mark_b: 'MODELS',
      sub: 'Learn {n} car models by design, history & spotting cues',
      home_aria: 'Back to Todologo menu',
      groups_aria: 'Car collections',
      groups_title: 'Collections',
      all_eras: 'All collections',
      set: 'Models',
      'set.popular': 'Essentials',
      'set.all': 'All',
      answer: 'Answer by',
      answer_choose: 'Choosing',
      answer_type: 'Typing',
      how: 'How it works',
      credit: 'Photos via Wikimedia Commons · Flags and brand badges from Todologo.',
      intro_title: 'Learn 220 car models',
      intro_1: '<b>{n} models</b> organized into 4 collections: <b>Classic Icons (50s–90s)</b>, <b>Argentina & LATAM Classics</b>, <b>Modern Cars, SUVs & Pick-ups</b>, and <b>Modern Sports, EVs & Supercars</b>. Start with <b>{p} essentials</b> or unlock all {n}.',
      intro_2: 'In <b>Learn</b> mode, choose between similar-looking cars or type the model/nickname (e.g. "300 SL", "F40", "Fitito", "Torino", "Cybertruck"); misses return soon via spaced repetition.',
      intro_3: 'Shortcuts: 1–4 to pick, Space/Enter to advance, P to jump from Explore to Learn.',
      which_model: 'Which car model is this?',
      type_meta: 'Type the car name (e.g. 300 SL, F40, Miura) · Enter to check',
      pick_meta: 'Pick from 4 choices · keys 1–4',
      type_ph: 'Type the model (e.g. Ferrari F40, 300 SL…)',
      type_aria: 'Car model name',
      check: 'Check',
      hint: 'Hint',
      skip: 'Skip',
      show_answer: 'Show answer',
      next: 'Next',
      key_space: 'Space',
      again: 'Review',
      correct: 'Correct',
      correct_spelled: 'Correct · {name}',
      correct_hinted: 'Correct (with hint)',
      you_said: 'You picked {name}',
      you_said_short: 'You said {name}',
      not_a_model: '"{text}" did not match',
      not_quite: 'Not quite',
      the_answer: 'The answer',
      to_come_back: '{n} coming back',
      which_one: 'Which {word}?',
      be_specific: 'Be more specific',
      test_was: 'It was',
      skipped: 'Skipped',
      nothing_missed: 'Clean sweep — zero misses.',
      missed_below: 'Tap any missed car to inspect its specs or drill your misses.',
      all_models: 'All models',
      prev_model: 'Previous',
      next_model: 'Next',
      learn_these: 'Learn these',
      nothing_here: 'No models in this filter.',
      n_models: { one: '{n} model', other: '{n} models' },
      n_of: '{i} of {n}',
      spec_year: 'Year',
      spec_engine: 'Engine',
      spec_power: 'Power',
      spec_speed: 'Top speed',
      spec_designer: 'Design',
      photo_alt: 'Photograph of {name}',
      photo_alt_quiz: 'Car to identify',
      commons: 'Wikimedia Commons',
      photo_credit_quiz: 'Gallery photo · answer to reveal full specs and history',
      photo_credit_open: 'Article & specs on {src}',
      best_test: 'Best test: <b>{score}/{total}</b> · {time}',
      no_test: 'No test completed yet.',
      search_ph: 'Search model, brand, year or nickname (e.g. 300 SL, Falcon, F40)…',
      search_aria: 'Search car model',
      search_clear: 'Clear search',
      search_empty: 'No models matched "{q}".',
      search_count: '{n} shown',
      rail_help: 'Browse all 4 collections or focus on Classics (50s–90s), Argentina & LATAM, Modern SUVs/Pick-ups, or Sports & EVs.',
      'mode_hint.study': 'Browse all {n} cars with instant search, technical specs, and spotting cues.',
      'mode_hint.practice': 'Spaced repetition across {n} models — missed cars return until mastered.',
      'mode_hint.test': 'Timed run through all {n} cars with no hints.',
      'set_hint.popular': 'The {n} most iconic cars across every era.',
      'set_hint.all': 'The complete collection of {n} models.',
      'answer_hint.choose': '4 choices biased toward cars from the same era or visual lookalikes.',
      'answer_hint.type': 'Type the car name; accepts famous aliases ("Gullwing", "F40", "R34") and forgives small typos.',
      keys_study: '<kbd>←</kbd> <kbd>→</kbd> step · <kbd>Esc</kbd> back · <kbd>P</kbd> learn',
      keys_choose: '<kbd>1</kbd>–<kbd>4</kbd> choose · <kbd>Space</kbd> / <kbd>Enter</kbd> next',
      keys_type: '<kbd>Enter</kbd> submit or advance',
      shell: {
        acc: 'Accuracy',
        time: 'Time',
        streak: 'Streak',
        done: 'Done',
        lang_title: 'Language',
        mode: 'Mode',
        mode_study: 'Explore',
        mode_practice: 'Learn',
        mode_test: 'Test',
        restart: 'Restart',
        clean: 'Clean view',
        exit_clean: 'Exit clean view',
        settings: 'Settings',
        sound_title: 'Sound',
        keys: 'Keys',
        best_badge: 'New best!',
        test_complete: 'Test complete',
        again: 'Test again',
        misses: 'Learn misses',
        know: 'Mastered: {n} / {m}'
      }
    }
  };

  var LANG = 'es';
  (function initLang() {
    var pick = null;
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'es' || q === 'en') pick = q;
    } catch (e) {}
    try {
      if (!pick) {
        var g = localStorage.getItem('todologo.lang');
        if (g === 'es' || g === 'en') pick = g;
      }
    } catch (e) {}
    if (!pick) {
      var s = saved.get('lang', null);
      if (s === 'es' || s === 'en') pick = s;
    }
    LANG = pick || 'es';
    try { localStorage.setItem('todologo.lang', LANG); } catch (e) {}
    document.documentElement.lang = LANG;
  })();

  function t(key, vars) {
    var dict = UI[LANG] || UI.es;
    var val;
    if (key.indexOf('shell.') === 0) val = dict.shell[key.slice(6)];
    else val = dict[key];
    if (val === undefined) {
      val = key.indexOf('shell.') === 0 ? UI.en.shell[key.slice(6)] : UI.en[key];
    }
    if (val === undefined) val = key;
    if (val && typeof val === 'object' && ('one' in val || 'other' in val)) {
      var n = vars && vars.n != null ? Number(vars.n) : 2;
      val = n === 1 ? val.one : val.other;
    }
    if (vars) {
      val = String(val).replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
    }
    return String(val);
  }

  /* ---------------- sound synthesizer ---------------- */
  var soundOn = saved.get('sound', true) !== false;
  var audioCtx = null;
  function play(kind, streak) {
    if (!soundOn) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      osc.connect(g);
      g.connect(audioCtx.destination);
      if (kind === 'correct' || kind === 'close') {
        var base = 520 + Math.min(8, streak || 0) * 28;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.exponentialRampToValueAtTime(base * (kind === 'close' ? 1.18 : 1.32), now + 0.09);
        g.gain.setValueAtTime(0.08, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now); osc.stop(now + 0.15);
      } else if (kind === 'wrong' || kind === 'skip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        g.gain.setValueAtTime(0.08, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        osc.start(now); osc.stop(now + 0.18);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        g.gain.setValueAtTime(0.05, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.09);
      }
    } catch (e) {}
  }

  /* ---------------- DOM helpers ---------------- */
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'text') el.textContent = String(v);
        else if (k === 'html') el.innerHTML = String(v);
        else if (k === 'onclick') el.addEventListener('click', v);
        else el.setAttribute(k, v === true ? '' : String(v));
      });
    }
    if (kids) {
      (Array.isArray(kids) ? kids : [kids]).forEach(function (k) {
        if (k != null && k !== false) el.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
      });
    }
    return el;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function clock(s) {
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  var byId = new Map(MODELS.map(function (m) { return [m.id, m]; }));
  var catById = new Map(CATEGORIES.map(function (c) { return [c.id, c]; }));

  /* ---------------- fuzzy answer matching & disambiguation ---------------- */
  function norm(s) {
    return String(s || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ß/g, 'ss')
      .replace(/ø/g, 'o')
      .replace(/æ/g, 'ae')
      .replace(/ł/g, 'l')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '');
  }

  function buildVagueGroups(models) {
    var groups = {};
    function addGroup(key, ids) {
      if (ids && ids.length > 1) groups[key] = ids;
    }
    var byBrand = {};
    models.forEach(function (m) {
      if (!byBrand[m.brand]) byBrand[m.brand] = [];
      byBrand[m.brand].push(m.id);
    });
    Object.keys(byBrand).forEach(function (b) { addGroup(b, byBrand[b]); });
    addGroup('Mercedes', byBrand['Mercedes-Benz']);
    addGroup('VW', byBrand['Volkswagen']);
    addGroup('Alfa', byBrand['Alfa Romeo']);
    addGroup('Aston', byBrand['Aston Martin']);
    var families = [
      [['Ford Mustang', 'Mustang'], ['ford-mustang-1965', 'ford-mustang-modern']],
      [['Chevrolet Camaro', 'Camaro'], ['chevrolet-camaro-1969', 'chevrolet-camaro-6g']],
      [['Chevrolet Corvette', 'Corvette'], ['chevrolet-corvette-c2', 'chevrolet-corvette-c8']],
      [['Porsche 911', '911'], ['porsche-911-rs', 'porsche-911-992']],
      [['Volkswagen Golf', 'Golf', 'Golf GTI'], ['vw-golf-gti-classic', 'vw-golf-modern', 'vw-golf-r']],
      [['Volkswagen Gol', 'Gol', 'VW Gol'], ['vw-gol-g1', 'vw-gol-g2-g4']],
      [['Volkswagen Beetle', 'Beetle', 'Escarabajo'], ['vw-beetle-classic', 'vw-beetle-modern']],
      [['Toyota Corolla', 'Corolla'], ['toyota-corolla-90s', 'toyota-corolla-modern']],
      [['Honda Civic', 'Civic'], ['honda-civic-90s', 'honda-civic-modern', 'honda-civic-type-r']],
      [['Mini Cooper', 'Mini'], ['mini-cooper-classic', 'mini-cooper-modern']],
      [['Fiat 500', '500'], ['fiat-500-classic', 'fiat-500-modern']],
      [['Toyota Supra', 'Supra'], ['toyota-supra-mk4', 'toyota-gr-supra-a90']],
      [['BMW Serie 3', 'Serie 3', 'BMW 3 Series'], ['bmw-3-e36-e46', 'bmw-3-g20']],
      [['Audi A3', 'A3'], ['audi-a3-8l', 'audi-a3-a4-modern']],
      [['Nissan GT-R', 'GT-R', 'GTR', 'Skyline'], ['nissan-skyline-r34', 'nissan-gtr-r35']],
      [['Peugeot 205', '205'], ['peugeot-205-t16', 'peugeot-205-gti']]
    ];
    families.forEach(function (pair) {
      var ids = pair[1].filter(function (id) { return byId.has(id); });
      pair[0].forEach(function (k) { addGroup(k, ids); });
    });
    return groups;
  }
  var VAGUE_GROUPS = buildVagueGroups(MODELS);

  function distance(a, b, max) {
    if (max == null) max = 3;
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var d = Array.from({ length: a.length + 1 }, function (_, i) { return [i]; });
    for (var j = 1; j <= b.length; j++) d[0][j] = j;
    for (var i = 1; i <= a.length; i++) {
      var best = Infinity;
      for (var jj = 1; jj <= b.length; jj++) {
        var cost = a[i - 1] === b[jj - 1] ? 0 : 1;
        d[i][jj] = Math.min(d[i - 1][jj] + 1, d[i][jj - 1] + 1, d[i - 1][jj - 1] + cost);
        if (i > 1 && jj > 1 && a[i - 1] === b[jj - 2] && a[i - 2] === b[jj - 1]) {
          d[i][jj] = Math.min(d[i][jj], d[i - 2][jj - 2] + 1);
        }
        best = Math.min(best, d[i][jj]);
      }
      if (best > max) return max + 1;
    }
    return d[a.length][b.length];
  }
  function slack(n) { return n <= 4 ? 0 : n <= 8 ? 1 : 2; }

  function makeIndex(models) {
    var exact = new Map();
    var shown = new Map();
    models.forEach(function (m) {
      [m.name].concat(m.aka || []).forEach(function (n) {
        var k = norm(n);
        if (!k) return;
        if (!exact.has(k)) exact.set(k, m.id);
        if (!shown.has(k)) shown.set(k, n);
      });
    });
    var vague = new Map();
    Object.keys(VAGUE_GROUPS).forEach(function (k) {
      if (VAGUE_GROUPS[k].length > 1) vague.set(norm(k), VAGUE_GROUPS[k]);
    });
    return { exact: exact, shown: shown, vague: vague, names: Array.from(exact.keys()) };
  }

  function check(text, answerId, idx) {
    var k = norm(text);
    if (!k) return { verdict: 'wrong' };
    var vList = idx.vague.get(k);
    if (vList && vList.indexOf(answerId) >= 0 && idx.exact.get(k) !== answerId) {
      return { verdict: 'vague', ids: vList };
    }
    var hit = idx.exact.get(k);
    if (hit) return hit === answerId ? { verdict: 'right' } : { verdict: 'other', id: hit };
    var best = null, bestD = Infinity, tie = false;
    idx.names.forEach(function (nm) {
      var allow = slack(Math.min(nm.length, k.length));
      if (!allow) return;
      var dd = distance(k, nm, allow);
      if (dd > allow) return;
      if (dd < bestD) { best = nm; bestD = dd; tie = false; }
      else if (dd === bestD && idx.exact.get(nm) !== idx.exact.get(best)) tie = true;
    });
    if (best && !tie) {
      var id = idx.exact.get(best);
      if (id === answerId) return { verdict: 'right', spelled: idx.shown.get(best) };
      return { verdict: 'other', id: id };
    }
    return { verdict: 'wrong' };
  }
  var index = makeIndex(MODELS);

  /* ---------------- quiz & lookalike logic ---------------- */
  var SETS = ['popular', 'all'];
  var LEARNED = 2;
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function inSet(m, set) { return set === 'popular' ? !!m.pop : true; }
  function inGroup(m, group) {
    if (!group || group === 'all') return true;
    return m.category === group;
  }
  function pool(models, set, group) {
    return models.filter(function (m) { return inSet(m, set) && inGroup(m, group || 'all'); });
  }
  function lookalikeMap(groups) {
    var map = new Map();
    groups.forEach(function (ids) {
      ids.forEach(function (id) {
        var merged = (map.get(id) || []).concat(ids.filter(function (x) { return x !== id; }));
        map.set(id, Array.from(new Set(merged)));
      });
    });
    return map;
  }
  var lmap = lookalikeMap(LOOKALIKES);

  function choices(target, setModels) {
    var n = 4;
    var others = setModels.filter(function (m) { return m.id !== target.id; });
    if (others.length < n - 1) others = MODELS.filter(function (m) { return m.id !== target.id; });
    var picked = [];
    function take(list, max) {
      var sh = shuffle(list);
      for (var i = 0; i < sh.length; i++) {
        if (picked.length >= n - 1 || max <= 0) break;
        if (picked.indexOf(sh[i]) < 0) { picked.push(sh[i]); max--; }
      }
    }
    var near = new Set(lmap.get(target.id) || []);
    take(others.filter(function (m) { return near.has(m.id); }), 2);
    take(others.filter(function (m) { return m.category === target.category; }), 2);
    take(others.filter(function (m) { return m.country === target.country; }), 1);
    take(others, n);
    return shuffle([target].concat(picked)).map(function (m) { return m.id; });
  }

  function pickNext(poolModels, known, recent) {
    var gap = Math.min(6, Math.max(0, poolModels.length - 2));
    var avoid = new Set(recent.slice(-gap));
    var fresh = poolModels.filter(function (m) { return !avoid.has(m.id); });
    var list = fresh.length ? fresh : poolModels;
    var total = 0;
    list.forEach(function (m) { total += (known[m.id] || 0) >= LEARNED ? 1 : 5; });
    var r = Math.random() * total;
    for (var i = 0; i < list.length; i++) {
      r -= (known[list[i].id] || 0) >= LEARNED ? 1 : 5;
      if (r < 0) return list[i];
    }
    return list[list.length - 1];
  }
  function nextStreak(streak, right) { return right ? Math.min(3, (streak || 0) + 1) : 0; }
  function learnedIn(poolModels, known) {
    return poolModels.filter(function (m) { return (known[m.id] || 0) >= LEARNED; }).length;
  }
  function createReview() {
    var queue = [], answered = 0, soon = 3, later = 8;
    return {
      due: function () {
        var i = queue.findIndex(function (x) { return x.due <= answered; });
        return i < 0 ? null : queue.splice(i, 1)[0];
      },
      record: function (id, right, item) {
        answered++;
        if (!right) queue.push({ id: id, due: answered + soon, step: 0 });
        else if (item && item.step === 0) queue.push({ id: id, due: answered + later, step: 1 });
      },
      waiting: function () { return queue.length; }
    };
  }

  /* ---------------- names, flags, brand badges & photo cards ---------------- */
  function countryName(c) {
    return LANG === 'en'
      ? (DATA.COUNTRIES_EN && DATA.COUNTRIES_EN[c]) || c
      : (DATA.COUNTRIES_ES && DATA.COUNTRIES_ES[c]) || c;
  }
  function catName(id) {
    var c = catById.get(id);
    if (!c) return id;
    return LANG === 'en' ? c.en : c.es;
  }
  function flag(c) {
    return h('img', {
      class: 'flag',
      src: '../flag-atlas/flags/' + c + '.svg',
      alt: '',
      loading: 'lazy',
      decoding: 'async'
    });
  }
  function brandBadge(m) {
    if (!m.brandId) return null;
    return h('img', {
      class: 'brand-badge',
      src: '../car-brands/logos/' + m.brandId + '.webp',
      alt: '',
      loading: 'lazy',
      decoding: 'async'
    });
  }
  function place(c) { return [flag(c), h('span', { text: countryName(c) })]; }

  function wikiUrl(m) {
    return 'https://en.wikipedia.org/wiki/' + encodeURIComponent(m.wiki || m.name.replace(/\s+/g, '_'));
  }

  function specSection(m) {
    var eng = m.engine && (m.engine[LANG] || m.engine.es || m.engine.en);
    var fact = m.fact && (m.fact[LANG] || m.fact.es || m.fact.en);
    var pills = [
      h('span', null, [h('b', { text: t('spec_year') + ': ' }), document.createTextNode(String(m.year))]),
      eng ? h('span', null, [h('b', { text: t('spec_engine') + ': ' }), document.createTextNode(eng)]) : null,
      m.power ? h('span', null, [h('b', { text: t('spec_power') + ': ' }), document.createTextNode(m.power)]) : null,
      m.topSpeed ? h('span', null, [h('b', { text: t('spec_speed') + ': ' }), document.createTextNode(m.topSpeed)]) : null,
      m.designer ? h('span', null, [h('b', { text: t('spec_designer') + ': ' }), document.createTextNode(m.designer)]) : null
    ].filter(Boolean);
    return h('div', { class: 'spec-wrap' }, [
      h('div', { class: 'facts' }, pills),
      fact ? h('p', { class: 'fact-note', text: fact }) : null
    ].filter(Boolean));
  }

  function photoDetailBox(m, o) {
    o = o || {};
    var wrap = h('div', { class: 'detail', 'data-id': m.id });
    var box = h('div', { class: 'show' });
    var plate = h('div', { class: 'plate' });
    var img = h('img', {
      alt: o.quiz ? t('photo_alt_quiz') : t('photo_alt', { name: m.name }),
      decoding: 'async',
      src: m.photo
    });
    img.addEventListener('load', function () { img.classList.add('is-in'); });
    if (img.complete) img.classList.add('is-in');
    plate.appendChild(img);

    var credit = h('div', { class: 'credit-line' });
    function updateCredit(revealed) {
      if (!revealed) {
        credit.textContent = t('photo_credit_quiz');
      } else {
        credit.innerHTML = t('photo_credit_open', {
          src: '<a href="' + esc(wikiUrl(m)) + '" target="_blank" rel="noopener">Wikipedia · ' + esc(m.name) + '</a>'
        });
      }
    }
    updateCredit(!o.quiz);
    box.append(plate, credit);
    wrap.appendChild(box);

    if (!o.quiz) {
      wrap.appendChild(specSection(m));
    }
    wrap.reveal = function () {
      img.alt = t('photo_alt', { name: m.name });
      updateCredit(true);
      if (!wrap.querySelector('.spec-wrap')) {
        wrap.appendChild(specSection(m));
      }
    };
    return wrap;
  }

  function thumb(m) {
    var box = h('div', { class: 'thumb' });
    box.appendChild(h('img', { src: m.photo, alt: '', loading: 'lazy', decoding: 'async' }));
    box.appendChild(h('span', { class: 'year-tag', text: m.year }));
    return box;
  }
  function preload(m) {
    if (m && m.photo && typeof Image !== 'undefined') new Image().src = m.photo;
  }

  /* ---------------- settings & state ---------------- */
  var MODES = ['study', 'practice', 'test'];
  function validGroup(g) {
    return g === 'all' || catById.has(g);
  }
  var S = { mode: 'study', set: 'popular', group: 'all', answer: 'choose' };
  (function loadSettings() {
    var s = saved.get('settings', null);
    if (!s || typeof s !== 'object') return;
    if (MODES.indexOf(s.mode) >= 0) S.mode = s.mode === 'test' ? 'practice' : s.mode;
    if (SETS.indexOf(s.set) >= 0) S.set = s.set;
    if (typeof s.group === 'string' && validGroup(s.group)) S.group = s.group;
    if (['choose', 'type'].indexOf(s.answer) >= 0) S.answer = s.answer;
  })();
  function saveSettings() { saved.set('settings', S); }

  var known = saved.get('known', {});
  var bests = saved.get('best', {});
  function bestKey() { return [S.set, S.group, S.answer].join('|'); }
  function poolNow() { return pool(MODELS, S.set, S.group); }
  function setNow() { return pool(MODELS, S.set, 'all'); }
  function groupLabel(g) { return g === 'all' ? t('all_eras') : catName(g); }

  /* ---------------- UI & prompt helpers ---------------- */
  var actions = [];
  var advance = null;
  var run = 0;
  var session = { right: 0, total: 0, streak: 0, longest: 0, t0: 0, frozen: null };
  var peek = {};
  var studyAt = null;
  var openHelp = null;

  function closeHelp() {
    if (!openHelp) return;
    openHelp.box.remove();
    openHelp.btn.removeAttribute('aria-expanded');
    openHelp = null;
  }

  function clearResult() {
    $('prompt').classList.remove('is-review');
    var pill = $('prompt').querySelector('.pill');
    if (pill) pill.remove();
    $('reviewPanel').hidden = true;
    $('reviewPanel').innerHTML = '';
  }

  function statsOff(off) {
    $('stats').classList.toggle('is-off', !!off);
  }

  function placeLabel() {
    return t('set.' + S.set) + (S.group === 'all' ? '' : ' · ' + groupLabel(S.group));
  }
  function eyebrow(extra) {
    return placeLabel() + ' · ' + t('shell.mode_' + S.mode) + (extra ? ' · ' + extra : '');
  }
  function aboutLine(m, extra) {
    return [
      brandBadge(m),
      flag(m.country),
      h('span', { text: m.brand + ' · ' + countryName(m.country) + ' · ' + m.year + ' · ' + catName(m.category) }),
      extra ? h('span', { text: '· ' + extra }) : null
    ].filter(Boolean);
  }

  function prompt(p) {
    clearResult();
    statsOff(S.mode === 'study');
    var box = $('prompt');
    ['ok', 'bad', 'warn'].forEach(function (s) { box.classList.toggle('is-' + s, p.state === s); });
    $('pEyebrow').textContent = p.eyebrow || eyebrow();
    $('pName').textContent = p.name || '';
    var metaArr = (p.meta == null ? [' '] : [].concat(p.meta)).map(function (m) {
      return typeof m === 'string' ? document.createTextNode(m) : m;
    });
    $('pMeta').replaceChildren.apply($('pMeta'), metaArr);
    $('pBarWrap').classList.toggle('is-off', p.bar == null);
    if (p.bar != null) $('pBar').style.width = Math.round(p.bar * 100) + '%';
  }

  function setActions(list, row) {
    actions = list || [];
    var box = $('actions');
    box.className = 'actions' + (row ? ' row' : '');
    box.replaceChildren.apply(box, actions.map(function (a) {
      a.el = h('button', {
        class: 'act' + (a.primary ? ' primary' : ''),
        type: 'button',
        'data-id': a.id,
        onclick: function () { if (a.on) a.on(a.id); }
      }, [
        a.key ? h('kbd', { text: a.key === ' ' ? t('key_space') : a.key.toUpperCase() }) : null,
        h('span', { class: 'txt', text: a.label })
      ]);
      return a.el;
    }));
  }
  function nextButton(on) {
    return { id: 'next', label: t('next'), key: ' ', primary: true, on: on };
  }

  function elapsed() {
    return session.frozen != null ? session.frozen : session.t0 ? (Date.now() - session.t0) / 1000 : 0;
  }
  function showStats() {
    var p = poolNow();
    $('know').textContent = t('shell.know', { n: learnedIn(p, known), m: p.length });
    $('sAcc').textContent = session.total ? Math.round((100 * session.right) / session.total) + '%' : '–';
    $('sStreak').textContent = String(session.streak);
    $('sTime').textContent = clock(elapsed());
  }
  setInterval(function () {
    if (session.t0 && session.frozen == null) $('sTime').textContent = clock(elapsed());
  }, 500);

  function mark(right, o) {
    o = o || {};
    session.total++;
    if (right) {
      session.right++;
      session.streak++;
      session.longest = Math.max(session.longest, session.streak);
    } else {
      session.streak = 0;
    }
    play(right ? (o.close ? 'close' : 'correct') : o.skip ? 'skip' : 'wrong', session.streak);
    showStats();
  }
  function flash(right) {
    var box = $('stageBox');
    box.classList.remove('flash-ok', 'flash-bad');
    void box.offsetWidth;
    box.classList.add(right ? 'flash-ok' : 'flash-bad');
    setTimeout(function () { box.classList.remove('flash-ok', 'flash-bad'); }, 450);
  }
  function show(kids) {
    var v = $('view');
    v.replaceChildren.apply(v, [].concat(kids).filter(Boolean));
    v.scrollTop = 0;
  }
  function learn(id, right, hinted) {
    known[id] = hinted && right ? known[id] || 0 : nextStreak(known[id], right);
    saved.set('known', known);
  }

  /* ---------------- asking ---------------- */
  function letters(name) {
    return name.split(' ').map(function (w) {
      var chars = Array.from(w);
      return chars[0] + ' ' + '_ '.repeat(Math.max(0, chars.length - 1)).trim();
    }).join('  ');
  }

  function ask(m, o) {
    peek.q = { id: m.id };
    peek.answer = m.id;
    var typing = S.answer === 'type';
    prompt({ eyebrow: o.eyebrow, name: t('which_model'), meta: typing ? t('type_meta') : t('pick_meta'), bar: o.bar });
    var box = photoDetailBox(m, { quiz: true });
    show(box);
    if (!session.t0) session.t0 = Date.now();
    var done = false;
    function answer(right, said, extra) {
      if (done) return;
      done = true;
      o.onAnswer(right, said, extra || {}, box);
    }
    if (!typing) {
      var ids = choices(m, setNow());
      peek.q.options = ids;
      setActions(ids.map(function (id, i) {
        return { id: id, label: byId.get(id).name, key: String(i + 1), on: function () { answer(id === m.id, id); } };
      }));
      advance = null;
      return;
    }

    var hints = 0;
    var input = h('input', {
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'words',
      spellcheck: 'false',
      enterkeyhint: 'done',
      placeholder: t('type_ph'),
      'aria-label': t('type_aria')
    });
    function submit() {
      var text = input.value.trim();
      if (!text) return;
      var res = check(text, m.id, index);
      if (res.verdict === 'right') return answer(true, m.id, { spelled: res.spelled, hinted: hints > 0 });
      if (res.verdict === 'vague') {
        prompt({
          eyebrow: o.eyebrow || eyebrow(),
          name: t('which_one', { word: text }),
          meta: [t('be_specific') + ': ' + res.ids.map(function (id) { return byId.get(id).name; }).join(' / ')],
          state: 'warn',
          bar: o.bar
        });
        input.select();
        return;
      }
      answer(false, res.verdict === 'other' ? res.id : null, { typed: text, hinted: hints > 0 });
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); submit(); }
    });
    var row = h('div', { class: 'typebox' }, [
      input,
      h('button', { class: 'act primary', type: 'button', onclick: submit }, [h('span', { class: 'txt', text: t('check') })])
    ]);
    var extras = [];
    if (!o.test) {
      extras.push({
        id: 'hint',
        label: t('hint'),
        on: function () {
          hints++;
          play('hint');
          if (hints >= 3) return answer(false, null, { gaveUp: true, hinted: true });
          var hintMeta = hints === 1
            ? place(m.country).concat([h('span', { text: '· ' + catName(m.category) + ' (' + m.year + ')' })])
            : [h('span', { class: 'letters', text: letters(m.name) })];
          prompt({
            eyebrow: o.eyebrow || eyebrow(),
            name: t('which_model'),
            meta: hintMeta,
            bar: o.bar
          });
          input.focus();
        }
      });
    }
    extras.push({
      id: 'give-up',
      label: o.test ? t('skip') : t('show_answer'),
      on: function () { answer(false, null, { gaveUp: true }); }
    });
    setActions(extras, true);
    $('actions').prepend(row);
    advance = null;
    setTimeout(function () { if (input.focus) input.focus({ preventScroll: true }); }, 30);
  }

  /* ---------------- practice ---------------- */
  function practice(only) {
    var mine = run;
    var review = createReview();
    var recent = [];
    var items = only || poolNow();
    if (!items.length) return emptyPool();
    function next() {
      if (mine !== run) return;
      var item = review.due();
      var m = item ? byId.get(item.id) : pickNext(items, known, recent);
      recent.push(m.id);
      ask(m, {
        eyebrow: item ? eyebrow(t('again')) : null,
        onAnswer: function (right, said, extra, box) {
          if (mine !== run) return;
          mark(right, { close: extra.spelled, skip: extra.gaveUp });
          flash(right);
          review.record(m.id, right, item);
          learn(m.id, right, extra.hinted);
          fillRail();
          var waiting = review.waiting();
          var s = said && said !== m.id ? byId.get(said) : null;
          var top = right
            ? (extra.spelled ? t('correct_spelled', { name: m.name }) : t('correct'))
            : s
              ? t('you_said', { name: s.name })
              : extra.gaveUp
                ? t('the_answer')
                : extra.typed
                  ? t('not_a_model', { text: extra.typed })
                  : t('not_quite');
          if (right && extra.hinted) top = t('correct_hinted');
          prompt({
            eyebrow: top,
            name: m.name,
            meta: aboutLine(m, waiting ? t('to_come_back', { n: waiting }) : null),
            state: right ? 'ok' : 'bad'
          });
          box.reveal();
          setActions([nextButton(next)], true);
          advance = next;
        }
      });
      var soon = items[Math.floor(Math.random() * items.length)];
      if (soon) preload(soon);
    }
    next();
  }

  /* ---------------- test ---------------- */
  function showResultCard(r) {
    var box = $('prompt');
    box.classList.add('is-review');
    $('pEyebrow').textContent = r.eyebrow;
    if (r.best) box.appendChild(h('span', { class: 'pill', text: t('shell.best_badge') }));
    var rp = $('reviewPanel');
    rp.hidden = false;
    rp.replaceChildren(
      h('div', { class: 'res-main' }, [
        h('div', { class: 'res-score' }, [h('b', { text: r.score }), h('span', { text: '/' + r.total })]),
        h('div', { class: 'res-tiles' }, [
          h('div', null, [h('b', { text: r.acc }), h('span', { text: t('shell.acc') })]),
          h('div', null, [h('b', { text: r.time }), h('span', { text: t('shell.time') })]),
          h('div', null, [h('b', { text: r.streak }), h('span', { text: t('shell.streak') })])
        ])
      ]),
      h('div', { class: 'res-actions' }, [
        h('button', { class: 'btn primary', type: 'button', onclick: r.again }, t('shell.again')),
        r.misses ? h('button', { class: 'btn', type: 'button', onclick: r.misses }, t('shell.misses')) : null
      ].filter(Boolean)),
      h('div', { class: 'res-foot' }, [
        h('span', { class: 'key ok' }, [h('i'), h('b', { text: r.ok }), document.createTextNode(LANG === 'es' ? ' correctas' : ' correct')]),
        h('span', { class: 'key bad' }, [h('i'), h('b', { text: r.bad }), document.createTextNode(LANG === 'es' ? ' falladas' : ' missed')]),
        r.hint ? h('p', { class: 'rhint', text: r.hint }) : null
      ].filter(Boolean))
    );
  }

  function test() {
    var mine = run;
    var items = shuffle(poolNow());
    if (!items.length) return emptyPool();
    var missed = [];
    var i = 0;
    function step() {
      if (mine !== run) return;
      if (i >= items.length) return finish();
      var m = items[i];
      var n = items.length;
      var opts = {
        eyebrow: eyebrow(t('n_of', { i: i + 1, n: n })),
        bar: i / n,
        test: true,
        onAnswer: function (right, said, extra) {
          if (mine !== run) return;
          actions.forEach(function (a) {
            a.on = null;
            if (a.el) {
              a.el.disabled = true;
              if (a.id === said) a.el.classList.add(right ? 'is-right' : 'is-wrong');
              if (!right && a.id === m.id) a.el.classList.add('is-right');
            }
          });
          mark(right, { close: extra.spelled, skip: extra.gaveUp });
          flash(right);
          known[m.id] = right ? Math.max(LEARNED, known[m.id] || 0) : 0;
          saved.set('known', known);
          if (!right) missed.push({ id: m.id, said: said && byId.has(said) ? said : null, typed: extra.typed || null });
          if (!right && S.answer === 'type') {
            prompt({ eyebrow: opts.eyebrow, name: m.name, meta: t('test_was'), bar: opts.bar, state: 'bad' });
          }
          i++;
          setTimeout(step, right ? 420 : S.answer === 'type' ? 1200 : 850);
        }
      };
      ask(m, opts);
      if (items[i + 1]) preload(items[i + 1]);
    }
    function finish() {
      session.frozen = elapsed();
      var total = items.length;
      var score = total - missed.length;
      var time = session.frozen;
      var key = bestKey();
      var old = bests[key];
      var better = !old || score / total > old.score / old.total || (score / total === old.score / old.total && time < old.time);
      if (better) {
        bests[key] = { score: score, total: total, time: time };
        saved.set('best', bests);
      }
      peek.q = null;
      peek.result = { score: score, total: total };
      show(h('div', { class: 'summary' }, [
        missed.length
          ? h('div', { class: 'misses' }, missed.map(function (ms) {
              var m = byId.get(ms.id);
              return h('button', { type: 'button', onclick: function () { openStudy(ms.id); } }, [
                thumb(m),
                h('div', { class: 'lbl' }, [
                  h('b', { text: m.name }),
                  h('small', { text: ms.said ? t('you_said_short', { name: byId.get(ms.said).name }) : ms.typed ? '“' + ms.typed + '”' : t('skipped') })
                ])
              ]);
            }))
          : h('p', { class: 'note', text: t('nothing_missed') })
      ]));
      setActions([]);
      var misses = missed.map(function (ms) { return byId.get(ms.id); });
      showResultCard({
        eyebrow: t('shell.test_complete') + ' · ' + placeLabel(),
        score: score,
        total: total,
        time: clock(time),
        acc: Math.round((100 * score) / Math.max(1, total)) + '%',
        streak: session.longest,
        best: better && !!old,
        again: function () { start(); },
        misses: misses.length ? function () { learnOnly(misses); } : null,
        ok: score,
        bad: misses.length,
        hint: misses.length ? t('missed_below') : ''
      });
      advance = null;
      fillRail();
      showBest();
      showStats();
    }
    step();
  }

  function learnOnly(list) {
    S.mode = 'practice';
    saveSettings();
    start({ only: list });
  }

  /* ---------------- explore ---------------- */
  var searchTerm = '';
  function matchesSearch(m, q) {
    if (!q) return true;
    var nq = norm(q);
    var raw = q.toLowerCase();
    var hay = [m.name, m.brand, String(m.year), m.designer || ''].concat(m.aka || []).concat(m.fact ? [m.fact.es || '', m.fact.en || ''] : []).join(' ');
    return norm(hay).indexOf(nq) >= 0 || hay.toLowerCase().indexOf(raw) >= 0;
  }

  function studyGrid() {
    studyAt = null;
    peek.study = null;
    var items = poolNow();
    if (!items.length) return emptyPool();
    var bar = $('gridBar');
    if (bar) bar.hidden = false;
    var q = searchTerm.trim();
    var filtered = q ? items.filter(function (m) { return matchesSearch(m, q); }) : items;
    if ($('exploreClear')) $('exploreClear').hidden = !q;
    if ($('exploreCount')) $('exploreCount').textContent = filtered.length + '/' + items.length;
    prompt({
      name: S.group === 'all' ? t('set.' + S.set) : groupLabel(S.group),
      meta: t('n_models', { n: filtered.length })
    });
    var grid = h('div', { class: 'grid' });
    function card(m) {
      return h('button', {
        class: 'pcard' + ((known[m.id] || 0) >= LEARNED ? ' is-known' : ''),
        type: 'button',
        'data-id': m.id,
        onclick: function () { studyOne(m.id); }
      }, [
        thumb(m),
        h('div', { class: 'lbl' }, [flag(m.country), h('b', { text: m.name })])
      ]);
    }
    if (!filtered.length) {
      grid.appendChild(h('p', { class: 'grid-empty', text: t('search_empty', { q: q }) }));
    } else if (S.group === 'all') {
      CATEGORIES.forEach(function (c) {
        var these = filtered.filter(function (m) { return m.category === c.id; });
        if (!these.length) return;
        grid.appendChild(h('div', { class: 'head' }, [
          h('span', { text: (LANG === 'en' ? c.en : c.es) + ' · ' + these.length }),
          h('span', { text: c.era })
        ]));
        these.forEach(function (m) { grid.appendChild(card(m)); });
      });
    } else {
      filtered.forEach(function (m) { grid.appendChild(card(m)); });
    }
    show(grid);
    setActions([{ id: 'practice', label: t('learn_these'), key: 'p', primary: true, on: function () { setMode('practice'); } }], true);
    advance = null;
  }

  function studyOne(id) {
    if ($('gridBar')) $('gridBar').hidden = true;
    studyAt = id;
    peek.study = id;
    var m = byId.get(id);
    var items = poolNow();
    var at = items.findIndex(function (x) { return x.id === id; });
    prompt({
      eyebrow: eyebrow(at >= 0 ? t('n_of', { i: at + 1, n: items.length }) : null),
      name: m.name,
      meta: aboutLine(m)
    });
    show(photoDetailBox(m, { quiz: false }));
    function go(d) {
      if (!items.length) return;
      studyOne(items[(Math.max(0, at) + d + items.length) % items.length].id);
    }
    setActions([
      { id: 'back', label: t('all_models'), key: 'b', on: studyGrid },
      { id: 'prev', label: t('prev_model'), key: '←', on: function () { go(-1); } },
      { id: 'next', label: t('next_model'), key: '→', on: function () { go(1); } }
    ], true);
    advance = function () { go(1); };
  }

  function openStudy(id) {
    var m = byId.get(id);
    if (m && !poolNow().some(function (x) { return x.id === id; })) {
      if (!inSet(m, S.set)) S.set = 'all';
      S.group = 'all';
    }
    S.mode = 'study';
    saveSettings();
    start({ open: id });
  }

  function emptyPool() {
    prompt({ name: t('nothing_here'), meta: ' ' });
    show(h('p', { class: 'note', style: 'padding:24px;align-self:center;justify-self:center', text: t('nothing_here') }));
    setActions([]);
  }

  /* ---------------- rail, panel & localization ---------------- */
  function setSeg(id, value) {
    Array.from($(id).querySelectorAll('button')).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === String(value)));
    });
  }
  function onSeg(id, fn) {
    $(id).addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b && !b.disabled) fn(b.dataset.v);
    });
  }

  function fillRail() {
    var list = $('railList');
    list.innerHTML = '';
    var all = setNow();
    function item(g, label, era, items) {
      var n = learnedIn(items, known);
      var done = items.length && n === items.length;
      return h('button', {
        class: 'rg',
        type: 'button',
        'data-group': g,
        'aria-pressed': String(S.group === g),
        disabled: !items.length,
        onclick: function () { setGroup(g); }
      }, [
        h('div', { class: 'r-txt' }, [
          h('span', { text: label }),
          era ? h('span', { class: 'r-era', text: era }) : null
        ].filter(Boolean)),
        h('em', { class: done ? 'done' : '', text: n + '/' + items.length })
      ]);
    }
    list.appendChild(item('all', t('all_eras'), null, all));
    CATEGORIES.forEach(function (c) {
      var inC = all.filter(function (m) { return m.category === c.id; });
      if (inC.length) list.appendChild(item(c.id, LANG === 'en' ? c.en : c.es, c.era, inC));
    });
  }

  function showBest() {
    var b = bests[bestKey()];
    $('best').innerHTML = b ? t('best_test', { score: b.score, total: b.total, time: clock(b.time) }) : t('no_test');
  }

  function applyStaticUi() {
    var popCount = MODELS.filter(function (m) { return m.pop; }).length;
    document.documentElement.lang = LANG;
    document.title = t('page_title') + ' — Todologo';
    $('toolMark').innerHTML = esc(t('mark_a')) + ' <span>' + esc(t('mark_b')) + '</span>';
    $('brandSub').textContent = t('sub', { n: MODELS.length });
    $('homeLink').setAttribute('aria-label', t('home_aria'));
    $('rail').setAttribute('aria-label', t('groups_aria'));
    $('railTitle').textContent = t('groups_title');
    $('lblAcc').textContent = t('shell.acc');
    $('lblTime').textContent = t('shell.time');
    $('lblStreak').textContent = t('shell.streak');
    $('closeSheet').textContent = t('shell.done');
    $('lblLang').textContent = t('shell.lang_title');
    $('langSel').value = LANG;
    $('lblMode').textContent = t('shell.mode');
    var modeBtns = $('modeSeg').querySelectorAll('button');
    modeBtns[0].textContent = t('shell.mode_study');
    modeBtns[1].textContent = t('shell.mode_practice');
    modeBtns[2].textContent = t('shell.mode_test');
    $('lblSet').textContent = t('set');
    var setBtns = $('setSeg').querySelectorAll('button');
    setBtns[0].textContent = t('set.popular') + ' (' + popCount + ')';
    setBtns[1].textContent = t('set.all') + ' (' + MODELS.length + ')';
    $('lblAnswer').textContent = t('answer');
    var ansBtns = $('answerSeg').querySelectorAll('button');
    ansBtns[0].textContent = t('answer_choose');
    ansBtns[1].textContent = t('answer_type');
    $('restartBtn').textContent = t('shell.restart');
    $('cleanBtn').textContent = t('shell.clean');
    $('cleanExit').textContent = t('shell.exit_clean');
    $('settingsBtn').textContent = t('shell.settings');
    $('soundBtn').setAttribute('aria-pressed', String(soundOn));
    $('soundBtn').textContent = t('shell.sound_title') + ': ' + (soundOn ? (LANG === 'es' ? 'Sí' : 'On') : (LANG === 'es' ? 'No' : 'Off'));
    $('keysBtn').textContent = t('shell.keys');
    $('howBtn').textContent = t('how');
    $('creditLine').textContent = t('credit');
    if ($('exploreSearch')) {
      $('exploreSearch').placeholder = t('search_ph');
      $('exploreSearch').setAttribute('aria-label', t('search_aria'));
    }
    if ($('exploreClear')) $('exploreClear').setAttribute('aria-label', t('search_clear'));
    $('introTitle').textContent = t('intro_title');
    $('intro1').innerHTML = t('intro_1', { n: MODELS.length, p: popCount });
    $('intro2').innerHTML = t('intro_2');
    $('intro3').textContent = t('intro_3');
    $('keysTitle').textContent = t('shell.keys');
    $('keysList').innerHTML =
      '<li>' + t(S.mode === 'study' ? 'keys_study' : S.answer === 'type' ? 'keys_type' : 'keys_choose') + '</li>' +
      '<li><kbd>M</kbd> ' + t('shell.sound_title') + ' · <kbd>Esc</kbd> ' + (LANG === 'es' ? 'volver / cerrar' : 'back / close') + '</li>';
  }

  function fillPanel() {
    setSeg('modeSeg', S.mode);
    setSeg('setSeg', S.set);
    setSeg('answerSeg', S.answer);
    $('answerBox').classList.toggle('is-off', S.mode === 'study');
    Array.from($('answerSeg').querySelectorAll('button')).forEach(function (b) { b.disabled = S.mode === 'study'; });
    showBest();
    applyStaticUi();
  }

  function helpItems(what) {
    if (what === 'mode') return MODES.map(function (m) { return [t('shell.mode_' + m), t('mode_hint.' + m, { n: poolNow().length }), S.mode === m]; });
    if (what === 'set') {
      var popC = MODELS.filter(function (m) { return m.pop; }).length;
      return [
        [t('set.popular'), t('set_hint.popular', { n: popC }), S.set === 'popular'],
        [t('set.all'), t('set_hint.all', { n: MODELS.length }), S.set === 'all']
      ];
    }
    if (what === 'answer') return ['choose', 'type'].map(function (v) { return [t('answer_' + v), t('answer_hint.' + v), S.answer === v]; });
    if (what === 'rail') return t('rail_help');
    return '';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button.help[data-help]');
    if (openHelp && (!btn || btn === openHelp.btn)) {
      closeHelp();
      return;
    }
    closeHelp();
    if (!btn) return;
    var content = helpItems(btn.dataset.help);
    var box = h('div', { class: 'helpbox', role: 'dialog' });
    if (typeof content === 'string') {
      box.appendChild(h('p', { text: content }));
    } else {
      content.forEach(function (row) {
        box.appendChild(h('p', { class: row[2] ? 'now' : '' }, [h('b', { text: row[0] }), document.createTextNode(row[1])]));
      });
    }
    document.body.appendChild(box);
    var rect = btn.getBoundingClientRect();
    box.style.top = Math.min(window.innerHeight - 160, rect.bottom + 8) + 'px';
    box.style.left = Math.max(12, Math.min(window.innerWidth - 322, rect.left - 120)) + 'px';
    btn.setAttribute('aria-expanded', 'true');
    openHelp = { btn: btn, box: box };
  });

  function start(o) {
    o = o || {};
    run++;
    advance = null;
    setActions([]);
    session.right = session.total = session.streak = session.longest = 0;
    session.t0 = 0;
    session.frozen = null;
    peek.q = null;
    peek.result = null;
    peek.study = null;
    showStats();
    fillRail();
    fillPanel();
    ['ok', 'bad', 'warn'].forEach(function (s) { $('prompt').classList.remove('is-' + s); });
    if ($('gridBar')) $('gridBar').hidden = true;
    if (S.mode === 'study') (o.open ? studyOne(o.open) : studyGrid());
    else if (S.mode === 'practice') practice(o.only);
    else test();
  }

  function setMode(m) { S.mode = m; saveSettings(); play('mode'); start(); }
  function setGroup(g) { S.group = g; saveSettings(); start(); }
  function setLang(l) {
    if (l !== 'es' && l !== 'en') return;
    LANG = l;
    saved.set('lang', l);
    try { localStorage.setItem('todologo.lang', l); } catch (e) {}
    start({ open: S.mode === 'study' ? studyAt : null });
  }

  if ($('exploreSearch')) {
    $('exploreSearch').addEventListener('input', function (e) {
      searchTerm = e.target.value || '';
      if (S.mode === 'study' && !studyAt) studyGrid();
    });
  }
  if ($('exploreClear')) {
    $('exploreClear').addEventListener('click', function () {
      searchTerm = '';
      if ($('exploreSearch')) { $('exploreSearch').value = ''; $('exploreSearch').focus(); }
      if (S.mode === 'study' && !studyAt) studyGrid();
    });
  }

  onSeg('modeSeg', setMode);
  onSeg('setSeg', function (v) { S.set = v; saveSettings(); start(); });
  onSeg('answerSeg', function (v) { S.answer = v; saveSettings(); start(); });
  $('langSel').addEventListener('change', function (e) { setLang(e.target.value); });
  $('restartBtn').addEventListener('click', function () { document.body.classList.remove('sheet-open'); start(); });
  $('settingsBtn').addEventListener('click', function () { document.body.classList.toggle('sheet-open'); });
  $('closeSheet').addEventListener('click', function () { document.body.classList.remove('sheet-open'); });
  $('cleanBtn').addEventListener('click', function () { document.body.classList.remove('sheet-open'); document.body.classList.add('clean'); });
  $('cleanExit').addEventListener('click', function () { document.body.classList.remove('clean'); });
  $('soundBtn').addEventListener('click', function () {
    soundOn = !soundOn;
    saved.set('sound', soundOn);
    applyStaticUi();
  });
  $('howBtn').addEventListener('click', function () { $('intro').hidden = false; });
  $('intro').addEventListener('click', function (e) { if (e.target === $('intro') || e.target.closest('.card-x')) $('intro').hidden = true; });
  $('keysBtn').addEventListener('click', function () { $('keysModal').hidden = false; });
  $('keysModal').addEventListener('click', function (e) { if (e.target === $('keysModal') || e.target.closest('.card-x')) $('keysModal').hidden = true; });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!$('intro').hidden) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('intro').hidden = true; }
      return;
    }
    if (!$('keysModal').hidden) {
      if (e.key === 'Escape') { e.preventDefault(); $('keysModal').hidden = true; }
      return;
    }
    var typing = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA');
    if (e.key === 'Escape') {
      closeHelp();
      if (document.body.classList.contains('sheet-open')) document.body.classList.remove('sheet-open');
      else if (S.mode === 'study' && studyAt) studyGrid();
      else document.body.classList.remove('clean');
      return;
    }
    if (typing) return;
    if (e.key === '?') { e.preventDefault(); $('keysModal').hidden = !$('keysModal').hidden; return; }
    if (e.key.toLowerCase() === 'm') { e.preventDefault(); $('soundBtn').click(); return; }
    var key = e.key === 'Enter' ? ' ' : e.key === 'ArrowLeft' ? '←' : e.key === 'ArrowRight' ? '→' : e.key.toLowerCase();
    var a = actions.find(function (x) { return x.key === key && x.el && !x.el.disabled; });
    if (a) {
      e.preventDefault();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      if (a.on) a.on(a.id);
    } else if (key === ' ' && advance) {
      e.preventDefault();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      advance();
    }
  });

  start();

  window.CM = {
    S: S, peek: peek, start: start, setMode: setMode, setGroup: setGroup, setLang: setLang,
    session: session, known: known, openStudy: openStudy, saveSettings: saveSettings,
    check: check, index: index, choices: choices, MODELS: MODELS, CATEGORIES: CATEGORIES, LOOKALIKES: LOOKALIKES
  };
})();
