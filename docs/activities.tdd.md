# Stop activity proposals — TDD evidence

## Source and user journey

No source plan; journey derived from the request: “add to each stop proposals of what to do in each stop”.

As a visitor planning the trip, I can open any of the 21 stops and see destination-specific ideas, clearly identified as proposals rather than completed activities or bookings.

## Execution and checkpoints

- Baseline: `node --test scripts/*.test.mjs` — 25 passed. Route validator passed for 21 stages and 76 nights.
- RED: `node --test scripts/activities.test.mjs` — 23 executed, 0 passed, 23 failed: missing activity arrays, heading/list markup, and rendered proposals. Checkpoint: `090639b` on `feat/favicon`.
- GREEN: same command — 23 passed, 0 failed. Each stop has at least two proposals; longer stays have more ideas. The existing panel replaces its list with text-only list items on selection. Checkpoint: `9d69a7e` on `feat/favicon`.
- Regression/coverage: `node --test --experimental-test-coverage scripts/*.test.mjs` — 48 passed, 0 failed, 0 skipped.
- `node scripts/validate-plan.mjs` — Plan validation passed: 21 stages, 76 nights, 21 unique timeline targets.
- `node scripts/validate-content.mjs` — 1 entry successfully validated.
- `git diff --check` — passed with no output.
- Browser verification on locally served `plan.html`: called `openPanel` for every route entry; all 21 lists matched their stop's proposals (2–4 each). At a 1440px viewport there was no horizontal page overflow.
- `git merge-base --is-ancestor 090639b HEAD` passed after GREEN; both checkpoints are reachable on the active branch. No refactor was needed.

## Test specification

| Guarantee | Test target | Type | Result |
| --- | --- | --- | --- |
| All 21 stops, including departure and return, contain at least two nonempty, distinct activity strings | `scripts/activities.test.mjs`: per-stop tests | Data integration | PASS |
| Panel provides a German heading and semantic list | `scripts/activities.test.mjs`: panel markup | Static integration | PASS |
| Selecting each stop replaces the previous suggestions with the selected stop's list | `scripts/activities.test.mjs`: opening each stop | Renderer integration with DOM stub | PASS |
| Proposal strings are rendered via text content, including an HTML-shaped input | Same renderer test | Renderer integration | PASS |
| Existing route, dates, grouping, navigation, and journal content remain valid | Route/content validators and full test suite | Regression | PASS |

## Coverage and known gaps

Node reported aggregate 100% but no instrumented source files. This is not evidence of 80% production coverage: production JavaScript is embedded in HTML and the renderer is executed via a VM in the integration test. The changed rendering behavior and all route entries are exercised, but full planner coverage is not established.

Browser verification was desktop-only and scripted, not a persisted Playwright E2E suite. Activity suitability, 2027 opening hours, tickets, ferry operations, weather, and accessibility were not independently verified. The UI explicitly asks visitors to check these before visiting. No bookings, dates, coordinates, or published journal entries changed.

## Merge evidence

Preserve the RED/GREEN summary above if squashing checkpoints. RED: 23 intended failures; GREEN: 23 activity tests and 48 full-suite tests pass. No refactor stage.
