# Arbeidstøybørsen

Klikkbar demo av en markedsplass for ombruk av arbeidstøy. Ren
HTML/CSS/vanilla JS – ingen build-steg, ingen backend. Sidene er
responsive og fungerer på mobil.

## Use case

**Re:textile er selger, kommunen er kjøper.** Klærne kommer inn til
Re:textile, som kontrollerer, reparerer og sorterer dem og legger dem ut
for salg. Kommunen logger inn og bestiller arbeidstøy – i første use case
(Modum kommune) i hovedsak kjøp av eget tøy tilbake. Kommunene selger
ikke til hverandre direkte; Re:textile selger på vegne av kommunene.

Demoen har to perspektiver, valgt på forsiden (`index.html`):

### Kjøper – Modum kommune

- `butikk.html` – hele katalogen Re:textile har lagt ut, filtrer på
  kategori, legg hva som helst i handlekurven (også tøy med opprinnelse
  Modum)
- `handlekurv.html` – juster antall / fjern varer, send bestilling til
  Re:textile
- `bestillinger.html` – kun bestillinger Modum kommune selv har gjort

### Admin – Re:textile

- `admin.html` – nøkkeltall for mottak, lager og bestillinger
- `admin-varemottak.html` – plagg fra kommunene gjennom kontroll →
  reparasjon → sortering → «legg ut for salg»
- `admin-lager.html` – alle varer lagt ut for salg + skjema for å legge
  ut nye (med opprinnelseskommune og tilstand)
- `admin-bestillinger.html` – alle bestillinger fra kommunene, med
  statusflyt Venter → Bekreftet → Sendt → Levert

State (rolle, handlekurv, bestillinger, varemottak, lager) lagres i
`localStorage` i nettleseren. «Bytt perspektiv» i menyen nullstiller
rollen og går tilbake til forsiden.

## Kjøre lokalt

Åpne `index.html` direkte i nettleseren, eller server mappen med f.eks.:

```
npx serve .
```

## Hoste på GitHub Pages

1. Push dette repoet til GitHub.
2. Settings → Pages → Deploy from branch → velg `main` og `/ (root)`.
3. Siden blir tilgjengelig på `https://<bruker>.github.io/<repo>/`.

`.nojekyll` er inkludert slik at GitHub Pages serverer filene direkte.
