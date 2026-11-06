# Readability and mobile map markers: TDD evidence

## Request

"The design is a bit hard to read. Improve the design. Also on mobile it doesn't look super clean, especially the dots on the map."

## What was wrong

- Small text was 13 to 14px in EB Garamond, a serif with a small x-height. Running text started at 17px with 1.45 leading.
- In the light theme the muted grey `#59574e` fell below 4.5:1 on three of the sand surfaces (4.44, 3.92 and 3.44).
- Display capitals used a line-height of .85, so stacked headings almost touched.
- The journal map marker was a square anchored at its bottom edge, so it sat above the real location. Leaflet's touch styles shrank the zoom buttons to 30px.
- On a phone, the sticky Journal/Map switcher covered the map heading after switching views.
- On a 390px phone the route plan kept 70px side padding, 44px markers and a 48px grouping distance. The overview showed 6 markers, one of them hiding 6 stops behind a "6×" box.

## Execution and checkpoints

- Baseline: `node --test scripts/*.test.mjs`: 48 passed.
- RED: `node --test scripts/design.test.mjs`: 14 tests, 2 passed (guards that already held), 12 failed for the reasons above. Checkpoint `5c8adb0`. Two test helper bugs found on the way to GREEN were fixed in the test file, not worked around in the code: the CSS block lookup matched `html, body` before `body`, and the function extractor stopped at the first indented closing brace. A cross-realm `deepEqual` on a `vm` array was replaced with `Array.from`.
- A 15th test (touch zoom buttons) was added RED after the first browser check and then made GREEN.
- GREEN: `node --test scripts/*.test.mjs`: 63 passed, 0 failed.
- `node scripts/validate-plan.mjs` and `node scripts/validate-content.mjs` both pass.

## Changes

| Area | Before | After |
| --- | --- | --- |
| `--step-small` / `--step-body` | 13–14px / 17–19px | 15–16px / 18–21px |
| Plan `--t-s` / `--t-b` | 14px / 17px | 15px / 18px |
| Body leading | 1.45 | 1.55 |
| Display line-height | .85 | .95 |
| Light `--muted` | `#59574e` (3.44:1 worst) | `#45433b` (4.70:1 worst) |
| Journal marker | 38px, bottom anchor | 32px, centred, paper ring |
| Plan markers on phones | 44px, gap 48, side padding 70 | 32px, gap 36, side padding 20 |
| Grouped stops | wide box with "N×" | two stacked dots with the first station number |
| Phone overview (390px) | 6 markers, largest group 6 | 10 markers, largest group 3 |

The remaining groups on a phone are mostly the same city on the way out and on the way back (Bern 2/20, Lyon 3/19 and so on). They share a location, so they are meant to stay together. Tapping a stacked dot still opens the stop picker with every stop and its date.

## Test specification

| Guarantee | Test |
| --- | --- |
| Ink and muted text reach 4.5:1 on every surface in both themes; button and footer text too | `design.test.mjs`: theme contrast tests |
| Planner muted labels reach 4.5:1 on all floating surfaces | planner contrast test |
| Minimum sizes and leading | text size and leading tests |
| No display line-height below .92 | display capitals test |
| Journal marker anchored at its centre with a paper ring | journal marker test |
| Map heading clears the sticky switcher | phone scroll-margin test |
| Zoom buttons stay 44px on touch devices | touch zoom test |
| Phone markers are smaller but do not overlap | marker metrics test |
| Fitted phone overview keeps at least 10 markers and no group above 3 (Web Mercator at the fitted zoom, as Leaflet computes it) | phone overview test |
| Desktop keeps at least 13 markers | desktop overview test |
| Group label and stacked shape | grouped marker test |

## Browser check

Headless Chromium at 360, 390, 768 and 1440px, light and dark: no horizontal overflow and no script errors on either page. Leaflet and CARTO tiles are blocked in the build sandbox, so Leaflet was served from a local npm copy and tiles were stubbed with flat colour. Marker placement and grouping were checked that way; the look over real map tiles has not been checked.
