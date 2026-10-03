# Design review

## Brief and scope

Family travel journal for friends and relatives. Refine the existing playful, editorial style using the [taste skill](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md), with native HTML and CSS.

Redesign mode: preserve. The journal and map, search, status filters, article viewer, anchor IDs, original posts and photos remain the foundation.

Design settings: variation 6/10, motion 3/10, density 3/10. The asymmetric journal/map composition supplies variation. Motion supplies control feedback only; reading and photographs supply the visual content.

## Audit

- Existing identity: Outfit headings, Plus Jakarta Sans body, warm light background, purple controls, rounded containers.
- Functional content: actual travel posts, photographs, route markers, search and statistics.
- Repeated decoration: confetti, dotted background, hero text strip, repeated section labels, photo-overlay arrow, and competing colored shadows.
- Accessibility to retain: keyboard focus, skip link, modal semantics, scroll locking, clear empty/error states, and full portrait photographs.
- SEO baseline: one public index page; title and description remain intact. No route migration or post slug changes.

## Refinement

- Keep the font pairing and purple accent. Use one semantic accent across controls, links and markers.
- Simplify decorative elements and display statistics without separate colored cards.
- Use a consistent shape scale: panels 24px, inputs/media 12px, status and filter controls pills.
- Provide coordinated light/dark tokens, an accessible theme toggle, system preference detection, and a saved browser preference. Apply the theme before first paint.
- Match CARTO's map style to the theme using its [documented tile styles](https://github.com/CartoDB/basemap-styles/blob/master/README.md).
- Self-host the existing fonts with `font-display: swap`, Latin/Latin Extended subsets, two font preloads, and included SIL-OFL licenses.
- Use a static loading placeholder with the card's image proportions. Keep reduced-motion support and avoid automatic animations.
- Keep the user's real travel photograph. Generated travel imagery would misrepresent this factual journal.

## Pre-flight

Applicable checks cover hierarchy, theme/palette/shape consistency, keyboard controls, placeholder and button contrast, original content, real imagery, stable IDs, responsive single-column rules, loading/empty/error states, and local assets.

Measured token contrast ratios:

| Pair | Light | Dark |
| --- | ---: | ---: |
| Body text / page | 14.17:1 | 14.62:1 |
| Muted text / input surface | 6.30:1 | 8.35:1 |
| Selected button text / accent | 6.85:1 | 8.05:1 |
| Input boundary / input surface | 3.78:1 | 5.54:1 |

Landing-page-only checks for pricing, social proof, bento grids, product previews, and marketing CTAs do not apply. Framework/animation-library checks do not apply to this static implementation. Existing factual prose is preserved.

The content validator, JavaScript syntax check, font-path validation, whitespace check, and DOM interaction checks cover code and state behavior. Live browser checks cover rendered desktop behavior in both themes after deployment.

Limitations: local Chromium could not start in this execution environment and cloud-browser device previews are blocked. Rendered mobile layouts and Lighthouse/Core Web Vitals are therefore unverified; no Lighthouse score or performance result is claimed.
