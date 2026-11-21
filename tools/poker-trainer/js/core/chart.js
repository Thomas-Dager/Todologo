/* The starting-hand chart: which hands to raise when everyone before you has folded, by seat,
 * at a six-player table. No page code.
 *
 * This is our own beginner chart, not a copy of anyone's. It follows the shape computer-solved
 * charts share (more hands the later you act) but is simpler and a little tighter in the early
 * seats: each kind of hand (pairs, suited kings, offsuit aces...) is raised from one cut-off
 * upward, with nothing mixed, so every hand has one answer and every answer has a one-line rule.
 * The small blind plays the Cutoff's chart. The reasons are in claude/poker-trainer-plan.md.
 */
import { RANKS, RANK_LABELS, rankWord, rankWords } from './cards.js';

/** The seats in the order they act before the flop. `behind` is how many players are still to act. */
export const SEATS = [
	{ id: 'utg', name: 'Under the gun', short: 'UTG', behind: 5, chart: 'utg' },
	{ id: 'hj', name: 'Hijack', short: 'HJ', behind: 4, chart: 'hj' },
	{ id: 'co', name: 'Cutoff', short: 'CO', behind: 3, chart: 'co' },
	{ id: 'btn', name: 'Button', short: 'BTN', behind: 2, chart: 'btn' },
	{ id: 'sb', name: 'Small blind', short: 'SB', behind: 1, chart: 'co' },
];
export const seat = (id) => SEATS.find((s) => s.id === id);

// 'ATs+' = suited A-10 and every better suited ace; '66+' = sixes and every bigger pair
const RAISE = {
	utg: '66+, ATs+, KTs+, QTs+, JTs, T9s, AJo+, KQo',
	hj: '55+, A2s+, K9s+, Q9s+, J9s+, T9s, 98s, ATo+, KJo+',
	co: '22+, A2s+, K6s+, Q8s+, J8s+, T8s+, 98s, 87s, 76s, 65s, 54s, A9o+, KTo+, QTo+, JTo',
	btn: '22+, A2s+, K2s+, Q4s+, J6s+, T6s+, 96s+, 85s+, 75s+, 64s+, 53s+, 43s, A2o+, K8o+, Q9o+, J9o+, T8o+, 98o',
};

/** The 169 starting hands: 'AA', 'AKs' (suited), 'AKo' (offsuit). hi and lo are ranks, 12 the ace. */
export const HANDS = [];
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
export const hand = (id) => BY_ID.get(id);

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
export const raises = (seatId, handId) => RANGES[seat(seatId).chart].has(handId);
/** The share of all 1,326 two-card hands raised from a seat, 0..1. */
export function share(seatId) {
	let n = 0;
	for (const h of HANDS) if (raises(seatId, h.id)) n += h.combos;
	return n / 1326;
}
/** The seats a hand is raised from, earliest first. */
export const raisedFrom = (handId) => SEATS.filter((s) => raises(s.id, handId)).map((s) => s.id);

/** 'AKs' -> 'A K suited', 'TT' -> 'Pair of tens' */
export function handName(handId) {
	const h = hand(handId);
	if (h.kind === 'pair') return 'Pair of ' + rankWords(h.hi);
	return `${RANK_LABELS[h.hi]} ${RANK_LABELS[h.lo]} ${h.kind}`;
}
// the hands of one kind that share a top card, best first: suited kings are KQs, KJs ... K2s
function family(h) {
	return HANDS.filter((x) => x.kind === h.kind && (h.kind === 'pair' || x.hi === h.hi));
}
/** The rule a hand falls under, in words: "From the Cutoff, raise suited kings down to K 6." */
export function rule(seatId, handId) {
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
export function cardsFor(handId, rng) {
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
export function edgeDistance(seatId, handId) {
	const fam = family(hand(handId));
	const i = fam.findIndex((x) => x.id === handId);
	const firstFold = fam.findIndex((x) => !raises(seatId, x.id));
	if (firstFold < 0) return fam.length - 1 - i; // all raised: distance from the weakest
	return i < firstFold ? firstFold - 1 - i : i - firstFold;
}
