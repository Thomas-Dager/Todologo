/* The questions each drill asks. No page code: every maker takes rng() (a number in [0, 1)) and
 * returns a plain object with the cards, the right `answer`, a `key` naming what kind of question
 * it is, and `why`, the explanation in a sentence or two.
 */
import { strength, bestFive, describe, compare, deal, pick, pickWeighted, shuffle, rankWord } from './cards.js';
import { SEATS, HANDS, raises, rule, cardsFor, edgeDistance, handName, seat } from './chart.js';
import { DRAWS, readDraw, explainDraw, hitChance, ruleOfThumb, priceOfCall, BET_SIZES, OUT_COUNTS } from './draws.js';

const pct = (x) => Math.round(100 * x);
const upper = (s) => s[0].toUpperCase() + s.slice(1);

// ---------------------------------------------------------------- 1. hand ranks
// how often each category is asked: the common ones more, the rare ones often enough to learn
const RANK_WEIGHTS = [1, 2, 2, 1.5, 2, 2, 2, 1, 0.7];
/** Two cards and a full board: name the best hand. want: a category to force (0..8). */
export function makeRanks(rng, want) {
	const cat = want != null ? want : pickWeighted(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8], (c) => RANK_WEIGHTS[c]);
	for (;;) {
		const dealt = deal(rng, 7);
		const v = strength(dealt);
		if (v >> 20 !== cat) continue;
		const hole = dealt.slice(0, 2);
		const board = dealt.slice(2);
		const best = bestFive(dealt);
		const onBoard = strength(board) === v;
		return {
			drill: 'ranks',
			key: 'ranks:' + cat,
			hole,
			board,
			best,
			answer: cat,
			name: describe(v),
			why: onBoard
				? 'The five cards on the board are your best hand: your own two don’t improve it.'
				: 'Your best five cards are the ones lit up; the other two don’t count.',
		};
	}
}

// ---------------------------------------------------------------- 2. who wins
const WIN_KINDS = { category: 3, top: 2, kicker: 3, split: 2 };
const SHARED = ['no pair', 'a pair', 'two pair', 'three of a kind', 'a straight', 'a flush', 'a full house', 'four of a kind', 'a straight flush'];
/** A board and two players' cards: who wins, or is it a split? want: one of WIN_KINDS. */
export function makeWinner(rng, want) {
	const kind = want || pickWeighted(rng, Object.keys(WIN_KINDS), (k) => WIN_KINDS[k]);
	for (;;) {
		const dealt = deal(rng, 9);
		const board = dealt.slice(0, 5);
		const a = dealt.slice(5, 7);
		const b = dealt.slice(7, 9);
		const va = strength([...a, ...board]);
		const vb = strength([...b, ...board]);
		const res = compare(va, vb);
		const got = res.winner < 0 ? 'split' : res.why.category ? 'category' : res.why.index === 0 ? 'top' : 'kicker';
		if (got !== kind) continue;
		const names = [describe(va), describe(vb)];
		const who = ['A', 'B'];
		let why;
		if (res.winner < 0) {
			why = `Both players’ best five cards are the same (${names[0].toLowerCase()}), so they split the pot. Suits never break a tie.`;
		} else if (res.why.category) {
			const w = res.winner;
			why = `${names[w]} beats ${names[1 - w].toLowerCase()}.`;
		} else {
			const w = res.winner;
			why = `Both have ${SHARED[va >> 20]}, so the cards decide. ${who[w]}’s ${res.why.role} is higher: ${rankWord(res.why.ranks[0])} against ${rankWord(res.why.ranks[1])}.`;
		}
		return {
			drill: 'winner',
			key: 'winner:' + kind,
			board,
			hands: [a, b],
			best: [bestFive([...a, ...board]), bestFive([...b, ...board])],
			names,
			answer: res.winner < 0 ? 'split' : who[res.winner],
			why,
		};
	}
}

// ---------------------------------------------------------------- 3. starting hands
/**
 * A seat and a hand: raise or fold? opts.seat fixes the seat ('all' or absent: any);
 * opts.misses maps 'seat:hand' to how often it has been missed, so those come up more.
 */
export function makePreflop(rng, opts = {}) {
	const seatId = opts.seat && opts.seat !== 'all' ? opts.seat : pick(rng, SEATS).id;
	const misses = opts.misses || {};
	const h = pickWeighted(rng, HANDS, (x) => {
		const d = edgeDistance(seatId, x.id);
		const near = d === 0 ? 5 : d === 1 ? 3 : d <= 3 ? 1.5 : 0.6;
		return near * (1 + 2 * Math.min(3, misses[seatId + ':' + x.id] || 0));
	});
	return preflopQuestion(seatId, h.id, rng);
}
export function preflopQuestion(seatId, handId, rng) {
	const yes = raises(seatId, handId);
	return {
		drill: 'preflop',
		key: seatId + ':' + handId,
		seat: seatId,
		hand: handId,
		hole: cardsFor(handId, rng),
		answer: yes ? 'raise' : 'fold',
		name: handName(handId),
		why: rule(seatId, handId),
	};
}

// ---------------------------------------------------------------- 4. outs
const DRAW_WEIGHTS = { gutshot: 1, oesd: 1.5, double: 0.6, flush: 1.5, 'flush+gutshot': 1, 'flush+oesd': 1 };
/** Your cards and a flop or turn: how many cards complete the draw? opts.kind, opts.toCome (1 or 2) force them. */
export function makeOuts(rng, opts = {}) {
	const kind = opts.kind || pickWeighted(rng, Object.keys(DRAW_WEIGHTS), (k) => DRAW_WEIGHTS[k]);
	const toCome = opts.toCome || (rng() < 0.5 ? 2 : 1);
	const wantsFlush = kind.startsWith('flush');
	for (;;) {
		const dealt = deal(rng, 2 + (toCome === 2 ? 3 : 4));
		const hole = dealt.slice(0, 2);
		const board = dealt.slice(2);
		// cheap check first: a flush draw needs two suited cards in hand and two more on the board
		const suited = (hole[0] & 3) === (hole[1] & 3);
		if (wantsFlush !== (suited && board.filter((c) => (c & 3) === (hole[0] & 3)).length === 2)) continue;
		const d = readDraw(hole, board);
		if (!d || d.kind !== kind) continue;
		return {
			drill: 'outs',
			key: 'outs:' + kind,
			hole,
			board,
			toCome,
			draw: d,
			kind,
			outs: [...new Set([...d.flush, ...d.straight])],
			answer: d.total,
			options: OUT_COUNTS,
			name: DRAWS[kind].label,
			why: explainDraw(d),
		};
	}
}

// ---------------------------------------------------------------- 5. the two percentages
const POTS = [12, 24, 36, 48, 60, 72, 96, 120, 180, 240, 300, 360]; // every bet size comes out a whole number
/** Either "how often will you hit?" (rule of 2 and 4) or "what does this call need?" opts.kind: 'chance' | 'price'. */
export function makeOdds(rng, opts = {}) {
	const kind = opts.kind || (rng() < 0.5 ? 'chance' : 'price');
	if (kind === 'chance') {
		const outs = opts.outs || pick(rng, OUT_COUNTS);
		const toCome = opts.toCome || (rng() < 0.5 ? 2 : 1);
		const answer = ruleOfThumb(outs, toCome);
		const exact = (100 * hitChance(outs, toCome)).toFixed(1);
		return {
			drill: 'odds',
			key: 'chance:' + toCome,
			kind,
			outs,
			toCome,
			answer,
			options: [1, 2, 3, 4].map((k) => outs * k),
			name: `About ${answer}%`,
			why:
				`${toCome === 1 ? 'One card to come: outs × 2' : 'Two cards to come: outs × 4'} = ${answer}%. The exact figure is ${exact}%.` +
				(toCome === 2 && outs > 9 ? ' The rule runs a little high for big draws.' : ''),
		};
	}
	const size = opts.size ? BET_SIZES.find((b) => b.id === opts.size) : pick(rng, BET_SIZES);
	const pot = opts.pot || pick(rng, POTS);
	const bet = Math.round(pot * size.of);
	return {
		drill: 'odds',
		key: 'price:' + size.id,
		kind,
		pot,
		bet,
		size,
		answer: size.needs,
		options: BET_SIZES.map((b) => b.needs),
		name: `${size.needs}%`,
		why: `You pay $${bet} to win $${pot + bet} (the pot plus the bet). After you call the pot is $${pot + 2 * bet}, and $${bet} ÷ $${pot + 2 * bet} = ${size.needs}%. ${size.label} always needs ${size.needs}%.`,
	};
}

// ---------------------------------------------------------------- 6. call or fold
const CLEAR = 0.03; // a spot is only asked if the two percentages are at least this far apart
/** A draw, a pot and a bet: call or fold? Only spots with a clear answer. opts.want: 'call' | 'fold'. */
export function makeCall(rng, opts = {}) {
	const want = opts.want || (rng() < 0.5 ? 'call' : 'fold');
	for (;;) {
		const q = makeOuts(rng);
		const hit = hitChance(q.answer, q.toCome);
		const sizes = shuffle(rng, BET_SIZES).filter((b) => {
			const need = priceOfCall(1, b.of);
			return Math.abs(hit - need) >= CLEAR && (hit > need ? 'call' : 'fold') === want;
		});
		if (!sizes.length) continue;
		const size = sizes[0];
		const pot = pick(rng, POTS);
		const bet = Math.round(pot * size.of);
		const rough = ruleOfThumb(q.answer, q.toCome);
		const need = pct(priceOfCall(pot, bet));
		const exact = pct(hit);
		return {
			drill: 'call',
			key: 'call:' + q.kind + ':' + q.toCome,
			hole: q.hole,
			board: q.board,
			toCome: q.toCome,
			draw: q.draw,
			kind: q.kind,
			outs: q.outs,
			pot,
			bet,
			size,
			hit,
			need: priceOfCall(pot, bet),
			answer: want,
			name: upper(want),
			why:
				`${DRAWS[q.kind].label}: ${q.answer} outs, about ${rough}% with ${q.toCome === 1 ? 'one card' : 'two cards'} to come` +
				`${rough !== exact ? ` (exactly ${exact}%)` : ''}. Calling $${bet} makes the pot $${pot + 2 * bet}, so you need ${need}%. ` +
				(want === 'call' ? `You hit more often than you need to: call.` : `You hit less often than you need to: fold.`),
		};
	}
}

// ---------------------------------------------------------------- the drills
/** How many questions a test has, and the score that passes it. */
export const TEST_SIZE = { ranks: 20, winner: 20, preflop: 30, outs: 15, odds: 20, call: 20 };
export const PASS_MARK = 0.9;
export const passes = (score, total) => score / total >= PASS_MARK;

/** A test's questions. Each kind of question comes up about equally often; starting hands never repeat. */
export function buildTest(drill, rng, opts = {}) {
	const n = TEST_SIZE[drill];
	const out = [];
	if (drill === 'ranks') {
		const cats = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 1, 2, 4, 5, 6]);
		for (const c of cats.slice(0, n)) out.push(makeRanks(rng, c));
	} else if (drill === 'winner') {
		const kinds = shuffle(rng, ['category', 'top', 'kicker', 'split']);
		for (let i = 0; i < n; i++) out.push(makeWinner(rng, kinds[i % 4]));
	} else if (drill === 'preflop') {
		const seen = new Set();
		while (out.length < n) {
			const q = makePreflop(rng, { seat: opts.seat });
			if (seen.has(q.key)) continue;
			seen.add(q.key);
			out.push(q);
		}
	} else if (drill === 'outs') {
		const kinds = shuffle(rng, Object.keys(DRAWS));
		for (let i = 0; i < n; i++) out.push(makeOuts(rng, { kind: kinds[i % kinds.length] }));
	} else if (drill === 'odds') {
		for (let i = 0; i < n; i++) out.push(makeOdds(rng, { kind: i % 2 ? 'price' : 'chance' }));
	} else if (drill === 'call') {
		for (let i = 0; i < n; i++) out.push(makeCall(rng, { want: i % 2 ? 'call' : 'fold' }));
	}
	return shuffle(rng, out);
}
export const MAKERS = { ranks: makeRanks, winner: makeWinner, preflop: makePreflop, outs: makeOuts, odds: makeOdds, call: makeCall };
export { seat };
