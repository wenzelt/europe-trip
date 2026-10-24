import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
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

assert.equal(route[0].arrival, '2027-02-01', 'Departure from Munich');
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
assert.equal(nights, 83, 'The plan must account for all overnight stays.');
assert.equal(new Set(route.map(stop => stop.countryCode)).size, 5);
assert.deepEqual(route.filter(stop => stop.type === 'stay').map(stop => (dateValue(stop.departure) - dateValue(stop.arrival)) / 86400000), [17, 14, 14]);
assert.equal((dateValue('2027-04-27') - dateValue(route.at(-1).arrival)) / 86400000, 2);
assert.doesNotMatch(html, /Winter Campervan|FERRY_SEGS|TOTAL_KM|of 26/);
console.log(`${route.length} stations, ${nights} nights, 5 countries, 2 buffer days: route valid.`);
