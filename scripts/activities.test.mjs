import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const html = await readFile(new URL('../plan.html', import.meta.url), 'utf8');
const route = JSON.parse(html.match(/const ROUTE = (\[[\s\S]*?\]);/)[1]);

test('the stop panel exposes an activity list with a German heading', () => {
  assert.match(html, /<h2[^>]*>Ideen vor Ort<\/h2>/);
  assert.match(html, /<ul[^>]*id="p-activities"/);
});

test('opening each stop replaces the list and renders proposals as text', () => {
  const elements = new Map();
  const element = () => ({
    textContent: '', children: [], style: {}, classList: { contains: () => true },
    replaceChildren(...children) { this.children = children; },
    toggleAttribute() {},
  });
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    createElement: element,
    querySelector: element,
  };
  const source = html.match(/function openPanel\(idx\) \{[\s\S]*?\n\}/)[0];
  const openPanel = runInNewContext(`${source}; openPanel`, {
    STOPS: route, DETAILS: Object.fromEntries(route.map(stop => [stop.n, stop])),
    TOTAL_NIGHTS: 76, document, formatDate: value => value, nightsAt: () => 1,
    requestAnimationFrame: fn => fn(), markerSvg: () => '',
    itinerary: { querySelectorAll: () => [] }, highlightActiveMarker() {},
    window: { innerWidth: 1440 }, L: { point() {} },
    map: { project: () => ({ add() {} }), unproject() {}, panTo() {} },
  });
  for (const [idx, stop] of route.entries()) {
    openPanel(idx);
    const items = document.getElementById('p-activities').children;
    assert.ok(items.length >= 2, `No proposals rendered for ${stop.name}`);
    assert.deepEqual(items.map(item => item.textContent), stop.activities);
  }
  const original = route[0].activities;
  route[0].activities = ['<img src=x onerror=alert(1)>'];
  openPanel(0);
  assert.equal(document.getElementById('p-activities').children[0].textContent, route[0].activities[0]);
  route[0].activities = original;
});

for (const stop of route) {
  test(`${stop.n}: ${stop.name} has specific activity proposals`, () => {
    assert.ok(Array.isArray(stop.activities), 'Activity proposals must be a list.');
    assert.ok(stop.activities.length >= 2, 'Offer at least two ideas per stop.');
    assert.equal(new Set(stop.activities).size, stop.activities.length);
    for (const activity of stop.activities) {
      assert.equal(typeof activity, 'string');
      assert.ok(activity.trim().length >= 20, 'Ideas should describe something to do.');
    }
  });
}
