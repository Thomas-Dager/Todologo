/* Poker Trainer
 *
 * Six drills in the order a beginner needs them, each with three modes (Study, Practice, Test):
 *   Hand ranks, Who wins?         reading hand strength
 *   Starting hands                which two cards to raise from which seat
 *   Count your outs, The odds, Call or fold?   when chasing a draw is worth the price
 *
 * Plain modules, no framework and no build step. Everything the tool knows about poker is in
 * js/core/ (the hand evaluator, the chart, the draw maths, the question makers); this file is the
 * page: what each drill shows, the buttons, the scoring. Settings, best scores and the starting
 * hands you miss are saved in the browser through /js/progress.js.
 */
import { RANKS, RANK_LABELS, SUITS, SUIT_NAMES, CATEGORIES, FIVE_CARD_COUNTS, FIVE_CARD_TOTAL, cards as parse } from './core/cards.js';
import { seat, raises, share, raisedFrom, rule, handName } from './core/chart.js';
import { DRAWS, BET_SIZES, OUT_COUNTS, hitChance, ruleOfThumb } from './core/draws.js';
import { MAKERS, makeWinner, makeCall, buildTest, TEST_SIZE, PASS_MARK, passes } from './core/questions.js';
import { createReview } from './core/review.js';

const $ = (id) => document.getElementById(id);
const saved = window.SiteProgress ? window.SiteProgress.tool('poker-trainer') : { get: (k, d) => d, set: () => {} };

// ------------------------------------------------------------------ small helpers
function h(tag, attrs, kids) {
	const el = document.createElement(tag);
	for (const k in attrs || {}) {
		const v = attrs[k];
		if (v == null || v === false) continue;
		if (k === 'class') el.className = v;
		else if (k === 'text') el.textContent = v;
		else if (k === 'html') el.innerHTML = v;
		else if (k === 'style') el.style.cssText = v;
		else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
		else el.setAttribute(k, v === true ? '' : v);
	}
	for (const kid of [].concat(kids || [])) if (kid) el.append(kid);
	return el;
}
const clock = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const SUIT_MARK = ['♣', '♦', '♥', '♠'];
/** Cards as text, for lists: A♥ K♦ */
const txt = (cs) => cs.map((c) => RANK_LABELS[c >> 2] + SUIT_MARK[c & 3]).join(' ');

// ------------------------------------------------------------------ settings
const DRILLS = [
	{ id: 'ranks', label: 'Hand ranks' },
	{ id: 'winner', label: 'Who wins?' },
	{ id: 'preflop', label: 'Starting hands' },
	{ id: 'outs', label: 'Count your outs' },
	{ id: 'odds', label: 'The odds' },
	{ id: 'call', label: 'Call or fold?' },
];
const drillOf = (id) => DRILLS.find((d) => d.id === id);
const S = {
	drill: 'ranks',
	mode: { ranks: 'study', winner: 'study', preflop: 'study', outs: 'study', odds: 'study', call: 'study' },
	seat: 'all', // starting hands: one seat, or all of them
};
(function load() {
	const s = saved.get('settings', null);
	if (!s || typeof s !== 'object') return;
	if (drillOf(s.drill)) S.drill = s.drill;
	// a drill left in Test reopens in Practice, so the clock isn't already running when the page loads
	for (const k in S.mode) if (s.mode && ['study', 'practice', 'test'].includes(s.mode[k])) S.mode[k] = s.mode[k] === 'test' ? 'practice' : s.mode[k];
	if (s.seat === 'all' || seat(s.seat)) S.seat = s.seat;
})();
const saveSettings = () => saved.set('settings', S);
const mode = () => S.mode[S.drill];

// best test per drill (starting hands: per seat setting), and the starting hands missed in practice
const bests = saved.get('best', {});
const misses = saved.get('misses', {});
const bestKey = (id) => (id === 'preflop' ? 'preflop:' + S.seat : id);
const passed = (id) => {
	const b = bests[id === 'preflop' ? 'preflop:all' : id];
	return !!b && passes(b.score, b.total);
};

// ------------------------------------------------------------------ cards and tables
const felt = $('felt');
function cardEl(c, cls) {
	const svg = (k) => `<svg class="${k}" viewBox="0 0 24 24" aria-hidden="true"><use href="#suit-${SUITS[c & 3]}"/></svg>`;
	const red = (c & 3) === 1 || (c & 3) === 2;
	return h('div', {
		class: 'card' + (red ? ' red' : '') + (cls ? ' ' + cls : ''),
		role: 'img',
		'aria-label': RANK_LABELS[c >> 2] + ' of ' + SUIT_NAMES[c & 3],
		html: `<span class="cr">${RANK_LABELS[c >> 2]}</span>${svg('cs')}${svg('cp')}`,
	});
}
const slotEl = () => h('div', { class: 'card slot', role: 'img', 'aria-label': 'A card still to come' });
/** A labelled row of cards. lit: after the answer, the cards that count stay bright and the rest fade. */
function group(label, cs, o = {}) {
	const row = h('div', { class: 'cardrow' });
	for (const c of cs) row.append(cardEl(c, (o.fresh ? 'in ' : '') + (o.lit ? (o.lit.includes(c) ? 'lit' : 'dim') : '')));
	for (let i = 0; i < (o.slots || 0); i++) row.append(slotEl());
	return h('div', { class: 'grp ' + (o.cls || '') }, [h('div', { class: 'tag' + (o.tagCls ? ' ' + o.tagCls : ''), text: label }), row, o.under || null]);
}
const tile = (label, value, cls) => h('div', { class: 'chip' + (cls ? ' ' + cls : '') }, [h('small', { text: label }), h('b', { text: value })]);

/** The six seats seen from above, you at the bottom; play runs clockwise, so the seats to your left act after you. */
function seatsEl(heroId) {
	const order = ['utg', 'hj', 'co', 'btn', 'sb', 'bb'];
	const hero = order.indexOf(heroId);
	const cx = 160;
	const cy = 86;
	const at = (k, f) => {
		const a = ([90, 150, 210, 270, 330, 30][(k - hero + 6) % 6] * Math.PI) / 180;
		return [cx + 122 * f * Math.cos(a), cy + 58 * f * Math.sin(a)];
	};
	let out = `<ellipse class="rail-line" cx="${cx}" cy="${cy}" rx="122" ry="58"/>`;
	order.forEach((id, k) => {
		const [x, y] = at(k, 1);
		const cls = k < hero ? 'out' : k === hero ? 'you' : '';
		out += `<g class="seat ${cls}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}">${id === 'bb' ? 'BB' : seat(id).short}</text></g>`;
	});
	const [bx, by] = at(3, 0.66);
	out += `<g class="dealer"><circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="7.5"/><text x="${bx.toFixed(1)}" y="${(by + 3.2).toFixed(1)}">D</text></g>`;
	const s = seat(heroId);
	const line = hero === 0 ? 'You act first' : hero === 1 ? '1 player folded' : hero + ' players folded';
	out += `<text class="mid" x="${cx}" y="${cy - 3}">${line}</text><text class="mid" x="${cx}" y="${cy + 11}">${s.behind} still to act</text>`;
	return h('div', { style: 'display:contents', html: `<svg class="seats" viewBox="0 0 320 172" role="img" aria-label="${s.name}: ${line.toLowerCase()}, ${s.behind} still to act">${out}</svg>` });
}

// ------------------------------------------------------------------ what each drill shows
const boardTag = (q) => (q.board.length === 3 ? 'The flop' : q.board.length === 4 ? 'The turn' : 'Board');
const VIEW = {
	ranks: {
		ask: () => ({ name: 'What’s your best hand?', meta: 'The best five cards out of your two and the board' }),
		table: (q, done) => [
			h('div', { class: 'deal' }, [group('Board', q.board, { cls: 'board', lit: done && q.best, fresh: !done }), group('Your cards', q.hole, { cls: 'mine', lit: done && q.best, fresh: !done })]),
		],
		buttons: () => CATEGORIES.map((label, i) => ({ id: String(i), label, key: String(i + 1), wide: true })),
		answerText: (q) => CATEGORIES[q.answer],
		result: (q) => q.name,
		line: (q) => `${txt(q.hole)} on ${txt(q.board)}`,
		keys: '<kbd>1</kbd>–<kbd>9</kbd> for the hands, weakest to strongest · <kbd>Space</kbd> next',
	},
	winner: {
		ask: () => ({ name: 'Who wins?', meta: 'Each player’s best five cards. Suits never break a tie.' }),
		table: (q, done) => {
			const who = (i) => {
				const won = done && (q.answer === 'split' || q.answer === 'AB'[i]);
				return group('Player ' + 'AB'[i] + (done ? (q.answer === 'split' ? ' · splits' : won ? ' · wins' : '') : ''), q.hands[i], {
					cls: won ? 'is-win' : '',
					tagCls: won ? 'win' : '',
					fresh: !done,
					under: h('div', { class: 'res', text: done ? q.names[i] : '' }),
				});
			};
			return [h('div', { class: 'deal' }, [group('Board', q.board, { cls: 'board', fresh: !done }), h('div', { class: 'players' }, [who(0), who(1)])])];
		},
		buttons: () => [
			{ id: 'A', label: 'A wins', key: 'a' },
			{ id: 'split', label: 'Split', key: 's', color: 'split' },
			{ id: 'B', label: 'B wins', key: 'b' },
		],
		answerText: (q) => (q.answer === 'split' ? 'Split' : q.answer + ' wins'),
		result: (q) => (q.answer === 'split' ? 'Split pot' : `Player ${q.answer} wins`),
		line: (q) => `A ${txt(q.hands[0])} · B ${txt(q.hands[1])} on ${txt(q.board)}`,
		keys: '<kbd>A</kbd> A wins · <kbd>S</kbd> split · <kbd>B</kbd> B wins · <kbd>Space</kbd> next',
	},
	preflop: {
		ask: (q) => {
			const s = seat(q.seat);
			const left = s.behind === 1 ? 'only the big blind is left' : `${s.behind} players still to act`;
			return { name: s.name, meta: (q.seat === 'utg' ? 'You’re first to act' : 'Everyone before you folded') + ' · ' + left };
		},
		table: (q, done) => [h('div', { class: 'deal' }, [seatsEl(q.seat), group('Your cards', q.hole, { cls: 'mine', fresh: !done })])],
		buttons: () => [
			{ id: 'raise', label: 'Raise', key: 'r', color: 'raise' },
			{ id: 'fold', label: 'Fold', key: 'f', color: 'fold' },
		],
		answerText: (q) => cap(q.answer),
		result: (q) => cap(q.answer) + ' · ' + q.name,
		tip: (q) => {
			const from = raisedFrom(q.hand).map((id) => seat(id).name);
			return `${q.why} ${from.length ? `This hand is raised from: ${from.join(', ')}.` : 'This hand isn’t raised first from any seat.'}`;
		},
		line: (q) => `${seat(q.seat).name}: ${q.name}`,
		keys: '<kbd>R</kbd> raise · <kbd>F</kbd> fold · <kbd>Space</kbd> next',
	},
	outs: {
		ask: (q) => ({ name: 'How many outs?', meta: 'Cards that complete your straight or flush · ' + (q.toCome === 2 ? 'two cards to come' : 'one card to come') }),
		table: (q, done) => [
			h('div', { class: 'deal' }, [
				group(boardTag(q), q.board, { cls: 'board', slots: 5 - q.board.length, fresh: !done }),
				group('Your cards', q.hole, { cls: 'mine', fresh: !done }),
				done ? h('div', { class: 'grp' }, [h('div', { class: 'tag', text: 'Your outs' }), h('div', { class: 'strip' }, sortOuts(q).map((c) => cardEl(c)))]) : null,
			]),
		],
		buttons: () => OUT_COUNTS.map((n, i) => ({ id: String(n), label: String(n), key: String(i + 1), num: true })),
		answerText: (q) => q.answer + ' outs',
		result: (q) => `${q.answer} outs`,
		tip: (q) => `<b>${q.name}.</b> ${q.why}`,
		line: (q) => `${txt(q.hole)} on ${txt(q.board)}`,
		keys: '<kbd>1</kbd>–<kbd>5</kbd> for the buttons, left to right · <kbd>Space</kbd> next',
	},
	odds: {
		ask: (q) =>
			q.kind === 'chance'
				? { name: 'How often will you hit?', meta: 'The rule of 2 and 4' }
				: { name: 'How often must you win to call?', meta: 'The call, as a share of the pot once you’ve called' },
		table: (q) =>
			q.kind === 'chance'
				? [h('div', { class: 'tiles' }, [tile('Outs', String(q.outs), 'big'), tile(q.toCome === 1 ? 'Card to come' : 'Cards to come', String(q.toCome), 'big')])]
				: [
						h('div', { class: 'tiles' }, [tile('Pot', '$' + q.pot, 'big'), tile('Their bet', '$' + q.bet, 'big')]),
						h('p', { class: 'note', text: `Your opponent bets $${q.bet} into a pot of $${q.pot}.` }),
					],
		buttons: (q) => q.options.map((n, i) => ({ id: String(n), label: n + '%', key: String(i + 1), num: true })),
		answerText: (q) => q.answer + '%',
		result: (q) => q.name,
		line: (q) => (q.kind === 'chance' ? `${q.outs} outs, ${q.toCome === 1 ? 'one card' : 'two cards'} to come` : `$${q.bet} bet into $${q.pot}`),
		keys: '<kbd>1</kbd>–<kbd>6</kbd> for the buttons, left to right · <kbd>Space</kbd> next',
	},
	call: {
		ask: (q) => ({ name: 'Call or fold?', meta: q.toCome === 1 ? 'The turn: one card to come' : 'Your opponent is all-in on the flop: two cards to come' }),
		table: (q, done) => [
			h('div', { class: 'deal' }, [
				group(boardTag(q), q.board, { cls: 'board', slots: 5 - q.board.length, fresh: !done }),
				group('Your cards', q.hole, { cls: 'mine', fresh: !done }),
				done
					? h('div', { class: 'tiles' }, [
							tile('You hit', Math.round(100 * q.hit) + '%', q.answer === 'call' ? 'good' : 'poor'),
							h('span', { class: 'versus', text: q.answer === 'call' ? 'more than' : 'less than' }),
							tile('You need', Math.round(100 * q.need) + '%'),
						])
					: h('div', { class: 'tiles' }, [tile('Pot', '$' + q.pot), tile(q.toCome === 2 ? 'Their all-in' : 'Their bet', '$' + q.bet)]),
			]),
		],
		buttons: () => [
			{ id: 'call', label: 'Call', key: 'c', color: 'call' },
			{ id: 'fold', label: 'Fold', key: 'f', color: 'fold' },
		],
		answerText: (q) => cap(q.answer),
		result: (q) => cap(q.answer),
		line: (q) => `${DRAWS[q.kind].label}, $${q.bet} into $${q.pot}, ${q.toCome === 1 ? 'one card' : 'two cards'} to come`,
		keys: '<kbd>C</kbd> call · <kbd>F</kbd> fold · <kbd>Space</kbd> next',
	},
};
/** A draw's outs, flush cards first, then by rank. */
function sortOuts(q) {
	const suit = q.draw.suit;
	return q.outs.slice().sort((a, b) => ((b & 3) === suit) - ((a & 3) === suit) || (b >> 2) - (a >> 2) || (a & 3) - (b & 3));
}

// ------------------------------------------------------------------ prompt, buttons, score
let actions = [];
let advance = null; // what Space does when no button claims it
let run = 0; // goes up on every restart, so a pending step from the old run does nothing
const session = { right: 0, total: 0, streak: 0, t0: 0, frozen: null };
const peek = {}; // the question on screen and its answer, for the checks in tools-src/poker-trainer/verify/

function prompt(p) {
	const box = $('prompt');
	box.classList.toggle('is-ok', p.state === 'ok');
	box.classList.toggle('is-bad', p.state === 'bad');
	$('pEyebrow').textContent = p.eyebrow || eyebrow();
	$('pName').textContent = p.name || '';
	$('pMeta').textContent = p.meta || ' ';
	$('pBarWrap').classList.toggle('is-off', p.bar == null);
	if (p.bar != null) $('pBar').style.width = Math.round(p.bar * 100) + '%';
	$('pTip').hidden = !p.tip;
	$('pTip').innerHTML = p.tip || '';
}
const eyebrow = (extra) => drillOf(S.drill).label + ' · ' + cap(mode()) + (extra ? ' · ' + extra : '');

/** Buttons under the table. Each: { id, label, key, color, primary, wide, num, on }. */
function setActions(list) {
	actions = list || [];
	const box = $('actions');
	box.innerHTML = '';
	for (const a of actions) {
		a.el = h(
			'button',
			{
				class: 'act' + (a.primary ? ' primary' : '') + (a.wide ? ' wide' : '') + (a.num ? ' num' : ''),
				type: 'button',
				'data-id': a.id,
				'data-c': a.color ? '' : null,
				style: a.color ? '--c: var(--' + a.color + ')' : null,
				onclick: () => a.on && a.on(a.id),
			},
			[document.createTextNode(a.label), a.key ? h('kbd', { text: a.key === ' ' ? 'Space' : a.key.toUpperCase() }) : null]
		);
		box.append(a.el);
	}
}
const nextButton = (label, on) => ({ id: 'next', label, key: ' ', primary: true, on });

function mark(right) {
	session.total++;
	if (right) {
		session.right++;
		session.streak++;
	} else session.streak = 0;
	showStats();
}
const elapsed = () => (session.frozen != null ? session.frozen : session.t0 ? (Date.now() - session.t0) / 1000 : 0);
function showStats() {
	$('sAcc').textContent = session.total ? Math.round((100 * session.right) / session.total) + '%' : '–';
	$('sStreak').textContent = session.streak;
	$('sTime').textContent = clock(elapsed());
}
setInterval(() => {
	if (session.t0 && session.frozen == null) $('sTime').textContent = clock(elapsed());
}, 500);
function flash(right) {
	const box = $('stageBox');
	box.classList.remove('flash-ok', 'flash-bad');
	void box.offsetWidth;
	box.classList.add(right ? 'flash-ok' : 'flash-bad');
	setTimeout(() => box.classList.remove('flash-ok', 'flash-bad'), 450);
}
function show(kids, top) {
	felt.classList.toggle('is-top', !!top);
	felt.replaceChildren(...[].concat(kids).filter(Boolean));
	felt.scrollTop = 0;
}

// ------------------------------------------------------------------ practice and test
// a fresh question; starting hands follow the seat setting and lean towards the hands you've missed
const fresh = () => (S.drill === 'preflop' ? MAKERS.preflop(Math.random, { seat: S.seat, misses }) : MAKERS[S.drill](Math.random));

/** Put a question on the table and wait for an answer. o: { eyebrow, meta, bar, onAnswer(right, picked) } */
function ask(q, o) {
	const v = VIEW[q.drill];
	const a = v.ask(q);
	peek.q = q;
	peek.answer = String(q.answer);
	prompt({ eyebrow: o.eyebrow, name: a.name, meta: o.meta || a.meta, bar: o.bar });
	show(v.table(q, false));
	if (!session.t0) session.t0 = Date.now();
	setActions(v.buttons(q).map((b) => Object.assign(b, { on: (id) => o.onAnswer(id === String(q.answer), id) })));
	advance = null;
}

function practice() {
	const mine = run;
	const review = createReview();
	const next = () => {
		if (mine !== run) return;
		const item = review.due();
		const q = item ? item.q : fresh();
		const v = VIEW[q.drill];
		ask(q, {
			eyebrow: item ? eyebrow('again') : null,
			onAnswer: (right, picked) => {
				mark(right);
				flash(right);
				review.record(q, right, item);
				if (q.drill === 'preflop') {
					const n = (misses[q.key] || 0) + (right ? -1 : 1);
					if (n > 0) misses[q.key] = Math.min(3, n);
					else delete misses[q.key];
					saved.set('misses', misses);
				}
				const said = v.buttons(q).find((b) => b.id === picked);
				const waiting = review.waiting();
				prompt({
					eyebrow: right ? 'Correct' : 'Not quite' + (said ? ': you said ' + said.label.toLowerCase() : ''),
					name: v.result(q),
					meta: waiting ? `${waiting} to come back` : null,
					tip: v.tip ? v.tip(q) : q.why,
					state: right ? 'ok' : 'bad',
				});
				show(v.table(q, true));
				setActions([nextButton('Next', next)]);
				advance = next;
			},
		});
	};
	next();
}

function test() {
	const mine = run;
	const qs = buildTest(S.drill, Math.random, { seat: S.seat });
	const missed = [];
	let i = 0;
	const step = () => {
		if (mine !== run) return;
		if (i >= qs.length) return finish();
		const q = qs[i];
		ask(q, {
			eyebrow: eyebrow(`${i + 1} of ${qs.length}`),
			bar: i / qs.length,
			onAnswer: (right, picked) => {
				for (const a of actions) {
					a.on = null;
					a.el.disabled = true;
					if (a.id === picked) a.el.classList.add(right ? 'is-right' : 'is-wrong');
				}
				mark(right);
				flash(right);
				if (!right) missed.push(q);
				i++;
				setTimeout(step, 380);
			},
		});
	};
	const finish = () => {
		session.frozen = elapsed();
		const score = qs.length - missed.length;
		const time = session.frozen;
		const key = bestKey(S.drill);
		const old = bests[key];
		const better = !old || score > old.score || (score === old.score && time < old.time);
		if (better) {
			bests[key] = { score, total: qs.length, time };
			saved.set('best', bests);
		}
		const ok = passes(score, qs.length);
		peek.q = null;
		peek.result = { score, total: qs.length, passed: ok };
		const v = VIEW[S.drill];
		const need = Math.ceil(PASS_MARK * qs.length);
		prompt({
			eyebrow: eyebrow('result'),
			name: ok ? 'Passed' : 'Not yet',
			meta: `${need} of ${qs.length} to pass` + (better && old ? ' · a new best' : ''),
			tip: ok
				? nextDrill()
					? `That’s the mark. Next drill: <b>${nextDrill().label}</b>.`
					: 'That’s the mark, and the last drill. Come back now and then: the tests are worth repeating.'
				: 'The ones you missed are listed below. Run them through Practice, then try again.',
			state: ok ? 'ok' : 'bad',
			bar: 1,
		});
		show(
			h('div', { class: 'summary' }, [
				h('div', { class: 'tiles' }, [tile('Score', `${score}/${qs.length}`, 'big ' + (ok ? 'good' : 'poor')), tile('Time', clock(time), 'big')]),
				missed.length
					? h('div', { class: 'misses' }, missed.map((q) => h('div', {}, [h('span', { text: v.line(q) }), h('b', { text: v.answerText(q) })])))
					: h('p', { class: 'note', text: 'Nothing missed.' }),
			]),
			true
		);
		const nd = nextDrill();
		const again = { id: 'again', label: 'Try again', key: 't', on: start };
		const more = { id: 'practice', label: 'Practice', key: 'p', on: () => setMode('practice') };
		setActions(ok && nd ? [nextButton('Next drill', () => setDrill(nd.id)), again, more] : [Object.assign(again, { primary: true, key: ' ' }), more]);
		advance = null;
		fillRail(false);
		showBest();
	};
	step();
}
const nextDrill = () => DRILLS[DRILLS.findIndex((d) => d.id === S.drill) + 1] || null;

// ------------------------------------------------------------------ study pages
const toPractice = () => ({ id: 'practice', label: 'Practise this', key: 'p', on: () => setMode('practice') });
const LADDER = [
	[8, 'Ts 9s 8s 7s 6s', 'Five in a row, all one suit. The best of them, ace down to ten, is the royal flush.'],
	[7, 'Qs Qh Qd Qc 4d', 'All four cards of one rank.'],
	[6, 'Ks Kh Kd 7c 7s', 'Three of one rank and two of another.'],
	[5, 'Ad Jd 8d 6d 3d', 'Any five cards of one suit.'],
	[4, '9c 8d 7s 6h 5c', 'Five in a row in mixed suits. The ace can sit at the top (A K Q J 10) or the bottom (5 4 3 2 A).'],
	[3, '8s 8h 8d Kc 4s', 'Three cards of one rank.'],
	[2, 'Js Jd 6h 6c As', 'Two different pairs.'],
	[1, 'Ah Ad Ks 9c 4d', 'Two cards of one rank.'],
	[0, 'Ad Js 8c 6h 3d', 'None of the above: your highest card plays.'],
];
function oneIn(cat) {
	const n = FIVE_CARD_TOTAL / FIVE_CARD_COUNTS[cat];
	return '1 in ' + (n >= 100 ? Math.round(n).toLocaleString('en-US') : n >= 10 ? Math.round(n) : n.toFixed(1));
}
/** Step through made-up examples with the answer already showing. */
function examples(make, intro) {
	const mine = run;
	const next = () => {
		if (mine !== run) return;
		const q = make();
		const v = VIEW[q.drill];
		peek.q = q;
		prompt({ eyebrow: eyebrow('example'), name: v.result(q), meta: v.ask(q).meta, tip: v.tip ? v.tip(q) : q.why });
		show(v.table(q, true));
		setActions([nextButton('Another example', next), toPractice()]);
		advance = next;
	};
	if (!intro) return next();
	prompt(intro.prompt);
	show(intro.body, true);
	setActions([nextButton('See examples', next), toPractice()]);
	advance = next;
}
const STUDY = {
	ranks() {
		prompt({
			name: 'The nine hands',
			meta: 'Strongest at the top',
			tip: 'You always play the <b>best five cards</b> out of your two and the five on the board. The rarer a hand is, the higher it ranks: the figure beside each name is how often it turns up in five cards.',
		});
		show(
			h(
				'div',
				{ class: 'ladder' },
				LADDER.map(([cat, eg, line]) =>
					h('div', { class: 'rung' }, [
						h('div', { class: 'cardrow' }, parse(eg).map((c) => cardEl(c))),
						h('div', {}, [h('h4', {}, [document.createTextNode(CATEGORIES[cat]), h('em', { text: oneIn(cat) })]), h('p', { text: line })]),
					])
				)
			),
			true
		);
		setActions([Object.assign(toPractice(), { primary: true, key: ' ' })]);
	},
	winner() {
		examples(() => makeWinner(Math.random), {
			prompt: { name: 'How a winner is decided', meta: 'Five rules, in this order' },
			body: h('ol', {
				class: 'rules',
				html:
					'<li><b>Each player makes their best five cards</b> from their own two and the five on the board. The other two never count.</li>' +
					'<li><b>The higher kind of hand wins.</b> Any flush beats any straight, and so on down the ranks.</li>' +
					'<li><b>Same kind? Compare the cards that make it</b>, highest first: the higher pair, the higher straight, the higher flush card.</li>' +
					'<li><b>Still level? The spare cards decide.</b> These are kickers: a pair of kings with an ace beats a pair of kings with a queen.</li>' +
					'<li><b>Suits never break a tie.</b> If both best fives match rank for rank, the pot is split. That includes the times the board alone is the best hand.</li>',
			}),
		});
	},
	preflop() {
		let picked = null;
		const draw = () => {
			const one = S.seat !== 'all';
			const grid = h('div', { class: 'grid', role: 'group', 'aria-label': 'Starting hands' });
			for (let r = 12; r >= 0; r--) {
				for (let c = 12; c >= 0; c--) {
					// rows and columns both run ace to two: suited hands land above the diagonal, offsuit below
					const id = r === c ? RANKS[r] + RANKS[r] : r > c ? RANKS[r] + RANKS[c] + 's' : RANKS[c] + RANKS[r] + 'o';
					const from = raisedFrom(id);
					const on = one ? raises(S.seat, id) : from.length > 0;
					const colour = !on ? null : one ? 'var(--raise)' : `var(--seat-${from[0]})`;
					grid.append(
						h('button', {
							type: 'button',
							class: on ? '' : 'f',
							style: colour ? '--c: ' + colour : null,
							'aria-pressed': String(picked === id),
							'aria-label': handName(id) + (on ? ', raise' : ', fold'),
							text: id,
							onclick: () => {
								picked = id;
								draw();
							},
						})
					);
				}
			}
			const legend = one
				? [['var(--raise)', 'Raise'], ['#17242d', 'Fold']]
				: [['var(--seat-utg)', 'Every seat'], ['var(--seat-hj)', 'Hijack and later'], ['var(--seat-co)', 'Cutoff and later'], ['var(--seat-btn)', 'Button only'], ['#17242d', 'Fold']];
			show(
				h('div', { class: 'gridwrap' }, [
					grid,
					h('div', { class: 'legend' }, legend.map(([c, t]) => h('span', {}, [h('i', { style: '--c: ' + c }), document.createTextNode(t)]))),
					h('p', { class: 'note', html: 'Suited hands (<b>s</b>) sit above the diagonal of pairs, offsuit hands (<b>o</b>) below it. T is a ten.' }),
				]),
				true
			);
			const s = one ? seat(S.seat) : null;
			if (picked) {
				const from = raisedFrom(picked).map((id) => seat(id).name);
				prompt({
					name: handName(picked),
					meta: from.length ? 'Raise from: ' + from.join(', ') : 'Fold from every seat',
					tip: one ? rule(S.seat, picked) : from.length ? rule(raisedFrom(picked)[0], picked) : 'Not strong enough to be the first to raise from any seat.',
				});
			} else {
				prompt({
					name: one ? s.name : 'Which hands to play',
					meta: one ? `Raise ${Math.round(100 * share(S.seat))}% of hands · ${s.behind === 1 ? 'only the big blind left' : s.behind + ' players still to act'}` : 'When everyone before you has folded: raise the coloured hands, fold the rest',
					tip:
						(one && S.seat === 'sb'
							? 'The small blind plays the Cutoff’s chart: only one player is left, but you’ll act first on every later round, which makes hands harder to play.'
							: 'The later you act, the fewer players are left who could hold something better, so the more hands are worth a raise. Never just call the big blind: raise or fold.') + ' Tap a hand for its rule.',
				});
			}
		};
		draw();
		setActions([Object.assign(toPractice(), { primary: true, key: ' ' })]);
	},
	outs() {
		const eg = { gutshot: ['9c 8d', '6h 5s 2c'], oesd: ['9c 8d', '7h 6s 2c'], double: ['Jc 9d', 'Kh 7s Tc'], flush: ['Ah 7h', 'Kh 9h 2c'], 'flush+gutshot': ['9h 8h', '6h 5s 2h'], 'flush+oesd': ['9h 8h', '7h 6s 2h'] };
		prompt({
			name: 'Outs',
			meta: 'The cards still in the deck that complete your hand',
			tip: 'This drill counts the cards that make a <b>straight or flush</b>. Six draws cover nearly every case. When one card completes both, <b>count it once</b>.',
		});
		const table = h('table', { class: 'facts' }, [
			h('caption', { text: 'The draws to know' }),
			h('tr', {}, [h('th', { text: 'Draw' }), h('th', { text: 'Example' }), h('th', { text: 'Outs' })]),
			...Object.keys(DRAWS).map((k) =>
				h('tr', {}, [
					h('td', { text: DRAWS[k].label }),
					h('td', { html: `${txt(parse(eg[k][0]))} on ${txt(parse(eg[k][1]))}<br><small>${DRAWS[k].note}</small>` }),
					h('td', { class: 'n', text: String(DRAWS[k].outs) }),
				])
			),
		]);
		show(table, true);
		setActions([Object.assign(toPractice(), { primary: true, key: ' ' })]);
	},
	odds() {
		prompt({
			name: 'Two percentages',
			meta: 'How often you’ll hit, and how often you need to',
			tip: '<b>Hitting:</b> multiply your outs by 2 with one card to come, by 4 with two. <b>Needing:</b> divide the call by the pot once you’ve called. A call is worth making when the first number is bigger than the second.',
		});
		const exact = (o, n) => (100 * hitChance(o, n)).toFixed(0);
		show(
			[
				h('table', { class: 'facts' }, [
					h('caption', { text: 'How often you hit: the rule of 2 and 4' }),
					h('tr', {}, [h('th', { text: 'Outs' }), h('th', { text: 'One card to come' }), h('th', { text: 'Two cards to come' })]),
					...OUT_COUNTS.map((o) =>
						h('tr', {}, [
							h('td', { text: String(o) }),
							h('td', { class: 'n', html: `${ruleOfThumb(o, 1)}% <small>exactly ${exact(o, 1)}%</small>` }),
							h('td', { class: 'n', html: `${ruleOfThumb(o, 2)}% <small>exactly ${exact(o, 2)}%</small>` }),
						])
					),
				]),
				h('table', { class: 'facts' }, [
					h('caption', { text: 'How often you need to win: the price of a call' }),
					h('tr', {}, [h('th', { text: 'They bet' }), h('th', { text: 'For example' }), h('th', { text: 'You need' })]),
					...BET_SIZES.map((b) =>
						h('tr', {}, [h('td', { text: b.label }), h('td', { text: `$${Math.round(60 * b.of)} into $60: ${Math.round(60 * b.of)} ÷ ${60 + 2 * Math.round(60 * b.of)}` }), h('td', { class: 'n', text: b.needs + '%' })])
					),
				]),
			],
			true
		);
		setActions([Object.assign(toPractice(), { primary: true, key: ' ' })]);
	},
	call() {
		examples(() => makeCall(Math.random), {
			prompt: { name: 'Is the call worth it?', meta: 'Compare two numbers' },
			body: h('ol', {
				class: 'rules',
				html:
					'<li><b>Count your outs</b>, the cards that complete your hand.</li>' +
					'<li><b>Turn them into a chance:</b> outs × 2 with one card to come, × 4 with two.</li>' +
					'<li><b>Work out the price:</b> the call divided by the pot once you’ve called. Half the pot needs 25%, the whole pot 33%.</li>' +
					'<li><b>Call if you hit more often than you need to.</b> Otherwise fold: over time the call loses money, however good the draw looks.</li>' +
					'<li>In this drill you win when you hit and lose when you miss, and no more money goes in afterwards. Real hands add both of those; this is the base to build on.</li>',
			}),
		});
	},
};

// ------------------------------------------------------------------ rail, settings panel, wiring
const MODE_HINT = {
	study: 'Read it through, then switch to Practice.',
	practice: 'No clock. A question you miss comes back a few questions later, then once more.',
};
function setSeg(id, value) {
	for (const b of $(id).querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.v === String(value)));
}
function onSeg(id, fn) {
	$(id).addEventListener('click', (e) => {
		const b = e.target.closest('button');
		if (b) fn(b.dataset.v);
	});
}
function fillRail(scroll) {
	const list = $('railList');
	list.innerHTML = '';
	const upNext = DRILLS.find((d) => !passed(d.id));
	DRILLS.forEach((d, i) => {
		const b = bests[d.id === 'preflop' ? 'preflop:all' : d.id];
		const done = passed(d.id);
		list.append(
			h('button', { class: 'item', type: 'button', 'data-drill': d.id, 'aria-pressed': String(d.id === S.drill), title: done ? 'Test passed' : `Pass mark: ${Math.ceil(PASS_MARK * TEST_SIZE[d.id])} of ${TEST_SIZE[d.id]}`, onclick: () => setDrill(d.id) }, [
				h('span', {}, [h('i', { text: String(i + 1) }), document.createTextNode(d.label)]),
				h('em', { class: done ? 'done' : upNext === d && !b ? 'next' : '', text: b ? `${b.score}/${b.total}` : upNext === d ? 'next' : '' }),
			])
		);
	});
	$('railPath').textContent = 'Work down the list: each drill builds on the one before. A tick means you’ve scored 90% on its test.';
	const open = list.querySelector('[aria-pressed="true"]');
	if (scroll && open && open.scrollIntoView) open.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function showBest() {
	const b = bests[bestKey(S.drill)];
	$('best').innerHTML = b ? `Best test: <b>${b.score}/${b.total}</b> in ${clock(b.time)}` : 'No test score yet';
}
function fillPanel() {
	setSeg('modeSeg', mode());
	const n = TEST_SIZE[S.drill];
	$('modeHint').textContent = mode() === 'test' ? `${n} questions against the clock. ${Math.ceil(PASS_MARK * n)} right is a pass.` : MODE_HINT[mode()];
	$('seatBox').hidden = S.drill !== 'preflop';
	setSeg('seatSeg', S.seat);
	$('seatHint').textContent =
		S.seat === 'all'
			? 'Seats are named by how far they sit from the dealer’s button. UTG (“under the gun”) acts first; the button acts last.'
			: `${seat(S.seat).name}: ${seat(S.seat).behind === 1 ? 'only the big blind acts after you' : seat(S.seat).behind + ' players act after you'}.`;
	$('keysHint').innerHTML = mode() === 'study' ? '<kbd>Space</kbd> for the main button' : VIEW[S.drill].keys;
	showBest();
}

function start() {
	run++;
	advance = null;
	setActions([]);
	session.right = session.total = session.streak = 0;
	session.t0 = 0;
	session.frozen = null;
	peek.q = null;
	peek.result = null;
	showStats();
	fillRail(true);
	fillPanel();
	$('prompt').classList.remove('is-ok', 'is-bad');
	if (mode() === 'study') STUDY[S.drill]();
	else if (mode() === 'practice') practice();
	else test();
}
function setMode(m) {
	S.mode[S.drill] = m;
	saveSettings();
	start();
}
function setDrill(id) {
	S.drill = id;
	saveSettings();
	start();
}

onSeg('modeSeg', setMode);
onSeg('seatSeg', (v) => {
	S.seat = v;
	saveSettings();
	start();
});
$('restartBtn').addEventListener('click', () => {
	document.body.classList.remove('sheet-open');
	start();
});

// settings sheet (phones), clean view, intro
$('settingsBtn').addEventListener('click', () => document.body.classList.toggle('sheet-open'));
$('closeSheet').addEventListener('click', () => document.body.classList.remove('sheet-open'));
const setClean = (on) => document.body.classList.toggle('clean', on);
$('cleanBtn').addEventListener('click', () => {
	document.body.classList.remove('sheet-open');
	setClean(true);
});
$('cleanExit').addEventListener('click', () => setClean(false));
const intro = (on) => {
	$('intro').hidden = !on;
	if (on) $('introGo').focus();
	else saved.set('seenIntro', true);
};
$('howBtn').addEventListener('click', () => intro(true));
$('introGo').addEventListener('click', () => intro(false));
$('intro').addEventListener('click', (e) => e.target === $('intro') && intro(false));

document.addEventListener('keydown', (e) => {
	if (e.metaKey || e.ctrlKey || e.altKey) return;
	if (!$('intro').hidden) {
		if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			intro(false);
		}
		return;
	}
	if (e.key === 'Escape') {
		document.body.classList.remove('sheet-open');
		setClean(false);
		return;
	}
	const key = e.key === 'Enter' ? ' ' : e.key.toLowerCase();
	const a = actions.find((x) => x.key === key && x.el && !x.el.disabled);
	if (a) {
		e.preventDefault();
		// a focused button would also fire on Space/Enter: drop focus so it runs once
		if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
		if (a.on) a.on(a.id);
	} else if (key === ' ' && advance) {
		e.preventDefault();
		if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
		advance();
	}
});

// a first visit opens the first drill in Study; a later one opens wherever you left off
start();
if (!saved.get('seenIntro', false)) intro(true);

// handles for the checks in tools-src/poker-trainer/verify/
window.PT = { S, peek, start, setMode, setDrill, session };
