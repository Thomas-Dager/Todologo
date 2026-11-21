// Checking a typed name against a subdivision. No page code here.

// Words that say what kind of place it is, not which one: "Kyiv Oblast" and "Kyiv" are the same answer
const KIND_WORDS = /\b(province|provincia|state|region|oblast|krai|okrug|county|district|department|departamento|prefecture|governorate|municipality|city|canton|parish|territory|emirate|division|voivodeship|republic|autonomous|federal|capital|special|administrative|metropolitan|of|the|de|del|do|da)\b/g;

// Letters that are not a plain letter with an accent on it, so taking accents off leaves them as they are
const PLAIN = { đ: 'd', ð: 'd', ø: 'o', ł: 'l', ı: 'i', ß: 'ss', æ: 'ae', œ: 'oe', þ: 'th' };

// Letters and digits only, accents off: "Côte-d'Or" -> "cotedor", "Đà Nẵng" -> "da nang"
export function norm(s) {
	return String(s ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[đðøłıßæœþ]/g, (c) => PLAIN[c])
		.replace(/&/g, ' and ')
		.replace(/\bst\b\.?/g, 'saint')
		.replace(/[^a-z0-9 ]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
const squash = (s) => s.replace(/ /g, '');

export function editDistance(a, b) {
	const m = a.length, n = b.length;
	if (!m) return n;
	if (!n) return m;
	let prev = Array.from({ length: n + 1 }, (_, j) => j);
	for (let i = 1; i <= m; i++) {
		const cur = [i];
		for (let j = 1; j <= n; j++) {
			cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
		}
		prev = cur;
	}
	return prev[n];
}

// Every spelling that counts as right for a unit: its name, its other names, each with and without
// a "(city)" tag and the kind words
export function answerForms(unit) {
	const forms = new Set();
	for (const raw of [unit.name, ...(unit.alts || [])]) {
		const bare = String(raw).replace(/\s*\([^)]*\)\s*/g, ' ');
		for (const s of [raw, bare]) {
			const n = norm(s);
			if (n) forms.add(squash(n));
			const short = squash(n.replace(KIND_WORDS, ' ').replace(/\s+/g, ' ').trim());
			if (short.length >= 3) forms.add(short);
		}
	}
	return [...forms];
}

// A unit's names exactly as written (accents and spacing aside), with and without a "(city)" tag:
// kind words stay, so "Kyiv" and "Kyiv Oblast" are different names here
export function fullForms(unit) {
	const forms = new Set();
	for (const raw of [unit.name, ...(unit.alts || [])]) {
		for (const s of [raw, String(raw).replace(/\s*\([^)]*\)\s*/g, ' ')]) {
			const n = squash(norm(s));
			if (n) forms.add(n);
		}
	}
	return forms;
}

// checkAnswer, knowing the other units of the country: typing another unit's own name is wrong, not a
// near miss ("Kabul" for Zabul) nor right through a shared kind word ("Kyiv" for Kyiv Oblast, when the
// city of Kyiv is a unit too)
export function judgeAnswer(typed, unit, others = []) {
	const verdict = checkAnswer(typed, unit);
	if (verdict === 'empty' || verdict === 'wrong') return verdict;
	const t = squash(norm(typed));
	if (fullForms(unit).has(t)) return verdict;
	for (const other of others) if (other !== unit && fullForms(other).has(t)) return 'wrong';
	return verdict;
}

// -> 'exact', 'close' (a small spelling slip: half a point), 'wrong' or 'empty'
export function checkAnswer(typed, unit) {
	const n = norm(typed);
	if (!n) return 'empty';
	const t = squash(n);
	const tShort = squash(n.replace(KIND_WORDS, ' ').replace(/\s+/g, ' ').trim());
	const forms = answerForms(unit);
	if (forms.includes(t) || (tShort.length >= 3 && forms.includes(tShort))) return 'exact';
	for (const f of forms) {
		const slack = f.length >= 8 ? 2 : f.length >= 5 ? 1 : 0;
		if (slack && (editDistance(t, f) <= slack || editDistance(tShort, f) <= slack)) return 'close';
	}
	return 'wrong';
}
