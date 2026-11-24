/* Código Morse y Señales (T036) — Todologo
 * Aprende 46 señales (A–Z, 0–9, SOS y Código Q) por ritmo WebAudio 650 Hz, lámpara óptica,
 * banderas náuticas ICS y alfabeto fonético OTAN.
 */
(function () {
  'use strict';

  var DATA = window.MORSE_DATA;
  if (!DATA) return;

  var CATEGORIES = DATA.CATEGORIES;
  var LOOKALIKES = DATA.LOOKALIKES;
  var ITEMS = DATA.ITEMS;
  var ICS_FLAGS = DATA.ICS_FLAGS || {};

  var $ = function (id) { return document.getElementById(id); };
  var saved = window.SiteProgress
    ? window.SiteProgress.tool('morse-trainer')
    : {
        get: function (k, d) {
          try { var v = localStorage.getItem('todologo.morse-trainer.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
        },
        set: function (k, v) {
          try { localStorage.setItem('todologo.morse-trainer.' + k, JSON.stringify(v)); } catch (e) {}
        }
      };

  var UI = {
    es: {
      page_title: 'Código Morse y Señales',
      mark_a: 'CÓDIGO',
      mark_b: 'MORSE',
      sub: 'Oído, ritmo, lámpara óptica, código Q y banderas',
      home_aria: 'Volver al menú de Todologo',
      groups_aria: 'Grupos de señales',
      groups_title: 'Señales',
      all_groups: 'Todas las señales',
      set: 'Conjunto',
      'set.popular': 'Esenciales',
      'set.all': 'Todas',
      skill: 'Habilidad',
      skill_decode: 'Decodificar',
      skill_transmit: 'Transmitir',
      answer: 'Responder',
      answer_choose: 'Eligiendo',
      answer_type: 'Escribiendo',
      cue: 'Guía visual',
      cue_visual: 'Con guía ·−',
      cue_blind: 'Solo oído y luz',
      speed: 'Velocidad',
      how: 'Cómo funciona',
      credit: 'Sintetizador CW a 650 Hz con tiempo Farnsworth y banderas ICS SVG integradas.',
      intro_title: 'Aprende Código Morse por ritmo',
      intro_1: 'En lugar de contar puntos y rayas mentalmente, entrena tu oído y vista a reconocer la <b>cadencia rítmica</b> completa de <b>{n} señales</b> (A–Z, 0–9, SOS y Código Q) con el método Farnsworth.',
      intro_2: 'En <b>Decodificar</b> escuchas el tono de 650 Hz y ves la lámpara óptica (con o sin puntos/rayas visibles). En <b>Transmitir</b> usas los botones Dit/Dah o mantienes pulsada la barra <b>Espacio</b> como manipulador telegráfico real.',
      intro_3: 'En Explorar dispones además de un traductor instantáneo para escuchar cualquier palabra en Morse y ver su bandera marítima ICS y palabra OTAN.',
      which_signal: '¿Qué carácter o señal es?',
      transmit_target: 'Transmite: {char}',
      decode_pick_meta: 'Escucha y observa la lámpara · teclas 1–4 · R repetir',
      decode_type_meta: 'Escribe letra, número, señal o palabra OTAN · R repetir',
      transmit_meta: 'Usa . Dit (J), − Dah (K) o mantén Espacio · Enter comprobar',
      masked_cue: 'Escucha el ritmo o mira la lámpara óptica (R para repetir)',
      transmit_empty: 'Pulsa . Dit, − Dah o mantén Espacio',
      replay: 'Repetir señal',
      dit_btn: 'Dit ·',
      dah_btn: 'Dah −',
      key_paddle: 'Manipulador (Espacio)',
      backspace_btn: 'Borrar',
      type_ph: 'Escribe carácter o palabra OTAN (ej. R o Romeo)…',
      type_aria: 'Carácter o palabra OTAN',
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
      you_sent: 'Transmitiste {code}',
      you_said_short: 'Dijiste {name}',
      not_match: '«{text}» no coincide',
      not_quite: 'Casi',
      the_answer: 'La respuesta',
      to_come_back: '{n} para repasar',
      test_was: 'Era',
      skipped: 'Saltada',
      nothing_missed: '¡Transmisión impecable! Cero fallos.',
      missed_below: 'Pulsa cualquier tarjeta para estudiarla y escuchar su ritmo.',
      all_signals: 'Todas las señales',
      prev_sig: 'Anterior',
      next_sig: 'Siguiente',
      learn_these: 'Practicar estas',
      nothing_here: 'Sin señales aquí.',
      n_signals: { one: '{n} señal', other: '{n} señales' },
      n_of: '{i} de {n}',
      tx_ph: 'Traductor en vivo: escribe texto o Código Q (ej. HOLA SOS)…',
      tx_btn: 'Transmitir',
      tx_stop: 'Detener',
      nato_lbl: 'OTAN',
      rhythm_lbl: 'Ritmo',
      ics_lbl: 'Bandera náutica ICS',
      best_test: 'Mejor examen: <b>{score}/{total}</b> · {time}',
      no_test: 'Sin examen completado todavía.',
      rail_help: 'Estudia las 46 señales juntas o céntrate en Letras base de ritmo, el resto del alfabeto A–Z, Números 0–9 o Código Q / SOS.',
      'mode_hint.study': 'Explora las {n} señales, usa el traductor en vivo y consulta banderas ICS y alfabeto OTAN.',
      'mode_hint.practice': 'Repetición espaciada sobre {n} señales (decodificando o transmitiendo).',
      'mode_hint.test': 'Recorrido cronometrado por las {n} señales sin pistas.',
      'skill_hint.decode': 'Escucha la señal y adivina el carácter o código.',
      'skill_hint.transmit': 'Se te pide una letra o código y tú lo tecleas en · y − con ritmo.',
      keys_study: '<kbd>←</kbd> <kbd>→</kbd> navegar · <kbd>R</kbd> repetir audio · <kbd>P</kbd> aprender',
      keys_decode_choose: '<kbd>1</kbd>–<kbd>4</kbd> elegir · <kbd>R</kbd> repetir · <kbd>Espacio</kbd> siguiente',
      keys_decode_type: '<kbd>Enter</kbd> comprobar · <kbd>R</kbd> repetir (fuera del cuadro)',
      keys_transmit: '<kbd>.</kbd> / <kbd>J</kbd> Dit · <kbd>-</kbd> / <kbd>K</kbd> Dah · mantén <kbd>Espacio</kbd> · <kbd>Backspace</kbd> borrar · <kbd>Enter</kbd> enviar',
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
        know: 'Dominadas: {n} / {m}'
      }
    },
    en: {
      page_title: 'Morse Code & Signals',
      mark_a: 'MORSE',
      mark_b: 'SIGNALS',
      sub: 'Ear training, optical signal lamp, NATO phonetic, Q-codes & flags',
      home_aria: 'Back to Todologo menu',
      groups_aria: 'Signal groups',
      groups_title: 'Signals',
      all_groups: 'All signals',
      set: 'Set',
      'set.popular': 'Essentials',
      'set.all': 'All',
      skill: 'Direction',
      skill_decode: 'Decode',
      skill_transmit: 'Transmit',
      answer: 'Answer by',
      answer_choose: 'Choosing',
      answer_type: 'Typing',
      cue: 'Visual aid',
      cue_visual: 'Show ·−',
      cue_blind: 'Ear & lamp only',
      speed: 'Speed',
      how: 'How it works',
      credit: '650 Hz raised-cosine WebAudio CW tone with Farnsworth timing & ICS flags.',
      intro_title: 'Learn Morse Code by rhythm',
      intro_1: 'Instead of counting dots in your head, train ear and eye to recognize the whole <b>musical rhythm</b> across <b>{n} signals</b> (A–Z, 0–9, SOS & Q-codes) using Farnsworth spacing.',
      intro_2: 'In <b>Decode</b> mode, identify the 650 Hz tone and optical signal lamp (with or without dot/dash dots visible). In <b>Transmit</b> mode, tap Dit/Dah buttons or press-and-hold <b>Spacebar</b> as a straight telegraph key.',
      intro_3: 'Browse mode also features a live text-to-Morse translator/sender alongside NATO phonetic names and ICS maritime flags.',
      which_signal: 'Which character or signal?',
      transmit_target: 'Key: {char}',
      decode_pick_meta: 'Listen & watch lamp · keys 1–4 · R replay',
      decode_type_meta: 'Type character, Q-code or NATO word · R replay',
      transmit_meta: 'Tap . Dit (J), − Dah (K) or hold Spacebar · Enter submit',
      masked_cue: 'Listen carefully or watch the signal lamp (R to replay)',
      transmit_empty: 'Tap . Dit, − Dah or hold Spacebar',
      replay: 'Replay signal',
      dit_btn: 'Dit ·',
      dah_btn: 'Dah −',
      key_paddle: 'Straight key (Space)',
      backspace_btn: 'Erase',
      type_ph: 'Type character or NATO word (e.g. R or Romeo)…',
      type_aria: 'Character or NATO word',
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
      you_sent: 'You keyed {code}',
      you_said_short: 'You said {name}',
      not_match: '"{text}" did not match',
      not_quite: 'Not quite',
      the_answer: 'The answer',
      to_come_back: '{n} coming back',
      test_was: 'It was',
      skipped: 'Skipped',
      nothing_missed: 'Clean copy — zero errors.',
      missed_below: 'Tap any missed signal to inspect and hear its cadence.',
      all_signals: 'All signals',
      prev_sig: 'Previous',
      next_sig: 'Next',
      learn_these: 'Learn these',
      nothing_here: 'No signals in this group.',
      n_signals: { one: '{n} signal', other: '{n} signals' },
      n_of: '{i} of {n}',
      tx_ph: 'Live translator: type text or Q-code (e.g. HELLO SOS 73)…',
      tx_btn: 'Transmit',
      tx_stop: 'Stop',
      nato_lbl: 'NATO',
      rhythm_lbl: 'Cadence',
      ics_lbl: 'ICS Maritime Flag',
      best_test: 'Best test: <b>{score}/{total}</b> · {time}',
      no_test: 'No test completed yet.',
      rail_help: 'Practice all 46 signals or isolate high-frequency rhythm letters, rest of A–Z, digits 0–9, or SOS / Q-signals.',
      'mode_hint.study': 'Inspect all {n} signals, run the live translator, and study NATO words & ICS flags.',
      'mode_hint.practice': 'Spaced repetition across {n} signals in Decode or Transmit direction.',
      'mode_hint.test': 'Timed drill through {n} signals without hints.',
      'skill_hint.decode': 'Hear audio/lamp and identify the character or Q-code.',
      'skill_hint.transmit': 'Given a character or code, tap or hold-key the · and − rhythm yourself.',
      keys_study: '<kbd>←</kbd> <kbd>→</kbd> step · <kbd>R</kbd> replay · <kbd>P</kbd> learn',
      keys_decode_choose: '<kbd>1</kbd>–<kbd>4</kbd> choose · <kbd>R</kbd> replay · <kbd>Space</kbd> next',
      keys_decode_type: '<kbd>Enter</kbd> check · <kbd>R</kbd> replay (outside input)',
      keys_transmit: '<kbd>.</kbd> / <kbd>J</kbd> Dit · <kbd>-</kbd> / <kbd>K</kbd> Dah · hold <kbd>Space</kbd> · <kbd>Backspace</kbd> erase · <kbd>Enter</kbd> submit',
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
    var val = key.indexOf('shell.') === 0 ? dict.shell[key.slice(6)] : dict[key];
    if (val === undefined) val = key.indexOf('shell.') === 0 ? UI.en.shell[key.slice(6)] : UI.en[key];
    if (val === undefined) val = key;
    if (val && typeof val === 'object' && ('one' in val || 'other' in val)) {
      var n = vars && vars.n != null ? Number(vars.n) : 2;
      val = n === 1 ? val.one : val.other;
    }
    if (vars) val = String(val).replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
    return String(val);
  }

  /* ---------------- CW 650 Hz WebAudio + Optical Signal Lamp engine ---------------- */
  var soundOn = saved.get('sound', true) !== false;
  var audioCtx = null;
  var playToken = 0;
  var activeTimers = [];
  var activeOscs = [];
  var livePaddleOsc = null;
  var livePaddleGain = null;

  function ensureAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function clearLamp() {
    Array.from(document.querySelectorAll('.morse-lamp, #txLed')).forEach(function (el) {
      el.classList.remove('is-lit');
    });
  }

  function setLampLit(on, selector) {
    var targets = document.querySelectorAll(selector || '.morse-lamp');
    Array.from(targets).forEach(function (el) {
      el.classList.toggle('is-lit', !!on);
    });
  }

  function stopMorse() {
    playToken++;
    activeTimers.forEach(function (id) { clearTimeout(id); });
    activeTimers = [];
    activeOscs.forEach(function (o) { try { o.stop(); o.disconnect(); } catch (e) {} });
    activeOscs = [];
    clearLamp();
    if ($('txPlayBtn')) $('txPlayBtn').textContent = t('tx_btn');
  }

  function getTiming(wpm) {
    // Farnsworth timing: crisp 18 WPM elements when reading slow (10 WPM), full speed >= 16 WPM
    var charWpm = Math.max(16, Number(wpm) || 16);
    var dotMs = Math.round(1200 / charWpm);
    var slowFactor = wpm <= 10 ? 1.75 : wpm <= 16 ? 1.15 : 1.0;
    return {
      dot: dotMs,
      dash: dotMs * 3,
      elemGap: dotMs,
      charGap: Math.round(dotMs * 3 * slowFactor),
      wordGap: Math.round(dotMs * 7 * slowFactor)
    };
  }

  function scheduleTone(startSec, durSec) {
    if (!soundOn) return;
    try {
      var ctx = ensureAudio();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      var fade = Math.min(0.006, durSec * 0.2);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, startSec);
      g.gain.setValueAtTime(0.0001, startSec);
      g.gain.linearRampToValueAtTime(0.14, startSec + fade);
      g.gain.setValueAtTime(0.14, Math.max(startSec + fade, startSec + durSec - fade));
      g.gain.linearRampToValueAtTime(0.0001, startSec + durSec);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(startSec);
      osc.stop(startSec + durSec + 0.01);
      activeOscs.push(osc);
    } catch (e) {}
  }

  function playMorse(pattern, o) {
    o = o || {};
    stopMorse();
    if (!pattern) return;
    var mine = playToken;
    var timing = getTiming(S.speed);
    var lampSel = o.lampSel || '.morse-lamp';
    var ctx = soundOn ? ensureAudio() : null;
    var baseSec = ctx ? ctx.currentTime + 0.03 : 0;
    var offsetMs = 30;

    Array.from(pattern).forEach(function (ch) {
      if (ch === '.') {
        if (ctx) scheduleTone(baseSec + offsetMs / 1000, timing.dot / 1000);
        activeTimers.push(setTimeout(function () { if (mine === playToken) setLampLit(true, lampSel); }, offsetMs));
        activeTimers.push(setTimeout(function () { if (mine === playToken) setLampLit(false, lampSel); }, offsetMs + timing.dot));
        offsetMs += timing.dot + timing.elemGap;
      } else if (ch === '-') {
        if (ctx) scheduleTone(baseSec + offsetMs / 1000, timing.dash / 1000);
        activeTimers.push(setTimeout(function () { if (mine === playToken) setLampLit(true, lampSel); }, offsetMs));
        activeTimers.push(setTimeout(function () { if (mine === playToken) setLampLit(false, lampSel); }, offsetMs + timing.dash));
        offsetMs += timing.dash + timing.elemGap;
      } else if (ch === ' ') {
        offsetMs += timing.charGap;
      } else if (ch === '/') {
        offsetMs += timing.wordGap;
      }
    });

    if (o.onDone) {
      activeTimers.push(setTimeout(function () {
        if (mine === playToken) o.onDone();
      }, offsetMs + 40));
    }
    return offsetMs;
  }

  function playFeedback(kind, streak) {
    if (!soundOn) return;
    try {
      var ctx = ensureAudio();
      if (!ctx) return;
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      if (kind === 'correct' || kind === 'close') {
        var base = 520 + Math.min(8, streak || 0) * 28;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.exponentialRampToValueAtTime(base * 1.32, now + 0.09);
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
        g.gain.setValueAtTime(0.04, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now); osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

  function startPaddleTone() {
    setLampLit(true, '.morse-lamp');
    if (!soundOn) return;
    try {
      var ctx = ensureAudio();
      if (!ctx || livePaddleOsc) return;
      var now = ctx.currentTime;
      livePaddleOsc = ctx.createOscillator();
      livePaddleGain = ctx.createGain();
      livePaddleOsc.type = 'sine';
      livePaddleOsc.frequency.setValueAtTime(650, now);
      livePaddleGain.gain.setValueAtTime(0.0001, now);
      livePaddleGain.gain.linearRampToValueAtTime(0.14, now + 0.006);
      livePaddleOsc.connect(livePaddleGain);
      livePaddleGain.connect(ctx.destination);
      livePaddleOsc.start(now);
    } catch (e) {}
  }

  function stopPaddleTone() {
    setLampLit(false, '.morse-lamp');
    try {
      if (livePaddleGain && audioCtx) {
        var now = audioCtx.currentTime;
        livePaddleGain.gain.cancelScheduledValues(now);
        livePaddleGain.gain.linearRampToValueAtTime(0.0001, now + 0.01);
      }
      if (livePaddleOsc) {
        var o = livePaddleOsc;
        setTimeout(function () { try { o.stop(); o.disconnect(); } catch (e) {} }, 20);
      }
    } catch (e) {}
    livePaddleOsc = null;
    livePaddleGain = null;
  }

  /* ---------------- DOM & SVG helpers ---------------- */
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
  function prettyMorse(m) {
    return String(m || '').replace(/\./g, '·').replace(/-/g, '−');
  }

  function renderFlagSvg(charKey) {
    var spec = ICS_FLAGS[String(charKey || '').toUpperCase()];
    if (!spec) return null;
    var w = 60, ht = 42, body = '';
    if (spec.kind === 'solid') {
      body = '<rect width="60" height="42" fill="' + spec.a + '"/>';
    } else if (spec.kind === 'solid-swallow') {
      body = '<polygon points="0,0 60,0 44,21 60,42 0,42" fill="' + spec.a + '"/>';
    } else if (spec.kind === 'vsplit-swallow') {
      body = '<rect width="30" height="42" fill="' + spec.a + '"/><polygon points="30,0 60,0 44,21 60,42 30,42" fill="' + spec.b + '"/>';
    } else if (spec.kind === 'vsplit') {
      body = '<rect width="30" height="42" fill="' + spec.a + '"/><rect x="30" width="30" height="42" fill="' + spec.b + '"/>';
    } else if (spec.kind === 'hsplit') {
      body = '<rect width="60" height="21" fill="' + spec.a + '"/><rect y="21" width="60" height="21" fill="' + spec.b + '"/>';
    } else if (spec.kind === 'hstripes' || spec.kind === 'hstripes3') {
      var bh = ht / spec.bands.length;
      body = spec.bands.map(function (c, idx) {
        return '<rect y="' + (idx * bh) + '" width="60" height="' + (bh + 0.5) + '" fill="' + c + '"/>';
      }).join('');
    } else if (spec.kind === 'hstripes3-wide') {
      body = '<rect width="60" height="42" fill="' + spec.top + '"/><rect y="10" width="60" height="22" fill="' + spec.mid + '"/>';
    } else if (spec.kind === 'vstripes' || spec.kind === 'vstripes3') {
      var bw = w / spec.bands.length;
      body = spec.bands.map(function (c, idx) {
        return '<rect x="' + (idx * bw) + '" width="' + (bw + 0.5) + '" height="42" fill="' + c + '"/>';
      }).join('');
    } else if (spec.kind === 'diamond') {
      body = '<rect width="60" height="42" fill="' + spec.bg + '"/><polygon points="30,3 57,21 30,39 3,21" fill="' + spec.fg + '"/>';
    } else if (spec.kind === 'circle') {
      body = '<rect width="60" height="42" fill="' + spec.bg + '"/><circle cx="30" cy="21" r="11" fill="' + spec.fg + '"/>';
    } else if (spec.kind === 'quarters') {
      body = '<rect width="30" height="21" fill="' + spec.tl + '"/><rect x="30" width="30" height="21" fill="' + spec.tr + '"/><rect y="21" width="30" height="21" fill="' + spec.bl + '"/><rect x="30" y="21" width="30" height="21" fill="' + spec.br + '"/>';
    } else if (spec.kind === 'saltire') {
      body = '<rect width="60" height="42" fill="' + spec.bg + '"/><path d="M0 0 L60 42 M60 0 L0 42" stroke="' + spec.fg + '" stroke-width="8"/>';
    } else if (spec.kind === 'cross') {
      body = '<rect width="60" height="42" fill="' + spec.bg + '"/><rect x="24" width="12" height="42" fill="' + spec.fg + '"/><rect y="15" width="60" height="12" fill="' + spec.fg + '"/>';
    } else if (spec.kind === 'checker4') {
      for (var r = 0; r < 4; r++) {
        for (var col = 0; col < 4; col++) {
          body += '<rect x="' + (col * 15) + '" y="' + (r * 10.5) + '" width="15.5" height="11" fill="' + ((r + col) % 2 === 0 ? spec.a : spec.b) + '"/>';
        }
      }
    } else if (spec.kind === 'diag-split') {
      body = '<rect width="60" height="42" fill="' + spec.tl + '"/><polygon points="60,0 60,42 0,42" fill="' + spec.br + '"/>';
    } else if (spec.kind === 'diag-stripes') {
      body = '<defs><pattern id="yd_' + esc(charKey) + '" width="14" height="14" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="7" height="14" fill="' + spec.a + '"/><rect x="7" width="7" height="14" fill="' + spec.b + '"/></pattern></defs><rect width="60" height="42" fill="url(#yd_' + esc(charKey) + ')"/>';
    } else if (spec.kind === 'center-rect') {
      body = '<rect width="60" height="42" fill="' + spec.bg + '"/><rect x="16" y="11" width="28" height="20" fill="' + spec.fg + '"/>';
    } else if (spec.kind === 'nested3') {
      body = '<rect width="60" height="42" fill="' + spec.outer + '"/><rect x="10" y="7" width="40" height="28" fill="' + spec.mid + '"/><rect x="20" y="14" width="20" height="14" fill="' + spec.inner + '"/>';
    } else if (spec.kind === 'four-tri') {
      body = '<polygon points="0,0 60,0 30,21" fill="' + spec.top + '"/><polygon points="60,0 60,42 30,21" fill="' + spec.right + '"/><polygon points="0,42 60,42 30,21" fill="' + spec.bottom + '"/><polygon points="0,0 0,42 30,21" fill="' + spec.left + '"/>';
    } else if (spec.kind.indexOf('pennant') === 0) {
      var poly = '0,0 60,12 60,30 0,42';
      var cid = 'pen_' + esc(charKey);
      var inner = '';
      if (spec.kind === 'pennant-v') inner = '<rect width="60" height="42" fill="' + spec.bg + '"/><rect x="18" width="24" height="42" fill="' + spec.fg + '"/>';
      else if (spec.kind === 'pennant-dot') inner = '<rect width="60" height="42" fill="' + spec.bg + '"/><circle cx="22" cy="21" r="9" fill="' + spec.fg + '"/>';
      else if (spec.kind === 'pennant-v3') inner = '<rect width="20" height="42" fill="' + spec.bands[0] + '"/><rect x="20" width="20" height="42" fill="' + spec.bands[1] + '"/><rect x="40" width="20" height="42" fill="' + spec.bands[2] + '"/>';
      else if (spec.kind === 'pennant-cross') inner = '<rect width="60" height="42" fill="' + spec.bg + '"/><rect x="18" width="8" height="42" fill="' + spec.fg + '"/><rect y="16" width="60" height="10" fill="' + spec.fg + '"/>';
      else if (spec.kind === 'pennant-vsplit') inner = '<rect width="26" height="42" fill="' + spec.a + '"/><rect x="26" width="34" height="42" fill="' + spec.b + '"/>';
      else if (spec.kind === 'pennant-hsplit') inner = '<rect width="60" height="21" fill="' + spec.a + '"/><rect y="21" width="60" height="21" fill="' + spec.b + '"/>';
      else if (spec.kind === 'pennant-q') inner = '<rect width="30" height="21" fill="' + spec.tl + '"/><rect x="30" width="30" height="21" fill="' + spec.tr + '"/><rect y="21" width="30" height="21" fill="' + spec.bl + '"/><rect x="30" y="21" width="30" height="21" fill="' + spec.br + '"/>';
      body = '<defs><clipPath id="' + cid + '"><polygon points="' + poly + '"/></clipPath></defs><g clip-path="url(#' + cid + ')">' + inner + '</g>';
    }
    return h('div', {
      class: 'ics-flag-box',
      html: '<svg viewBox="0 0 60 42" aria-hidden="true">' + body + '</svg><span>' + esc(t('ics_lbl') + ' · ' + charKey) + '</span>'
    });
  }

  /* ---------------- indexing & quiz helpers ---------------- */
  var byId = new Map(ITEMS.map(function (it) { return [it.id, it]; }));
  var catById = new Map(CATEGORIES.map(function (c) { return [c.id, c]; }));
  var charToMorse = new Map();
  ITEMS.forEach(function (it) {
    charToMorse.set(it.char.toUpperCase(), it.morse);
  });

  function textToMorse(raw) {
    var clean = String(raw || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
    if (!clean) return '';
    var words = clean.split(/\s+/);
    return words.map(function (w) {
      if (charToMorse.has(w)) return charToMorse.get(w);
      return Array.from(w).map(function (ch) {
        return charToMorse.get(ch) || '';
      }).filter(Boolean).join(' ');
    }).filter(Boolean).join(' / ');
  }

  function norm(s) {
    return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
  }

  function makeIndex(items) {
    var exact = new Map();
    items.forEach(function (it) {
      [it.char, it.nato].concat(it.nato ? it.nato.split('/') : []).forEach(function (alias) {
        var k = norm(alias);
        if (k && !exact.has(k)) exact.set(k, it.id);
      });
    });
    return exact;
  }
  var exactIndex = makeIndex(ITEMS);

  function checkDecode(text, answerId) {
    var k = norm(text);
    if (!k) return { verdict: 'wrong' };
    var hit = exactIndex.get(k);
    if (hit) return hit === answerId ? { verdict: 'right' } : { verdict: 'other', id: hit };
    return { verdict: 'wrong' };
  }

  function checkTransmit(typedMorse, targetItem) {
    var cleanTyped = String(typedMorse || '').replace(/[^.\-]/g, '');
    var cleanTarget = String(targetItem.morse || '').replace(/[^.\-]/g, '');
    return cleanTyped === cleanTarget;
  }

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
  function inSet(it, set) { return set === 'popular' ? !!it.pop : true; }
  function inGroup(it, group) { return !group || group === 'all' ? true : it.category === group; }
  function pool(items, set, group) {
    return items.filter(function (it) { return inSet(it, set) && inGroup(it, group || 'all'); });
  }
  function lookalikeMap(groups) {
    var map = new Map();
    groups.forEach(function (ids) {
      ids.forEach(function (id) {
        map.set(id, Array.from(new Set((map.get(id) || []).concat(ids.filter(function (x) { return x !== id; })))));
      });
    });
    return map;
  }
  var lmap = lookalikeMap(LOOKALIKES);

  function choices(target, setItems) {
    var n = 4;
    var others = setItems.filter(function (it) { return it.id !== target.id; });
    if (others.length < n - 1) others = ITEMS.filter(function (it) { return it.id !== target.id; });
    var picked = [];
    function take(list, max) {
      var sh = shuffle(list);
      for (var i = 0; i < sh.length; i++) {
        if (picked.length >= n - 1 || max <= 0) break;
        if (picked.indexOf(sh[i]) < 0) { picked.push(sh[i]); max--; }
      }
    }
    var near = new Set(lmap.get(target.id) || []);
    take(others.filter(function (it) { return near.has(it.id); }), 2);
    take(others.filter(function (it) { return it.category === target.category; }), 2);
    take(others, n);
    return shuffle([target].concat(picked)).map(function (it) { return it.id; });
  }

  function pickNext(poolItems, known, recent) {
    var gap = Math.min(6, Math.max(0, poolItems.length - 2));
    var avoid = new Set(recent.slice(-gap));
    var fresh = poolItems.filter(function (it) { return !avoid.has(it.id); });
    var list = fresh.length ? fresh : poolItems;
    var total = 0;
    list.forEach(function (it) { total += (known[it.id] || 0) >= LEARNED ? 1 : 5; });
    var r = Math.random() * total;
    for (var i = 0; i < list.length; i++) {
      r -= (known[list[i].id] || 0) >= LEARNED ? 1 : 5;
      if (r < 0) return list[i];
    }
    return list[list.length - 1];
  }
  function nextStreak(streak, right) { return right ? Math.min(3, (streak || 0) + 1) : 0; }
  function learnedIn(poolItems, known) { return poolItems.filter(function (it) { return (known[it.id] || 0) >= LEARNED; }).length; }
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

  /* ---------------- settings & state ---------------- */
  var MODES = ['study', 'practice', 'test'];
  function validGroup(g) { return g === 'all' || catById.has(g); }
  var S = { mode: 'study', set: 'popular', group: 'all', skill: 'decode', answer: 'choose', cue: 'visual', speed: '16' };
  (function loadSettings() {
    var s = saved.get('settings', null);
    if (!s || typeof s !== 'object') return;
    if (MODES.indexOf(s.mode) >= 0) S.mode = s.mode === 'test' ? 'practice' : s.mode;
    if (SETS.indexOf(s.set) >= 0) S.set = s.set;
    if (typeof s.group === 'string' && validGroup(s.group)) S.group = s.group;
    if (['decode', 'transmit'].indexOf(s.skill) >= 0) S.skill = s.skill;
    if (['choose', 'type'].indexOf(s.answer) >= 0) S.answer = s.answer;
    if (['visual', 'blind'].indexOf(s.cue) >= 0) S.cue = s.cue;
    if (['10', '16', '24'].indexOf(String(s.speed)) >= 0) S.speed = String(s.speed);
  })();
  function saveSettings() { saved.set('settings', S); }

  var known = saved.get('known', {});
  var bests = saved.get('best', {});
  function bestKey() { return [S.set, S.group, S.skill, S.answer, S.cue].join('|'); }
  function poolNow() { return pool(ITEMS, S.set, S.group); }
  function setNow() { return pool(ITEMS, S.set, 'all'); }
  function catName(id) { var c = catById.get(id); return c ? (LANG === 'en' ? c.en : c.es) : id; }
  function groupLabel(g) { return g === 'all' ? t('all_groups') : catName(g); }

  /* ---------------- visual stage components ---------------- */
  function renderMorsePills(pattern) {
    var box = h('div', { class: 'morse-pills' });
    if (!pattern) {
      box.appendChild(h('span', { class: 'morse-masked', text: t('transmit_empty') }));
      return box;
    }
    Array.from(pattern).forEach(function (c) {
      if (c === '.') box.appendChild(h('span', { class: 'morse-dit', 'aria-label': 'dit' }));
      else if (c === '-') box.appendChild(h('span', { class: 'morse-dah', 'aria-label': 'dah' }));
      else if (c === ' ') box.appendChild(h('span', { class: 'morse-gap' }));
    });
    return box;
  }

  function signalStageBox(it, o) {
    o = o || {};
    var box = h('div', { class: 'signal-stage', 'data-id': it.id });
    var lamp = h('div', { class: 'morse-lamp', 'aria-label': 'Optical Morse Lamp' });
    box.appendChild(h('div', { class: 'morse-lamp-wrap' }, lamp));

    var pillsWrap = h('div', { class: 'morse-visual' });
    if (o.quiz) {
      if (o.skill === 'transmit') {
        box.appendChild(h('div', { class: 'glyph-hero', text: it.char }));
        pillsWrap.appendChild(renderMorsePills(o.typedMorse || ''));
      } else if (S.cue === 'visual') {
        pillsWrap.appendChild(renderMorsePills(it.morse));
      } else {
        pillsWrap.appendChild(h('span', { class: 'morse-masked', text: t('masked_cue') }));
      }
      box.appendChild(pillsWrap);
    } else {
      box.appendChild(h('div', { class: 'glyph-hero', text: it.char }));
      pillsWrap.appendChild(renderMorsePills(it.morse));
      box.appendChild(pillsWrap);
    }

    function appendFacts() {
      var flagEl = renderFlagSvg(it.char);
      if (flagEl) box.appendChild(h('div', { class: 'signal-meta' }, flagEl));
      var icsText = it.ics && (it.ics[LANG] || it.ics.es);
      var factText = it.fact && (it.fact[LANG] || it.fact.es);
      box.appendChild(h('div', { class: 'facts' }, [
        it.nato ? h('span', null, [h('b', { text: t('nato_lbl') + ': ' }), document.createTextNode(it.nato)]) : null,
        h('span', null, [h('b', { text: t('rhythm_lbl') + ': ' }), document.createTextNode(it.rhythm)]),
        icsText ? h('span', null, [document.createTextNode(icsText)]) : null
      ].filter(Boolean)));
      if (factText) box.appendChild(h('p', { class: 'fact-note', text: factText }));
    }

    if (!o.quiz) appendFacts();
    box.setTypedMorse = function (code) {
      pillsWrap.replaceChildren(renderMorsePills(code));
    };
    box.reveal = function () {
      pillsWrap.replaceChildren(renderMorsePills(it.morse));
      if (!box.querySelector('.glyph-hero')) {
        box.insertBefore(h('div', { class: 'glyph-hero', text: it.char }), pillsWrap);
      }
      if (!box.querySelector('.facts')) appendFacts();
    };
    return box;
  }

  /* ---------------- UI helpers ---------------- */
  var actions = [];
  var advance = null;
  var run = 0;
  var session = { right: 0, total: 0, streak: 0, longest: 0, t0: 0, frozen: null };
  var peek = {};
  var studyAt = null;
  var openHelp = null;
  var replayFn = null;
  var paddleHoldStart = 0;
  var paddleKeyFn = null;

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
  function statsOff(off) { $('stats').classList.toggle('is-off', !!off); }
  function placeLabel() { return t('set.' + S.set) + (S.group === 'all' ? '' : ' · ' + groupLabel(S.group)); }
  function eyebrow(extra) { return placeLabel() + ' · ' + t('shell.mode_' + S.mode) + (extra ? ' · ' + extra : ''); }

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
        class: 'act' + (a.primary ? ' primary' : '') + (a.cls ? ' ' + a.cls : ''),
        type: 'button',
        'data-id': a.id,
        onclick: a.on ? function () { a.on(a.id); } : null
      }, [
        a.key ? h('kbd', { text: a.key === ' ' ? t('key_space') : a.key.toUpperCase() }) : null,
        h('span', { class: 'txt', text: a.label })
      ]);
      if (a.onMount) a.onMount(a.el);
      return a.el;
    }));
  }
  function nextButton(on) { return { id: 'next', label: t('next'), key: ' ', primary: true, on: on }; }
  function elapsed() { return session.frozen != null ? session.frozen : session.t0 ? (Date.now() - session.t0) / 1000 : 0; }
  function showStats() {
    var p = poolNow();
    $('know').textContent = t('shell.know', { n: learnedIn(p, known), m: p.length });
    $('sAcc').textContent = session.total ? Math.round((100 * session.right) / session.total) + '%' : '–';
    $('sStreak').textContent = String(session.streak);
    $('sTime').textContent = clock(elapsed());
  }
  setInterval(function () { if (session.t0 && session.frozen == null) $('sTime').textContent = clock(elapsed()); }, 500);

  function mark(right, o) {
    o = o || {};
    session.total++;
    if (right) {
      session.right++; session.streak++;
      session.longest = Math.max(session.longest, session.streak);
    } else { session.streak = 0; }
    playFeedback(right ? (o.close ? 'close' : 'correct') : o.skip ? 'skip' : 'wrong', session.streak);
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

  /* ---------------- asking (Decode + Transmit) ---------------- */
  function ask(it, o) {
    stopMorse();
    paddleKeyFn = null;
    peek.q = { id: it.id, skill: S.skill };
    peek.answer = it.id;
    var transmitMode = S.skill === 'transmit';
    var typing = S.answer === 'type';

    prompt({
      eyebrow: o.eyebrow,
      name: transmitMode ? t('transmit_target', { char: it.char + (it.nato ? ' · ' + it.nato : '') }) : t('which_signal'),
      meta: transmitMode ? t('transmit_meta') : typing ? t('decode_type_meta') : t('decode_pick_meta'),
      bar: o.bar
    });

    var box = signalStageBox(it, { quiz: true, skill: S.skill, typedMorse: '' });
    show(box);
    if (!session.t0) session.t0 = Date.now();
    var done = false;

    function finishAnswer(right, said, extra) {
      if (done) return;
      done = true;
      paddleKeyFn = null;
      replayFn = function () { playMorse(it.morse); };
      o.onAnswer(right, said, extra || {}, box);
    }

    if (transmitMode) {
      var keyed = '';
      function pushElem(ch) {
        if (done || keyed.length >= 16) return;
        keyed += ch;
        box.setTypedMorse(keyed);
        playMorse(ch);
      }
      function backspaceElem() {
        if (done || !keyed.length) return;
        keyed = keyed.slice(0, -1);
        box.setTypedMorse(keyed);
      }
      function submitTransmit() {
        if (!keyed) return;
        var cleanOk = checkTransmit(keyed, it);
        finishAnswer(cleanOk, cleanOk ? it.id : null, { typedMorse: keyed });
      }
      paddleKeyFn = {
        down: function () {
          if (done || paddleHoldStart) return;
          paddleHoldStart = Date.now();
          startPaddleTone();
        },
        up: function () {
          if (!paddleHoldStart) return;
          var dt = Date.now() - paddleHoldStart;
          paddleHoldStart = 0;
          stopPaddleTone();
          if (done || keyed.length >= 16) return;
          var elem = dt >= 190 ? '-' : '.';
          keyed += elem;
          box.setTypedMorse(keyed);
        }
      };

      setActions([
        { id: 'dit', label: t('dit_btn'), key: '.', on: function () { pushElem('.'); } },
        { id: 'dah', label: t('dah_btn'), key: '-', on: function () { pushElem('-'); } },
        {
          id: 'paddle',
          label: t('key_paddle'),
          cls: 'key-paddle',
          onMount: function (el) {
            el.addEventListener('pointerdown', function (e) { e.preventDefault(); el.classList.add('is-down'); paddleKeyFn && paddleKeyFn.down(); });
            el.addEventListener('pointerup', function () { el.classList.remove('is-down'); paddleKeyFn && paddleKeyFn.up(); });
            el.addEventListener('pointerleave', function () { if (paddleHoldStart) { el.classList.remove('is-down'); paddleKeyFn && paddleKeyFn.up(); } });
          }
        },
        { id: 'back', label: t('backspace_btn'), on: backspaceElem },
        { id: 'send', label: t('check'), primary: true, on: submitTransmit },
        { id: 'give-up', label: o.test ? t('skip') : t('show_answer'), on: function () { finishAnswer(false, null, { gaveUp: true }); } }
      ], true);
      replayFn = function () { playMorse(it.morse); };
      advance = submitTransmit;
      peek.transmitHelpers = { pushElem: pushElem, submitTransmit: submitTransmit };
      return;
    }

    replayFn = function () { playMorse(it.morse); };
    playMorse(it.morse);

    if (!typing) {
      var ids = choices(it, setNow());
      peek.q.options = ids;
      var btns = ids.map(function (id, i) {
        var opt = byId.get(id);
        return {
          id: id,
          label: opt.char + (opt.nato && opt.char.length === 1 ? ' · ' + opt.nato : ''),
          key: String(i + 1),
          on: function () { finishAnswer(id === it.id, id); }
        };
      });
      btns.push({ id: 'replay', label: t('replay'), key: 'r', on: replayFn });
      setActions(btns);
      advance = null;
      return;
    }

    var hints = 0;
    var input = h('input', {
      type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false',
      enterkeyhint: 'done', placeholder: t('type_ph'), 'aria-label': t('type_aria')
    });
    function submit() {
      var text = input.value.trim();
      if (!text) return;
      var res = checkDecode(text, it.id);
      if (res.verdict === 'right') return finishAnswer(true, it.id, { hinted: hints > 0 });
      finishAnswer(false, res.verdict === 'other' ? res.id : null, { typed: text, hinted: hints > 0 });
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); submit(); }
    });
    var row = h('div', { class: 'typebox' }, [
      input,
      h('button', { class: 'act primary', type: 'button', onclick: submit }, [h('span', { class: 'txt', text: t('check') })])
    ]);
    var extras = [{ id: 'replay', label: t('replay'), key: 'r', on: replayFn }];
    if (!o.test) {
      extras.push({
        id: 'hint',
        label: t('hint'),
        on: function () {
          hints++;
          playFeedback('hint');
          if (hints >= 3) return finishAnswer(false, null, { gaveUp: true, hinted: true });
          prompt({
            eyebrow: o.eyebrow || eyebrow(),
            name: t('which_signal'),
            meta: hints === 1 ? catName(it.category) + ' · ' + prettyMorse(it.morse) : (it.nato || it.rhythm),
            bar: o.bar
          });
          input.focus();
        }
      });
    }
    extras.push({ id: 'give-up', label: o.test ? t('skip') : t('show_answer'), on: function () { finishAnswer(false, null, { gaveUp: true }); } });
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
      var it = item ? byId.get(item.id) : pickNext(items, known, recent);
      recent.push(it.id);
      ask(it, {
        eyebrow: item ? eyebrow(t('again')) : null,
        onAnswer: function (right, said, extra, box) {
          if (mine !== run) return;
          mark(right, { skip: extra.gaveUp });
          flash(right);
          review.record(it.id, right, item);
          learn(it.id, right, extra.hinted);
          fillRail();
          var waiting = review.waiting();
          var s = said && said !== it.id ? byId.get(said) : null;
          var top = right
            ? (extra.hinted ? t('correct_hinted') : t('correct'))
            : extra.typedMorse
              ? t('you_sent', { code: prettyMorse(extra.typedMorse) })
              : s
                ? t('you_said', { name: s.char })
                : extra.gaveUp
                  ? t('the_answer')
                  : extra.typed
                    ? t('not_match', { text: extra.typed })
                    : t('not_quite');
          prompt({
            eyebrow: top,
            name: it.char + ' · ' + prettyMorse(it.morse),
            meta: (it.nato || catName(it.category)) + (waiting ? ' · ' + t('to_come_back', { n: waiting }) : ''),
            state: right ? 'ok' : 'bad'
          });
          box.reveal();
          if (S.skill === 'transmit') playMorse(it.morse);
          setActions([{ id: 'replay', label: t('replay'), key: 'r', on: replayFn }, nextButton(next)], true);
          advance = next;
        }
      });
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
      var it = items[i];
      var n = items.length;
      var opts = {
        eyebrow: eyebrow(t('n_of', { i: i + 1, n: n })),
        bar: i / n,
        test: true,
        onAnswer: function (right, said, extra) {
          if (mine !== run) return;
          actions.forEach(function (a) {
            if (a.el && a.id !== 'replay') {
              a.el.disabled = true;
              if (a.id === said) a.el.classList.add(right ? 'is-right' : 'is-wrong');
              if (!right && a.id === it.id) a.el.classList.add('is-right');
            }
          });
          mark(right, { skip: extra.gaveUp });
          flash(right);
          known[it.id] = right ? Math.max(LEARNED, known[it.id] || 0) : 0;
          saved.set('known', known);
          if (!right) missed.push({ id: it.id, said: said && byId.has(said) ? said : null, typed: extra.typed || extra.typedMorse || null });
          if (!right) {
            prompt({ eyebrow: opts.eyebrow, name: it.char + ' · ' + prettyMorse(it.morse), meta: t('test_was'), bar: opts.bar, state: 'bad' });
          }
          i++;
          setTimeout(step, right ? 480 : 1100);
        }
      };
      ask(it, opts);
    }
    function finish() {
      stopMorse();
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
              var it = byId.get(ms.id);
              return h('button', { type: 'button', onclick: function () { openStudy(ms.id); } }, [
                h('b', { text: it.char }),
                h('code', { text: prettyMorse(it.morse) }),
                h('small', { text: ms.said ? t('you_said_short', { name: byId.get(ms.said).char }) : ms.typed ? '“' + ms.typed + '”' : t('skipped') })
              ]);
            }))
          : h('p', { class: 'note', text: t('nothing_missed') })
      ]));
      setActions([]);
      var misses = missed.map(function (ms) { return byId.get(ms.id); });
      showResultCard({
        eyebrow: t('shell.test_complete') + ' · ' + placeLabel(),
        score: score, total: total, time: clock(time),
        acc: Math.round((100 * score) / Math.max(1, total)) + '%',
        streak: session.longest, best: better && !!old,
        again: function () { start(); },
        misses: misses.length ? function () { learnOnly(misses); } : null,
        ok: score, bad: misses.length, hint: misses.length ? t('missed_below') : ''
      });
      advance = null;
      fillRail(); showBest(); showStats();
    }
    step();
  }

  function learnOnly(list) { S.mode = 'practice'; saveSettings(); start({ only: list }); }

  /* ---------------- explore ---------------- */
  function updateTranslatorPreview() {
    var val = $('txInput') ? $('txInput').value : '';
    var rawCode = textToMorse(val);
    if ($('txPreview')) $('txPreview').textContent = rawCode ? prettyMorse(rawCode) : '';
  }

  function studyGrid() {
    stopMorse();
    studyAt = null; peek.study = null;
    var items = poolNow();
    if (!items.length) return emptyPool();
    if ($('txBar')) $('txBar').hidden = false;
    updateTranslatorPreview();
    prompt({ name: S.group === 'all' ? t('set.' + S.set) : groupLabel(S.group), meta: t('n_signals', { n: items.length }) });
    var grid = h('div', { class: 'grid' });
    function card(it) {
      return h('button', {
        class: 'pcard' + ((known[it.id] || 0) >= LEARNED ? ' is-known' : ''),
        type: 'button', 'data-id': it.id,
        onclick: function () { studyOne(it.id); }
      }, [
        h('span', { class: 'pchar', text: it.char }),
        h('span', { class: 'pcode', text: prettyMorse(it.morse) }),
        h('span', { class: 'pnato', text: it.nato })
      ]);
    }
    if (S.group === 'all') {
      CATEGORIES.forEach(function (c) {
        var these = items.filter(function (it) { return it.category === c.id; });
        if (!these.length) return;
        grid.appendChild(h('div', { class: 'head' }, [
          h('span', { text: (LANG === 'en' ? c.en : c.es) + ' · ' + these.length })
        ]));
        these.forEach(function (it) { grid.appendChild(card(it)); });
      });
    } else {
      items.forEach(function (it) { grid.appendChild(card(it)); });
    }
    show(grid);
    setActions([{ id: 'practice', label: t('learn_these'), key: 'p', primary: true, on: function () { setMode('practice'); } }], true);
    advance = null;
  }

  function studyOne(id) {
    stopMorse();
    if ($('txBar')) $('txBar').hidden = true;
    var it = byId.get(id);
    if (!it) return studyGrid();
    studyAt = id; peek.study = id;
    var items = poolNow();
    var at = items.findIndex(function (x) { return x.id === id; });
    prompt({
      eyebrow: eyebrow(at >= 0 ? t('n_of', { i: at + 1, n: items.length }) : null),
      name: it.char + (it.nato ? ' · ' + it.nato : ''),
      meta: catName(it.category) + ' · ' + prettyMorse(it.morse)
    });
    var stageBox = signalStageBox(it, { quiz: false });
    show(stageBox);
    replayFn = function () { playMorse(it.morse); };
    playMorse(it.morse);
    function go(d) {
      if (!items.length) return;
      studyOne(items[(Math.max(0, at) + d + items.length) % items.length].id);
    }
    setActions([
      { id: 'back', label: t('all_signals'), key: 'b', on: studyGrid },
      { id: 'replay', label: t('replay'), key: 'r', primary: true, on: replayFn },
      { id: 'prev', label: t('prev_sig'), key: '←', on: function () { go(-1); } },
      { id: 'next', label: t('next_sig'), key: '→', on: function () { go(1); } }
    ], true);
    advance = function () { go(1); };
  }

  function openStudy(id) {
    var it = byId.get(id);
    if (it && !poolNow().some(function (x) { return x.id === id; })) {
      if (!inSet(it, S.set)) S.set = 'all';
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
    Array.from($(id).querySelectorAll('button')).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === String(value))); });
  }
  function onSeg(id, fn) {
    $(id).addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && !b.disabled) fn(b.dataset.v); });
  }
  function fillRail() {
    var list = $('railList');
    list.innerHTML = '';
    var all = setNow();
    function item(g, label, items) {
      var n = learnedIn(items, known);
      var done = items.length && n === items.length;
      return h('button', {
        class: 'rg', type: 'button', 'data-group': g, 'aria-pressed': String(S.group === g),
        disabled: !items.length, onclick: function () { setGroup(g); }
      }, [h('div', { class: 'r-txt' }, h('span', { text: label })), h('em', { class: done ? 'done' : '', text: n + '/' + items.length })]);
    }
    list.appendChild(item('all', t('all_groups'), all));
    CATEGORIES.forEach(function (c) {
      var inC = all.filter(function (it) { return it.category === c.id; });
      if (inC.length) list.appendChild(item(c.id, LANG === 'en' ? c.en : c.es, inC));
    });
  }
  function showBest() {
    var b = bests[bestKey()];
    $('best').innerHTML = b ? t('best_test', { score: b.score, total: b.total, time: clock(b.time) }) : t('no_test');
  }

  function applyStaticUi() {
    var popC = ITEMS.filter(function (it) { return it.pop; }).length;
    document.documentElement.lang = LANG;
    document.title = t('page_title') + ' — Todologo';
    $('toolMark').innerHTML = esc(t('mark_a')) + ' <span>' + esc(t('mark_b')) + '</span>';
    $('brandSub').textContent = t('sub');
    $('homeLink').setAttribute('aria-label', t('home_aria'));
    $('rail').setAttribute('aria-label', t('groups_aria'));
    $('railTitle').textContent = t('groups_title');
    $('lblAcc').textContent = t('shell.acc'); $('lblTime').textContent = t('shell.time'); $('lblStreak').textContent = t('shell.streak');
    $('closeSheet').textContent = t('shell.done');
    $('lblLang').textContent = t('shell.lang_title'); $('langSel').value = LANG;
    $('lblMode').textContent = t('shell.mode');
    var mb = $('modeSeg').querySelectorAll('button');
    mb[0].textContent = t('shell.mode_study'); mb[1].textContent = t('shell.mode_practice'); mb[2].textContent = t('shell.mode_test');
    $('lblSet').textContent = t('set');
    var sb = $('setSeg').querySelectorAll('button');
    sb[0].textContent = t('set.popular') + ' (' + popC + ')';
    sb[1].textContent = t('set.all') + ' (' + ITEMS.length + ')';
    $('lblSkill').textContent = t('skill');
    var sk = $('skillSeg').querySelectorAll('button');
    sk[0].textContent = t('skill_decode'); sk[1].textContent = t('skill_transmit');
    $('lblAnswer').textContent = t('answer');
    var ab = $('answerSeg').querySelectorAll('button');
    ab[0].textContent = t('answer_choose'); ab[1].textContent = t('answer_type');
    $('lblCue').textContent = t('cue');
    var cb = $('cueSeg').querySelectorAll('button');
    cb[0].textContent = t('cue_visual'); cb[1].textContent = t('cue_blind');
    $('lblSpeed').textContent = t('speed');
    $('restartBtn').textContent = t('shell.restart'); $('cleanBtn').textContent = t('shell.clean');
    $('cleanExit').textContent = t('shell.exit_clean'); $('settingsBtn').textContent = t('shell.settings');
    $('soundBtn').setAttribute('aria-pressed', String(soundOn));
    $('soundBtn').textContent = t('shell.sound_title') + ': ' + (soundOn ? (LANG === 'es' ? 'Sí' : 'On') : (LANG === 'es' ? 'No' : 'Off'));
    $('keysBtn').textContent = t('shell.keys'); $('howBtn').textContent = t('how'); $('creditLine').textContent = t('credit');
    if ($('txInput')) $('txInput').placeholder = t('tx_ph');
    if ($('txPlayBtn')) $('txPlayBtn').textContent = t('tx_btn');
    $('introTitle').textContent = t('intro_title');
    $('intro1').innerHTML = t('intro_1', { n: ITEMS.length });
    $('intro2').innerHTML = t('intro_2');
    $('intro3').textContent = t('intro_3');
    $('keysTitle').textContent = t('shell.keys');
    var kKey = S.mode === 'study' ? 'keys_study' : S.skill === 'transmit' ? 'keys_transmit' : S.answer === 'type' ? 'keys_decode_type' : 'keys_decode_choose';
    $('keysList').innerHTML = '<li>' + t(kKey) + '</li><li><kbd>M</kbd> ' + t('shell.sound_title') + ' · <kbd>Esc</kbd> ' + (LANG === 'es' ? 'volver / cerrar' : 'back / close') + '</li>';
  }

  function fillPanel() {
    setSeg('modeSeg', S.mode);
    setSeg('setSeg', S.set);
    setSeg('skillSeg', S.skill);
    setSeg('answerSeg', S.answer);
    setSeg('cueSeg', S.cue);
    setSeg('speedSeg', S.speed);
    var inStudy = S.mode === 'study';
    var isTx = S.skill === 'transmit';
    $('skillBox').classList.toggle('is-off', inStudy);
    Array.from($('skillSeg').querySelectorAll('button')).forEach(function (b) { b.disabled = inStudy; });
    $('answerBox').classList.toggle('is-off', inStudy || isTx);
    Array.from($('answerSeg').querySelectorAll('button')).forEach(function (b) { b.disabled = inStudy || isTx; });
    $('cueBox').classList.toggle('is-off', inStudy || isTx);
    Array.from($('cueSeg').querySelectorAll('button')).forEach(function (b) { b.disabled = inStudy || isTx; });
    showBest();
    applyStaticUi();
  }

  function helpItems(what) {
    if (what === 'mode') return MODES.map(function (m) { return [t('shell.mode_' + m), t('mode_hint.' + m, { n: poolNow().length }), S.mode === m]; });
    if (what === 'skill') return ['decode', 'transmit'].map(function (sk) { return [t('skill_' + sk), t('skill_hint.' + sk), S.skill === sk]; });
    if (what === 'rail') return t('rail_help');
    return '';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button.help[data-help]');
    if (openHelp && (!btn || btn === openHelp.btn)) { closeHelp(); return; }
    closeHelp();
    if (!btn) return;
    var content = helpItems(btn.dataset.help);
    var box = h('div', { class: 'helpbox', role: 'dialog' });
    if (typeof content === 'string') box.appendChild(h('p', { text: content }));
    else content.forEach(function (row) { box.appendChild(h('p', { class: row[2] ? 'now' : '' }, [h('b', { text: row[0] }), document.createTextNode(row[1])])); });
    document.body.appendChild(box);
    var rect = btn.getBoundingClientRect();
    box.style.top = Math.min(window.innerHeight - 160, rect.bottom + 8) + 'px';
    box.style.left = Math.max(12, Math.min(window.innerWidth - 322, rect.left - 120)) + 'px';
    btn.setAttribute('aria-expanded', 'true');
    openHelp = { btn: btn, box: box };
  });

  function start(o) {
    o = o || {};
    stopMorse();
    run++;
    advance = null;
    replayFn = null;
    paddleKeyFn = null;
    setActions([]);
    session.right = session.total = session.streak = session.longest = 0;
    session.t0 = 0; session.frozen = null;
    peek.q = null; peek.result = null; peek.study = null; peek.transmitHelpers = null;
    showStats(); fillRail(); fillPanel();
    ['ok', 'bad', 'warn'].forEach(function (s) { $('prompt').classList.remove('is-' + s); });
    if ($('txBar')) $('txBar').hidden = true;
    if (S.mode === 'study') (o.open ? studyOne(o.open) : studyGrid());
    else if (S.mode === 'practice') practice(o.only);
    else test();
  }

  function setMode(m) { S.mode = m; saveSettings(); start(); }
  function setGroup(g) { S.group = g; saveSettings(); start(); }
  function setLang(l) {
    if (l !== 'es' && l !== 'en') return;
    LANG = l; saved.set('lang', l);
    try { localStorage.setItem('todologo.lang', l); } catch (e) {}
    start({ open: S.mode === 'study' ? studyAt : null });
  }

  onSeg('modeSeg', setMode);
  onSeg('setSeg', function (v) { S.set = v; saveSettings(); start(); });
  onSeg('skillSeg', function (v) { S.skill = v; saveSettings(); start(); });
  onSeg('answerSeg', function (v) { S.answer = v; saveSettings(); start(); });
  onSeg('cueSeg', function (v) { S.cue = v; saveSettings(); start(); });
  onSeg('speedSeg', function (v) { S.speed = String(v); saveSettings(); applyStaticUi(); });

  if ($('txInput')) {
    $('txInput').addEventListener('input', updateTranslatorPreview);
    $('txInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); $('txPlayBtn') && $('txPlayBtn').click(); }
    });
  }
  if ($('txPlayBtn')) {
    $('txPlayBtn').addEventListener('click', function () {
      var val = $('txInput') ? $('txInput').value.trim() : '';
      var code = textToMorse(val || 'SOS');
      if (!code) return;
      if ($('txPreview')) $('txPreview').textContent = prettyMorse(code);
      $('txPlayBtn').textContent = t('tx_stop');
      playMorse(code, {
        lampSel: '#txLed',
        onDone: function () { if ($('txPlayBtn')) $('txPlayBtn').textContent = t('tx_btn'); }
      });
    });
  }

  $('langSel').addEventListener('change', function (e) { setLang(e.target.value); });
  $('restartBtn').addEventListener('click', function () { document.body.classList.remove('sheet-open'); start(); });
  $('settingsBtn').addEventListener('click', function () { document.body.classList.toggle('sheet-open'); });
  $('closeSheet').addEventListener('click', function () { document.body.classList.remove('sheet-open'); });
  $('cleanBtn').addEventListener('click', function () { document.body.classList.remove('sheet-open'); document.body.classList.add('clean'); });
  $('cleanExit').addEventListener('click', function () { document.body.classList.remove('clean'); });
  $('soundBtn').addEventListener('click', function () {
    soundOn = !soundOn; saved.set('sound', soundOn);
    if (!soundOn) stopMorse();
    applyStaticUi();
  });
  $('howBtn').addEventListener('click', function () { $('intro').hidden = false; });
  $('intro').addEventListener('click', function (e) { if (e.target === $('intro') || e.target.closest('.card-x')) $('intro').hidden = true; });
  $('keysBtn').addEventListener('click', function () { $('keysModal').hidden = false; });
  $('keysModal').addEventListener('click', function (e) { if (e.target === $('keysModal') || e.target.closest('.card-x')) $('keysModal').hidden = true; });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!$('intro').hidden) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('intro').hidden = true; } return; }
    if (!$('keysModal').hidden) { if (e.key === 'Escape') { e.preventDefault(); $('keysModal').hidden = true; } return; }
    var typing = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA');
    if (e.key === 'Escape') {
      closeHelp(); stopMorse();
      if (document.body.classList.contains('sheet-open')) document.body.classList.remove('sheet-open');
      else if (S.mode === 'study' && studyAt) studyGrid();
      else document.body.classList.remove('clean');
      return;
    }
    if (typing) return;
    if (e.key === '?') { e.preventDefault(); $('keysModal').hidden = !$('keysModal').hidden; return; }
    if (e.key.toLowerCase() === 'm') { e.preventDefault(); $('soundBtn').click(); return; }
    if (paddleKeyFn) {
      if (e.key === ' ' && !e.repeat) { e.preventDefault(); paddleKeyFn.down(); return; }
      if (e.key === 'Backspace') { e.preventDefault(); var b = actions.find(function (x) { return x.id === 'back'; }); if (b && b.on) b.on(); return; }
      if (e.key.toLowerCase() === 'j' || e.key === '.') { e.preventDefault(); var d = actions.find(function (x) { return x.id === 'dit'; }); if (d && d.on) d.on(); return; }
      if (e.key.toLowerCase() === 'k' || e.key === '-') { e.preventDefault(); var da = actions.find(function (x) { return x.id === 'dah'; }); if (da && da.on) da.on(); return; }
    }
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

  document.addEventListener('keyup', function (e) {
    if (e.key === ' ' && paddleKeyFn && paddleHoldStart) {
      e.preventDefault();
      paddleKeyFn.up();
    }
  });

  start();

  window.MT = {
    S: S, peek: peek, start: start, setMode: setMode, setGroup: setGroup, setLang: setLang,
    session: session, known: known, openStudy: openStudy, textToMorse: textToMorse,
    checkDecode: checkDecode, checkTransmit: checkTransmit, ITEMS: ITEMS, CATEGORIES: CATEGORIES
  };
})();
