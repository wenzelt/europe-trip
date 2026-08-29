# Europe Trip — Elternzeit-Journal

Ein datengetriebenes Elternzeit-Journal mit interaktiver Karte. Von Januar bis 1. April reisen wir mit dem eigenen Auto; Unterkünfte sind Airbnbs oder ähnliche Ferienwohnungen.

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

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Die Inhalte lassen sich prüfen mit:

```bash
node scripts/validate-content.mjs
```

Pushes auf `master` werden nach erfolgreicher Prüfung automatisch über GitHub Pages veröffentlicht.
