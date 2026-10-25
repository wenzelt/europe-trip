import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../plan.html', import.meta.url), 'utf8');
const journalHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
assert.match(journalHtml, /<a class="plan-link" href="\.\/plan\.html"/, 'The journal must link to the route plan.');
assert.match(html, /<a class="back-link" href="\.\/"/, 'The route plan must link back to the journal.');
const match = html.match(/const ROUTE = (\[[\s\S]*?\]);/);
assert.ok(match, 'The planner must contain its route data.');
const route = JSON.parse(match[1]);
const types = new Set(['start', 'drive', 'stay', 'end']);
const countries = new Set(['DE', 'CH', 'FR', 'ES', 'PT']);
const dateValue = value => {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
  const date = new Date(value + 'T00:00:00Z');
  assert.equal(date.toISOString().slice(0, 10), value, `Invalid date: ${value}`);
  return date.getTime();
};

assert.equal(route[0].arrival, '2027-02-08', 'Departure after the Augsburg theatre');
assert.equal(route.at(-1).arrival, '2027-04-25', 'Return to Munich');
assert.equal(route[0].type, 'start');
assert.equal(route.at(-1).type, 'end');
assert.equal(route[0].lat, route.at(-1).lat);
assert.equal(route[0].lng, route.at(-1).lng);
let nights = 0;
for (const [idx, stop] of route.entries()) {
  assert.equal(stop.n, idx + 1, 'Station numbers must be contiguous.');
  assert.ok(stop.name && stop.desc && stop.country);
  assert.ok(types.has(stop.type));
  assert.ok(countries.has(stop.countryCode));
  assert.ok(Number.isFinite(stop.lat) && stop.lat >= -90 && stop.lat <= 90);
  assert.ok(Number.isFinite(stop.lng) && stop.lng >= -180 && stop.lng <= 180);
  assert.equal(new URL(stop.coordinateSource).protocol, 'https:');
  assert.equal(new URL(stop.wiki).protocol, 'https:');
  const arrival = dateValue(stop.arrival);
  const departure = dateValue(stop.departure);
  assert.ok(departure >= arrival, `Negative stay at ${stop.name}`);
  if (idx > 0) assert.equal(stop.arrival, route[idx - 1].departure, `Gap or overlap before ${stop.name}`);
  if (stop.type === 'drive' || stop.type === 'stay') assert.ok(departure > arrival);
  nights += (departure - arrival) / 86400000;
}
assert.equal(nights, 76, 'The plan must account for all overnight stays.');
assert.equal(new Set(route.map(stop => stop.countryCode)).size, 5);
assert.deepEqual(route.filter(stop => stop.type === 'stay').map(stop => (dateValue(stop.departure) - dateValue(stop.arrival)) / 86400000), [14, 11, 7, 7, 8]);
const tar = route.find(stop => stop.name === 'Tarifa');
assert.equal(tar?.arrival, '2027-03-20');
assert.equal(tar?.departure, '2027-03-27');
const easter = '2027-03-28';
const easterStop = route.find(stop => stop.arrival <= easter && easter < stop.departure);
assert.equal(easterStop?.name, 'Cádiz / El Puerto de Santa María', 'Easter Sunday must be in Spain');
assert.equal(easterStop?.countryCode, 'ES');
const tavira = route.find(stop => stop.name.startsWith('Tavira'));
assert.equal(tavira?.arrival, '2027-04-03', 'Portugal only after Easter');

assert.equal((dateValue('2027-04-27') - dateValue(route.at(-1).arrival)) / 86400000, 2);
assert.doesNotMatch(html, /Winter Campervan|FERRY_SEGS|TOTAL_KM|of 26/);
// Exercise the same pure grouping function used by the interactive map.
const groupingMatch = html.match(/function clusterStopsByPixelDistance\([\s\S]*?\n}\n/);
assert.ok(groupingMatch, 'Screen-space marker grouping must exist.');
const clusterStops = runInNewContext('(' + groupingMatch[0] + ')');
const point = stop => ({ x: stop.lng, y: stop.lat });
const shared = [
  { n: 1, lat: 0, lng: 0 }, { n: 21, lat: 0, lng: 0 },
  { n: 10, lat: 0, lng: 80 }
];
const grouped = clusterStops(shared, point);
assert.equal(grouped.length, 2, 'Same-place stops merge without hiding unrelated stops.');
assert.deepEqual(Array.from(grouped[0], stop => stop.n), [1, 21]);
assert.equal(clusterStops(shared, point, 1).length, 2, 'Exact duplicates group at any zoom.');
const near = [{ lat: 0, lng: 0 }, { lat: 0, lng: 40 }];
assert.equal(clusterStops(near, point).length, 1, 'Nearby markers group when visually overlapping.');
assert.equal(clusterStops(near, s => ({x: s.lng * 4,y:s.lat})).length, 2, 'Nearby markers separate when zoomed in.');
const chain = [{lat:0,lng:0},{lat:0,lng:40},{lat:0,lng:80}];
assert.equal(clusterStops(chain, point).length, 2, 'Complete-link grouping avoids long overlapping chains.');
console.log(`${route.length} stations, ${nights} nights, Easter in Spain, marker grouping and 2 buffer days: route valid.`);
