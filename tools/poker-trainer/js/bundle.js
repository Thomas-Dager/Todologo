(function(){
"use strict";

/* === js/core/cards.js === */
/* Cards and hand strength (Texas hold'em). No page code.
 *
 * A card is a number 0..51: its rank is card >> 2 (0 is a two, 12 an ace) and its suit card & 3
 * (clubs, diamonds, hearts, spades). In text a card is two letters: 'Ah', 'Td', '7c'.
 */
const RANKS = '23456789TJQKA';
const SUITS = 'cdhs';
const SUIT_NAMES = ['clubs', 'diamonds', 'hearts', 'spades'];
/** What a card shows: 10 for a ten. */
const RANK_LABELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const WORDS = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
const rankWord = (r) => WORDS[r];
const rankWords = (r) => WORDS[r] + (r === 4 ? 'es' : 's');
const rankOf = (c) => c >> 2;
const suitOf = (c) => c & 3;
const card = (text) => RANKS.indexOf(text[0]) * 4 + SUITS.indexOf(text[1]);
/** 'Ah Kd' or 'AhKd' -> [card, card] */
const cards = (text) => (text.replace(/\s+/g, '').match(/../g) || []).map(card);
const cardText = (c) => RANKS[c >> 2] + SUITS[c & 3];

/** Hand categories, weakest first. A royal flush is the best straight flush. */
const CATEGORIES = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush'];
/** How many five-card hands of each category exist, out of 2,598,960: why they rank in this order. */
const FIVE_CARD_COUNTS = [1302540, 1098240, 123552, 54912, 10200, 5108, 3744, 624, 40];
const FIVE_CARD_TOTAL = 2598960;
// how many of the five ranks decide a tie, per category (pair: the pair, then three kickers)
const DECIDERS = [5, 4, 3, 3, 1, 5, 2, 2, 1];

/** The top card of a straight in a set of ranks (one bit per rank), or -1. The ace also plays low: 5-4-3-2-A. */
function straightTop(bits) {
	for (let hi = 12; hi >= 4; hi--) {
		const five = 0b11111 << (hi - 4);
		if ((bits & five) === five) return hi;
	}
	return (bits & 0b1000000001111) === 0b1000000001111 ? 3 : -1;
}
function topRanks(bits, n) {
	const out = [];
	for (let r = 12; r >= 0 && out.length < n; r--) if ((bits >> r) & 1) out.push(r);
	return out;
}
const value = (cat, ranks) => {
	let v = cat;
	for (let i = 0; i < 5; i++) v = (v << 4) | (i < ranks.length ? ranks[i] : 0);
	return v;
};

/**
 * How strong the best five-card hand in 5 to 7 cards is, as one number: a bigger number wins and
 * equal numbers split the pot. The category is strength >> 20.
 */
function strength(cs) {
	const count = new Array(13).fill(0);
	const suitBits = [0, 0, 0, 0];
	const suitCount = [0, 0, 0, 0];
	let bits = 0;
	for (const c of cs) {
		const r = c >> 2;
		const s = c & 3;
		count[r]++;
		suitCount[s]++;
		suitBits[s] |= 1 << r;
		bits |= 1 << r;
	}
	for (let s = 0; s < 4; s++) {
		if (suitCount[s] < 5) continue;
		const top = straightTop(suitBits[s]);
		return top >= 0 ? value(8, [top]) : value(5, topRanks(suitBits[s], 5));
	}
	let quads = -1;
	const trips = [];
	const pairs = [];
	for (let r = 12; r >= 0; r--) {
		if (count[r] === 4) quads = r;
		else if (count[r] === 3) trips.push(r);
		else if (count[r] === 2) pairs.push(r);
	}
	const without = (...rs) => rs.reduce((b, r) => b & ~(1 << r), bits);
	if (quads >= 0) return value(7, [quads, topRanks(without(quads), 1)[0]]);
	if (trips.length && (trips.length > 1 || pairs.length)) {
		return value(6, [trips[0], Math.max(trips.length > 1 ? trips[1] : -1, pairs.length ? pairs[0] : -1)]);
	}
	const top = straightTop(bits);
	if (top >= 0) return value(4, [top]);
	if (trips.length) return value(3, [trips[0], ...topRanks(without(trips[0]), 2)]);
	if (pairs.length >= 2) return value(2, [pairs[0], pairs[1], topRanks(without(pairs[0], pairs[1]), 1)[0]]);
	if (pairs.length) return value(1, [pairs[0], ...topRanks(without(pairs[0]), 3)]);
	return value(0, topRanks(bits, 5));
}
const categoryOf = (v) => v >> 20;
/** The ranks that decide a tie within a category, most important first. */
function deciders(v) {
	const out = [];
	for (let i = 0; i < DECIDERS[v >> 20]; i++) out.push((v >> (4 * (4 - i))) & 15);
	return out;
}

/** The five cards that make the best hand, out of 5 to 7. */
function bestFive(cs) {
	if (cs.length <= 5) return cs.slice();
	const want = strength(cs);
	const n = cs.length;
	// leave out one card (six cards) or two (seven) until the five left are as strong as the whole
	for (let a = 0; a < n; a++) {
		for (let b = n === 7 ? a + 1 : a; b < (n === 7 ? n : a + 1); b++) {
			const five = cs.filter((_, i) => i !== a && i !== b);
			if (strength(five) === want) return five;
		}
	}
	return cs.slice(0, 5);
}

/** The hand in words: "Full house, kings full of sevens". */
function describe(v) {
	const cat = v >> 20;
	const r = deciders(v);
	switch (cat) {
		case 8:
			return r[0] === 12 ? 'Royal flush' : `Straight flush, ${rankWord(r[0])} high`;
		case 7:
			return `Four ${rankWords(r[0])}`;
		case 6:
			return `Full house, ${rankWords(r[0])} full of ${rankWords(r[1])}`;
		case 5:
			return `Flush, ${rankWord(r[0])} high`;
		case 4:
			return `Straight, ${rankWord(r[0])} high`;
		case 3:
			return `Three ${rankWords(r[0])}`;
		case 2:
			return `Two pair, ${rankWords(r[0])} and ${rankWords(r[1])}`;
		case 1:
			return `Pair of ${rankWords(r[0])}`;
		default:
			return `${rankWord(r[0])[0].toUpperCase()}${rankWord(r[0]).slice(1)} high`;
	}
}

// what each deciding rank is, per category, for explaining who won
const ROLES = [
	['high card', 'second card', 'third card', 'fourth card', 'fifth card'],
	['pair', 'kicker', 'second kicker', 'third kicker'],
	['top pair', 'second pair', 'kicker'],
	['three of a kind', 'kicker', 'second kicker'],
	['straight'],
	['highest flush card', 'second flush card', 'third flush card', 'fourth flush card', 'fifth flush card'],
	['three of a kind', 'pair'],
	['four of a kind', 'kicker'],
	['straight flush'],
];
/**
 * Compare two strengths. Returns { winner: 0 | 1 | -1 (split), why }, where why is null for a
 * split, { category: true } when the categories differ, or { role, ranks: [winner's, loser's] }
 * for the first card that separates two hands of the same category.
 */
function compare(a, b) {
	if (a === b) return { winner: -1, why: null };
	const winner = a > b ? 0 : 1;
	if (a >> 20 !== b >> 20) return { winner, why: { category: true } };
	const da = deciders(a);
	const db = deciders(b);
	const i = da.findIndex((r, k) => r !== db[k]);
	const pair = winner === 0 ? [da[i], db[i]] : [db[i], da[i]];
	return { winner, why: { role: ROLES[a >> 20][i], index: i, ranks: pair } };
}

/** n different cards, none of them in `taken`. rng() returns a number in [0, 1). */
function deal(rng, n, taken = []) {
	const used = new Set(taken);
	const out = [];
	while (out.length < n) {
		const c = Math.floor(rng() * 52);
		if (used.has(c)) continue;
		used.add(c);
		out.push(c);
	}
	return out;
}
/** A small repeatable random number generator (mulberry32), for tests. */
function seeded(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
function pickWeighted(rng, items, weight) {
	let total = 0;
	const ws = items.map((x) => {
		const w = Math.max(0, weight(x));
		total += w;
		return w;
	});
	let roll = rng() * total;
	for (let i = 0; i < items.length; i++) {
		roll -= ws[i];
		if (roll < 0) return items[i];
	}
	return items[items.length - 1];
}
const pick = (rng, items) => items[Math.floor(rng() * items.length)];
function shuffle(rng, items) {
	const a = items.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}


/* === js/core/chart.js === */
/* The starting-hand chart: which hands to raise when everyone before you has folded, by seat,
 * at a six-player table. No page code.
 *
 * This is our own beginner chart, not a copy of anyone's. It follows the shape computer-solved
 * charts share (more hands the later you act) but is simpler and a little tighter in the early
 * seats: each kind of hand (pairs, suited kings, offsuit aces...) is raised from one cut-off
 * upward, with nothing mixed, so every hand has one answer and every answer has a one-line rule.
 * The small blind plays the Cutoff's chart. The reasons are in claude/poker-trainer-plan.md.
 */

/** The seats in the order they act before the flop. `behind` is how many players are still to act. */
const SEATS = [
	{ id: 'utg', name: 'Under the gun', short: 'UTG', behind: 5, chart: 'utg' },
	{ id: 'hj', name: 'Hijack', short: 'HJ', behind: 4, chart: 'hj' },
	{ id: 'co', name: 'Cutoff', short: 'CO', behind: 3, chart: 'co' },
	{ id: 'btn', name: 'Button', short: 'BTN', behind: 2, chart: 'btn' },
	{ id: 'sb', name: 'Small blind', short: 'SB', behind: 1, chart: 'co' },
];
const seat = (id) => SEATS.find((s) => s.id === id);

// 'ATs+' = suited A-10 and every better suited ace; '66+' = sixes and every bigger pair
const RAISE = {
	utg: '66+, ATs+, KTs+, QTs+, JTs, T9s, AJo+, KQo',
	hj: '55+, A2s+, K9s+, Q9s+, J9s+, T9s, 98s, ATo+, KJo+',
	co: '22+, A2s+, K6s+, Q8s+, J8s+, T8s+, 98s, 87s, 76s, 65s, 54s, A9o+, KTo+, QTo+, JTo',
	btn: '22+, A2s+, K2s+, Q4s+, J6s+, T6s+, 96s+, 85s+, 75s+, 64s+, 53s+, 43s, A2o+, K8o+, Q9o+, J9o+, T8o+, 98o',
};

/** The 169 starting hands: 'AA', 'AKs' (suited), 'AKo' (offsuit). hi and lo are ranks, 12 the ace. */
const HANDS = [];
for (let hi = 12; hi >= 0; hi--) {
	for (let lo = hi; lo >= 0; lo--) {
		if (hi === lo) HANDS.push({ id: RANKS[hi] + RANKS[lo], hi, lo, kind: 'pair', combos: 6 });
		else {
			HANDS.push({ id: RANKS[hi] + RANKS[lo] + 's', hi, lo, kind: 'suited', combos: 4 });
			HANDS.push({ id: RANKS[hi] + RANKS[lo] + 'o', hi, lo, kind: 'offsuit', combos: 12 });
		}
	}
}
const BY_ID = new Map(HANDS.map((x) => [x.id, x]));
const hand = (id) => BY_ID.get(id);

function expand(token) {
	const plus = token.endsWith('+');
	const t = plus ? token.slice(0, -1) : token;
	const hi = RANKS.indexOf(t[0]);
	const lo = RANKS.indexOf(t[1]);
	const out = [];
	if (hi === lo) for (let r = lo; r <= (plus ? 12 : lo); r++) out.push(RANKS[r] + RANKS[r]);
	else for (let r = lo; r <= (plus ? hi - 1 : lo); r++) out.push(t[0] + RANKS[r] + t[2]);
	return out;
}
const RANGES = {};
for (const id in RAISE) RANGES[id] = new Set(RAISE[id].split(',').flatMap((t) => expand(t.trim())));

/** Raise this hand first in from this seat? */
const raises = (seatId, handId) => RANGES[seat(seatId).chart].has(handId);
/** The share of all 1,326 two-card hands raised from a seat, 0..1. */
function share(seatId) {
	let n = 0;
	for (const h of HANDS) if (raises(seatId, h.id)) n += h.combos;
	return n / 1326;
}
/** The seats a hand is raised from, earliest first. */
const raisedFrom = (handId) => SEATS.filter((s) => raises(s.id, handId)).map((s) => s.id);

/** 'AKs' -> 'A K suited', 'TT' -> 'Pair of tens' */
function handName(handId) {
	const h = hand(handId);
	if (h.kind === 'pair') return 'Pair of ' + rankWords(h.hi);
	return `${RANK_LABELS[h.hi]} ${RANK_LABELS[h.lo]} ${h.kind}`;
}
// the hands of one kind that share a top card, best first: suited kings are KQs, KJs ... K2s
function family(h) {
	return HANDS.filter((x) => x.kind === h.kind && (h.kind === 'pair' || x.hi === h.hi));
}
/** The rule a hand falls under, in words: "From the Cutoff, raise suited kings down to K 6." */
function rule(seatId, handId) {
	const h = hand(handId);
	const s = seat(seatId);
	const where = `From ${s.id === 'utg' ? 'under the gun' : 'the ' + s.name.toLowerCase()}`;
	const fam = family(h);
	const inRange = fam.filter((x) => raises(seatId, x.id));
	if (h.kind === 'pair') {
		if (inRange.length === fam.length) return `${where}, raise every pair.`;
		return `${where}, raise ${rankWords(inRange[inRange.length - 1].hi)} and bigger pairs; fold the smaller ones.`;
	}
	const what = `${h.kind} ${rankWords(h.hi)}`;
	if (!inRange.length) return `${where}, fold every ${h.kind} ${rankWord(h.hi)}-high hand.`;
	if (inRange.length === fam.length) return `${where}, raise every ${h.kind} ${rankWord(h.hi)}.`;
	const last = inRange[inRange.length - 1];
	const lowest = `${RANK_LABELS[last.hi]} ${RANK_LABELS[last.lo]}`;
	if (inRange.length === 1) return `${where}, ${lowest} is the only ${h.kind} ${rankWord(h.hi)}-high hand to raise.`;
	return `${where}, raise ${what} down to ${lowest}; fold the rest.`;
}
/** Two cards for a hand, in random suits. rng() returns a number in [0, 1). */
function cardsFor(handId, rng) {
	const h = hand(handId);
	const s1 = Math.floor(rng() * 4);
	let s2 = s1;
	if (h.kind !== 'suited') while (s2 === s1) s2 = Math.floor(rng() * 4);
	return [h.hi * 4 + s1, h.lo * 4 + s2];
}
/**
 * How far a hand is from the edge of a seat's range, in steps along its own kind (0 = the last
 * hand raised or the first one folded). Hands near the edge are the ones worth drilling.
 */
function edgeDistance(seatId, handId) {
	const fam = family(hand(handId));
	const i = fam.findIndex((x) => x.id === handId);
	const firstFold = fam.findIndex((x) => !raises(seatId, x.id));
	if (firstFold < 0) return fam.length - 1 - i; // all raised: distance from the weakest
	return i < firstFold ? firstFold - 1 - i : i - firstFold;
}


/* === js/core/draws.js === */
/* Draws: counting outs, and the two percentages a call comes down to. No page code. */
const DRAWS = {
	gutshot: { label: 'Gutshot straight draw', outs: 4, note: 'One rank fills the gap in your straight.' },
	oesd: { label: 'Open-ended straight draw', outs: 8, note: 'Four in a row: a card on either end makes the straight.' },
	double: { label: 'Double gutshot', outs: 8, note: 'Two different ranks each fill a gap.' },
	flush: { label: 'Flush draw', outs: 9, note: 'Four of a suit: 13 minus the 4 you can see.' },
	'flush+gutshot': { label: 'Flush draw + gutshot', outs: 12, note: '9 + 4, minus the 1 card counted twice.' },
	'flush+oesd': { label: 'Flush draw + open-ended', outs: 15, note: '9 + 8, minus the 2 cards counted twice.' },
};
const OUT_COUNTS = [4, 8, 9, 12, 15];

/**
 * The cards that would complete a straight or flush for `hole` on `board` (3 or 4 cards).
 * Returns null unless it's a clean draw to drill: nothing made yet (not even a pair), the flush
 * draw uses both hole cards, and no out makes the hand on the board alone. Otherwise
 * { kind, total, flush: [cards], straight: [cards], both: [cards], straightRanks, suit }.
 */
function readDraw(hole, board) {
	const seen = [...hole, ...board];
	if (strength(seen) >> 20 !== 0) return null;
	const suitCount = [0, 0, 0, 0];
	for (const c of board) suitCount[c & 3]++;
	if (Math.max(...suitCount) > 2) return null;
	const flushSuit = (hole[0] & 3) === (hole[1] & 3) && suitCount[hole[0] & 3] === 2 ? hole[0] & 3 : -1;

	const taken = new Set(seen);
	const flush = [];
	const straightRanks = new Set();
	for (let c = 0; c < 52; c++) {
		if (taken.has(c)) continue;
		const cat = strength([...seen, c]) >> 20;
		if (cat !== 4 && cat !== 5 && cat !== 8) continue;
		if (board.length === 4 && strength([...board, c]) >> 20 >= 4) return null;
		if ((c & 3) === flushSuit) flush.push(c);
		if (cat === 4) straightRanks.add(c >> 2);
	}
	// a card of the flush suit can complete the straight too: find the ranks from the other suits
	const ranks = [...straightRanks].sort((a, b) => a - b);
	if (ranks.length > 2) return null;
	const straight = [];
	for (let c = 0; c < 52; c++) if (!taken.has(c) && straightRanks.has(c >> 2)) straight.push(c);
	const both = straight.filter((c) => (c & 3) === flushSuit);
	const total = flush.length + straight.length - both.length;

	// four in a row already (the ace can sit below the two)? Then it's open-ended, or one-ended
	let have = 0;
	for (const c of seen) have |= 1 << (c >> 2);
	const has = (r) => (have >> (r < 0 ? 12 : r)) & 1;
	let fourInARow = false;
	for (let lo = -1; lo <= 9; lo++) if (has(lo) && has(lo + 1) && has(lo + 2) && has(lo + 3)) fourInARow = true;
	let run = '';
	if (ranks.length === 1) {
		if (fourInARow) return null; // A-2-3-4 or J-Q-K-A: one end only, a rarer case left out
		run = 'gutshot';
	} else if (ranks.length === 2) run = fourInARow ? 'oesd' : 'double';
	const kind = flush.length && run ? 'flush+' + run : flush.length ? 'flush' : run;
	if (!DRAWS[kind] || DRAWS[kind].outs !== total) return null;
	return { kind, total, flush, straight, both, straightRanks: ranks, suit: flushSuit };
}

/** The count spelled out: "9 hearts make your flush. Any 9 or ace makes your straight (8 cards)..." */
function explainDraw(d) {
	const parts = [];
	if (d.flush.length) parts.push(`${d.flush.length} ${SUIT_NAMES[d.suit]} are left to make your flush.`);
	if (d.straight.length) {
		const names = d.straightRanks.map((r) => RANK_LABELS[r]).reverse();
		parts.push(`Any ${names.join(' or ')} makes your straight (${d.straight.length} cards).`);
	}
	if (d.both.length) {
		parts.push(`${d.both.length === 1 ? 'One of those is' : d.both.length + ' of those are'} counted twice: ${d.flush.length} + ${d.straight.length} − ${d.both.length} = ${d.total}.`);
	}
	return parts.join(' ');
}

/** The exact chance of hitting one of `outs` cards with 1 or 2 cards to come, 0..1. */
function hitChance(outs, toCome) {
	const unseen = toCome === 2 ? 47 : 46; // 52 minus your two cards and the board
	if (toCome === 1) return outs / unseen;
	const miss = ((unseen - outs) * (unseen - outs - 1)) / (unseen * (unseen - 1));
	return 1 - miss;
}
/** The rule of 2 and 4: outs × 2 with one card to come, × 4 with two. A percentage. */
const ruleOfThumb = (outs, toCome) => outs * (toCome === 2 ? 4 : 2);
/** The share of the time a call has to win to break even: the call over the pot after you call. 0..1. */
const priceOfCall = (pot, bet) => bet / (pot + 2 * bet);

/** The bet sizes drilled, as a share of the pot, and what each one needs (a whole percentage). */
const BET_SIZES = [
	{ id: 'quarter', label: 'A quarter of the pot', short: '¼ pot', of: 1 / 4 },
	{ id: 'third', label: 'A third of the pot', short: '⅓ pot', of: 1 / 3 },
	{ id: 'half', label: 'Half the pot', short: '½ pot', of: 1 / 2 },
	{ id: 'twothirds', label: 'Two thirds of the pot', short: '⅔ pot', of: 2 / 3 },
	{ id: 'pot', label: 'The whole pot', short: 'Pot', of: 1 },
	{ id: 'double', label: 'Twice the pot', short: '2× pot', of: 2 },
].map((b) => ({ ...b, needs: Math.round(100 * priceOfCall(1, b.of)) }));


/* === js/core/questions.js === */
/* The questions each drill asks. No page code: every maker takes rng() (a number in [0, 1)) and
 * returns a plain object with the cards, the right `answer`, a `key` naming what kind of question
 * it is, and `why`, the explanation in a sentence or two.
 */

const pct = (x) => Math.round(100 * x);
const upper = (s) => s[0].toUpperCase() + s.slice(1);

// ---------------------------------------------------------------- 1. hand ranks
// how often each category is asked: the common ones more, the rare ones often enough to learn
const RANK_WEIGHTS = [1, 2, 2, 1.5, 2, 2, 2, 1, 0.7];
/** Two cards and a full board: name the best hand. want: a category to force (0..8). */
function makeRanks(rng, want) {
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
function makeWinner(rng, want) {
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
function makePreflop(rng, opts = {}) {
	const seatId = opts.seat && opts.seat !== 'all' ? opts.seat : pick(rng, SEATS).id;
	const misses = opts.misses || {};
	const h = pickWeighted(rng, HANDS, (x) => {
		const d = edgeDistance(seatId, x.id);
		const near = d === 0 ? 5 : d === 1 ? 3 : d <= 3 ? 1.5 : 0.6;
		return near * (1 + 2 * Math.min(3, misses[seatId + ':' + x.id] || 0));
	});
	return preflopQuestion(seatId, h.id, rng);
}
function preflopQuestion(seatId, handId, rng) {
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
function makeOuts(rng, opts = {}) {
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
function makeOdds(rng, opts = {}) {
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
function makeCall(rng, opts = {}) {
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
const TEST_SIZE = { ranks: 20, winner: 20, preflop: 30, outs: 15, odds: 20, call: 20 };
const PASS_MARK = 0.9;
const passes = (score, total) => score / total >= PASS_MARK;

/** A test's questions. Each kind of question comes up about equally often; starting hands never repeat. */
function buildTest(drill, rng, opts = {}) {
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
const MAKERS = { ranks: makeRanks, winner: makeWinner, preflop: makePreflop, outs: makeOuts, odds: makeOdds, call: makeCall };


/* === js/core/review.js === */
/* Bringing missed questions back during practice. No page code.
 *
 * A question you miss returns a few questions later, the same cards, so you have to recall the
 * answer rather than reread it. Get it right then and it returns once more, further on; get that
 * right too and it's done. Miss it again and it starts over.
 */
function createReview({ soon = 3, later = 8 } = {}) {
	const queue = []; // { q, due, step }
	let answered = 0;
	return {
		/** A question whose turn has come, or null. */
		due() {
			const i = queue.findIndex((x) => x.due <= answered);
			return i < 0 ? null : queue.splice(i, 1)[0];
		},
		/** Record an answer. item is what due() returned for this question, or null for a new one. */
		record(q, right, item) {
			answered++;
			if (!right) queue.push({ q, due: answered + soon, step: 0 });
			else if (item && item.step === 0) queue.push({ q, due: answered + later, step: 1 });
		},
		/** How many questions are waiting to come back. */
		waiting: () => queue.length,
	};
}


/* === js/app.js === */
const parse = cards;
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

const $ = (id) => document.getElementById(id);
const saved = window.SiteProgress ? window.SiteProgress.tool('poker-trainer') : { get: (k, d) => d, set: () => {} };

// ------------------------------------------------------------------ small helpers
function h(tag, attrs, kids) {
	const el = document.createElement(tag);
	for (const k in attrs || {}) {
		const v = attrs[k];
		if (v == null || v === false) continue;
		if (k === 'class') el.className = v;
		else if (k === 'text') el.textContent = trText(v);
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
	$('pEyebrow').textContent = trText(p.eyebrow || eyebrow());
	$('pName').textContent = trText(p.name || '');
	$('pMeta').textContent = trText(p.meta || ' ');
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
			[document.createTextNode(trText(a.label)), a.key ? h('kbd', { text: a.key === ' ' ? 'Space' : a.key.toUpperCase() }) : null]
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
						h('div', {}, [h('h4', {}, [document.createTextNode(trText(CATEGORIES[cat])), h('em', { text: oneIn(cat) })]), h('p', { text: line })]),
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
					h('div', { class: 'legend' }, legend.map(([c, t]) => h('span', {}, [h('i', { style: '--c: ' + c }), document.createTextNode(trText(t))]))),
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
				h('span', {}, [h('i', { text: String(i + 1) }), document.createTextNode(trText(d.label))]),
				h('em', { class: done ? 'done' : upNext === d && !b ? 'next' : '', text: b ? `${b.score}/${b.total}` : upNext === d ? 'next' : '' }),
			])
		);
	});
	$('railPath').textContent = LANG === 'es' ? 'Avanza por la lista en orden: cada ejercicio se basa en el anterior. Una marca indica que lograste 90% en el examen.' : 'Work down the list: each drill builds on the one before. A tick means you’ve scored 90% on its test.';
	const open = list.querySelector('[aria-pressed="true"]');
	if (scroll && open && open.scrollIntoView) open.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function showBest() {
	const b = bests[bestKey(S.drill)];
	$('best').innerHTML = b ? (LANG === 'es' ? `Mejor examen: <b>${b.score}/${b.total}</b> en ${clock(b.time)}` : `Best test: <b>${b.score}/${b.total}</b> in ${clock(b.time)}`) : (LANG === 'es' ? 'Aún sin puntuación de examen' : 'No test score yet');
}
function fillPanel() {
	setSeg('modeSeg', mode());
	const n = TEST_SIZE[S.drill];
	$('modeHint').textContent = LANG === 'es' ? (mode() === 'test' ? `${n} preguntas contrarreloj. Necesitas ${Math.ceil(PASS_MARK * n)} aciertos para aprobar.` : mode() === 'study' ? 'Léelo con calma y luego pasa a Practicar.' : 'Sin reloj. Las preguntas que falles volverán unas rondas después.') : (mode() === 'test' ? `${n} questions against the clock. ${Math.ceil(PASS_MARK * n)} right is a pass.` : MODE_HINT[mode()]);
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


// ------------------------------------------------------------------ Todologo i18n (es / en)
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

var PT_ES_STRINGS = {
  // Categories
  'High card': 'Carta alta',
  'Pair': 'Pareja',
  'Two pair': 'Doble pareja',
  'Three of a kind': 'Trío',
  'Straight': 'Escalera',
  'Flush': 'Color',
  'Full house': 'Full house',
  'Four of a kind': 'Póker',
  'Straight flush': 'Escalera de color',
  'Royal flush': 'Escalera real',
  // Drills
  'Hand ranks': 'Jerarquía de manos',
  'Who wins?': '¿Quién gana?',
  'Starting hands': 'Manos iniciales',
  'Count your outs': 'Cuenta tus outs',
  'The odds': 'Las probabilidades',
  'Call or fold?': '¿Pagar o retirarse?',
  // Seats
  'Under the gun': 'Under the gun (UTG)',
  'Hijack': 'Hijack (HJ)',
  'Cutoff': 'Cutoff (CO)',
  'Button': 'Botón (BTN)',
  'Small blind': 'Ciega pequeña (SB)',
  // Draws
  'Gutshot straight draw': 'Proyecto de escalera interna (gutshot)',
  'Open-ended straight draw': 'Proyecto de escalera abierta',
  'Double gutshot': 'Doble proyecto de escalera interna',
  'Flush draw': 'Proyecto de color',
  'Flush draw + gutshot': 'Proyecto de color + escalera interna',
  'Flush draw + open-ended': 'Proyecto de color + escalera abierta',
  'One rank fills the gap in your straight.': 'Un valor completa el hueco de tu escalera.',
  'Four in a row: a card on either end makes the straight.': 'Cuatro seguidas: una carta en cualquier extremo completa la escalera.',
  'Two different ranks each fill a gap.': 'Dos valores distintos completan cada uno un hueco.',
  'Four of a suit: 13 minus the 4 you can see.': 'Cuatro del mismo palo: 13 menos las 4 visibles.',
  '9 + 4, minus the 1 card counted twice.': '9 + 4, menos 1 carta contada dos veces.',
  '9 + 8, minus the 2 cards counted twice.': '9 + 8, menos 2 cartas contadas dos veces.',
  // Bet sizes
  'A quarter of the pot': 'Un cuarto del bote',
  'A third of the pot': 'Un tercio del bote',
  'Half the pot': 'Medio bote',
  'Two thirds of the pot': 'Dos tercios del bote',
  'The whole pot': 'El bote entero',
  'Twice the pot': 'El doble del bote',
  // Buttons & prompts
  'What’s your best hand?': '¿Cuál es tu mejor mano?',
  'The best five cards out of your two and the board': 'Las mejores cinco cartas entre tus dos cartas y la mesa',
  'Board': 'Mesa',
  'The flop': 'El flop',
  'The turn': 'El turn',
  'Your cards': 'Tus cartas',
  'Your outs': 'Tus outs',
  'Each player’s best five cards. Suits never break a tie.': 'Las mejores cinco cartas de cada jugador. Los palos nunca desempatan.',
  'A wins': 'Gana A',
  'Split': 'Empate',
  'B wins': 'Gana B',
  'Split pot': 'Bote dividido (empate)',
  'Player A wins': 'Gana el Jugador A',
  'Player B wins': 'Gana el Jugador B',
  'Raise': 'Subir',
  'Fold': 'Retirarse',
  'Call': 'Pagar',
  'How many outs?': '¿Cuántos outs tienes?',
  'How often will you hit?': '¿Con qué frecuencia ligarás?',
  'The rule of 2 and 4': 'La regla del 2 y del 4',
  'How often must you win to call?': '¿Qué porcentaje necesitas para pagar?',
  'The call, as a share of the pot once you’ve called': 'Lo que pagas dividido entre el bote total después de pagar',
  'Outs': 'Outs',
  'Card to come': 'Carta por salir',
  'Cards to come': 'Cartas por salir',
  'Pot': 'Bote',
  'Their bet': 'Su apuesta',
  'Their all-in': 'Su all-in',
  'You hit': 'Ligas',
  'You need': 'Necesitas',
  'more than': 'más de',
  'less than': 'menos de',
  'Correct': 'Correcto',
  'Next': 'Siguiente',
  'Passed': 'Aprobado',
  'Not yet': 'Aún no',
  'Score': 'Puntuación',
  'Time': 'Tiempo',
  'Nothing missed.': 'Sin fallos.',
  'Try again': 'Intentar de nuevo',
  'Practice': 'Practicar',
  'Next drill': 'Siguiente ejercicio',
  'Practise this': 'Practicar esto',
  'Another example': 'Otro ejemplo',
  'See examples': 'Ver ejemplos',
  'The nine hands': 'Las nueve manos',
  'Strongest at the top': 'De la más fuerte a la más débil',
  'How a winner is decided': 'Cómo se decide quién gana',
  'Five rules, in this order': 'Cinco reglas, en este orden',
  'Which hands to play': 'Qué manos jugar',
  'When everyone before you has folded: raise the coloured hands, fold the rest': 'Cuando todos foldean antes que tú: sube con las manos coloreadas y retírate con el resto',
  'Every seat': 'Cualquier posición',
  'Hijack and later': 'Hijack o posterior',
  'Cutoff and later': 'Cutoff o posterior',
  'Button only': 'Solo en Botón',
  'Fold from every seat': 'Retirarse en todas las posiciones',
  'The cards still in the deck that complete your hand': 'Las cartas que quedan en el mazo y completan tu mano',
  'The draws to know': 'Los proyectos clave',
  'Draw': 'Proyecto',
  'Example': 'Ejemplo',
  'Two percentages': 'Dos porcentajes',
  'How often you’ll hit, and how often you need to': 'Con qué frecuencia ligarás y cuánto necesitas para pagar',
  'How often you hit: the rule of 2 and 4': 'Con qué frecuencia ligas: la regla del 2 y del 4',
  'One card to come': 'Una carta por salir',
  'Two cards to come': 'Dos cartas por salir',
  'How often you need to win: the price of a call': 'Cuánto necesitas ganar: el precio de pagar',
  'They bet': 'Apuestan',
  'For example': 'Por ejemplo',
  'Is the call worth it?': '¿Vale la pena pagar?',
  'Compare two numbers': 'Compara dos números'
};

function trText(s) {
  if (LANG !== 'es' || typeof s !== 'string') return s;
  if (PT_ES_STRINGS[s]) return PT_ES_STRINGS[s];
  return s
    .replace(/^Study$/i, 'Estudiar')
    .replace(/^Practice$/i, 'Practicar')
    .replace(/^Test$/i, 'Examen')
    .replace(/ · Study/g, ' · Estudiar')
    .replace(/ · Practice/g, ' · Practicar')
    .replace(/ · Test/g, ' · Examen')
    .replace(/ · example/g, ' · ejemplo')
    .replace(/ · result/g, ' · resultado')
    .replace(/ · again/g, ' · repaso')
    .replace(/^Not quite: you said (.*)$/, 'Casi: dijiste $1')
    .replace(/^(\d+) to come back$/, '$1 pendiente(s) de repaso')
    .replace(/^(\d+) of (\d+) to pass$/, '$1 de $2 para aprobar')
    .replace(/ · a new best$/, ' · nuevo récord')
    .replace(/^Player ([AB]) · splits$/, 'Jugador $1 · empata')
    .replace(/^Player ([AB]) · wins$/, 'Jugador $1 · gana')
    .replace(/^Player ([AB])$/, 'Jugador $1')
    .replace(/^You act first$/, 'Hablas primero')
    .replace(/^1 player folded$/, '1 jugador se retiró')
    .replace(/^(\d+) players folded$/, '$1 jugadores se retiraron')
    .replace(/^(\d+) still to act$/, '$1 por hablar')
    .replace(/^Your opponent bets \$(\d+) into a pot of \$(\d+)\.$/, 'Tu rival apuesta $$$1 en un bote de $$$2.')
    .replace(/^Cards that complete your straight or flush · two cards to come$/, 'Cartas que completan tu escalera o color · quedan dos cartas por salir')
    .replace(/^Cards that complete your straight or flush · one card to come$/, 'Cartas que completan tu escalera o color · queda una carta por salir')
    .replace(/^The turn: one card to come$/, 'El turn: queda una carta por salir')
    .replace(/^Your opponent is all-in on the flop: two cards to come$/, 'Tu rival va all-in en el flop: quedan dos cartas por salir')
    .replace(/^1 in ([\d,.]+)$/, '1 de cada $1');
}

function applyPokerStaticLang() {
  document.documentElement.lang = LANG;
  const isEs = LANG === 'es';
  document.title = isEs ? 'Entrenador de Póker — Todologo' : 'Poker Trainer — Todologo';
  const mark = document.querySelector('.brand .mark');
  if (mark) mark.innerHTML = isEs ? 'ENTRENADOR DE <span>PÓKER</span><sup>BETA</sup>' : 'POKER <span>TRAINER</span><sup>BETA</sup>';
  const sub = document.querySelector('.brand .sub');
  if (sub) sub.textContent = isEs ? 'Texas Hold’em, una habilidad a la vez' : 'Texas hold’em, one skill at a time';
  const railTitle = document.querySelector('.rail-title');
  if (railTitle) railTitle.textContent = isEs ? 'Ejercicios, en orden' : 'Drills, in order';
  const stats = document.querySelectorAll('.stats .stat small');
  if (stats.length === 3) {
    stats[0].textContent = isEs ? 'Acierto' : 'Accuracy';
    stats[1].textContent = isEs ? 'Tiempo' : 'Time';
    stats[2].textContent = isEs ? 'Racha' : 'Streak';
  }
  if ($('settingsBtn')) $('settingsBtn').textContent = isEs ? 'Ajustes' : 'Settings';
  if ($('howBtn')) $('howBtn').textContent = isEs ? 'Cómo funciona' : 'How it works';
  if ($('cleanExit')) $('cleanExit').textContent = isEs ? 'Salir de vista limpia' : 'Exit clean view';
  if ($('closeSheet')) $('closeSheet').textContent = isEs ? 'Listo' : 'Done';
  if ($('langLabel')) $('langLabel').textContent = isEs ? 'Idioma' : 'Language';
  if ($('modeHeading')) $('modeHeading').textContent = isEs ? 'Modo' : 'Mode';
  if ($('seatHeading')) $('seatHeading').textContent = isEs ? 'Posición' : 'Seat';
  const modeBtns = $('modeSeg') ? $('modeSeg').querySelectorAll('button') : [];
  if (modeBtns.length === 3) {
    modeBtns[0].textContent = isEs ? 'Estudiar' : 'Study';
    modeBtns[1].textContent = isEs ? 'Practicar' : 'Practice';
    modeBtns[2].textContent = isEs ? 'Examen' : 'Test';
  }
  const seatAllBtn = $('seatSeg') ? $('seatSeg').querySelector('[data-v="all"]') : null;
  if (seatAllBtn) seatAllBtn.textContent = isEs ? 'Todas' : 'All';
  if ($('restartBtn')) $('restartBtn').textContent = isEs ? 'Reiniciar' : 'Restart';
  if ($('cleanBtn')) $('cleanBtn').textContent = isEs ? 'Vista limpia' : 'Clean view';
  if ($('creditText')) {
    $('creditText').textContent = isEs
      ? 'Texas Hold’em sin límite, seis jugadores. La tabla de manos iniciales está diseñada para principiantes: más simple y sólida. Solo para aprendizaje.'
      : 'No-limit Texas hold’em, six players. The starting-hand chart is this tool’s own beginner chart: simpler and a little tighter than the computer-solved ones it follows. For learning only.';
  }
  if ($('introTitle')) $('introTitle').textContent = isEs ? 'Seis ejercicios, en este orden' : 'Six drills, in this order';
  if ($('introBody1')) {
    $('introBody1').textContent = isEs
      ? 'Los principiantes suelen perder por tres hábitos: jugar demasiadas manos, pagar con demasiada frecuencia y calcular mal la fuerza de su mano. Cada ejercicio entrena una parte.'
      : 'Beginners usually lose through three habits: playing too many hands, calling too often, and misjudging how strong a hand is. Each drill works on one piece of that.';
  }
  if ($('introList')) {
    $('introList').innerHTML = isEs
      ? '<li><b>Jerarquía de manos</b> y <b>¿Quién gana?</b> Lee tus mejores cinco cartas y descubre quién se lleva el bote cuando dos manos están cerca.</li>' +
        '<li><b>Manos iniciales.</b> Qué dos cartas vale la pena subir desde cada posición.</li>' +
        '<li><b>Cuenta tus outs</b>, <b>Las probabilidades</b> y <b>¿Pagar o retirarse?</b> Cuenta las cartas que completan tu proyecto, conviértelas en porcentaje y compáralo con el precio de pagar.</li>'
      : '<li><b>Hand ranks</b> and <b>Who wins?</b> Read your best five cards, and know who takes the pot when two hands are close.</li>' +
        '<li><b>Starting hands.</b> Which two cards are worth playing from each seat. Folding the rest is the simplest big improvement a beginner can make.</li>' +
        '<li><b>Count your outs</b>, <b>The odds</b> and <b>Call or fold?</b> Count the cards that complete your hand, turn that into a percentage, and compare it with the price of the call.</li>';
  }
  if ($('introBody2')) {
    $('introBody2').innerHTML = isEs
      ? 'Cada ejercicio tiene tres modos: <b>Estudiar</b> te muestra las respuestas, <b>Practicar</b> te evalúa repitiendo los fallos, y <b>Examen</b> es contrarreloj. Consigue un 90% en el examen para completarlo.'
      : 'Each drill has three modes: <b>Study</b> shows you the answers, <b>Practice</b> quizzes you and brings your misses back, and <b>Test</b> is a timed run. Score 90% on a test and the drill gets a tick. Your progress stays in this browser.';
  }
  if ($('introGo')) $('introGo').textContent = isEs ? 'Empezar' : 'Start';
}

if ($('langSel')) {
  $('langSel').value = LANG;
  $('langSel').addEventListener('change', (e) => {
    LANG = e.target.value;
    saved.set('lang', LANG);
    try { localStorage.setItem('todologo.lang', LANG); } catch (err) {}
    applyPokerStaticLang();
    start();
  });
}
applyPokerStaticLang();
start();
if (!saved.get('seenIntro', false)) intro(true);

// handles for the checks in tools-src/poker-trainer/verify/
window.PT = { S, peek, start, setMode, setDrill, session };


})();
