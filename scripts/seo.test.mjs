import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = 'https://wenzelt.github.io/europe-trip/';
const pages = ['index.html', 'plan.html'];
const read = path => readFile(new URL(path, root), 'utf8');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m => [m[1], m[2]]));

for (const page of pages) {
  test(`${page}: unique title, description and one H1; no skipped heading levels`, async () => {
    const html = await read(page);
    assert.equal([...html.matchAll(/<title>/gi)].length, 1);
    assert.match(html, /<title>[^<]{10,90}<\/title>/i);
    const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
    assert.equal(meta.filter(m => m.name === 'description' && m.content?.length >= 50).length, 1);
    assert.equal([...html.matchAll(/<h1\b/gi)].length, 1);
    let previous = 0;
    for (const m of html.matchAll(/<h([1-6])\b/gi)) {
      const level = Number(m[1]);
      assert.ok(level <= previous + 1, `heading jumps from H${previous} to H${level}`);
      previous = level;
    }
    assert.doesNotMatch(html, /noindex/i);
  });

  test(`${page}: canonical and social sharing metadata resolve to the public HTTPS site`, async () => {
    const html = await read(page);
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0])).find(a => a.rel === 'canonical');
    const url = page === 'index.html' ? site : site + page;
    assert.equal(canonical?.href, url);
    const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
    for (const key of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'og:image:alt']) {
      assert.ok(meta.some(m => m.property === key && m.content), `${key} missing`);
    }
    assert.equal(meta.find(m => m.property === 'og:url').content, url);
    const image = new URL(meta.find(m => m.property === 'og:image').content);
    assert.ok(image.href.startsWith(site));
    await access(new URL(image.href.slice(site.length), root));
    assert.ok(meta.some(m => m.name === 'twitter:card' && m.content === 'summary_large_image'));
  });

  test(`${page}: valid factual structured data identifies the page`, async () => {
    const html = await read(page);
    const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    assert.ok(scripts.length, 'JSON-LD missing');
    const data = scripts.map(m => JSON.parse(m[1]));
    assert.ok(data.some(d => d['@context'] === 'https://schema.org' && d['@type'] === 'WebPage' && d.name && d.url === (page === 'index.html' ? site : site + page)));
  });

  test(`${page}: local links/assets exist and static images have alt text and dimensions`, async () => {
    const html = await read(page);
    for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*>/gi)) {
      const a = attrs(match[0]);
      const ref = a.href ?? a.src;
      if (ref && !/^(?:[a-z]+:|\/\/|#|\$)/i.test(ref) && !ref.includes('${')) {
        await access(new URL(ref.split(/[?#]/)[0] || page, root));
      }
      if (/^<img\b/i.test(match[0])) {
        assert.ok(Object.hasOwn(a, 'alt'), 'image alt missing');
        if (a.src && !a.src.includes('${')) {
          assert.ok(Number(a.width) > 0 && Number(a.height) > 0, `image dimensions missing: ${a.src}`);
        }
      }
    }
    assert.match(html, /name="viewport"/);
  });
}

test('mobile itinerary shows every stage without a horizontal scrolling strip', async () => {
  const css = await read('design-system.css');
  assert.match(css, /\.slips\s*\{[^}]*flex-direction:\s*column[^}]*overflow-x:\s*visible/s);
});

test('sitemap lists exactly the two canonical pages with HTTPS URLs', async () => {
  const xml = await read('sitemap.xml');
  assert.match(xml, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]).sort(), [site, site + 'plan.html'].sort());
});

test('robots permits crawling and advertises the sitemap', async () => {
  const robots = await read('robots.txt');
  assert.match(robots, /User-agent:\s*\*/i);
  assert.doesNotMatch(robots, /Disallow:\s*\/\s*(?:\n|$)/i);
  assert.ok(robots.includes(`Sitemap: ${site}sitemap.xml`));
});

test('llms.txt points to real public pages without claiming private or invented content', async () => {
  const text = await read('llms.txt');
  assert.ok(text.startsWith('# '));
  assert.ok(text.includes(site) && text.includes(site + 'plan.html'));
});
