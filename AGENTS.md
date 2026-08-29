# AGENTS.md — Post creation playbook

This repository is a German-language, data-driven parental-leave travel journal for January through April 1. The public site is rendered by `index.html`; editorial content lives in `data/entries.json`.

These instructions apply to every agent that creates, edits, validates, or publishes a journal post.

## Read before changing content

Before editing anything, read:

1. `README.md`
2. `data/entries.schema.json`
3. `data/entries.json`
4. `scripts/validate-content.mjs`

For a normal post, change only `data/entries.json` and any associated files under `assets/posts/<entry-id>/`. Do not modify `index.html`, `design-system.css`, the schema, or the validator unless the user explicitly requests a product or schema change.

## Determine the task

Classify the request before acting:

- **New published post:** “create/add/publish a blog post” means `published: true`.
- **Draft:** “draft/prepare/save for later” means `published: false`.
- **Edit:** preserve the existing `id` and `route_order` unless the user explicitly changes the route.
- **Delete:** do not delete a published entry or image without explicit confirmation.
- **Design or feature request:** handle separately from editorial content.

## Information to collect from the prompter

A post cannot be placed correctly without a date and a location. Collect the smallest amount of missing information needed.

### Required

- **What happened:** factual activity or event.
- **Location:** city, municipality, named public place, or general area.
- **Date:** an exact calendar date.
- **Publication intent:** published post or draft; infer publication only from clear wording as described above.
- **Route position:** where this stop belongs relative to existing entries, if it is not obviously the next stop.

### Optional

- Preferred title.
- People or relationships that may be mentioned.
- Memorable details, mood, quotations, food, weather, or highlights.
- Tags.
- External HTTPS links.
- Cover image and gallery images.
- Whether an attached image may be published.

### Clarification rules

Ask a focused follow-up when any required fact is missing or ambiguous.

- Resolve “today”, “yesterday”, and similar relative dates using the conversation date and the user’s timezone, then store an ISO date.
- Never use a file upload timestamp as the photo capture date.
- Inspect embedded EXIF metadata when the user asks for image date or GPS data.
- If EXIF contains no date or GPS position, say so and ask the user. Do not infer an exact place from generic scenery.
- If an image shows a recognizable activity but not a unique landmark, use it to describe only what is visibly supported.
- Do not ask for title, prose, tags, or highlights when they can be drafted safely from supplied facts.
- If route placement is unclear, ask whether the entry is the next stop or belongs between existing stops.

## Factual and editorial rules

- Write in natural German.
- Use a warm first-person-plural voice (“wir”) unless the user requests another perspective.
- Keep the summary to one concise sentence.
- Use one to four short body paragraphs.
- Write two to five highlights when the prompt supports them.
- Do not invent names, emotions, weather, route details, climbing grades, prices, accommodation details, or events.
- Distinguish visible image evidence from assumptions.
- Preserve the user’s meaning while correcting spelling and grammar.
- Avoid generic travel-copy superlatives unless the user supplied them.
- Do not claim that a place, service, ferry, opening time, or rule is current without checking a reliable source when that fact matters.

## Location and coordinates

Every entry requires decimal latitude and longitude.

1. Prefer coordinates supplied by the user or embedded GPS metadata.
2. Otherwise verify the named public location with a reliable mapping or geographic source.
3. Use the city or municipality center when the exact activity location is unknown.
4. Never guess a precise trail, crag, Airbnb, home, or live location.
5. Store latitude in `[-90, 90]` and longitude in `[-180, 180]`.
6. Use an ISO 3166-1 alpha-2 uppercase `country_code`.
7. Mention the coordinate source in the pull-request description or final report.

## Field mapping

| Field | Rule |
| --- | --- |
| `id` | Unique lowercase kebab-case slug. Prefer `<activity-or-title>-<place>-<YYYY-MM-DD>`. Never change after publication. |
| `title` | Short, specific, and natural German. |
| `date` | Exact ISO date: `YYYY-MM-DD`. |
| `status` | `idee`, `geplant`, `unterwegs`, or `besucht`. Completed activities are `besucht`. |
| `published` | `true` for a requested published post; `false` for drafts. |
| `route_order` | Unique positive integer controlling both marker numbering and route line order. |
| `location.name` | User-facing city or public-place name. |
| `location.region` | State, province, canton, or comparable region when known. |
| `location.country` | German country name. |
| `location.country_code` | Two-letter uppercase country code. |
| `location.lat/lng` | Verified decimal coordinates. |
| `summary` | One-sentence card excerpt. |
| `body` | Array containing one to four prose paragraphs. |
| `highlights` | Array of factual short phrases; may be empty. |
| `tags` | Two to five useful, non-duplicated labels. |
| `cover_image` | Relative repository path or `null`. |
| `gallery` | Relative repository image paths; may be empty. Do not repeat the cover unless intentional. |
| `links` | Objects containing a label and an HTTPS URL; may be empty. |

## Route-order rules

- Inspect every existing `route_order` before assigning a new one.
- If the post is the next stop, use the current maximum plus one.
- If it belongs in the middle, insert it at the requested position and renumber later entries so all values remain unique.
- Route order represents journey order, not necessarily publication date.
- Never reuse or skip around an existing value merely to avoid renumbering.

## Image workflow

When the user supplies images:

1. Confirm that publishing the image is implied by the post request; ask if uncertain.
2. Do not identify people, infer sensitive attributes, or add names not supplied by the user.
3. Inspect metadata only when relevant. Do not expose raw private metadata in the post.
4. Remove GPS and unnecessary EXIF metadata from the public derivative.
5. Apply only technical web optimization unless the user requests creative editing: preserve content and aspect ratio, use a sensible display size, and avoid visible quality loss.
6. Store files under `assets/posts/<entry-id>/`.
7. Use descriptive lowercase filenames such as `klettern-flintsbach-2026-08-28.jpeg`.
8. Reference the exact relative path from `data/entries.json`.
9. Verify that every referenced image exists in the same branch.
10. Never publish screenshots containing booking numbers, access codes, addresses, faces of uninvolved people, or other private information.

## Privacy and safety

The repository and GitHub Pages site are public.

Never publish:

- Exact Airbnb or private-home addresses.
- Booking URLs, confirmation numbers, access codes, or door codes.
- Private phone numbers, email addresses, or contact details.
- Real-time location or future accommodation details that create a safety risk.
- Children’s names, medical details, schedules, or other identifying information unless the user explicitly requests publication and the content is appropriate for a public site.
- Hidden image metadata containing precise private locations.

A city, municipality, or general neighborhood is sufficient for map placement.

## Example entry

```json
{
  "id": "marktbesuch-bologna-2027-02-12",
  "title": "Ein Vormittag in Bologna",
  "date": "2027-02-12",
  "status": "besucht",
  "published": true,
  "route_order": 7,
  "location": {
    "name": "Bologna",
    "region": "Emilia-Romagna",
    "country": "Italien",
    "country_code": "IT",
    "lat": 44.4949,
    "lng": 11.3426
  },
  "summary": "Ein entspannter Vormittag zwischen Arkaden, Marktständen und kleinen Entdeckungen.",
  "body": [
    "Heute haben wir Bologna zu Fuß erkundet und uns durch die Straßen rund um den Markt treiben lassen."
  ],
  "highlights": ["Marktbesuch", "Spaziergang unter den Arkaden"],
  "tags": ["Bologna", "Italien", "Markt"],
  "cover_image": "assets/posts/marktbesuch-bologna-2027-02-12/bologna-markt.jpeg",
  "gallery": [],
  "links": []
}
```

The example demonstrates structure only. Never copy its facts, coordinates, date, route order, or prose into a real entry without verifying them.

## Validation

Before committing:

1. Parse `data/entries.json` as JSON.
2. Run:

   ```bash
   node scripts/validate-content.mjs
   ```

3. Confirm manually:
   - IDs are unique and stable.
   - Route orders are unique and reflect journey order.
   - Required arrays exist even when empty.
   - Dates are exact and plausible.
   - Coordinates match the named general location.
   - Image paths exist and use exact casing.
   - Links use HTTPS.
   - No sensitive information is present.
   - Existing unrelated entries are unchanged.

## Git and publication workflow

1. Create a branch named `content/<entry-id>` for a new post.
2. Commit the post data and its images together when possible.
3. Open a pull request describing:
   - Post title and date.
   - General map location.
   - Coordinate source.
   - Images added or optimized.
   - Whether the post is published or a draft.
   - Validation performed.
4. Wait for the repository validation workflow.
5. If the user requested publication, merge only after validation succeeds.
6. If the user requested a draft or review, leave the pull request open.
7. After merging a published post, verify the GitHub Pages deployment completed successfully.
8. Report the post, pull request, merge commit, deployment result, and public page link.

## Definition of done

A new post is complete only when:

- The prompt’s facts are represented accurately.
- Missing required information was resolved without guessing.
- Metadata matches the schema.
- Coordinates are verified and appropriately imprecise for privacy.
- Images are optimized, sanitized, stored, and referenced correctly.
- Validation succeeds.
- Publication state matches the user’s intent.
- Unrelated content and design files remain untouched.
- The final report provides traceable repository and deployment links.

## Project scope

The entire site documents the family’s parental-leave journey from January through April 1, using their own car and Airbnb-style accommodation. Do not reintroduce campervan or ferry assumptions unless the user explicitly changes the plan again.
