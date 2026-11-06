# Design review

## Brief and scope

Family travel journal for friends and relatives, plus a draft route plan. Redesigned with the [taste skill](https://github.com/Leonxlnx/taste-skill) (v2) using native HTML and CSS, no build step.

Everything functional is kept: journal and map, search, status filters, article viewer, anchor IDs, original posts and photos, and the route plan with its validated `ROUTE` data. `scripts/validate-content.mjs` and `scripts/validate-plan.mjs` still gate deployment.

## Direction: "The page is the object"

- Idea: the route and its numbers (21 stations, 76 nights, 5 countries, 2 buffer days) become a roadbook folder. Its tabs are the destinations: Journal, Map and Route plan.
- Live detail: a countdown to departure, "Day N of 76" during the trip and "Home again" afterwards.
- Type: Bebas Neue for display capitals, EB Garamond for text. Both are self-hosted from `assets/fonts/` under the SIL OFL.
- Colour, "Sand and moss": sand surfaces, one moss accent (`#4f6238` light, `#a3bb78` dark), tone-stepped surfaces instead of lines.
- Shape: square corners, no gradients, shadows, pills, emoji, eyebrow labels or hairline rules. The old purple accent, rounded panels and pill controls are retired.
- Tokens live in `tokens.css` and are shared by `index.html` (`design-system.css`) and `plan.html` (`plan.css`).

## Accessibility and behaviour retained

- Keyboard focus, skip link, modal semantics, scroll locking, clear empty and error states, full portrait photographs.
- Light/dark theme: system preference, a toggle on both pages, and a saved choice (`journal-theme`) applied before first paint. CARTO tiles switch between Voyager and Dark Matter with the theme.
- Reduced motion is respected.
- Mobile: the journal has a Journal/Map switch (the map is hidden until selected and resized when shown). The itinerary slips stack in a column below the tablet breakpoint and do not scroll sideways. This is covered by a regression test in `scripts/seo.test.mjs`.
- The route plan opens stop details in a side drawer on desktop and a bottom sheet on phones.
- Readability: secondary text meets WCAG AA (4.5:1) on every surface in both themes; the smallest text is 15px and running text 18px with 1.55 leading; display capitals use a line-height of at least .95. All of this is covered by `scripts/design.test.mjs`.
- Map markers: the journal marker is centred on its place and has a paper ring so it stands off the tiles. On phones the route plan uses 32px markers, 20px side padding and a 36px grouping distance, so the overview shows 10 markers instead of 6 and no marker hides more than 3 stops. Grouped stops show as two stacked dots labelled with their first station number.

## Verification

- Taste-skill `lint.mjs`: 0 FAIL, 0 WARN on source. `inspect.mjs --app` on the planner: 0 FAIL, 0 WARN.
- The journal inspector reports a few WARNs (footage, ragged edges). Treat them as open polish items rather than defects.
- Headless Chrome at 1440, 768 and 390 px: no horizontal page overflow, no broken images, Leaflet tiles and markers render on both pages, and the journal map renders on mobile after switching to the Map view.
- SEO metadata, crawl files and their tests are documented in [`seo.tdd.md`](seo.tdd.md).

## Known limits

- Copy written for the design (folder strip notes, route-slip labels, showcase and footer prose) is sample text and should be reviewed by the author.
- Photos in `assets/found/` are Wikimedia Commons images; see `credits.json` for authors and licences.
- On desktop the itinerary row can overflow its container by about 4 px because of the tilted slips. It is not visible in screenshots.
