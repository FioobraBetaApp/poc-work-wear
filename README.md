# Arbeidstøybørsen

Klikkbar demo av en markedsplass for utveksling av arbeidstøy mellom
kommuner. Ren HTML/CSS/vanilla JS – ingen build-steg, ingen backend.
Brukeren er forhåndsinnlogget som **Modum kommune**.

State (handlekurv, bestillinger, egne annonser) lagres i `localStorage`
i nettleseren slik at demoen føles interaktiv på tvers av sidene, uten
noen ekte database.

## Sider

- `index.html` – oversikt over alle varer, filtrer på kategori, legg i kurv
- `handlekurv.html` – juster antall/fjern varer, send bestilling
- `bestillinger.html` – bestillinger sendt av oss / mottatt fra andre kommuner
- `mine-annonser.html` – Modum sine egne annonser + skjema for å legge ut nye

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
