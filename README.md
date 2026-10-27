# Europe Trip — Elternzeit-Journal

Ein datengetriebenes Elternzeit-Journal mit interaktiver Karte. Vom 8. Februar bis 25. April 2027 reisen wir mit dem eigenen Auto; Unterkünfte sind Airbnbs oder ähnliche Ferienwohnungen.

Die Seite besteht aus zwei Teilen:

- **Journal** (`index.html`): die Startseite mit allen Blogeinträgen und der Karte besuchter Orte.
- **Reiseplan** (`plan.html`): die Karte des geplanten Roadtrips 2027. Sie ist über den Button „Route plan“ oben rechts im Journal erreichbar; der Button „← Journal“ führt zurück.

## Inhalte pflegen

Alle sichtbaren Blogeinträge stehen in [`data/entries.json`](data/entries.json). Jeder Eintrag enthält:

- `location.lat` und `location.lng` für den Kartenmarker
- `route_order` für die Reihenfolge der Route
- `status`: `idee`, `geplant`, `unterwegs` oder `besucht`
- `published`: Entwürfe mit `false` bleiben unsichtbar
- Text, Highlights, Tags sowie optionale Bilder und Links

Das vollständige Format ist in [`data/entries.schema.json`](data/entries.schema.json) beschrieben. Hinweise für künftige ChatGPT-/Codex-Bearbeitungen stehen in [`AGENTS.md`](AGENTS.md).

## Neuen Elternzeit-Eintrag mit ChatGPT ergänzen

Das Repo in ChatGPT verbinden und zum Beispiel schreiben:

> Ergänze einen veröffentlichten Blogeintrag für Bologna am 12. Februar. Wir haben die Altstadt besucht und in der Nähe des Mercato delle Erbe gewohnt. Verwende ein Bild aus `assets/posts/bologna/`.

ChatGPT soll anschließend `data/entries.json` ergänzen, verlässliche Koordinaten verwenden und die Inhaltsprüfung ausführen. Da Repo und Webseite öffentlich sind, gehören exakte Unterkunftsadressen, Buchungsnummern und Zugangscodes niemals in die Daten.

## Reiseplan 2027

Aktueller **Routenentwurf V3**, 8. Februar bis 25. April 2027 ab und bis München, mit dem Hyundai und Ferienwohnungen. Bis zum genannten Elternzeitende am 27. April bleiben zwei Tage Puffer. **Die Stationen sind Vorschläge, keine bestätigten Buchungen.**

Prioritäten: möglichst sonnige, regenarme Küstenorte, lange Basen zum Kochen/Lesen/Filmschneiden, Wandern und Stadtbesuche sowie eine Kite-Woche. **Ostern am 28. März ist in Spanien** (Cádiz) eingeplant. Portugal folgt erst im April.

| Ankunft | Weiterfahrt | Basis | Nächte |
| --- | --- | --- | ---: |
| 2027-02-08 | 2027-02-08 | München | 0 |
| 2027-02-08 | 2027-02-09 | Bern | 1 |
| 2027-02-09 | 2027-02-10 | Lyon | 1 |
| 2027-02-10 | 2027-02-11 | Montpellier | 1 |
| 2027-02-11 | 2027-02-12 | Girona / Costa Brava | 1 |
| 2027-02-12 | 2027-02-15 | Peñíscola | 3 |
| 2027-02-15 | 2027-02-20 | Alicante / Playa de San Juan | 5 |
| 2027-02-20 | 2027-03-06 | Almería / Cabo de Gata | 14 |
| 2027-03-06 | 2027-03-17 | Torrox Costa / Nerja | 11 |
| 2027-03-17 | 2027-03-20 | Sevilla | 3 |
| 2027-03-20 | 2027-03-27 | Tarifa | 7 |
| 2027-03-27 | 2027-04-03 | Cádiz / El Puerto de Santa María | 7 |
| 2027-04-03 | 2027-04-11 | Tavira / östliche Algarve | 8 |
| 2027-04-11 | 2027-04-13 | Nerja | 2 |
| 2027-04-13 | 2027-04-15 | Cartagena / Umgebung | 2 |
| 2027-04-15 | 2027-04-19 | Valencia / Umgebung | 4 |
| 2027-04-19 | 2027-04-21 | Girona / Costa Brava | 2 |
| 2027-04-21 | 2027-04-23 | Montpellier | 2 |
| 2027-04-23 | 2027-04-24 | Lyon | 1 |
| 2027-04-24 | 2027-04-25 | Bern | 1 |
| 2027-04-25 | 2027-04-25 | München | 0 |

**21 Stationen, 76 Nächte, fünf Länder.** Start und Rückkehr München sind zwei Stationen ohne Übernachtung. Der Teil 20.–27. März in Tarifa dient Wind- und Kitesurfen; vom 27. März bis 3. April verbringen wir Ostern in Cádiz bzw. der Umgebung. Der Aufenthalt in Tavira folgt vom 3. bis 11. April.

### Kartenansicht und überlappende Orte

Die Leaflet-Karte zeichnet Verbindungen zwischen den tatsächlichen Gemeinde-/Stadtkoordinaten. Sie zeigt keine berechnete Fahrstrecke. Beim Herauszoomen liegen sowohl wiederholte Orte (München, Bern, Lyon, Montpellier, Girona) als auch nahe Stationen übereinander. Statt Marker zu verdecken, **gruppiert die Karte überlappende Marker bei der jeweils aktuellen Zoomstufe** zu einem Marker mit „2×“ (oder mehr). Durch Anklicken lässt sich jede Fahrt/Station mitsamt Datum einzeln wählen; beim Hineinzoomen werden räumlich getrennte Marker wieder aufgelöst. Linien und Routenfolge behalten die echten Referenzkoordinaten.

Neue, öffentlich verifizierbare Stadtreferenzpunkte:
- [Almería](https://en.wikipedia.org/wiki/Almer%C3%ADa): 36.8417, -2.4639.
- [Tarifa](https://en.wikipedia.org/wiki/Tarifa): 36.014, -5.606.
- [Cádiz](https://en.wikipedia.org/wiki/C%C3%A1diz): 36.535, -6.2975.

Andere Gemeindereferenzkoordinaten stammen unverändert aus der vorherigen Version. **Keine privaten Unterkunftskoordinaten**. Die Karte zeigt bei Alternativen (z. B. „Cádiz / El Puerto de Santa María“) ausdrücklich nur die zuerst genannte Referenzstadt. Kitesurfverleih und Winterinfrastruktur sind vor Ort zu prüfen. Die Euro-5-Zufahrtsberechtigung des Hyundai in städtischen Umweltzonen sowie Werkstattkontrolle vor Fahrtantritt bleiben offen.

Die Routendaten stehen direkt in [`plan.html`](plan.html) (`const ROUTE`).

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen (Journal) bzw. `http://localhost:8000/plan.html` (Reiseplan). Die Inhalte lassen sich prüfen mit:

```bash
node scripts/validate-content.mjs
node scripts/validate-plan.mjs
node --test scripts/seo.test.mjs
node --test scripts/journal.test.mjs
```

Die SEO-Checkliste, RED/GREEN-Nachweise und offenen Punkte stehen in [`docs/seo.tdd.md`](docs/seo.tdd.md).

`validate-plan.mjs` überprüft lückenlose Übernachtungen, das Osterfenster in Spanien, die Kite-Woche, die Marker-Gruppierungslogik und die gegenseitige Verlinkung von Journal und Reiseplan.

## Veröffentlichung

Pushes auf `master` werden nach erfolgreicher Prüfung beider Skripte automatisch über GitHub Pages veröffentlicht. Dabei erscheint das Journal als Startseite und der Reiseplan unter `plan.html`. Der frühere Branch `vacation-plan` ist in `master` aufgegangen und wird nicht mehr separat veröffentlicht.

## Gestaltung

Die Seite nutzt statisches HTML, CSS und Leaflet. Die Schriftarten Bebas Neue (Überschriften) und EB Garamond (Fließtext) werden lokal aus `assets/fonts/` geladen; die jeweiligen SIL-OFL-Lizenzen liegen daneben. Gemeinsame Farben, Schriftgrößen und Abstände stehen in `tokens.css`, das Journal nutzt `design-system.css`, der Reiseplan `plan.css`. Die vier Fotos unter `assets/found/` stammen von Wikimedia Commons; Urheber und Lizenz stehen in `assets/found/credits.json`.

Das Farbschema des Journals folgt zunächst der Systemeinstellung. Der Schalter „Dark theme“ speichert die eigene Auswahl lokal im Browser. Die Kartendarstellung wechselt passend zwischen CARTO Voyager und Dark Matter. Der Reiseplan hat ein eigenes dunkles Design.

Die gestalterischen Entscheidungen und Prüfgrenzen sind in [`docs/design-review.md`](docs/design-review.md) dokumentiert.
