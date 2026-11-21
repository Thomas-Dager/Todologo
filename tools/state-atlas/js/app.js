// States & Provinces: pick a country, then learn its first-level subdivisions on the map.
// One state object, one named action per control. The quiz rules are in core/session.js, the
// answer checking in core/answer.js, the drawing in map.js. Data: data/index.json (the countries)
// and data/sub/<ID>.json (one country, loaded when it's picked); the world's country shapes are
// the World Capitals map's own files, so the borders are the same.
import { feature } from '../../capital-atlas/geo.js';
import { createMap, COL, rewind, mainCluster } from './map.js';
import { norm } from './core/answer.js';
import { newSession, current, finished, answerClick, answerType, giveUp, skip, summary, better } from './core/session.js';

const $ = (id) => document.getElementById(id);
const saved = window.SiteProgress ? window.SiteProgress.tool('state-atlas') : { get: (k, d) => d, set() {} };
const CONTINENTS = [
	['north-america', 'North America'], ['south-america', 'South America'], ['asia', 'Asia'],
	['europe', 'Europe'], ['africa', 'Africa'], ['oceania', 'Oceania'],
];
const MODE_HINT = {
	study: 'Step through the regions with the arrows, or click any one to see its name. No score.',
	practice: 'Every region is asked. Misses come back at the end of the round for another go.',
	test: 'One go at each region, against the clock.',
};
const FORMAT_HINT = {
	click: 'You get a name; click it on the map. Tiny ones have a ring you can click.',
	type: 'A region lights up; type its name. Accents don’t matter, and a small spelling slip counts as half a point.',
};

const state = {
	countries: [], // [{ id, name, region, count, kind }]
	none: [], // countries with nothing to learn
	byId: new Map(),
	open: null, // the country being studied: { id, name, kind, units: [{ name, alts?, type? }] }
	mode: ['study', 'practice', 'test'].includes(saved.get('mode')) ? saved.get('mode') : 'study',
	format: saved.get('format') === 'type' ? 'type' : 'click',
	names: false, // Study: every name on the map
	selected: null, // Study and review: the unit being looked at
	session: null,
	review: null, // the finished round: { sum, ms, best }
	flash: null, // { i, color, until }
	hover: null,
	startedAt: 0,
	collapsed: new Set(),
};
const loaded = new Map(); // country id -> its data

const narrow = () => window.innerWidth <= 900;
function insets() {
	const pr = $('prompt').getBoundingClientRect();
	if (narrow()) return { left: 10, right: 10, top: pr.bottom + 10, bottom: 74 };
	const l = $('left').getBoundingClientRect(), r = $('right').getBoundingClientRect();
	return { left: l.right + 16, right: window.innerWidth - r.left + 16, top: pr.bottom + 14, bottom: 64 };
}

const view = {
	country: (c) => (!c.id ? COL.territory : state.open ? COL.other : state.byId.has(c.id) ? (state.hover && state.hover.country === c.id ? '#e2d8c0' : COL.land) : COL.landOff),
	fill(i) {
		const f = state.flash;
		if (f && f.i === i && performance.now() < f.until) return f.color;
		const s = state.session, shown = s || state.review;
		const r = shown && (state.review ? state.review.result : s.result).get(i);
		if (r) return r === 'ok' ? COL.ok : r === 'close' ? COL.close : COL.bad;
		return state.hover && state.hover.unit === i ? '#e2d8c0' : COL.land;
	},
	// the province lit up: the one being asked about (typing) or looked at. fill: washed blue all over;
	// in the results it keeps its right/wrong colour and only its edge lights
	lit() {
		const s = state.session;
		if (s && !state.review && s.format === 'type' && current(s) != null) return [{ i: current(s), fill: true }];
		return state.selected != null ? [{ i: state.selected, fill: !state.review }] : [];
	},
	callouts() {
		if (state.selected == null || !state.open) return [];
		if (state.session && !state.review) return [];
		return [{ i: state.selected, text: state.open.units[state.selected].name }];
	},
	names: () => state.names && state.mode === 'study' && !!state.open,
};

// The World Capitals map's other files, fetched when the map first wants them: its finer country
// shapes (zoomed in) and its lakes and rivers. A failed fetch only means the coarser picture stays.
const CAPITALS = '../capital-atlas/data/';
function fetchForMap(file) {
	fetch(CAPITALS + file + '.json')
		.then((r) => r.json())
		.then((t) => {
			if (file.startsWith('water-')) map.setWater(file.slice(6), feature(t, t.objects.lakes).features, feature(t, t.objects.rivers).features);
			else map.setWorldDetail(file.slice(4), feature(t, t.objects.land).features);
		})
		.catch(() => {});
}
const map = createMap({ canvas: $('map'), insets, view, onClick: clickMap, onHover: hoverMap, need: fetchForMap });

/* ---------- small helpers ---------- */
let toastTimer = 0;
function toast(msg, kind = '') {
	const t = $('toast');
	t.textContent = msg;
	t.className = 'toast show ' + kind;
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
let pulseTimer = 0;
function pulse(kind) {
	const p = $('prompt');
	p.classList.remove('is-ok', 'is-bad', 'is-close');
	p.classList.add('is-' + kind);
	clearTimeout(pulseTimer);
	pulseTimer = setTimeout(() => p.classList.remove('is-ok', 'is-bad', 'is-close'), 600);
}
function flash(i, color, ms = 700) {
	state.flash = { i, color, until: performance.now() + ms };
	map.invalidate();
	setTimeout(() => map.invalidate(), ms + 30);
}
const clock = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
const points = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const bestKey = () => `${state.open.id}|${state.mode}|${state.format}`;
const kindOne = () => (state.open.kind === 'subdivisions' ? 'region' : state.open.kind.replace(/ies$/, 'y').replace(/s$/, ''));

/* ---------- actions ---------- */
async function openCountry(id, { animate = true } = {}) {
	const meta = state.byId.get(id);
	if (!meta) return;
	setSheet(null);
	let data = loaded.get(id);
	if (!data) {
		$('pMeta').textContent = `Loading ${meta.name}…`;
		try {
			const res = await fetch(`data/sub/${id}.json`);
			if (!res.ok) throw new Error(res.status);
			data = await res.json();
		} catch (err) {
			toast(`Couldn’t load ${meta.name}. Check your connection and try again.`, 'bad');
			render();
			return;
		}
		const fc = feature(data.topology, data.topology.objects.units);
		fc.features.forEach((f, i) => {
			f.properties = { name: data.units[i].name };
			rewind(f);
		});
		data.features = fc.features;
		// what the view is fitted to: the country without one or two far-off units
		const main = mainCluster(fc.features);
		data.shape = main.shape;
		data.far = main.far.map((i) => data.units[i].name).sort();
		loaded.set(id, data);
	}
	state.open = data;
	state.selected = null;
	state.session = state.review = null;
	saved.set('country', id);
	if (location.hash !== '#selftest') history.replaceState(null, '', '#' + id);
	map.setUnits(data.features, id);
	render(); // first, so the prompt has its real height when the view is fitted under it
	const row = $('list').querySelector('button[aria-pressed="true"]');
	if (row) row.scrollIntoView({ block: 'nearest' });
	map.frame(data.shape, animate);
	if (state.mode !== 'study') startRound();
}
function closeCountry() {
	state.open = null;
	state.selected = null;
	state.session = state.review = null;
	saved.set('country', null);
	if (location.hash !== '#selftest') history.replaceState(null, '', location.pathname);
	map.setUnits([], null);
	render();
	map.frame(null);
}
// Esc with a country open: back to the whole globe. A round with answers already in it asks for a second press first,
// so one stray key doesn't throw a test away.
let leaveAsked = -Infinity;
function escCountry() {
	const s = state.session;
	const midRound = s && !state.review && (s.result.size > 0 || s.wrongNow);
	if (midRound && performance.now() - leaveAsked > 3000) {
		leaveAsked = performance.now();
		toast('Press Esc again to leave this round.');
		return;
	}
	leaveAsked = -Infinity;
	closeCountry();
}
function setMode(mode) {
	state.mode = mode;
	saved.set('mode', mode);
	state.selected = null;
	state.session = state.review = null;
	if (state.open && mode !== 'study') startRound();
	else render();
}
function setFormat(format) {
	state.format = format;
	saved.set('format', format);
	if (state.open && state.mode !== 'study') startRound();
	else render();
}
function startRound(only = null) {
	state.session = newSession(state.open.units, { mode: state.mode, format: state.format, only });
	state.review = null;
	state.selected = null;
	state.startedAt = performance.now();
	render();
	showCurrent();
}
function showCurrent() {
	const s = state.session;
	if (!s || finished(s)) return;
	if (s.format === 'type') {
		map.lookAt(current(s));
		$('answer').value = '';
		if (!narrow() || document.activeElement === $('answer')) $('answer').focus({ preventScroll: true });
	}
	map.invalidate();
}
function endRound() {
	const s = state.session, sum = summary(s), ms = performance.now() - state.startedAt;
	const all = saved.get('best', {});
	const mine = { score: sum.score, total: sum.total, ms: Math.round(ms) };
	const whole = sum.total === state.open.units.length; // a "practise the misses" round doesn't count as a best
	const isBest = whole && better(mine, all[bestKey()]);
	if (isBest) {
		all[bestKey()] = mine;
		saved.set('best', all);
	}
	state.review = { sum, ms, result: s.result, isBest };
	state.selected = null;
	render();
}
// After any answer: feedback, then the next question or the results
function afterAnswer(res, pickedName) {
	const s = state.session, name = state.open.units[res.target].name;
	if (res.outcome === 'ok') {
		flash(res.target, COL.ok);
		pulse('ok');
	} else if (res.outcome === 'close') {
		flash(res.target, COL.close);
		pulse('close');
		toast(`Close: it’s spelled ${name}. Half a point.`, 'close');
	} else if (res.outcome === 'gaveup') {
		flash(res.target, COL.bad, 1100);
		map.lookAt(res.target);
		toast(s.format === 'type' ? `It’s ${name}.` : `${name} is here.`, 'bad');
	} else {
		pulse('bad');
		if (res.moved) {
			flash(res.target, COL.bad, 1100);
			toast(s.format === 'type' ? `It’s ${name}.` : `That’s ${pickedName}. ${name} is marked in red.`, 'bad');
		} else toast(s.format === 'type' ? 'Not that. Try again, or press Show me.' : `That’s ${pickedName}. Try again.`, 'bad');
	}
	if (finished(s)) endRound();
	else {
		render();
		if (res.moved) showCurrent();
	}
}
function clickMap(hit) {
	if (!hit) return;
	// the same words as World Capitals for a lake, and for land that is no country's (Greenland, Western Sahara)
	if (hit.lake != null) return toast(hit.lake ? `That’s ${hit.lake}.` : 'That’s a lake.');
	if (hit.place) return toast(`${hit.place}${hit.of && hit.of !== hit.place ? ` (${hit.of})` : ''} isn’t a country in this quiz.`);
	if (hit.country) {
		if (state.open) return; // while a country is open, the rest of the world is just background
		return openCountry(hit.country);
	}
	const i = hit.unit, s = state.session;
	if (s && !state.review) {
		if (s.format !== 'click') return;
		if (s.result.has(i) && s.result.get(i) !== 'bad' && current(s) !== i) return toast(`${state.open.units[i].name} is already done.`);
		const res = answerClick(s, i);
		if (res) afterAnswer(res, state.open.units[i].name);
		return;
	}
	state.selected = state.selected === i ? null : i;
	render();
}
function hoverMap(hit) {
	// only what a click would pick lights up: a province, or a country on the world view (not a lake, nor land that is no country's)
	const live = hit && (hit.unit != null ? !(state.session && !state.review && state.session.format === 'type') : hit.country ? !state.open : false);
	const next = live ? hit : null;
	if (JSON.stringify(next) === JSON.stringify(state.hover)) return;
	state.hover = next;
	$('stage').classList.toggle('hovering', !!next);
	map.invalidate();
}
function submitTyped() {
	const s = state.session;
	if (!s || state.review) return;
	const res = answerType(s, $('answer').value);
	if (!res) return;
	if (res.outcome === 'empty') return doSkip();
	if (res.moved || res.outcome === 'wrong') $('answer').select();
	afterAnswer(res);
}
function doSkip() {
	const s = state.session;
	if (!s || state.review) return;
	if (!skip(s)) return toast('That’s the last one left.');
	render();
	showCurrent();
}
function doGiveUp() {
	const s = state.session;
	if (!s || state.review) return;
	afterAnswer(giveUp(s));
}
function studyStep(d) {
	if (!state.open || (state.session && !state.review)) return;
	const n = state.open.units.length;
	state.selected = state.selected == null ? (d > 0 ? 0 : n - 1) : (state.selected + d + n) % n;
	map.lookAt(state.selected);
	render();
}
function setNames(on) {
	state.names = on;
	render();
}
function setSheet(which) {
	document.body.classList.toggle('sheet-countries', which === 'countries');
	document.body.classList.toggle('sheet-options', which === 'options');
}

/* ---------- drawing the page ---------- */
function renderList() {
	const q = norm($('search').value).replace(/ /g, '');
	const frag = document.createDocumentFragment();
	for (const [key, label] of CONTINENTS) {
		const all = state.countries.filter((c) => c.region === key);
		const rows = all.filter((c) => !q || norm(c.name).replace(/ /g, '').includes(q));
		if (!rows.length) continue;
		const shut = !q && state.collapsed.has(key);
		const h = document.createElement('h3');
		const hb = document.createElement('button');
		hb.type = 'button';
		hb.dataset.group = key;
		hb.setAttribute('aria-expanded', String(!shut));
		hb.innerHTML = `<span>${label}</span><em>${rows.length}${shut ? ' ▸' : ''}</em>`;
		h.append(hb);
		frag.append(h);
		if (shut) continue;
		const ul = document.createElement('ul');
		for (const c of rows) {
			const li = document.createElement('li'), b = document.createElement('button');
			b.type = 'button';
			b.dataset.id = c.id;
			b.setAttribute('aria-pressed', String(!!state.open && state.open.id === c.id));
			const name = document.createElement('span'), n = document.createElement('em');
			name.textContent = c.name;
			n.textContent = c.count;
			b.append(name, n);
			li.append(b);
			ul.append(li);
		}
		frag.append(ul);
	}
	if (!q && state.none.length) {
		const p = document.createElement('p');
		p.className = 'none';
		p.textContent = `Nothing to learn in ${state.none.map((c) => c.name).join(' and ')}: no subdivisions.`;
		frag.append(p);
	}
	if (!frag.childNodes.length) {
		const p = document.createElement('p');
		p.className = 'none';
		p.textContent = 'No country by that name.';
		frag.append(p);
	}
	$('list').replaceChildren(frag);
}
function renderPrompt() {
	const o = state.open, s = state.session, rv = state.review;
	const quiz = !!s && !rv;
	$('answerForm').hidden = !(quiz && s.format === 'type');
	$('quizRow').hidden = !quiz;
	$('review').hidden = !rv;
	$('pBar').hidden = !quiz;
	$('prevBtn').hidden = $('nextBtn').hidden = !o || quiz;
	if (!o) {
		const total = state.countries.reduce((n, c) => n + c.count, 0);
		$('pEyebrow').textContent = 'States & Provinces';
		$('pName').textContent = 'Pick a country';
		$('pMeta').textContent = state.countries.length ? `${state.countries.length} countries · ${total.toLocaleString('en')} regions · ${narrow() ? 'tap Countries, or a country on the globe' : 'click one in the list or on the globe'}` : 'Loading…';
		return;
	}
	const label = { study: 'Study', practice: 'Practice', test: 'Test' }[state.mode];
	$('pEyebrow').textContent = `${label} · ${o.name}`;
	if (rv) {
		$('pName').textContent = `${points(rv.sum.score)} / ${rv.sum.total}`;
		const best = saved.get('best', {})[bestKey()];
		$('pMeta').textContent = `${clock(rv.ms)}${rv.isBest ? ' · your best here' : best ? ` · best ${points(best.score)}/${best.total} in ${clock(best.ms)}` : ''} · click a region to see its name`;
		$('rOk').textContent = rv.sum.ok;
		$('rClose').textContent = rv.sum.close;
		$('rCloseKey').hidden = !rv.sum.close;
		$('rBad').textContent = rv.sum.bad;
		$('missedBtn').hidden = !rv.sum.missed.length;
		if (state.selected != null) $('pName').textContent = o.units[state.selected].name;
		return;
	}
	if (quiz) {
		const i = current(s), done = s.total - new Set(s.queue).size;
		$('pName').textContent = s.format === 'click' ? o.units[i].name : `Which ${kindOne()} is lit up?`;
		$('pMeta').textContent = `${Math.min(done + 1, s.total)} of ${s.total} · ${s.format === 'click' ? 'click it on the map' : 'type its name; Enter with nothing typed skips'}`;
		$('pBarFill').style.width = `${(100 * done) / s.total}%`;
		return;
	}
	if (state.selected == null) {
		$('pName').textContent = `${o.units.length} ${o.kind}`;
		$('pMeta').textContent = o.far.length
			? `${o.far.join(' and ')} ${o.far.length > 1 ? 'are' : 'is'} off to the side: drag the map or zoom out`
			: narrow() ? 'Tap a region to see its name' : '← → to step through them, or click any one';
	} else {
		const u = o.units[state.selected];
		$('pName').textContent = u.name;
		$('pMeta').textContent = `${state.selected + 1} of ${o.units.length}${u.type ? ' · ' + u.type : ''}${u.alts && u.alts.length ? ' · also ' + u.alts.slice(0, 2).join(', ') : ''}`;
	}
}
function renderStats() {
	const s = state.session, rv = state.review;
	if (!s) {
		$('sScore').textContent = '–';
		$('sTime').textContent = '0:00';
		$('sStreak').textContent = '0';
		return;
	}
	const sum = summary(s);
	$('sScore').textContent = `${points(sum.score)}/${s.total}`;
	$('sTime').textContent = clock(rv ? rv.ms : performance.now() - state.startedAt);
	$('sStreak').textContent = s.streak;
}
function renderControls() {
	for (const [id, v] of [['modeSeg', state.mode], ['formatSeg', state.format]]) {
		for (const b of $(id).querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.v === v));
	}
	$('modeHint').textContent = MODE_HINT[state.mode];
	$('formatHint').textContent = state.mode === 'study' ? 'Used in Practice and Test.' : FORMAT_HINT[state.format];
	$('restartBtn').disabled = !state.open || state.mode === 'study';
	$('namesBtn').disabled = !state.open || state.mode !== 'study';
	$('namesBtn').setAttribute('aria-pressed', String(view.names()));
	$('worldBtn').disabled = !state.open;
	const best = state.open && state.mode !== 'study' ? saved.get('best', {})[bestKey()] : null;
	$('bestLine').textContent = best ? `Best here: ${points(best.score)}/${best.total} in ${clock(best.ms)}` : '';
	$('bestLine').hidden = !best;
}
function render() {
	renderList();
	renderPrompt();
	renderStats();
	renderControls();
	map.invalidate();
}
setInterval(() => {
	if (state.session && !state.review) renderStats();
}, 500);

/* ---------- controls ---------- */
$('list').addEventListener('click', (e) => {
	const g = e.target.closest('button[data-group]');
	if (g) {
		state.collapsed[state.collapsed.has(g.dataset.group) ? 'delete' : 'add'](g.dataset.group);
		return renderList();
	}
	const b = e.target.closest('button[data-id]');
	if (b) openCountry(b.dataset.id);
});
$('search').addEventListener('input', renderList);
$('modeSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (b && b.dataset.v !== state.mode) setMode(b.dataset.v);
});
$('formatSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (b && b.dataset.v !== state.format) setFormat(b.dataset.v);
});
$('answerForm').addEventListener('submit', (e) => {
	e.preventDefault();
	submitTyped();
});
$('skipBtn').addEventListener('click', doSkip);
$('giveUpBtn').addEventListener('click', doGiveUp);
$('againBtn').addEventListener('click', () => startRound());
$('missedBtn').addEventListener('click', () => {
	const missed = state.review.sum.missed;
	state.mode = 'practice';
	saved.set('mode', 'practice');
	startRound(missed);
});
$('studyBtn').addEventListener('click', () => setMode('study'));
$('restartBtn').addEventListener('click', () => state.open && state.mode !== 'study' && startRound());
$('namesBtn').addEventListener('click', () => setNames(!state.names));
$('prevBtn').addEventListener('click', () => studyStep(-1));
$('nextBtn').addEventListener('click', () => studyStep(1));
$('zoomIn').addEventListener('click', () => map.zoomBy(1.4));
$('zoomOut').addEventListener('click', () => map.zoomBy(1 / 1.4));
$('resetView').addEventListener('click', () => map.frame(state.open ? state.open.shape : null));
$('worldBtn').addEventListener('click', closeCountry);
$('countriesBtn').addEventListener('click', () => setSheet('countries'));
$('optionsBtn').addEventListener('click', () => setSheet('options'));
for (const b of document.querySelectorAll('[data-close]')) b.addEventListener('click', () => setSheet(null));

document.addEventListener('keydown', (e) => {
	const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
	if (e.key === 'Escape') {
		if (document.body.classList.contains('sheet-countries') || document.body.classList.contains('sheet-options')) setSheet(null);
		else if (state.selected != null) {
			state.selected = null;
			render();
		} else if (state.open) escCountry();
		else map.frame(null);
		return;
	}
	if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
	if (e.key === 'ArrowRight' || e.key === 'ArrowDown') studyStep(1);
	else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') studyStep(-1);
	else if (e.key === '+' || e.key === '=') map.zoomBy(1.25);
	else if (e.key === '-' || e.key === '_') map.zoomBy(1 / 1.25);
	else if ((e.key === 'n' || e.key === 'N') && !$('namesBtn').disabled) setNames(!state.names);
	else return;
	e.preventDefault();
});
window.addEventListener('resize', () => {
	if (!narrow()) setSheet(null);
});

/* ---------- start ---------- */
async function boot() {
	const [index, low] = await Promise.all([
		fetch('data/index.json').then((r) => r.json()),
		fetch(CAPITALS + 'map-low.json').then((r) => r.json()),
	]);
	state.countries = index.countries;
	state.none = index.none;
	state.byId = new Map(index.countries.map((c) => [c.id, c]));
	const names = new Map([...index.countries, ...index.none].map((c) => [c.id, c.name]));
	map.setWorld(feature(low, low.objects.land).features.map((f) => ({ id: f.properties.id || null, name: names.get(f.properties.id) || f.properties.name, of: f.properties.of, feature: f })));
	map.resize();
	render();
	map.frame(null, false);
	$('loading').hidden = true;
	fetchForMap('water-low');
	const want = /^#[A-Z]{3}$/.test(location.hash) ? location.hash.slice(1) : saved.get('country', null);
	if (want && state.byId.has(want)) await openCountry(want, { animate: false });
	if (location.hash === '#selftest') {
		window.__stateAtlas = { state, map, view, openCountry, closeCountry, setMode, setFormat, startRound, clickMap, studyStep, loaded, current, summary };
	}
}
boot().catch((err) => {
	console.error(err);
	$('loadingText').textContent = 'The map didn’t load. Check your connection and reload the page.';
});
