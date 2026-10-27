import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const html = await read('index.html');
const css = await read('design-system.css');

// The live counter is plain browser code in index.html; load it without a DOM.
const consts = html.match(/const TRIP_START[^\n]*\n(?:\s*const TRIP_(?:END|DAYS)[^\n]*\n)*/)?.[0] ?? '';
const fn = html.match(/function tripStatus[\s\S]*?\n    }\n/)?.[0] ?? '';
const tripStatus = new Function(`${consts}\n${fn}\nreturn tripStatus;`)();
const day = (y, m, d) => new Date(y, m - 1, d, 15);

test('live status counts down to departure and is singular on the last day', () => {
  assert.equal(tripStatus(day(2027, 2, 1)), 'Departure in 7 days');
  assert.equal(tripStatus(day(2027, 2, 7)), 'Departure in 1 day');
});

test('live status shows Day N of 76 from 8 Feb to 24 Apr 2027', () => {
  assert.equal(tripStatus(day(2027, 2, 8)), 'Day 1 of 76');
  assert.equal(tripStatus(day(2027, 4, 24)), 'Day 76 of 76');
});

test('live status says Home again from 25 Apr 2027', () => {
  assert.equal(tripStatus(day(2027, 4, 25)), 'Home again');
  assert.equal(tripStatus(day(2028, 1, 1)), 'Home again');
});

test('hero keeps the title, the dates and a static live fallback without script', () => {
  assert.match(html, /<h1[^>]*id="trip-title"[^>]*>\s*Our Parental Leave\s+in Europe/);
  assert.match(html, /class="dates">8 Feb – 25 Apr 2027</);
  assert.match(html, /id="trip-live"[^>]*>[^<]+</);
});

test('the Route plan tab is the literal plan link', () => {
  assert.match(html, /<a class="plan-link" href="\.\/plan\.html"/);
});

test('page loads tokens.css and fonts.css before its own stylesheet, with no inline palette', () => {
  const order = ['./tokens.css', './fonts.css', './design-system.css'].map(h => html.indexOf(`href="${h}"`));
  assert.ok(order.every(i => i > -1) && order[0] < order[1] && order[1] < order[2]);
  assert.doesNotMatch(html, /<style/i);
  assert.doesNotMatch(css, /@import/);
});

test('every image has alt text and explicit size; script-filled pictures record theirs on load', () => {
  for (const tag of html.match(/<img\b[^>]*>/g)) {
    assert.match(tag, /\balt=/, tag);
    if (!/\bsrc="/.test(tag)) continue; // filled by script, see keepSize
    assert.match(tag, /\bwidth="\d+"/, tag);
    assert.match(tag, /\bheight="\d+"/, tag);
  }
  assert.match(html, /function keepSize[\s\S]*setAttribute\('width'[\s\S]*setAttribute\('height'/);
  assert.match(html, /keepSize\(preview\.image\)/);
  assert.match(html, /keepSize\(image\)/);
});

test('every found picture shown on the page is credited in the footer', async () => {
  const credits = JSON.parse(await read('assets/found/credits.json'));
  const shown = [...html.matchAll(/assets\/found\/([\w.-]+)/g)].map(m => m[1]);
  assert.ok(shown.length >= 3);
  for (const file of new Set(shown)) {
    await access(new URL(`assets/found/${file}`, root));
    assert.ok(JSON.stringify(credits).includes(file), `${file} missing from credits.json`);
  }
  assert.match(html, /class="imprint"/);
  for (const name of ['Olivier Bruchez', 'Benjamin Smith', 'Lorenz Poffet', 'Paul Wilkinson']) assert.ok(html.includes(name), name);
});

test('stylesheet keeps the roadbook rules: square corners, no shadows, no pill radii', () => {
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /border-radius:\s*(?!0\b)[1-9]/);
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/box-shadow:\s*none[^;]*;/g, ''), /box-shadow|backdrop-filter|gradient\(/);
});

test('reduced motion turns animation and transitions off', () => {
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*animation:\s*none/);
});
