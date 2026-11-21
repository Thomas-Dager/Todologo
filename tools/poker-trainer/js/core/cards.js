/* Cards and hand strength (Texas hold'em). No page code.
 *
 * A card is a number 0..51: its rank is card >> 2 (0 is a two, 12 an ace) and its suit card & 3
 * (clubs, diamonds, hearts, spades). In text a card is two letters: 'Ah', 'Td', '7c'.
 */
export const RANKS = '23456789TJQKA';
export const SUITS = 'cdhs';
export const SUIT_NAMES = ['clubs', 'diamonds', 'hearts', 'spades'];
/** What a card shows: 10 for a ten. */
export const RANK_LABELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const WORDS = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
export const rankWord = (r) => WORDS[r];
export const rankWords = (r) => WORDS[r] + (r === 4 ? 'es' : 's');

export const rankOf = (c) => c >> 2;
export const suitOf = (c) => c & 3;
export const card = (text) => RANKS.indexOf(text[0]) * 4 + SUITS.indexOf(text[1]);
/** 'Ah Kd' or 'AhKd' -> [card, card] */
export const cards = (text) => (text.replace(/\s+/g, '').match(/../g) || []).map(card);
export const cardText = (c) => RANKS[c >> 2] + SUITS[c & 3];

/** Hand categories, weakest first. A royal flush is the best straight flush. */
export const CATEGORIES = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush'];
/** How many five-card hands of each category exist, out of 2,598,960: why they rank in this order. */
export const FIVE_CARD_COUNTS = [1302540, 1098240, 123552, 54912, 10200, 5108, 3744, 624, 40];
export const FIVE_CARD_TOTAL = 2598960;
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
export function strength(cs) {
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
export const categoryOf = (v) => v >> 20;
/** The ranks that decide a tie within a category, most important first. */
export function deciders(v) {
	const out = [];
	for (let i = 0; i < DECIDERS[v >> 20]; i++) out.push((v >> (4 * (4 - i))) & 15);
	return out;
}

/** The five cards that make the best hand, out of 5 to 7. */
export function bestFive(cs) {
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
export function describe(v) {
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
export function compare(a, b) {
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
export function deal(rng, n, taken = []) {
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
export function seeded(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
export function pickWeighted(rng, items, weight) {
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
export const pick = (rng, items) => items[Math.floor(rng() * items.length)];
export function shuffle(rng, items) {
	const a = items.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
