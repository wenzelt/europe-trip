# SEO checklist and TDD evidence

## Scope and journeys

Journeys were derived from the user's 20-item SEO checklist:
- A crawler can discover the two existing public pages without duplicate canonical URLs.
- A visitor can share either page with factual metadata and an existing photograph.
- A phone reader can read every itinerary stage without sideways scrolling.

Public origin confirmed through the GitHub Pages API: https://wenzelt.github.io/europe-trip/.
No URLs, editorial entries, route dates or publication flags were changed by this SEO pass.

## RED → GREEN

Command: `node --test scripts/seo.test.mjs`.

Initial RED: 11 tests executed, 3 passed, 8 failed. Intended failures: missing canonical/social metadata, JSON-LD, sitemap.xml, robots.txt and llms.txt. One image check also flagged the hidden, sourceless preview placeholder; corrected the test to require dimensions only on actual static image sources, not an empty runtime placeholder.

Implemented: canonical/Open Graph/Twitter metadata and factual WebPage JSON-LD on both pages; sitemap, robots and llms files; an empty favicon declaration to avoid the journal's favicon 404. Existing titles and descriptions were retained. No fabricated last-modified dates, reviews or completed-trip claims.

Second RED: `node --test --test-name-pattern='mobile itinerary' scripts/seo.test.mjs` executed one test and failed because the responsive itinerary was a horizontal strip. Changed the responsive `.slips` layout to a vertical stack.

Final GREEN: 12 tests executed, 12 passed, 0 failed. CI now runs the SEO suite before deployment.

| Guarantee | Evidence | Type | Result |
| --- | --- | --- | --- |
| Both pages have titles, descriptions, one H1 and no skipped static heading levels or noindex | `node --test scripts/seo.test.mjs` | Static integration | PASS |
| Canonical and social URLs use the confirmed HTTPS origin; social image exists | Same command | Static integration | PASS |
| Both pages contain parseable, factual WebPage JSON-LD | Same command | Static integration | PASS |
| Literal local page links/assets exist; static images declare alt and dimensions | Same command | Static integration | PASS |
| Sitemap lists exactly the two canonical pages; robots permits crawling | Same command | Static integration | PASS |
| llms.txt links the real pages | Same command | Static integration | PASS |
| Responsive itinerary defines a vertical layout | Same command | CSS regression | PASS |
| Editorial data remains valid | `node scripts/validate-content.mjs` | Integration | PASS: 1 published entry checked |
| Route facts and navigation remain valid | `node scripts/validate-plan.mjs` | Integration | PASS: 21 stations, 76 nights, Easter in Spain, marker grouping, 2 buffer days |

## All 20 checklist items

| Item | Status |
| --- | --- |
| Sitemap | Added for journal and plan only. |
| robots.txt | Added with sitemap URL and crawl permission. On a project subpath, host-root robots.txt controls the whole host; this file does not control other wenzelt.github.io projects. |
| Remove noindex | None found in either page. |
| Canonicals | Added self-canonical HTTPS URLs; index.html canonicalizes to the directory URL. |
| Titles | Existing distinct descriptive titles retained and tested. |
| Descriptions | Existing distinct descriptions retained and tested. |
| One H1 | Verified in source and Chrome on both pages. |
| Heading order | Static heading order tested. Runtime article dialogs are not exhaustively covered. |
| Alt text | Static images tested; original journal image alt preserved. |
| Schema | Factual WebPage JSON-LD added; no invented reviews or completed travel. |
| Internal links | Existing journal ↔ plan navigation retained. |
| Broken links | Literal local links/assets checked; Chrome found no broken loaded images at 1440/768/390. External outbound links not exhaustively checked. |
| Image compression | Existing post photo is about 211 KB; new design photos are about 55–400 KB. No destructive recompression of originals. |
| Core Web Vitals | NOT verified: no field LCP/INP/CLS or Lighthouse run. Explicit image dimensions and existing font preloads help but do not prove good CWV. |
| Mobile layout | Chrome: no document overflow at 1440/768/390 on either page. Itinerary strip changed to stacked stages on tablet/phone. |
| HTTPS | Pages API reports https_enforced=true; HTTP URL returns 301 to HTTPS. |
| URL slugs | Existing short URLs retained; no unnecessary migration or broken post IDs. |
| og:image | Existing journal train photograph used on both pages, absolute HTTPS URL, alt and dimensions provided. Portrait source may crop differently per sharing platform. |
| Search Console | NOT verified. Requires the owner's verification token/account action; no token fabricated. |
| llms.txt | Added as optional AI-oriented guidance, not a ranking guarantee. |

## Browser and design checks

Independent local headless Chrome check at 1440, 768 and 390 pixels: both pages had one rendered H1, expected canonical, no document horizontal overflow, and no broken loaded images. The initial journal favicon 404 was subsequently fixed by adding the same empty favicon declaration used by the planner.

Final taste inspector: journal 0 FAIL / 3 WARN (no video, multiple text anchor lines, mobile view wrapper without its own heading); planner --app 0 FAIL / 0 WARN. Source taste lint passed 0 FAIL / 0 WARN before the final mobile CSS adjustment. These are design checks, not Core Web Vitals evidence.

## Coverage and limitations

`node --test --experimental-test-coverage scripts/seo.test.mjs` reported 100% with an empty application-file table. It does NOT measure browser JavaScript or HTML coverage. No 80% application coverage claim is made. The CSS regression is a source assertion, supplemented by browser inspection; it is not a substitute for a full E2E suite.

No checkpoint commits were created: the user did not explicitly request commits, and the working tree includes a separate in-progress design pass. RED/GREEN evidence is preserved here instead. Nothing was pushed or deployed during this task. Search Console and field CWV remain follow-ups after deployment.
