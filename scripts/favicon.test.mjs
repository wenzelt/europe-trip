import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

for (const page of ['index.html', 'plan.html']) {
  test(`${page}: declares the shared local SVG favicon`, async () => {
    const html = await readFile(new URL(page, root), 'utf8');
    const icons = [...html.matchAll(/<link\b[^>]*rel="icon"[^>]*>/gi)];
    assert.equal(icons.length, 1);
    assert.match(icons[0][0], /href="\.\/assets\/favicon\.svg"/);
    assert.match(icons[0][0], /type="image\/svg\+xml"/);
    assert.match(icons[0][0], /sizes="any"/);
  });
}

test('shared favicon exists as a scalable SVG image', async () => {
  const svg = await readFile(new URL('assets/favicon.svg', root), 'utf8');
  assert.match(svg, /<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /viewBox="0 0 32 32"/);
  assert.match(svg, /<path\b/);
  assert.match(svg, /<\/svg>/);
});
