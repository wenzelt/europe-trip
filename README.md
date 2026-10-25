# Europe Trip · Elternzeit-Roadtrip 2027

Aktueller **Routenentwurf V3**, 8. Februar bis 25. April 2027 ab und bis München, mit dem Hyundai und Ferienwohnungen. Bis zum genannten Elternzeitende am 27. April bleiben zwei Tage Puffer. **Die Stationen sind Vorschläge, keine bestätigten Buchungen.**

Prioritäten: möglichst sonnige, regenarme Küstenorte, lange Basen zum Kochen/Lesen/Filmschneiden, Wandern und Stadtbesuche sowie eine Kite-Woche. **Ostern am 28. März ist in Spanien** (Cádiz) eingeplant. Portugal folgt erst im April.

## Route

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

## Kartenansicht und überlappende Orte

Die Leaflet-Karte zeichnet Verbindungen zwischen den tatsächlichen Gemeinde-/Stadtkoordinaten. Sie zeigt keine berechnete Fahrstrecke. Beim Herauszoomen liegen sowohl wiederholte Orte (München, Bern, Lyon, Montpellier, Girona) als auch nahe Stationen übereinander. Statt Marker zu verdecken, **gruppiert die Karte überlappende Marker bei der jeweils aktuellen Zoomstufe** zu einem Marker mit „2×“ (oder mehr). Durch Anklicken lässt sich jede Fahrt/Station mitsamt Datum einzeln wählen; beim Hineinzoomen werden räumlich getrennte Marker wieder aufgelöst. Linien und Routenfolge behalten die echten Referenzkoordinaten.

Neue, öffentlich verifizierbare Stadtreferenzpunkte:
- [Almería](https://en.wikipedia.org/wiki/Almer%C3%ADa): 36.8417, -2.4639.
- [Tarifa](https://en.wikipedia.org/wiki/Tarifa): 36.014, -5.606.
- [Cádiz](https://en.wikipedia.org/wiki/C%C3%A1diz): 36.535, -6.2975.

Andere Gemeindereferenzkoordinaten stammen unverändert aus der vorherigen Version. **Keine privaten Unterkunftskoordinaten**. Die Karte zeigt bei Alternativen (z. B. „Cádiz / El Puerto de Santa María“) ausdrücklich nur die zuerst genannte Referenzstadt. Kitesurfverleih und Winterinfrastruktur sind vor Ort zu prüfen. Die Euro-5-Zufahrtsberechtigung des Hyundai in städtischen Umweltzonen sowie Werkstattkontrolle vor Fahrtantritt bleiben offen.

## Lokale Prüfung

```bash
node scripts/validate-plan.mjs
python3 -m http.server 8000
```

Im Browser dann `http://localhost:8000` öffnen. Die Tests überprüfen lückenlose Übernachtungen, das Osterfenster in Spanien, die Kite-Woche und die Marker-Gruppierungslogik.

## Veröffentlichung

**GitHub Pages veröffentlicht `vacation-plan`.** Die Auswahl liegt im Default-Branch `master` unter `.github/pages-source.txt`. Ein Push nach `vacation-plan` startet dort `Validate route plan`; bei erfolgreicher Prüfung baut `master` über `workflow_run` die Pages-Version aus dem geprüften Planner-Commit. Die Veröffentlichungskonfiguration auf `master` muss für diesen Routenwechsel nicht geändert werden. Das separate Reisejournal auf `master` mit `data/entries.json` bleibt unverändert.
