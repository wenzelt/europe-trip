import { readFile } from 'node:fs/promises';

const source = new URL('../data/entries.json', import.meta.url);
const data = JSON.parse(await readFile(source, 'utf8'));
const errors = [];
const allowedStatuses = new Set(['idee', 'geplant', 'unterwegs', 'besucht']);
const ids = new Set();
const routeOrders = new Set();

if (data.schema_version !== 1) errors.push('schema_version muss 1 sein.');
if (!data.trip?.title || !data.trip?.home) errors.push('trip.title und trip.home sind erforderlich.');
if (!Array.isArray(data.entries)) errors.push('entries muss ein Array sein.');

for (const [index, entry] of (data.entries || []).entries()) {
  const prefix = `entries[${index}]`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id || '')) errors.push(`${prefix}.id ist kein gültiger Slug.`);
  if (ids.has(entry.id)) errors.push(`${prefix}.id ist doppelt: ${entry.id}`);
  ids.add(entry.id);

  if (!entry.title || !entry.summary) errors.push(`${prefix}: title und summary sind erforderlich.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '') || Number.isNaN(Date.parse(`${entry.date}T00:00:00Z`))) {
    errors.push(`${prefix}.date muss ein gültiges ISO-Datum sein.`);
  }
  if (!allowedStatuses.has(entry.status)) errors.push(`${prefix}.status ist ungültig.`);
  if (typeof entry.published !== 'boolean') errors.push(`${prefix}.published muss true oder false sein.`);
  if (!Number.isInteger(entry.route_order) || entry.route_order < 1) errors.push(`${prefix}.route_order muss eine positive Ganzzahl sein.`);
  if (routeOrders.has(entry.route_order)) errors.push(`${prefix}.route_order ist doppelt: ${entry.route_order}`);
  routeOrders.add(entry.route_order);

  const { lat, lng, country_code: countryCode } = entry.location || {};
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.push(`${prefix}.location.lat ist ungültig.`);
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) errors.push(`${prefix}.location.lng ist ungültig.`);
  if (!/^[A-Z]{2}$/.test(countryCode || '')) errors.push(`${prefix}.location.country_code muss ISO-3166-1 alpha-2 entsprechen.`);
  if (!Array.isArray(entry.body) || entry.body.length === 0) errors.push(`${prefix}.body benötigt mindestens einen Absatz.`);
  for (const field of ['highlights', 'tags', 'gallery', 'links']) {
    if (!Array.isArray(entry[field])) errors.push(`${prefix}.${field} muss ein Array sein.`);
  }
  for (const link of (entry.links || [])) {
    if (!link?.label || !/^https:\/\//.test(link.url || '')) errors.push(`${prefix}.links enthält keinen gültigen HTTPS-Link.`);
  }
}

if (errors.length) {
  console.error(`Content-Prüfung fehlgeschlagen (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`${data.entries.length} Blogeintrag/Blogeinträge erfolgreich geprüft.`);
