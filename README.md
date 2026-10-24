# Europe Trip · Elternzeit-Roadtrip 2027

Routenentwurf mit dem Hyundai ab München vom **1. Februar bis 25. April 2027**. Bis zum Elternzeitende am **27. April** bleiben zwei Tage Puffer. Wir planen längere Aufenthalte in Andalusien und an der östlichen Algarve, ohne Flüge oder Fähren. Unterkünfte sind Ferienwohnungen oder ähnliche Unterkünfte; Buchungen sind noch offen.

## Route

| Ankunft | Weiterfahrt | Basis | Nächte |
| --- | --- | --- | ---: |
| 2027-02-01 | 2027-02-01 | München | 0 |
| 2027-02-01 | 2027-02-02 | Bern | 1 |
| 2027-02-02 | 2027-02-03 | Lyon | 1 |
| 2027-02-03 | 2027-02-04 | Montpellier | 1 |
| 2027-02-04 | 2027-02-05 | Girona / Costa Brava | 1 |
| 2027-02-05 | 2027-02-08 | Peñíscola | 3 |
| 2027-02-08 | 2027-02-12 | Alicante / Playa de San Juan | 4 |
| 2027-02-12 | 2027-03-01 | San José / Cabo de Gata | 17 |
| 2027-03-01 | 2027-03-15 | Torrox Costa / Nerja | 14 |
| 2027-03-15 | 2027-03-19 | Sevilla | 4 |
| 2027-03-19 | 2027-04-02 | Tavira / östliche Algarve | 14 |
| 2027-04-02 | 2027-04-06 | El Puerto de Santa María / Cádiz | 4 |
| 2027-04-06 | 2027-04-09 | Nerja | 3 |
| 2027-04-09 | 2027-04-12 | Cartagena / Umgebung | 3 |
| 2027-04-12 | 2027-04-17 | Valencia / Umgebung | 5 |
| 2027-04-17 | 2027-04-21 | Girona / Costa Brava | 4 |
| 2027-04-21 | 2027-04-23 | Montpellier | 2 |
| 2027-04-23 | 2027-04-24 | Lyon | 1 |
| 2027-04-24 | 2027-04-25 | Bern | 1 |
| 2027-04-25 | 2027-04-25 | München | 0 |

Die 20 Stationen umfassen Start und Rückkehr sowie wiederholte Orte auf dem Rückweg. Insgesamt sind 83 Übernachtungen in fünf Ländern eingeplant. Die Karte verbindet Ortsmarker schematisch; sie berechnet keine Straßenroute. Die grobe Schätzung von 6.500–7.000 km schließt Ausflüge aus und muss anhand der gewählten Unterkünfte geprüft werden.

## Inhalte und Quellen

Die Termine und Aufenthaltsdauern folgen dem vom Nutzer vorgegebenen Reiseplan vom 24. Oktober 2026. Es handelt sich um geplante Aufenthalte, nicht um Reiseberichte oder bestätigte Buchungen. Private Unterkunftsadressen, Buchungsdaten und Angaben zu Kindern sind nicht enthalten.

Die Marker stehen für öffentlich bekannte Orte oder Gemeindezentren. Bei Alternativen wie Torrox Costa/Nerja wird nur die genannte Referenzgemeinde markiert. Die geprüften Koordinatenquellen sind in jedem `ROUTE`-Datensatz unter `coordinateSource` hinterlegt:

- [München](https://en.wikipedia.org/wiki/Munich): 48.1375, 11.575
- [Bern](https://en.wikipedia.org/wiki/Bern): 46.94806, 7.4475
- [Lyon](https://en.wikipedia.org/wiki/Lyon): 45.7675, 4.835
- [Montpellier](https://en.wikipedia.org/wiki/Montpellier): 43.6119, 3.8772
- [Girona / Costa Brava](https://en.wikipedia.org/wiki/Girona): 41.98444, 2.82111
- [Peñíscola](https://en.wikipedia.org/wiki/Pe%C3%B1%C3%ADscola): 40.35917, 0.4075
- [Alicante / Playa de San Juan](https://en.wikipedia.org/wiki/Alicante): 38.34528, -0.48306
- [San José / Cabo de Gata](https://www.geonames.org/2511357/san-jose.html): 36.76048, -2.10912
- [Torrox Costa / Nerja](https://en.wikipedia.org/wiki/Torrox): 36.75, -3.95
- [Sevilla](https://en.wikipedia.org/wiki/Seville): 37.38861, -5.995
- [Tavira / östliche Algarve](https://en.wikipedia.org/wiki/Tavira): 37.117, -7.65
- [El Puerto de Santa María / Cádiz](https://en.wikipedia.org/wiki/El_Puerto_de_Santa_Mar%C3%ADa): 36.6014694, -6.2381472
- [Nerja](https://en.wikipedia.org/wiki/Nerja): 36.74694, -3.87889
- [Cartagena / Umgebung](https://en.wikipedia.org/wiki/Cartagena,_Spain): 37.6019, -0.9842
- [Valencia / Umgebung](https://en.wikipedia.org/wiki/Valencia): 39.47, -0.37639

## Lokal prüfen

```bash
node scripts/validate-plan.mjs
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Die Validierung prüft unter anderem lückenlose Termine, die Übernachtungen, die drei langen Aufenthalte und den Rückkehrpuffer. GitHub Actions führt sie bei Pushes und Pull Requests aus.

## Branch und Veröffentlichung

Diese Planerversion basiert auf `vacation-plan`. `master` enthält das separate Journal mit `data/entries.json` und dessen Post-Playbook. Die Route lebt im `ROUTE`-Array in `index.html`; keine Änderung an Journalbeiträgen ist nötig. Die Veröffentlichung wird weiterhin von der vorhandenen Pages-Konfiguration gesteuert. Ein neuer Planungsbranch wird nicht automatisch veröffentlicht.

