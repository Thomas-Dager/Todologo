/* Marcas de Autos (T030) — Todologo
 * Aprende 153 marcas (65 populares / 153 totales) por su logo, región y país.
 * Modos: Explorar, Aprender (Eligiendo / Escribiendo con repetición espaciada) y Examen.
 */
(function () {
  'use strict';

  var DATA = window.CAR_BRANDS_DATA;
  if (!DATA) return;

  var REGIONS = DATA.REGIONS;
  var COUNTRIES = DATA.COUNTRIES;
  var LOOKALIKES = DATA.LOOKALIKES;
  var BRANDS = DATA.BRANDS;

  var $ = function (id) { return document.getElementById(id); };
  var saved = window.SiteProgress
    ? window.SiteProgress.tool('car-brands')
    : {
        get: function (k, d) {
          try { var v = localStorage.getItem('todologo.car-brands.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
        },
        set: function (k, v) {
          try { localStorage.setItem('todologo.car-brands.' + k, JSON.stringify(v)); } catch (e) {}
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

  function uiDict() {
    return LANG === 'en'
      ? Object.assign({}, DATA.EN_UI, DATA.SHELL_EN)
      : Object.assign({}, DATA.ES_UI, DATA.SHELL_ES);
  }

  function t(key, vars) {
    var d = uiDict();
    var val = d[key];
    if (val === undefined) val = DATA.EN_UI[key] || DATA.SHELL_EN[key] || key;
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

  /* ---------------- small helpers & DOM builder ---------------- */
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

  var byId = new Map(BRANDS.map(function (b) { return [b.id, b]; }));

  /* ---------------- fuzzy answer matching ---------------- */
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
  var VAGUE = {
    'Mercedes': ['mercedes-benz', 'maybach'],
    'Great Wall': ['gwm', 'haval', 'wey', 'tank', 'ora'],
    'GWM': ['gwm', 'haval', 'wey', 'tank', 'ora']
  };
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
  function makeIndex(brands) {
    var exact = new Map();
    var shown = new Map();
    brands.forEach(function (b) {
      [b.name].concat(b.aka || []).forEach(function (n) {
        var k = norm(n);
        if (!k) return;
        if (!exact.has(k)) exact.set(k, b.id);
        if (!shown.has(k)) shown.set(k, n);
      });
    });
    var vague = new Map(Object.keys(VAGUE).map(function (k) { return [norm(k), VAGUE[k]]; }));
    return { exact: exact, shown: shown, vague: vague, names: Array.from(exact.keys()) };
  }
  function check(text, answerId, index) {
    var k = norm(text);
    if (!k) return { verdict: 'wrong' };
    var vList = index.vague.get(k);
    if (vList && vList.indexOf(answerId) >= 0 && index.exact.get(k) !== answerId) {
      return { verdict: 'vague', ids: vList };
    }
    var hit = index.exact.get(k);
    if (hit) return hit === answerId ? { verdict: 'right' } : { verdict: 'other', id: hit };
    var best = null, bestD = Infinity, tie = false;
    index.names.forEach(function (nm) {
      var allow = slack(Math.min(nm.length, k.length));
      if (!allow) return;
      var dd = distance(k, nm, allow);
      if (dd > allow) return;
      if (dd < bestD) { best = nm; bestD = dd; tie = false; }
      else if (dd === bestD && index.exact.get(nm) !== index.exact.get(best)) tie = true;
    });
    if (best && !tie) {
      var id = index.exact.get(best);
      if (id === answerId) return { verdict: 'right', spelled: index.shown.get(best) };
      return { verdict: 'other', id: id };
    }
    return { verdict: 'wrong' };
  }
  var index = makeIndex(BRANDS);

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
  function inSet(b, set) { return set === 'popular' ? !!b.pop : true; }
  function inGroup(b, group) {
    if (!group || group === 'all') return true;
    var parts = group.split(':');
    return parts[0] === 'r' ? b.region === parts[1] : parts[0] === 'c' ? b.country === parts[1] : false;
  }
  function pool(brands, set, group) {
    return brands.filter(function (b) { return inSet(b, set) && inGroup(b, group || 'all'); });
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

  function choices(target, setBrands) {
    var n = 4;
    var others = setBrands.filter(function (b) { return b.id !== target.id; });
    var picked = [];
    function take(list, max) {
      var sh = shuffle(list);
      for (var i = 0; i < sh.length; i++) {
        if (picked.length >= n - 1 || max <= 0) break;
        if (picked.indexOf(sh[i]) < 0) { picked.push(sh[i]); max--; }
      }
    }
    var near = new Set(lmap.get(target.id) || []);
    take(others.filter(function (b) { return near.has(b.id); }), 2);
    take(others.filter(function (b) { return b.country === target.country; }), 1);
    take(others.filter(function (b) { return b.region === target.region; }), n);
    take(others, n);
    return shuffle([target].concat(picked)).map(function (b) { return b.id; });
  }

  function pickNext(poolBrands, known, recent) {
    var gap = Math.min(6, Math.max(0, poolBrands.length - 2));
    var avoid = new Set(recent.slice(-gap));
    var fresh = poolBrands.filter(function (b) { return !avoid.has(b.id); });
    var list = fresh.length ? fresh : poolBrands;
    var total = 0;
    list.forEach(function (b) { total += (known[b.id] || 0) >= LEARNED ? 1 : 5; });
    var r = Math.random() * total;
    for (var i = 0; i < list.length; i++) {
      r -= (known[list[i].id] || 0) >= LEARNED ? 1 : 5;
      if (r < 0) return list[i];
    }
    return list[list.length - 1];
  }
  function nextStreak(streak, right) { return right ? Math.min(3, (streak || 0) + 1) : 0; }
  function learnedIn(poolBrands, known) {
    return poolBrands.filter(function (b) { return (known[b.id] || 0) >= LEARNED; }).length;
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

  /* ---------------- names, flags & logos ---------------- */
  function countryName(c) {
    if (LANG === 'es' && DATA.COUNTRIES_ES && DATA.COUNTRIES_ES[c]) return DATA.COUNTRIES_ES[c][0];
    return COUNTRIES[c] ? COUNTRIES[c].name : c;
  }
  function regionName(r) { return t('region.' + r); }
  function flag(c, extra) {
    return h('img', {
      class: 'flag' + (extra ? ' ' + extra : ''),
      src: '../flag-atlas/flags/' + c + '.svg',
      alt: '',
      loading: 'lazy',
      decoding: 'async'
    });
  }
  function place(c) { return [flag(c), h('span', { text: countryName(c) })]; }

  function logoUrl(b) { return b.logo ? b.logo.src : null; }
  function creditHtml(b, linked) {
    var L = b.logo;
    if (!L) return '';
    var site = esc(L.site || t('commons'));
    var src = linked && L.page ? '<a href="' + esc(L.page) + '" target="_blank" rel="noopener">' + site + '</a>' : site;
    if (L.licence === 'Trademark') return t('logo_credit_tm', { src: src });
    return L.author ? t('logo_credit_by', { who: esc(L.author), licence: esc(L.licence), src: src }) : t('logo_credit', { licence: esc(L.licence), src: src });
  }
  function logoBox(b, o) {
    o = o || {};
    var box = h('div', { class: 'show', 'data-id': b.id });
    var plate = h('div', { class: 'plate' });
    var url = logoUrl(b);
    if (url) {
      var img = h('img', { alt: o.quiz ? t('logo_alt_quiz') : t('logo_alt', { name: b.name }), decoding: 'async', src: url });
      img.addEventListener('load', function () { img.classList.add('is-in'); });
      if (img.complete) img.classList.add('is-in');
      plate.appendChild(img);
    } else {
      plate.appendChild(h('div', { class: 'initial', text: b.name[0] }));
    }
    var credit = h('div', { class: 'credit-line', html: creditHtml(b, !o.quiz) });
    box.append(plate, credit);
    box.reveal = function () {
      var img = plate.querySelector('img');
      if (img) img.alt = t('logo_alt', { name: b.name });
      credit.innerHTML = creditHtml(b, true);
    };
    return box;
  }
  function thumb(b) {
    var box = h('div', { class: 'thumb' });
    var url = logoUrl(b);
    box.appendChild(url ? h('img', { src: url, alt: '', loading: 'lazy', decoding: 'async' }) : h('div', { class: 'initial', text: b.name[0] }));
    return box;
  }
  function preload(b) {
    var url = logoUrl(b);
    if (url && typeof Image !== 'undefined') new Image().src = url;
  }

  /* ---------------- settings & state ---------------- */
  var MODES = ['study', 'practice', 'test'];
  function validGroup(g) {
    return g === 'all' || (g.indexOf('r:') === 0 && REGIONS.indexOf(g.slice(2)) >= 0) || (g.indexOf('c:') === 0 && !!COUNTRIES[g.slice(2)]);
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
  function poolNow() { return pool(BRANDS, S.set, S.group); }
  function setNow() { return pool(BRANDS, S.set, 'all'); }
  function groupRegion(g) { return g.indexOf('r:') === 0 ? g.slice(2) : g.indexOf('c:') === 0 ? COUNTRIES[g.slice(2)].region : null; }
  function groupLabel(g) { return g === 'all' ? t('all_regions') : g.indexOf('r:') === 0 ? regionName(g.slice(2)) : countryName(g.slice(2)); }

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
  function aboutLine(b, extra) {
    return place(b.country).concat([
      b.owner ? h('span', { text: '· ' + t('part_of', { owner: b.owner }) }) : null,
      extra ? h('span', { text: '· ' + extra }) : null
    ]).filter(Boolean);
  }

  function prompt(p) {
    clearResult();
    statsOff(S.mode === 'study');
    var box = $('prompt');
    ['ok', 'bad', 'warn'].forEach(function (s) { box.classList.toggle('is-' + s, p.state === s); });
    $('pEyebrow').textContent = p.eyebrow || eyebrow();
    var pKids = (p.nameFlag ? [flag(p.nameFlag)] : []).concat([document.createTextNode(p.name || '')]);
    $('pName').replaceChildren.apply($('pName'), pKids);
    var metaArr = (p.meta == null ? [' '] : [].concat(p.meta)).map(function (m) {
      return typeof m === 'string' ? document.createTextNode(m) : m;
    });
    var joined = [];
    metaArr.forEach(function (m, i) {
      if (i && !(metaArr[i - 1].classList && metaArr[i - 1].classList.contains('flag'))) joined.push(' ');
      joined.push(m);
    });
    $('pMeta').replaceChildren.apply($('pMeta'), joined);
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

  function ask(b, o) {
    peek.q = { id: b.id };
    peek.answer = b.id;
    var typing = S.answer === 'type';
    prompt({ eyebrow: o.eyebrow, name: t('which_brand'), meta: typing ? t('type_meta') : t('pick_meta'), bar: o.bar });
    var box = logoBox(b, { quiz: true });
    show(box);
    if (!session.t0) session.t0 = Date.now();
    var done = false;
    function answer(right, said, extra) {
      if (done) return;
      done = true;
      o.onAnswer(right, said, extra || {}, box);
    }
    if (!typing) {
      var ids = choices(b, setNow());
      peek.q.options = ids;
      setActions(ids.map(function (id, i) {
        return { id: id, label: byId.get(id).name, key: String(i + 1), on: function () { answer(id === b.id, id); } };
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
      var res = check(text, b.id, index);
      if (res.verdict === 'right') return answer(true, b.id, { spelled: res.spelled, hinted: hints > 0 });
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
          prompt({
            eyebrow: o.eyebrow || eyebrow(),
            name: t('which_brand'),
            meta: hints === 1 ? place(b.country) : [h('span', { class: 'letters', text: letters(b.name) })],
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
      var b = item ? byId.get(item.id) : pickNext(items, known, recent);
      recent.push(b.id);
      ask(b, {
        eyebrow: item ? eyebrow(t('again')) : null,
        onAnswer: function (right, said, extra, box) {
          if (mine !== run) return;
          mark(right, { close: extra.spelled, skip: extra.gaveUp });
          flash(right);
          review.record(b.id, right, item);
          learn(b.id, right, extra.hinted);
          fillRail();
          var waiting = review.waiting();
          var s = said && said !== b.id ? byId.get(said) : null;
          var top = right
            ? (extra.spelled ? t('correct_spelled', { name: b.name }) : t('correct'))
            : s
              ? t('you_said', { name: s.name })
              : extra.gaveUp
                ? t('the_answer')
                : extra.typed
                  ? t('not_a_brand', { text: extra.typed })
                  : t('not_quite');
          if (right && extra.hinted) top = t('correct_hinted');
          prompt({
            eyebrow: top,
            name: b.name,
            meta: aboutLine(b, waiting ? t('to_come_back', { n: waiting }) : null),
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
      var b = items[i];
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
              if (!right && a.id === b.id) a.el.classList.add('is-right');
            }
          });
          mark(right, { close: extra.spelled, skip: extra.gaveUp });
          flash(right);
          known[b.id] = right ? Math.max(LEARNED, known[b.id] || 0) : 0;
          saved.set('known', known);
          if (!right) missed.push({ id: b.id, said: said && byId.has(said) ? said : null, typed: extra.typed || null });
          if (!right && S.answer === 'type') {
            prompt({ eyebrow: opts.eyebrow, name: b.name, meta: t('test_was'), bar: opts.bar, state: 'bad' });
          }
          i++;
          setTimeout(step, right ? 420 : S.answer === 'type' ? 1200 : 850);
        }
      };
      ask(b, opts);
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
          ? h('div', { class: 'misses' }, missed.map(function (m) {
              var b = byId.get(m.id);
              return h('button', { type: 'button', onclick: function () { openStudy(m.id); } }, [
                thumb(b),
                h('div', { class: 'lbl' }, [
                  h('b', { text: b.name }),
                  h('small', { text: m.said ? t('you_said_short', { name: byId.get(m.said).name }) : m.typed ? '“' + m.typed + '”' : t('skipped') })
                ])
              ]);
            }))
          : h('p', { class: 'note', text: t('nothing_missed') })
      ]));
      setActions([]);
      var misses = missed.map(function (m) { return byId.get(m.id); });
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
  function studyGrid() {
    studyAt = null;
    peek.study = null;
    var items = poolNow();
    if (!items.length) return emptyPool();
    prompt({
      name: S.group === 'all' ? t('set.' + S.set) : groupLabel(S.group),
      nameFlag: S.group.indexOf('c:') === 0 ? S.group.slice(2) : null,
      meta: t('n_brands', { n: items.length })
    });
    var grid = h('div', { class: 'grid' });
    function card(b) {
      return h('button', {
        class: 'pcard' + ((known[b.id] || 0) >= LEARNED ? ' is-known' : ''),
        type: 'button',
        'data-id': b.id,
        onclick: function () { studyOne(b.id); }
      }, [
        thumb(b),
        h('div', { class: 'lbl' }, [flag(b.country), h('b', { text: b.name })])
      ]);
    }
    function heads(list, keyOf, labelFn) {
      var seen = [];
      list.forEach(function (b) { if (seen.indexOf(keyOf(b)) < 0) seen.push(keyOf(b)); });
      seen.forEach(function (k) {
        var these = list.filter(function (b) { return keyOf(b) === k; });
        grid.appendChild(h('div', { class: 'head' }, labelFn(k, these.length)));
        these.forEach(function (b) { grid.appendChild(card(b)); });
      });
    }
    if (S.group === 'all') heads(items, function (b) { return b.region; }, function (r, n) { return [h('span', { text: regionName(r) + ' · ' + n })]; });
    else if (S.group.indexOf('r:') === 0) heads(items, function (b) { return b.country; }, function (c, n) { return [flag(c), h('span', { text: countryName(c) + ' · ' + n })]; });
    else items.forEach(function (b) { grid.appendChild(card(b)); });
    show(grid);
    setActions([{ id: 'practice', label: t('learn_these'), key: 'p', primary: true, on: function () { setMode('practice'); } }], true);
    advance = null;
  }

  function studyOne(id) {
    studyAt = id;
    peek.study = id;
    var b = byId.get(id);
    var items = poolNow();
    var at = items.findIndex(function (x) { return x.id === id; });
    prompt({ eyebrow: eyebrow(at >= 0 ? t('n_of', { i: at + 1, n: items.length }) : null), name: b.name, meta: aboutLine(b) });
    var facts = h('div', { class: 'facts' }, [
      b.aka && b.aka.length ? h('span', { text: t('also', { names: b.aka.join(', ') }) }) : null
    ]);
    show(h('div', { class: 'detail' }, [logoBox(b), facts]));
    function go(d) {
      if (!items.length) return;
      studyOne(items[(Math.max(0, at) + d + items.length) % items.length].id);
    }
    setActions([
      { id: 'back', label: t('all_brands'), key: 'b', on: studyGrid },
      { id: 'prev', label: t('prev_brand'), key: '←', on: function () { go(-1); } },
      { id: 'next', label: t('next_brand'), key: '→', on: function () { go(1); } }
    ], true);
    advance = function () { go(1); };
  }

  function openStudy(id) {
    var b = byId.get(id);
    if (b && !poolNow().some(function (x) { return x.id === id; })) {
      if (!inSet(b, S.set)) S.set = 'all';
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
    var open = groupRegion(S.group);
    function item(cls, g, label, items, flagOf) {
      var n = learnedIn(items, known);
      var done = items.length && n === items.length;
      return h('button', {
        class: cls,
        type: 'button',
        'data-group': g,
        'aria-pressed': String(S.group === g),
        disabled: !items.length,
        onclick: function () { setGroup(g); }
      }, [
        h('span', null, [flagOf ? flag(flagOf) : null, h('span', { text: label })]),
        h('em', { class: done ? 'done' : '', text: n + '/' + items.length })
      ]);
    }
    list.appendChild(item('rg', 'all', t('all_regions'), all));
    REGIONS.forEach(function (r) {
      var inR = all.filter(function (b) { return b.region === r; });
      if (!inR.length) return;
      var subs = h('div', { class: 'subs' });
      Object.keys(COUNTRIES).forEach(function (c) {
        if (COUNTRIES[c].region !== r) return;
        var inC = inR.filter(function (b) { return b.country === c; });
        if (inC.length) subs.appendChild(item('sb', 'c:' + c, countryName(c), inC, c));
      });
      list.appendChild(h('div', { class: 'rgroup' + (open === r ? ' open' : '') }, [item('rg', 'r:' + r, regionName(r), inR), subs]));
    });
  }

  function showBest() {
    var b = bests[bestKey()];
    $('best').innerHTML = b ? t('best_test', { score: b.score, total: b.total, time: clock(b.time) }) : t('no_test');
  }

  function applyStaticUi() {
    document.documentElement.lang = LANG;
    document.title = (LANG === 'es' ? 'Marcas de Autos' : 'Car Brands') + ' — Todologo';
    $('toolMark').innerHTML = LANG === 'es' ? 'MARCAS <span>DE AUTOS</span>' : 'CAR <span>BRANDS</span>';
    $('brandSub').textContent = t('sub');
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
    setBtns[0].textContent = t('set.popular') + ' (' + BRANDS.filter(function (b) { return b.pop; }).length + ')';
    setBtns[1].textContent = t('set.all') + ' (' + BRANDS.length + ')';
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
    $('introTitle').textContent = t('intro_title');
    $('intro1').innerHTML = t('intro_1', { n: BRANDS.length, p: BRANDS.filter(function (b) { return b.pop; }).length });
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
      var popC = BRANDS.filter(function (b) { return b.pop; }).length;
      return [
        [t('set.popular'), t('set_hint.popular', { n: popC }), S.set === 'popular'],
        [t('set.all'), t('set_hint.all', { n: BRANDS.length }), S.set === 'all']
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

  window.CB = {
    S: S, peek: peek, start: start, setMode: setMode, setGroup: setGroup, setLang: setLang,
    session: session, known: known, openStudy: openStudy, saveSettings: saveSettings,
    check: check, index: index, choices: choices, BRANDS: BRANDS, LOOKALIKES: LOOKALIKES
  };
})();
