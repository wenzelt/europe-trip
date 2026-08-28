# Repository instructions

This repository is a German-language, data-driven Europe roadtrip journal. The public site is rendered by `index.html`; editorial content lives in `data/entries.json`.

## Adding or editing an entry

1. Read `README.md`, `data/entries.schema.json`, and the existing entries first.
2. Add or update only factual information supplied by the user or verified from a reliable source.
3. Store coordinates as decimal latitude/longitude in `location.lat` and `location.lng`. Do not guess coordinates.
4. Keep `id` stable after publication and use a unique kebab-case slug for new entries.
5. Give each entry a unique positive `route_order`; this determines the line drawn on the map.
6. Set `published` to `false` for drafts and to `true` only when the user wants the entry visible.
7. Put images under `assets/posts/<entry-id>/` and reference them with relative paths.
8. Run `node scripts/validate-content.mjs` before committing.

## Privacy

The repository and GitHub Pages site are public. Never add exact Airbnb addresses, booking links, access codes, reservation numbers, private contact information, live location data, or other sensitive travel details. A city or general neighborhood is sufficient for map placement.

## Scope

The current trip uses the travelers' own car and Airbnb-style accommodation. Do not reintroduce campervan or ferry assumptions unless the user explicitly changes the plan again.
