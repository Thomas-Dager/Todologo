// A practice round or a test over one country's subdivisions. No page code here.
//
// Practice: every unit is asked; a wrong click or a give-up marks it missed, and missed units come
//   back at the end of the round (up to twice) so you get another go. The score is first-try answers.
// Test: one go at each unit; a wrong answer shows the right one and moves on.
// A misspelled typed answer ("close") counts as half a point in both.
import { judgeAnswer } from './answer.js';

export function shuffled(n, random = Math.random) {
	const a = Array.from({ length: n }, (_, i) => i);
	for (let i = n - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// units: [{ name, alts? }]; only: unit indexes to ask (default all)
export function newSession(units, { mode, format, random = Math.random, only = null }) {
	const pool = only ?? units.map((_, i) => i);
	const order = shuffled(pool.length, random).map((k) => pool[k]);
	return {
		units, mode, format,
		total: order.length,
		queue: order, // what's still to ask; queue[0] is the current one
		result: new Map(), // unit index -> 'ok' | 'close' | 'bad' (its first answer)
		repeats: new Map(), // practice: how often a unit has come back
		wrongNow: false, // practice: the current unit has had a wrong answer this time round
		attempts: 0,
		streak: 0,
		answered: 0,
	};
}

export const current = (s) => (s.queue.length ? s.queue[0] : null);
export const finished = (s) => s.queue.length === 0;

function settle(s, outcome) {
	const i = s.queue.shift();
	if (!s.result.has(i)) s.result.set(i, s.wrongNow && outcome !== 'bad' ? 'bad' : outcome);
	const missed = outcome === 'bad' || s.wrongNow;
	s.streak = missed ? 0 : s.streak + 1;
	if (missed && s.mode === 'practice' && (s.repeats.get(i) || 0) < 2) {
		s.repeats.set(i, (s.repeats.get(i) || 0) + 1);
		s.queue.push(i); // comes back at the end
	}
	s.wrongNow = false;
	s.answered++;
	return i;
}

// A click on unit `picked` when the current one was asked for.
// -> { outcome: 'ok' | 'wrong', target, moved } (moved: the round went on to the next unit)
export function answerClick(s, picked) {
	const target = current(s);
	if (target == null) return null;
	s.attempts++;
	if (picked === target) {
		settle(s, 'ok');
		return { outcome: 'ok', target, moved: true };
	}
	if (s.mode === 'test') {
		settle(s, 'bad');
		return { outcome: 'wrong', target, moved: true };
	}
	s.wrongNow = true;
	s.streak = 0;
	return { outcome: 'wrong', target, moved: false };
}

// A typed name for the current (highlighted) unit.
// -> { outcome: 'ok' | 'close' | 'wrong' | 'empty', target, moved }
export function answerType(s, text) {
	const target = current(s);
	if (target == null) return null;
	const verdict = judgeAnswer(text, s.units[target], s.units);
	if (verdict === 'empty') return { outcome: 'empty', target, moved: false };
	s.attempts++;
	if (verdict === 'exact' || verdict === 'close') {
		const outcome = verdict === 'exact' ? 'ok' : 'close';
		settle(s, outcome);
		return { outcome, target, moved: true };
	}
	if (s.mode === 'test') {
		settle(s, 'bad');
		return { outcome: 'wrong', target, moved: true };
	}
	s.wrongNow = true;
	s.streak = 0;
	return { outcome: 'wrong', target, moved: false };
}

// See the answer: counts as missed
export function giveUp(s) {
	const target = current(s);
	if (target == null) return null;
	settle(s, 'bad');
	return { outcome: 'gaveup', target, moved: true };
}

// Leave the current one for later (no penalty); nothing happens if it's the last one left
export function skip(s) {
	if (s.queue.length < 2) return false;
	s.queue.push(s.queue.shift());
	s.wrongNow = false;
	return true;
}

export function summary(s) {
	let ok = 0, close = 0, bad = 0;
	for (const r of s.result.values()) {
		if (r === 'ok') ok++;
		else if (r === 'close') close++;
		else bad++;
	}
	return { total: s.total, ok, close, bad, score: ok + close / 2, missed: [...s.result].filter(([, r]) => r === 'bad').map(([i]) => i) };
}

// Is `a` a better result than the saved best `b`? More points first, then less time.
export function better(a, b) {
	if (!b) return true;
	const pa = a.score / a.total, pb = b.score / b.total;
	return pa > pb || (pa === pb && a.ms < b.ms);
}
