// What the tool asks about each country. World Capitals, World Countries and World Flags are one tool
// (app.js: the map, the regions, Study / Practice / Test, click and type questions) with three subjects.
// Each page says which with <html data-subject="…">: no attribute means World Capitals. Everything
// that differs between them is here, and nothing here touches the page. The words are in text.js.
import { t, nameOf, capitalOf, nameForms as localNames, capitalForms as localCapitals, uiText } from './text.js';

/* ---------------- typed answers ---------------- */
// Letters only, accents off, lower case: "São Tomé" -> "saotome". Letters of any alphabet count (Москва,
// 東京, القاهرة), so a name typed in any language compares; the few Latin letters with no accent to take
// off (ø, ß, ł…) become the plain letters people type for them.
const PLAIN = { ø: 'o', æ: 'ae', œ: 'oe', ß: 'ss', ł: 'l', đ: 'd', ð: 'd', þ: 'th', ı: 'i' };
export const norm = (s) =>
	String(s)
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/\bst\b\.?/g, 'saint')
		.replace(/[øæœßłđðþı]/g, (ch) => PLAIN[ch])
		.replace(/[^\p{L}\p{M}\p{N}]/gu, '');
export function editDistance(a, b) {
	const m = a.length, n = b.length;
	const d = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
	for (let j = 1; j <= n; j++) d[0][j] = j;
	for (let i = 1; i <= m; i++)
		for (let j = 1; j <= n; j++) {
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
		}
	return d[m][n];
}

/* ---------------- country names ---------------- */
// Other names that count as right when a country's name is typed: full official names and the short
// names people use. Not a part for the whole (England, Holland) and not an ambiguous one (Korea, Congo).
export const COUNTRY_ALTS = {
	USA: ['United States of America', 'USA', 'US', 'America'],
	GBR: ['UK', 'Great Britain', 'Britain'],
	ARE: ['UAE', 'Emirates'],
	COD: ['Democratic Republic of the Congo', 'DRC', 'Congo-Kinshasa'],
	COG: ['Congo-Brazzaville', 'Republic of Congo'],
	KOR: ['Republic of Korea'],
	PRK: ['DPRK'],
	CZE: ['Czech Republic'],
	TUR: ['Turkey'],
	CPV: ['Cape Verde'],
	TLS: ['East Timor'],
	CIV: ['Ivory Coast'],
	MMR: ['Burma'],
	VAT: ['Vatican', 'Holy See'],
	FSM: ['Federated States of Micronesia'],
	PSX: ['State of Palestine'],
	CAF: ['CAR'],
	BIH: ['Bosnia-Herzegovina', 'Bosnia'],
	RUS: ['Russian Federation'],
	CHN: ["People's Republic of China"],
	TWN: ['Republic of China'],
	VNM: ['Viet Nam'],
	LAO: ['Lao'],
	SYR: ['Syrian Arab Republic'],
	BRN: ['Brunei Darussalam'],
	MKD: ['Macedonia'],
	KNA: ['Saint Christopher and Nevis'],
	PNG: ['PNG'],
	NZL: ['NZ'],
};
// Old names: typing one gets "that's its old name" instead of a plain wrong answer
export const COUNTRY_FORMER = {
	SWZ: ['Swaziland'],
	LKA: ['Ceylon'],
	BFA: ['Upper Volta'],
	BEN: ['Dahomey'],
	KHM: ['Kampuchea'],
	THA: ['Siam'],
	ZWE: ['Rhodesia'],
	COD: ['Zaire'],
	IRN: ['Persia'],
};
// Every spelling of a country's name that counts: with and without "the" in front ("The Gambia"),
// and with "and" left out ("Antigua & Barbuda" types as "Antigua Barbuda")
export function nameForms(c) {
	const out = [];
	for (const s of [c.name, ...(COUNTRY_ALTS[c.id] || [])]) {
		out.push(s, 'The ' + s);
		if (/\band\b/.test(s)) out.push(s.replace(/\band\b/g, ' '));
	}
	return out;
}

/* ---------------- flags ---------------- */
// Shown with a flag once it has been answered or looked at (never before: it would give it away)
export const FLAG_NOTES = {
	AFG: 'This is the flag of the Islamic Republic, still used by the UN, the Olympics and many embassies. Since 2021 the Taliban government has used a white flag with the shahada in black.',
	SYR: 'Adopted in 2025, after the fall of the Assad government. Until then Syria’s flag was red, white and black with two green stars.',
	KGZ: 'Redrawn in 2023 with straight rays; the old flag’s rays were wavy.',
	TCD: 'Almost the same as Romania’s: Chad’s blue is a little darker.',
	ROU: 'Almost the same as Chad’s: Romania’s blue is a little lighter.',
	IDN: 'The same red over white as Monaco’s, but longer (2:3; Monaco’s is 4:5).',
	MCO: 'The same red over white as Indonesia’s, but squarer (4:5; Indonesia’s is 2:3).',
	NLD: 'Like Luxembourg’s, with a darker blue and a shorter shape.',
	LUX: 'Like the Netherlands’, with a lighter blue and a longer shape.',
	IRL: 'Green on the left (by the pole). Côte d’Ivoire’s is the same colours the other way round.',
	CIV: 'Orange on the left (by the pole). Ireland’s is the same colours the other way round.',
	AUS: 'Six white stars. New Zealand’s has four red ones and no small star.',
	NZL: 'Four red stars outlined in white. Australia’s has six white ones.',
	SEN: 'Like Mali’s, with a green star in the middle.',
	MLI: 'Green, yellow and red from the pole. Senegal’s adds a green star; Guinea’s has the same colours the other way round.',
	GIN: 'Red, yellow and green from the pole. Mali’s has the same colours the other way round.',
	COL: 'The yellow takes the top half. Ecuador’s is the same, with its coat of arms in the middle.',
	ECU: 'Like Colombia’s, with Ecuador’s coat of arms in the middle.',
	VEN: 'Yellow, blue and red in equal stripes, with an arc of eight stars.',
	SVN: 'White, blue and red, with Slovenia’s coat of arms (Mount Triglav) near the top left.',
	SVK: 'White, blue and red, with Slovakia’s coat of arms (a double cross on three hills) toward the pole.',
	RUS: 'White, blue and red, with no coat of arms.',
	NOR: 'A blue cross outlined in white on red. Iceland’s is the same with the colours swapped.',
	ISL: 'A red cross outlined in white on blue. Norway’s is the same with the colours swapped.',
	QAT: 'Maroon, and long (11:28). Bahrain’s is red and has five points.',
	BHR: 'Red, with five white points. Qatar’s is maroon, longer and has nine.',
	NPL: 'The only national flag that isn’t a rectangle.',
	CHE: 'Square, like the Vatican’s.',
	VAT: 'Square, like Switzerland’s.',
};
// The picture of a country's flag (World Flags only): flag-atlas/flags/<id>.svg, from the folder of this file
export const flagUrl = (id) => new URL(`../flag-atlas/flags/${id}.svg`, import.meta.url).href;

/* ---------------- the three subjects ---------------- */
// A capital's note (countries.json) and a flag's note, in the language in use where they've been translated
const note = (c) => uiText('note.' + c.id) ?? c.note ?? '';
const flagNote = (c) => uiText('flag.' + c.id) ?? FLAG_NOTES[c.id] ?? '';
const join = (...parts) => parts.filter(Boolean).join(' ');
const capitals = {
	key: 'capitals',
	tool: 'capital-atlas', // the folder, and the id its progress is saved under
	name: 'World Capitals',
	answer: (c) => capitalOf(c), // what a typed answer has to be (as shown)
	// what counts: the capital in the language in use, and in English with its other names
	forms: (c) => [...localCapitals(c), c.capital, ...(c.alts || [])],
	former: (c) => c.formerly || [],
	formerMsg: (typed) => t('capitals.former', { typed }),
	otherMsg: (o) => t('capitals.other', { capital: capitalOf(o), name: nameOf(o) }),
	tell: (c) => t('capitals.tell', { name: nameOf(c), capital: capitalOf(c) }),
	fact: (c) => t('capitals.fact', { name: nameOf(c), capital: capitalOf(c) }), // a country named, with what it teaches
	outside: (c, region) => t('capitals.outside', { name: nameOf(c), capital: capitalOf(c), region }),
	missClick: (c) => t('capitals.miss_click', { name: nameOf(c) }), // a wrong click: c was asked for
	callout: (c) => ({ title: capitalOf(c), sub: nameOf(c) }),
	label: (c) => capitalOf(c), // on the spinning globe
	dots: true, // a dot on every capital
	waterNames: true, // the names of oceans, seas, lakes and rivers show until a visitor turns them off (L)
	around: [7, 4.5], // the least a view of one country shows: degrees of longitude and latitude each side of its middle
	lightTyped: true, // typed questions light up the country being asked about
	namesAnswer: false, // a country's name answers a question (so voice can't fly to one mid-quiz)
	placeholder: () => t('capitals.placeholder'),
	study: (c) => ({ name: t('capitals.pair', { name: nameOf(c), capital: capitalOf(c) }), tip: note(c) }),
	clickAsk: (c) => ({ eyebrow: t('capitals.click_ask'), name: capitalOf(c) }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: capitalOf(c), tip: join(t('capitals.capital_of', { capital: capitalOf(c), name: nameOf(c) }), note(c)) }),
	typeAsk: (c) => ({ eyebrow: t('capitals.type_ask'), name: nameOf(c) }),
	typeReveal: (c) => ({ eyebrow: t('capitals.type_reveal', { name: nameOf(c) }), name: capitalOf(c), tip: join(t('type_it'), note(c)) }),
	hint: (k) => t('capitals.' + k + '_hint'), // study, click, type, type_hard
};
const countries = {
	key: 'countries',
	tool: 'country-atlas',
	name: 'World Countries',
	answer: (c) => nameOf(c),
	forms: (c) => [...localNames(c), ...nameForms(c)],
	former: (c) => COUNTRY_FORMER[c.id] || [],
	formerMsg: (typed) => t('countries.former', { typed }),
	otherMsg: (o) => t('countries.other', { name: nameOf(o) }),
	tell: (c) => t('countries.tell', { name: nameOf(c) }),
	fact: (c) => t('countries.fact', { name: nameOf(c) }),
	outside: (c, region) => t('countries.outside', { name: nameOf(c), region }),
	missClick: (c, clicked) => t('countries.miss_click', { name: nameOf(c), clicked: nameOf(clicked) }),
	callout: (c) => ({ title: nameOf(c), sub: '' }),
	label: (c) => nameOf(c),
	dots: false,
	waterNames: false, // off at first: the map is for finding countries; L or the Names button turns them on
	around: [16, 10],
	lightTyped: true,
	namesAnswer: true,
	placeholder: () => t('countries.placeholder'),
	study: (c) => ({ name: nameOf(c), tip: '' }),
	clickAsk: (c) => ({ eyebrow: t('countries.click_ask'), name: nameOf(c) }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: nameOf(c), tip: '' }),
	typeAsk: () => ({ eyebrow: t('countries.type_ask'), name: t('countries.the_glowing') }),
	typeReveal: (c) => ({ eyebrow: t('countries.type_reveal'), name: nameOf(c), tip: t('type_it') }),
	hint: (k) => t('countries.' + k + '_hint'),
};
const flags = {
	...countries,
	key: 'flags',
	tool: 'flag-atlas',
	name: 'World Flags',
	formerMsg: (typed) => t('flags.former', { typed }),
	otherMsg: (o) => t('flags.other', { name: nameOf(o) }),
	tell: (c) => t('flags.tell', { name: nameOf(c) }),
	fact: (c) => t('flags.fact', { name: nameOf(c) }),
	outside: (c, region) => t('flags.outside', { name: nameOf(c), region }),
	missClick: (c, clicked) => t('flags.miss_click', { name: nameOf(c), clicked: nameOf(clicked) }),
	callout: (c) => ({ title: nameOf(c), sub: '', flag: c.id }),
	lightTyped: false, // the flag is the question: lighting the country would give the answer away
	placeholder: () => t('flags.placeholder'),
	study: (c) => ({ name: nameOf(c), flag: c.id, tip: flagNote(c) }),
	clickAsk: (c) => ({ eyebrow: t('flags.click_ask'), name: '', flag: c.id }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: nameOf(c), flag: c.id, tip: flagNote(c) }),
	typeAsk: (c) => ({ eyebrow: t('flags.type_ask'), name: '', flag: c.id }),
	typeReveal: (c) => ({ eyebrow: t('flags.type_reveal'), name: nameOf(c), flag: c.id, tip: join(t('type_it'), flagNote(c)) }),
	hint: (k) => t('flags.' + k + '_hint'),
};
export const SUBJECTS = { capitals, countries, flags };
export const subjectFor = (key) => SUBJECTS[key] || capitals;

/* ---------------- checking a typed answer ---------------- */
// -> checkAnswer(c, typed, { strict, keepSecret }): { ok, note } or { ok: false, msg }; a near miss in
// Easy is { ok: true, close: true, note } (half a point).
// strict: spelling must be exact (accents, capitals and punctuation still don't matter).
// keepSecret: a wrong answer's message doesn't give the answer away.
// The checker knows the names in the language in use when it is made: make a new one after a language change.
export function makeChecker(S, list) {
	const index = new Map(); // a normalised answer -> the country it belongs to
	for (const c of list) for (const s of S.forms(c)) if (norm(s) && !index.has(norm(s))) index.set(norm(s), c);
	return function checkAnswer(c, typed, { strict = false, keepSecret = false } = {}) {
		const n = norm(typed);
		const forms = S.forms(c).map(norm).filter(Boolean);
		if (n && forms.includes(n)) return { ok: true };
		const tell = ' ' + (keepSecret ? t('try_again') : S.tell(c));
		if (S.former(c).map(norm).includes(n)) return { ok: false, msg: S.formerMsg(typed.trim()) + tell };
		const other = index.get(n);
		if (other && other !== c) return { ok: false, msg: S.otherMsg(other) + tell };
		const slack = strict ? 0 : n.length >= 8 ? 2 : n.length >= 5 ? 1 : 0;
		if (slack && forms.some((f) => editDistance(n, f) <= slack)) return { ok: true, close: true, note: t('close_note', { answer: S.answer(c) }) };
		if (keepSecret) return { ok: false, msg: t('not_quite') };
		const near = strict && forms.some((f) => editDistance(n, f) <= (n.length >= 8 ? 2 : 1));
		return { ok: false, msg: near ? t('so_close_hard', { answer: S.answer(c) }) : S.fact(c) };
	};
}
