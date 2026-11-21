// The map: a globe you can drag and zoom, drawn on one canvas. It shows the world's countries
// (the World Capitals map's own shapes, so the borders are the same) and, on top, the subdivisions
// of the country being studied. The page decides the colours and labels through `view`.
//
// It is drawn to look like the World Capitals globe: the same sea, glow, grid, shading, colours,
// border widths, lakes and rivers, from the same files, with the same numbers. Change one, change
// the other (capital-atlas/app.js: COL, drawBase, drawWater, lodName). What it leaves out on
// purpose: the names of seas, lakes and rivers, and naming a lake when it is clicked.
import { geoOrthographic, geoPath, geoGraticule10, geoContains, geoBounds, geoCentroid, geoDistance, geoArea } from '../../capital-atlas/geo.js';

export const COL = {
	seaLit: '#1a3142', // the sea where the light falls, top left
	seaDark: '#0b1820',
	glow: '111, 208, 232', // the thin atmosphere round the globe
	grat: 'rgba(111, 208, 232, 0.08)',
	shade: '4, 8, 12', // darkening toward the rim, so it reads as a ball
	lake: '#1d4560',
	lakeEdge: 'rgba(9, 14, 19, 0.55)',
	river: 'rgba(74, 146, 190, 0.8)',
	land: '#c6bba2', // a country you can study, or a subdivision not yet answered
	landOff: '#857f6f', // a country with no subdivisions to learn
	other: '#4b585f', // the rest of the world while one country is open
	territory: '#384449',
	border: 'rgba(9, 14, 19, 0.9)',
	hover: 'rgba(255, 250, 238, 0.32)',
	target: '#6fd0e8',
	targetEdge: '#bff0fb', // the thin light line round the province being looked at or asked about
	ok: '#86c39a',
	close: '#e2c35c',
	bad: '#d08a7c',
	ring: '#ecdec2',
	label: '#ecdec2',
	labelHalo: 'rgba(8, 15, 21, 0.85)',
};
const DEG = Math.PI / 180, TAU = Math.PI * 2;
const TINY = 12; // a unit smaller than this on screen gets a ring you can click
const RING = 9;
const GRAT = geoGraticule10();
const LEVELS = ['low', 'mid', 'high']; // the world's shapes, coarse to fine
const LAKE_LEAD = 0.5, RIVER_LEAD = 0.3; // lakes show from half a zoom level early, rivers a little less
const RIVER_CLASSES = [[0, 2], [3, 4], [5, 99]];

const biggestPiece = (g) => {
	if (g.type !== 'MultiPolygon') return g;
	let best = null, area = -1;
	for (const coords of g.coordinates) {
		const a = geoArea({ type: 'Polygon', coordinates: coords });
		if (a > area) [best, area] = [coords, a];
	}
	return { type: 'Polygon', coordinates: best };
};
// A point inside a polygon whose centroid isn't: the middle of the widest stretch of the shape along
// the centroid's latitude (holes cut the stretches)
function insidePoint(poly) {
	const lat = geoCentroid(poly)[1], xs = [];
	for (const ring of poly.coordinates) {
		for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
			const [x1, y1] = ring[i], [x2, y2] = ring[j];
			if (y1 > lat !== y2 > lat) xs.push(x1 + ((lat - y1) / (y2 - y1)) * (x2 - x1));
		}
	}
	xs.sort((a, b) => a - b);
	let best = null, width = 0;
	for (let k = 0; k + 1 < xs.length; k += 2) if (xs[k + 1] - xs[k] > width) [best, width] = [(xs[k] + xs[k + 1]) / 2, xs[k + 1] - xs[k]];
	return best == null ? null : [best, lat];
}
// The part of a country worth framing: its units' main pieces, without one or two far-off ones
// (Alaska and Hawaii, the Canaries, Svalbard), which would shrink everything else.
// -> { shape, far: [unit indexes left out] }
export function mainCluster(features) {
	const pieces = features.map((f) => ({ type: 'Feature', properties: {}, geometry: biggestPiece(f.geometry) }));
	const centres = pieces.map((p) => geoCentroid(p));
	const reachOf = (keep) => {
		let x = 0, y = 0, z = 0;
		for (const i of keep) {
			const [lon, lat] = centres[i];
			x += Math.cos(lat * DEG) * Math.cos(lon * DEG);
			y += Math.cos(lat * DEG) * Math.sin(lon * DEG);
			z += Math.sin(lat * DEG);
		}
		const mid = [Math.atan2(y, x) / DEG, Math.atan2(z, Math.hypot(x, y)) / DEG];
		let far = -1, reach = 0;
		const ds = [];
		for (const i of keep) {
			const d = geoDistance(mid, centres[i]);
			ds.push(d);
			if (d > reach) [far, reach] = [i, d];
		}
		ds.sort((a, b) => a - b);
		return { far, reach, typical: ds[ds.length >> 1] };
	};
	// boxes that touch: the unit is joined to (or right beside) another one, not off on its own
	const boxes = features.map((f) => geoBounds(f));
	const spans = ([[w], [e]]) => (w <= e ? [[w, e]] : [[w, 180], [-180, e]]);
	const touching = (a, b) => a[0][1] <= b[1][1] + 0.05 && b[0][1] <= a[1][1] + 0.05 && spans(a).some(([w1, e1]) => spans(b).some(([w2, e2]) => w1 <= e2 + 0.05 && w2 <= e1 + 0.05));
	const alone = (i, keep) => !keep.some((j) => j !== i && touching(boxes[i], boxes[j]));
	let keep = features.map((_, i) => i);
	const out = [];
	for (let n = Math.min(2, Math.floor((features.length - 1) / 4)); n > 0; n--) {
		const all = reachOf(keep), rest = keep.filter((i) => i !== all.far);
		// far-off means: on its own, three times as far out as a typical unit, and the view gets a fifth tighter without it
		if (!alone(all.far, keep) || all.reach < 3 * all.typical || reachOf(rest).reach > 0.8 * all.reach) break;
		out.push(all.far);
		keep = rest;
	}
	return { shape: { type: 'FeatureCollection', features: keep.map((i) => pieces[i]) }, far: out };
}
// What a shape needs for drawing, picking and labels
function measure(f) {
	const main = biggestPiece(f.geometry);
	const b = geoBounds(f);
	let c = geoCentroid(main);
	if (!geoContains(main, c)) c = insidePoint(main) || c; // a hollow or bent shape (Brandenburg round Berlin)
	const far = Math.max(...[[b[0][0], b[0][1]], [b[1][0], b[1][1]], [b[0][0], b[1][1]], [b[1][0], b[0][1]]].map((p) => geoDistance(c, p)));
	return { bounds: b, centre: c, reach: Math.min(Math.PI, far), area: geoArea(f) };
}
// d3 reads a ring's direction to tell a shape from everything-but-that-shape. Make every ring of a
// feature run the way d3 expects (an outer ring encloses less than half the globe; a hole, as d3 sees
// it, more), whatever the map files' builder did.
export function rewind(f) {
	const fix = (poly) => poly.forEach((ring, k) => {
		const big = geoArea({ type: 'Polygon', coordinates: [ring] }) > 2 * Math.PI;
		if (big !== k > 0) ring.reverse();
	});
	if (f.geometry.type === 'Polygon') fix(f.geometry.coordinates);
	else if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach(fix);
	return f;
}
const inBounds = ([[w, s], [e, n]], [lon, lat]) => lat >= s && lat <= n && (w <= e ? lon >= w && lon <= e : lon >= w || lon <= e);
// A lake or river: where it is and how far it reaches, for leaving out what's off screen
function measureWater(f) {
	const c = geoCentroid(f);
	let r = 0;
	const walk = (a) => (typeof a[0] === 'number' ? (r = Math.max(r, geoDistance(c, a))) : a.forEach(walk));
	walk(f.geometry.coordinates);
	return { f, m: { centre: c, reach: r + 0.005, area: geoArea(f) } };
}

// need(file): the map would like 'map-mid', 'map-high' or 'water-high' (it asks once for each);
// the page fetches it and hands it over with setWorldDetail or setWater
export function createMap({ canvas, insets, view, onClick, onHover, need = () => {} }) {
	// What only changes when the view does is kept as two pictures and pasted in on every other redraw
	// (a hover, an answer): `under` the provinces the sea and the world, `over` them the lakes, the
	// rivers and the shading. `ctx` is whichever of the three canvases is being drawn on.
	const screen = canvas.getContext('2d');
	const sheet = () => {
		const c = document.createElement('canvas');
		return { c, ctx: c.getContext('2d') };
	};
	const under = sheet(), over = sheet();
	const shore = sheet(), shoreLit = sheet(); // the lit province's lake shores (see drawShores)
	let shoreKept = '';
	let kept = ''; // the view the two pictures were drawn for
	let stamp = 0; // goes up when their contents change for another reason (new shapes arrived)
	let ctx = screen;
	let dpr = 1, W = 0, H = 0;
	let world = []; // [{ id, name, feature, m, detail: { mid, high } }]
	const water = { low: null, high: null }; // { lakes: [{ f, m }], rivers: [{ f, m }] }
	const asked = new Set();
	let moving = false, movingTimer = 0, slow = false; // slow: this device can't keep up while the map moves
	let rim = null; // for shapes at the globe's rim (see trace)
	let units = []; // [{ feature, m }]
	let openId = null; // the country whose units are showing (its world shape isn't drawn)
	const cam = { lon: 10, lat: 20, scale: 200 };
	let fitScale = 200;
	let proj = null, path = null;
	let fly = null, raf = 0;
	let tiny = { scale: 0, set: new Set(), full: false };
	let rings = []; // tiny units on screen: { i, x, y }

	function free() {
		const i = insets();
		return { x0: i.left, y0: i.top, x1: W - i.right, y1: H - i.bottom, w: Math.max(60, W - i.left - i.right), h: Math.max(60, H - i.top - i.bottom) };
	}
	function setProjection() {
		const f = free();
		proj = geoOrthographic().rotate([-cam.lon, -cam.lat]).scale(cam.scale).translate([f.x0 + f.w / 2, f.y0 + f.h / 2]).clipAngle(90).precision(0);
		path = geoPath(proj, ctx);
		rim = { area: geoPath(proj), alts: null };
	}
	// The map is moving (a drag, a pinch, the wheel, a flight): slow devices draw less until it stops
	function stir() {
		moving = true;
		clearTimeout(movingTimer);
		movingTimer = setTimeout(() => {
			moving = false;
			invalidate();
		}, 180);
	}
	function resize() {
		dpr = Math.min(2, window.devicePixelRatio || 1);
		W = window.innerWidth;
		H = window.innerHeight;
		for (const c of [canvas, under.c, over.c, shore.c, shoreLit.c]) {
			c.width = Math.round(W * dpr);
			c.height = Math.round(H * dpr);
		}
		kept = '';
		setProjection();
		invalidate();
	}

	// Where to look to see all of `shape` (a GeoJSON object), or the whole globe for null
	function cameraFor(shape) {
		const f = free();
		if (!shape) return { lon: cam.lon, lat: 15, scale: (Math.min(f.w, f.h) / 2) * 0.94 };
		const [lon, lat] = geoCentroid(shape);
		const p = geoOrthographic().rotate([-lon, -lat]).scale(1).translate([0, 0]).clipAngle(90);
		const [[x0, y0], [x1, y1]] = geoPath(p).bounds(shape);
		const scale = Math.min(f.w / Math.max(1e-6, x1 - x0), f.h / Math.max(1e-6, y1 - y0)) * 0.9;
		// the shape's box is rarely centred on its centroid: shift the view to the box's middle
		const mid = p.invert([(x0 + x1) / 2, (y0 + y1) / 2]) || [lon, lat];
		return { lon: mid[0], lat: Math.max(-85, Math.min(85, mid[1])), scale: Math.min(scale, 40000) };
	}
	function frame(shape, animate = true) {
		const to = cameraFor(shape);
		fitScale = to.scale;
		if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
			Object.assign(cam, to);
			fly = null;
			setProjection();
			invalidate();
			return;
		}
		let dl = to.lon - cam.lon;
		dl = ((dl + 540) % 360) - 180;
		fly = { from: { ...cam }, dl, to, t0: performance.now(), ms: 650 };
		invalidate();
	}
	function stepFly(now) {
		if (!fly) return;
		const t = Math.min(1, (now - fly.t0) / fly.ms), e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
		cam.lon = fly.from.lon + fly.dl * e;
		cam.lat = fly.from.lat + (fly.to.lat - fly.from.lat) * e;
		cam.scale = Math.exp(Math.log(fly.from.scale) + (Math.log(fly.to.scale) - Math.log(fly.from.scale)) * e);
		if (t >= 1) fly = null;
		setProjection();
	}
	function invalidate() {
		if (!raf) raf = requestAnimationFrame(draw);
	}

	// how far round the globe the screen can see: a quarter turn at most, less when zoomed in
	function viewCap() {
		const f = free(), cx = f.x0 + f.w / 2, cy = f.y0 + f.h / 2;
		const half = Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => Math.hypot(x - cx, y - cy)));
		return half >= cam.scale ? Math.PI / 2 : Math.asin(half / cam.scale);
	}
	let cap = Math.PI / 2; // viewCap() for the frame being drawn
	// some of the shape is on screen (so it is worth drawing)
	const facing = (m) => geoDistance(m.centre, [cam.lon, cam.lat]) - m.reach < cap;

	/* ---------- shapes at the globe's rim ---------- */
	// d3 trims each shape where the globe turns away, and now and then, at one angle, a shape near the
	// rim comes out inside out: it fills the whole globe instead of the sliver that shows. A drawn shape
	// can't be bigger than the place itself, so one near the rim that comes out more than twice its size
	// is drawn again trimmed a degree or two inside the rim, or left out of that frame.
	const nearRim = (m) => geoDistance(m.centre, [cam.lon, cam.lat]) + m.reach > Math.PI / 2 - 0.35;
	const tooBig = (areaPath, f, m) => areaPath.area(f) > m.area * cam.scale ** 2 * 2 + 50;
	const insideOut = (f, m) => nearRim(m) && tooBig(rim.area, f, m);
	// Add a shape's outline to the current path; false if it's left out of this frame
	function trace(f, m) {
		if (!insideOut(f, m)) {
			path(f);
			return true;
		}
		if (!rim.alts) {
			rim.alts = [89, 87.5].map((deg) => geoPath(geoOrthographic().rotate(proj.rotate()).translate(proj.translate()).scale(proj.scale()).clipAngle(deg).precision(0)));
		}
		for (const alt of rim.alts) {
			if (tooBig(alt, f, m)) continue;
			alt.context(ctx)(f);
			alt.context(null);
			return true;
		}
		return false;
	}

	/* ---------- detail, lakes and rivers ---------- */
	const ppd = () => cam.scale * DEG; // pixels per degree
	// Natural Earth gives each lake and river the web-map zoom it shows from (zoom 0 = the world in 256 px)
	const webZoom = () => Math.log2((ppd() * 360) / 256);
	// borders get thicker as you zoom in; rivers stay thinner than them so borders read first
	const borderWidth = () => Math.min(1.2, 0.45 + ppd() * 0.01);
	const riverWidth = (rank) => Math.max(0.45, borderWidth() * (rank <= 2 ? 0.75 : rank <= 4 ? 0.6 : 0.5));
	const ask = (file) => {
		if (asked.has(file)) return;
		asked.add(file);
		need(file);
	};
	// which of the world's shapes to draw at this zoom: finer ones are fetched the first time they'd show
	function level() {
		let want = ppd() < 14 ? 0 : ppd() < 70 ? 1 : 2;
		if (moving && slow && want > 0 && !(want === 2 && ppd() > 120)) want--;
		if (want > 0) ask('map-' + LEVELS[want]);
		return LEVELS[want];
	}
	const shapeOf = (c, lvl) => (lvl === 'high' && c.detail.high) || (lvl !== 'low' && c.detail.mid) || c.feature;
	function waterSet() {
		if (webZoom() >= 4.6) {
			ask('water-high');
			if (water.high && !(moving && slow)) return water.high;
		}
		return water.low;
	}
	function drawWater() {
		const w = waterSet();
		if (!w) return;
		const z = webZoom();
		const shown = (list, lead) => list.filter(({ f, m }) => f.properties.mz <= z + lead && facing(m));
		const lakes = shown(w.lakes, LAKE_LEAD);
		if (lakes.length) {
			ctx.beginPath();
			for (const { f, m } of lakes) if (!insideOut(f, m)) path(f);
			ctx.fillStyle = COL.lake;
			ctx.fill();
			ctx.lineWidth = 0.6;
			ctx.strokeStyle = COL.lakeEdge;
			ctx.stroke();
		}
		if (moving && slow) return; // rivers come back when the map stops
		const rivers = shown(w.rivers, RIVER_LEAD);
		ctx.lineCap = 'round';
		ctx.strokeStyle = COL.river;
		for (const [lo, hi] of RIVER_CLASSES) {
			ctx.beginPath();
			let any = false;
			for (const { f } of rivers) {
				if (f.properties.r < lo || f.properties.r > hi) continue;
				path(f);
				any = true;
			}
			if (!any) continue;
			ctx.lineWidth = riverWidth(lo);
			ctx.stroke();
		}
		ctx.lineCap = 'butt';
	}

	// the sea, the glow, the grid and the world's countries
	function drawUnder(lvl) {
		const [cx, cy] = proj.translate(), R = cam.scale;
		// The sea's edge and the grid are a few long curves (a meridian is only 3 points), so let d3
		// add points along them; the land is already dense and stays fast with that off.
		proj.precision(0.5);
		ctx.beginPath();
		path({ type: 'Sphere' });
		let g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R);
		g.addColorStop(0, COL.seaLit);
		g.addColorStop(1, COL.seaDark);
		ctx.fillStyle = g;
		ctx.fill();
		g = ctx.createRadialGradient(cx, cy, R * 0.985, cx, cy, R * 1.07);
		g.addColorStop(0, `rgba(${COL.glow}, 0.28)`);
		g.addColorStop(1, `rgba(${COL.glow}, 0)`);
		ctx.beginPath();
		ctx.arc(cx, cy, R * 1.07, 0, TAU);
		ctx.arc(cx, cy, R * 0.985, 0, TAU, true);
		ctx.fillStyle = g;
		ctx.fill();
		ctx.beginPath();
		path(GRAT);
		ctx.strokeStyle = COL.grat;
		ctx.lineWidth = 0.6;
		ctx.stroke();
		proj.precision(0);
		// the world's countries, and the land that is no country's (Greenland, Western Sahara…)
		ctx.lineJoin = 'round';
		ctx.lineWidth = borderWidth();
		ctx.strokeStyle = COL.border;
		for (const c of world) {
			if ((openId && c.id === openId) || !facing(c.m)) continue;
			ctx.beginPath();
			if (!trace(shapeOf(c, lvl), c.m)) continue;
			ctx.fillStyle = view.country(c);
			ctx.fill();
			ctx.stroke();
		}
	}
	// lakes and rivers lie on top of the land (they are part of no country or province)
	function drawOver() {
		ctx.lineJoin = 'round';
		drawWater();
	}
	// darkening toward the rim, so it reads as a ball (last, over everything on the globe)
	function drawShade() {
		const [cx, cy] = proj.translate(), R = cam.scale;
		const g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.35, cx, cy, R);
		g.addColorStop(0, `rgba(${COL.shade}, 0)`);
		g.addColorStop(1, `rgba(${COL.shade}, 0.5)`);
		ctx.beginPath();
		ctx.arc(cx, cy, R, 0, TAU);
		ctx.fillStyle = g;
		ctx.fill();
	}
	// Where the lit province meets a lake, its shore gets the same light edge and glow as a coast or a land
	// border. The province's own outline runs through the lake (Michigan's legal border is out in the
	// water) and is covered by it, so the shore is drawn again, kept to the province's part of it. Only
	// the outer shore of all the lakes together: some lakes come in pieces (Saginaw Bay and Lake Huron),
	// and the line where two pieces meet is water, not shore. So the shore is drawn on its own sheet twice
	// as wide, the lakes are wiped out of it (leaving the land side), and the sheet is pasted in with the glow.
	function drawShores(lit) {
		const w = waterSet(), z = webZoom();
		if (!w) return;
		for (const { i } of lit) {
			const u = units[i];
			const lakes = w.lakes.filter(({ f, m }) => f.properties.mz <= z + LAKE_LEAD && facing(m) && !insideOut(f, m) && geoDistance(m.centre, u.m.centre) < m.reach + u.m.reach);
			if (!lakes.length) continue;
			const e = shore.ctx, to = ctx;
			e.setTransform(1, 0, 0, 1, 0, 0);
			e.clearRect(0, 0, shore.c.width, shore.c.height);
			e.setTransform(dpr, 0, 0, dpr, 0, 0);
			path.context(e);
			e.beginPath();
			for (const { f } of lakes) path(f);
			path.context(to);
			e.lineJoin = 'round';
			e.lineWidth = 3.2;
			e.strokeStyle = COL.targetEdge;
			e.stroke();
			e.globalCompositeOperation = 'destination-out';
			e.fill(); // nonzero: where two pieces overlap a little it's still lake; islands wind the other way, so they stay
			e.globalCompositeOperation = 'source-over';
			to.save();
			proj.precision(0.3);
			to.beginPath();
			const shown = trace(u.feature, u.m);
			proj.precision(0);
			if (shown) {
				to.clip();
				to.shadowColor = `rgba(${COL.glow}, 0.8)`;
				to.shadowBlur = 14;
				paste(shore);
			}
			to.restore();
		}
	}
	function drawOn(to, fn) {
		ctx = to.ctx;
		path.context(ctx);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, W, H);
		fn();
		ctx = screen;
		path.context(ctx);
	}
	const paste = (from) => {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(from.c, 0, 0);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	};

	function draw(now) {
		raf = 0;
		stepFly(now);
		const t0 = performance.now();
		cap = Math.min(Math.PI / 2, viewCap() + 0.02);
		const lvl = level(), w = waterSet();
		const view_ = [cam.lon, cam.lat, cam.scale, W, H, dpr, lvl, w === water.high, moving && slow, openId, stamp, world.map((c) => view.country(c)).join()].join('|');
		if (view_ !== kept) {
			kept = view_;
			drawOn(under, () => drawUnder(lvl));
			drawOn(over, drawOver);
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, W, H);
		ctx.lineJoin = 'round';
		paste(under);
		// the open country's subdivisions
		if (units.length) {
			if (Math.abs(tiny.scale / cam.scale - 1) > 0.04 || (!tiny.full && !moving)) {
				tiny = { scale: cam.scale, set: new Set(), full: !moving };
				const measurer = geoPath(proj);
				const box = units.map((u) => measurer.bounds(u.feature));
				const size = box.map(([[x0, y0], [x1, y1]]) => Math.max(x1 - x0, y1 - y0));
				size.forEach((s, i) => s < TINY && tiny.set.add(i));
				// a small unit wholly under its tiny neighbours' rings can't be clicked at all (Valletta among Malta's
				// councils): it gets a ring of its own, and a click picks the nearest ring
				// (or under a lake drawn over it: Likoma's islands in Lake Malawi)
				const clickable = (i, ringAt) => {
					const [[x0, y0], [x1, y1]] = box[i];
					const tries = [point(units[i].m.centre)]; // its middle first: that settles almost every unit
					for (let a = 0.5; a < 6; a++) for (let b = 0.5; b < 6; b++) tries.push([x0 + ((x1 - x0) * a) / 6, y0 + ((y1 - y0) * b) / 6]);
					for (const t of tries) {
						if (!t || ringAt.some((p) => (p[0] - t[0]) ** 2 + (p[1] - t[1]) ** 2 < (RING + 1.5) ** 2)) continue;
						const h = pickShape(t[0], t[1]);
						if (h && h.unit === i) return true; // a spot of its own to click
					}
					return false;
				};
				// (a few hundred clicks' worth of work, so it waits until the map stops moving)
				for (let grew = !moving; grew; ) {
					grew = false;
					const ringAt = [...tiny.set].map((i) => point(units[i].m.centre)).filter(Boolean);
					size.forEach((s, i) => {
						if (tiny.set.has(i) || s > 4 * TINY || !facing(units[i].m) || clickable(i, ringAt)) return;
						tiny.set.add(i);
						grew = true; // its ring may cover a neighbour in turn
					});
				}
			}
			ctx.lineWidth = 1;
			ctx.strokeStyle = COL.border;
			proj.precision(0.3); // a province's long straight border has few points: let d3 curve it with the globe
			units.forEach((u, i) => {
				if (!facing(u.m)) return;
				ctx.beginPath();
				if (!trace(u.feature, u.m)) return;
				ctx.fillStyle = view.fill(i);
				ctx.fill();
				ctx.stroke();
			});
			// The one being looked at or asked about, lit the way World Capitals lights a country: a blue
			// wash, a thin light edge and a soft glow. The edge sits on the border and is thin, so the
			// coast keeps its detail; the lakes go on top afterwards, so it never crosses water.
			for (const { i, fill } of view.lit()) {
				if (tiny.set.has(i) || !facing(units[i].m)) continue; // a tiny one lights its ring instead
				ctx.beginPath();
				if (!trace(units[i].feature, units[i].m)) continue;
				ctx.shadowColor = `rgba(${COL.glow}, 0.8)`;
				ctx.shadowBlur = 14;
				if (fill) {
					ctx.globalAlpha = 0.78;
					ctx.fillStyle = COL.target;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
				ctx.lineWidth = 1.6;
				ctx.strokeStyle = COL.targetEdge;
				ctx.stroke();
				ctx.shadowBlur = 0;
			}
			proj.precision(0);
		}
		paste(over);
		// the lit province's lake shores: kept as a picture, since the glow is slow to draw and the shore
		// only changes with the view or the selection, not with a hover
		if (units.length) {
			const lit = view.lit().filter(({ i }) => !tiny.set.has(i) && facing(units[i].m));
			const key = view_ + '|' + lit.map(({ i }) => i).join();
			if (key !== shoreKept) {
				shoreKept = key;
				drawOn(shoreLit, () => drawShores(lit));
			}
			if (lit.length) paste(shoreLit);
		}
		drawShade();
		if (moving) {
			const ms = performance.now() - t0;
			if (ms > 24) slow = true;
			else if (ms < 8) slow = false;
		}
		if (units.length) {
			const lit = new Map(view.lit().map((l) => [l.i, l.fill]));
			rings = [];
			for (const i of tiny.set) {
				const pt = point(units[i].m.centre);
				if (!pt) continue;
				rings.push({ i, x: pt[0], y: pt[1] });
				ctx.beginPath();
				ctx.arc(pt[0], pt[1], RING, 0, Math.PI * 2);
				ctx.fillStyle = lit.get(i) ? COL.target : view.fill(i);
				ctx.globalAlpha = lit.get(i) ? 0.78 : 0.55;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.lineWidth = lit.has(i) ? 2.2 : 1.3;
				ctx.strokeStyle = lit.has(i) ? COL.target : COL.ring;
				ctx.stroke();
			}
			drawLabels();
		} else rings = [];
		if (fly) {
			stir();
			invalidate();
		}
	}

	function drawLabels() {
		const callouts = view.callouts(); // [{ i, text }]
		const named = view.names() ? units.map((u, i) => i).sort((a, b) => units[b].m.area - units[a].m.area) : [];
		if (!callouts.length && !named.length) return;
		const small = W < 600;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		const taken = [];
		const place = (i, text, strong) => {
			const pt = point(units[i].m.centre);
			if (!pt) return;
			ctx.font = `${strong ? 700 : 600} ${strong ? (small ? 13 : 15) : small ? 10 : 11.5}px Archivo, "Helvetica Neue", Arial, sans-serif`;
			const w = ctx.measureText(text).width, h = strong ? 20 : 14;
			const y = pt[1] - (strong && tiny.set.has(i) ? RING + 14 : 0);
			const box = [pt[0] - w / 2 - 3, y - h / 2, pt[0] + w / 2 + 3, y + h / 2];
			if (!strong && taken.some((t) => box[0] < t[2] && box[2] > t[0] && box[1] < t[3] && box[3] > t[1])) return;
			taken.push(box);
			if (strong) {
				ctx.fillStyle = 'rgba(13, 20, 27, 0.9)';
				ctx.strokeStyle = COL.target;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.roundRect(box[0] - 5, box[1] - 3, box[2] - box[0] + 10, h + 6, 6);
				ctx.fill();
				ctx.stroke();
			} else {
				ctx.lineWidth = 3;
				ctx.strokeStyle = COL.labelHalo;
				ctx.strokeText(text, pt[0], y);
			}
			ctx.fillStyle = COL.label;
			ctx.fillText(text, pt[0], y);
		};
		for (const c of callouts) place(c.i, c.text, true);
		const skip = new Set(callouts.map((c) => c.i));
		for (const i of named) if (!skip.has(i)) place(i, units[i].feature.properties.name, false);
	}

	// lon/lat -> screen, or null when it's round the back of the globe
	function point(ll) {
		if (geoDistance(ll, [cam.lon, cam.lat]) > Math.PI / 2 - 0.01) return null;
		const p = proj(ll);
		return p && isFinite(p[0]) ? p : null;
	}

	// What's under a screen point: { unit } (index), { country } (id), { lake } (its name, '' if it has
	// none), { place, of } (land that is no country's: its name and whose it is) or null. As on World
	// Capitals, a lake is named instead of counting as the land around it; rivers are only scenery.
	function pick(x, y) {
		let best = null, bd = (RING + 1.5) ** 2;
		for (const r of rings) {
			const d = (r.x - x) ** 2 + (r.y - y) ** 2;
			if (d < bd) [best, bd] = [r.i, d];
		}
		if (best != null) return { unit: best };
		return pickShape(x, y);
	}
	// what a click picks if no ring takes it: a lake, a unit, another country or a place
	function pickShape(x, y) {
		const f = free();
		const cx = f.x0 + f.w / 2, cy = f.y0 + f.h / 2;
		if ((x - cx) ** 2 + (y - cy) ** 2 > cam.scale ** 2) return null; // off the globe
		const ll = proj.invert([x, y]);
		if (!ll || !isFinite(ll[0])) return null;
		const w = waterSet(), z = webZoom();
		for (const { f: lake, m } of w ? w.lakes : []) {
			if (lake.properties.mz <= z + LAKE_LEAD && geoDistance(m.centre, ll) < m.reach && geoContains(lake, ll)) return { lake: lake.properties.n || '' };
		}
		for (let i = 0; i < units.length; i++) {
			if (inBounds(units[i].m.bounds, ll) && geoContains(units[i].feature, ll)) return { unit: i };
		}
		for (const c of world) {
			if ((openId && c.id === openId) || !inBounds(c.m.bounds, ll) || !geoContains(c.feature, ll)) continue;
			return c.id ? { country: c.id } : { place: c.name, of: c.of };
		}
		return null;
	}

	/* ---------- dragging, zooming, clicking ---------- */
	const pointers = new Map();
	let drag = null, pinch = null, moved = false;
	const clampScale = (s) => Math.max(fitScale * 0.45, Math.min(fitScale * 16, s));
	function zoomBy(k) {
		fly = null;
		stir();
		cam.scale = clampScale(cam.scale * k);
		setProjection();
		invalidate();
	}
	canvas.addEventListener('pointerdown', (e) => {
		canvas.setPointerCapture(e.pointerId);
		pointers.set(e.pointerId, [e.clientX, e.clientY]);
		moved = false;
		fly = null;
		if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, lon: cam.lon, lat: cam.lat };
		else if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), scale: cam.scale };
			drag = null;
			moved = true;
		}
	});
	canvas.addEventListener('pointermove', (e) => {
		if (!pointers.has(e.pointerId)) {
			if (e.pointerType === 'mouse') onHover(pick(e.clientX, e.clientY));
			return;
		}
		pointers.set(e.pointerId, [e.clientX, e.clientY]);
		if (pinch && pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			cam.scale = clampScale((pinch.scale * Math.hypot(a[0] - b[0], a[1] - b[1])) / pinch.d);
		} else if (drag) {
			const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
			if (!moved && Math.hypot(dx, dy) < 5) return;
			moved = true;
			canvas.parentElement.classList.add('dragging');
			const k = 1 / (cam.scale * DEG);
			cam.lon = drag.lon - dx * k;
			cam.lat = Math.max(-85, Math.min(85, drag.lat + dy * k));
		}
		stir();
		setProjection();
		invalidate();
	});
	const lift = (e) => {
		if (!pointers.has(e.pointerId)) return;
		pointers.delete(e.pointerId);
		canvas.parentElement.classList.remove('dragging');
		if (pointers.size < 2) pinch = null;
		if (!pointers.size) {
			if (!moved && e.type === 'pointerup') onClick(pick(e.clientX, e.clientY));
			drag = null;
		}
	};
	canvas.addEventListener('pointerup', lift);
	canvas.addEventListener('pointercancel', lift);
	canvas.addEventListener('pointerleave', () => onHover(null));
	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		zoomBy(Math.exp(-e.deltaY * (e.deltaMode ? 0.03 : 0.0015)));
	}, { passive: false });
	window.addEventListener('resize', resize);

	return {
		resize, invalidate, frame, zoomBy, pick, point,
		setWorld(list) {
			world = list.map((c) => ({ ...c, m: measure(c.feature), detail: {} }));
			stamp++;
			invalidate();
		},
		// the same shapes in more detail ('mid' or 'high'), in the same order as setWorld's
		setWorldDetail(name, features) {
			if (features.length !== world.length) return;
			world.forEach((c, i) => (c.detail[name] = features[i]));
			stamp++;
			invalidate();
		},
		// name: 'low' or 'high'; lakes and rivers: GeoJSON features with properties mz (the zoom they show from) and r (rank)
		setWater(name, lakes, rivers) {
			water[name] = { lakes: lakes.map(measureWater), rivers: rivers.map(measureWater) };
			stamp++;
			invalidate();
		},
		// features: GeoJSON features with properties.name, or [] to close the country
		setUnits(features, countryId) {
			units = features.map((feature) => ({ feature, m: measure(feature) }));
			openId = features.length ? countryId : null;
			tiny = { scale: 0, set: new Set(), full: false };
			invalidate();
		},
		unitCentre: (i) => (units[i] ? point(units[i].m.centre) : null),
		lookAt(i) {
			// bring a unit into view if it's off screen or round the back
			const u = units[i];
			if (!u) return;
			const pt = point(u.m.centre), f = free();
			if (pt && pt[0] > f.x0 + 20 && pt[0] < f.x1 - 20 && pt[1] > f.y0 + 20 && pt[1] < f.y1 - 20) return;
			let dl = u.m.centre[0] - cam.lon;
			dl = ((dl + 540) % 360) - 180;
			fly = { from: { ...cam }, dl, to: { lon: u.m.centre[0], lat: Math.max(-85, Math.min(85, u.m.centre[1])), scale: cam.scale }, t0: performance.now(), ms: 450 };
			invalidate();
		},
		cam,
		state: () => ({ units: units.length, openId, tiny: [...tiny.set], scale: cam.scale, fitScale, level: level(), water: Object.keys(water).filter((k) => water[k]), asked: [...asked] }),
	};
}
