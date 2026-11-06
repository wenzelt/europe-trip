import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const [tokens, journalCss, planCss, journalHtml, planHtml] = await Promise.all(
  ['tokens.css', 'design-system.css', 'plan.css', 'index.html', 'plan.html'].map(read)
);
const strip = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

// ---------- helpers ----------
function block(css, selector) {
  const clean = strip(css);
  const start = clean.search(new RegExp(`(^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} {`));
  assert.ok(start > -1, `${selector} block missing`);
  const body = clean.slice(start);
  return body.slice(body.indexOf('{') + 1, body.indexOf('}'));
}
function vars(css, selector) {
  return Object.fromEntries([...block(css, selector).matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}
const remToPx = value => {
  const m = String(value).match(/^([\d.]+)(rem|px)$/);
  assert.ok(m, `not a length: ${value}`);
  return m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1]);
};
const minSize = value => remToPx(value.startsWith('clamp(') ? value.slice(6).split(',')[0].trim() : value);
const luminance = hex => {
  const [r, g, b] = hex.replace('#', '').match(/\w\w/g).map(x => parseInt(x, 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const extract = (source, name) => {
  // The closing brace sits at the same indentation as the function keyword.
  const match = source.match(new RegExp(`^([ \\t]*)function ${name}\\([\\s\\S]*?\\n\\1}\\n`, 'm'));
  assert.ok(match, `function ${name} missing`);
  return match[0];
};

const light = vars(tokens, ':root');
const dark = { ...light, ...vars(tokens, ':root[data-theme="dark"]') };

// ---------- readability: colour ----------
for (const [theme, palette] of [['light', light], ['dark', dark]]) {
  test(`${theme} theme: body and secondary text reach WCAG AA (4.5:1) on every surface`, () => {
    for (const fg of ['ink', 'muted']) {
      for (const bg of ['bg', 'surface', 'paper', 'tone-1', 'tone-2', 'tone-3']) {
        const ratio = contrast(palette[fg], palette[bg]);
        assert.ok(ratio >= 4.5, `${fg} on ${bg}: ${ratio.toFixed(2)}:1`);
      }
    }
    for (const [fg, bg] of [['accent-ink', 'accent'], ['field-ink', 'field']]) {
      const ratio = contrast(palette[fg], palette[bg]);
      assert.ok(ratio >= 4.5, `${fg} on ${bg}: ${ratio.toFixed(2)}:1`);
    }
  });
}

test('route plan: muted labels reach WCAG AA on all floating surfaces in both themes', () => {
  const planLight = { ...light, ...vars(planCss, ':root') };
  const planDark = { ...dark, ...vars(planCss, ':root[data-theme="dark"]') };
  for (const palette of [planLight, planDark]) {
    const resolve = value => (value.startsWith('var(') ? palette[value.slice(6, -1)] : value);
    for (const surface of ['float', 'float-2', 'float-3']) {
      const ratio = contrast(resolve(palette['float-muted']), resolve(palette[surface]));
      assert.ok(ratio >= 4.5, `float-muted on ${surface}: ${ratio.toFixed(2)}:1`);
    }
  }
});

// ---------- readability: type ----------
test('journal text sizes stay readable for a small-x-height serif: 15px small, 18px body', () => {
  assert.ok(minSize(light['step-small']) >= 15, `--step-small starts at ${minSize(light['step-small'])}px`);
  assert.ok(minSize(light['step-body']) >= 18, `--step-body starts at ${minSize(light['step-body'])}px`);
});

test('route plan text sizes match: 15px small, 18px body', () => {
  const plan = vars(planCss, ':root');
  assert.ok(remToPx(plan['t-s']) >= 15, `--t-s is ${plan['t-s']}`);
  assert.ok(remToPx(plan['t-b']) >= 18, `--t-b is ${plan['t-b']}`);
});

test('running text has generous leading', () => {
  const lineHeight = Number(block(journalCss, 'body').match(/line-height:\s*([\d.]+)/)[1]);
  assert.ok(lineHeight >= 1.5, `body line-height ${lineHeight}`);
});

test('display capitals never collide: no line-height below .92 in the journal', () => {
  for (const m of strip(journalCss).matchAll(/line-height:\s*(0?\.\d+)/g)) {
    assert.ok(Number(m[1]) >= 0.92, `line-height ${m[1]} is too tight`);
  }
});

// ---------- journal map ----------
test('journal map marker is centred on its location and stands off the tiles', () => {
  const markerIcon = runInNewContext(`(${extract(journalHtml, 'markerIcon')})`, { L: { divIcon: options => options } });
  const icon = markerIcon(4);
  const [w, h] = icon.iconSize;
  assert.ok(w >= 28 && h >= 28, `marker ${w}×${h} is too small to tap`);
  assert.deepEqual(Array.from(icon.iconAnchor), [w / 2, h / 2], 'a square marker must be anchored at its centre');
  assert.ok(icon.popupAnchor[1] <= -h / 2, 'popup must open above the marker');
  assert.match(block(journalCss, '.route-marker'), /(outline|border):\s*\d+px solid var\(--paper\)/);
});

test('phone: jumping to the map does not hide its heading under the sticky switcher', () => {
  const mobile = strip(journalCss).split('@media (max-width: 980px)')[1];
  assert.match(mobile, /\.layout\s*{[^}]*scroll-margin-top:\s*\d+px/);
});

// ---------- route plan map ----------
let planFnsCache;
const loadPlanFns = () => planFnsCache ??= runInNewContext(`(() => {
  ${extract(planHtml, 'clusterStopsByPixelDistance')}
  ${extract(planHtml, 'markerMetrics')}
  ${extract(planHtml, 'routeFitPadding')}
  ${extract(planHtml, 'markerLabel')}
  ${planHtml.match(/const MARKER_SHAPES = {[\s\S]*?};/)?.[0] ?? 'const MARKER_SHAPES = {};'}
  return { clusterStopsByPixelDistance, markerMetrics, routeFitPadding, markerLabel, MARKER_SHAPES };
})()`);
const planFns = new Proxy({}, { get: (_, key) => loadPlanFns()[key] });
const route = JSON.parse(planHtml.match(/const ROUTE = (\[[\s\S]*?\]);/)[1]);

// Web Mercator at a fractional zoom, as Leaflet projects it.
const project = (lat, lng, zoom) => {
  const scale = 256 * 2 ** zoom;
  const rad = Math.PI / 180;
  return {
    x: ((lng + 180) / 360) * scale,
    y: ((1 - Math.log(Math.tan(lat * rad) + 1 / Math.cos(lat * rad)) / Math.PI) / 2) * scale
  };
};
// Leaflet's fitBounds zoom with padding and the planner's zoomSnap of .25.
function fittedMarkers(width, height, headerHeight) {
  const { paddingTopLeft: tl, paddingBottomRight: br } = planFns.routeFitPadding(width, headerHeight);
  const lats = route.map(s => s.lat), lngs = route.map(s => s.lng);
  const nw = project(Math.max(...lats), Math.min(...lngs), 0);
  const se = project(Math.min(...lats), Math.max(...lngs), 0);
  const raw = Math.log2(Math.min((width - tl[0] - br[0]) / (se.x - nw.x), (height - tl[1] - br[1]) / (se.y - nw.y)));
  const zoom = Math.floor(raw / 0.25) * 0.25;
  const { gap } = planFns.markerMetrics(width);
  return planFns.clusterStopsByPixelDistance(route, s => project(s.lat, s.lng, zoom), gap);
}

test('route plan markers are smaller on phones but never overlap and stay tappable', () => {
  const phone = planFns.markerMetrics(390);
  const desktop = planFns.markerMetrics(1440);
  assert.ok(phone.size >= 28 && phone.size < desktop.size, `phone marker ${phone.size}px`);
  for (const { size, gap } of [phone, desktop]) assert.ok(gap >= size + 2, `gap ${gap} < size ${size}`);
});

test('route plan uses the phone width for the route instead of wide side padding', () => {
  const { paddingTopLeft, paddingBottomRight } = planFns.routeFitPadding(390, 200);
  assert.ok(paddingTopLeft[0] <= 24 && paddingBottomRight[0] <= 24, 'side padding too wide on a phone');
  assert.ok(paddingTopLeft[1] >= 200, 'route must clear the title card');
});

test('phone overview: stops stay individually readable instead of collapsing into big groups', () => {
  const groups = fittedMarkers(390, 844, 200);
  assert.ok(groups.length >= 10, `only ${groups.length} markers on a 390px phone`);
  const largest = Math.max(...groups.map(g => g.length));
  assert.ok(largest <= 3, `a single marker hides ${largest} stops`);
});

test('desktop overview keeps at least as many markers as before', () => {
  assert.ok(fittedMarkers(1440, 900, 0).length >= 13);
});

test('grouped markers show the first station number on a stacked dot, not a count', () => {
  assert.equal(planFns.markerLabel([{ n: 7 }]), '7');
  assert.equal(planFns.markerLabel([{ n: 20 }, { n: 2 }]), '2');
  const shapes = planFns.MARKER_SHAPES.cluster ?? '';
  assert.ok((shapes.match(/<circle/g) ?? []).length >= 2, 'cluster should be two stacked circles');
});

test('journal zoom buttons keep a 44px touch target on touch devices too', () => {
  // Leaflet's own .leaflet-touch rule shrinks them to 30px unless the journal overrides it.
  const rule = strip(journalCss).match(/[^}]*\.leaflet-touch \.leaflet-bar a[^{]*{([^}]*)}/);
  assert.ok(rule, '.leaflet-touch .leaflet-bar a is not styled');
  assert.match(rule[1], /width:\s*44px/);
  assert.match(rule[1], /height:\s*44px/);
});
