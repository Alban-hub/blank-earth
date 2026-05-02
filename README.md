# Blank Earth

An interactive 3D globe for tracking the countries you've visited.

Live at **[niceearth.pages.dev](https://niceearth.pages.dev)**

---

## Layout

The repo root **is** the deployed site. Everything Cloudflare Pages serves lives at the top level. Anything that's not runtime (project history, design briefs, alternate pipelines) is under `docs/`.

```
NiceEarth/
├── index.html              The runtime
├── stats.html              "Your atlas" stats page
├── manifest.webmanifest    PWA manifest
├── sw.js                   Service worker (offline cache)
├── README.md
│
├── vendor/
│   └── three-r128.min.js   Three.js, bundled locally
│
├── data/
│   ├── world.topojson      Country boundaries (Natural Earth)
│   └── elevations.json     Mean elevation per country (ISO_A3 → metres)
│
├── plugins/
│   ├── manifest.json       Lists plug-ins to load at runtime
│   ├── example.js          Reference plug-in
│   └── README.md           Plug-in API
│
├── icons/
│   ├── globe.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
│
└── docs/                   Non-runtime — strategy, architecture, history
    ├── TECHNICAL_AUDIT.md
    ├── CLAUDE_DESIGN_BRIEF.md
    ├── atlas-brainstorm.md
    ├── scaling-the-globe.md
    ├── community-and-build.md
    ├── blender-port-brief.md
    ├── pipeline-blender-to-web.md
    ├── archive/            Old prototypes (blank-earth-3d, blank-earth-pilot)
    └── blender/            Experimental Blender authoring pipeline
```

---

## Run locally

`index.html` fetches its data files at runtime — opening via `file://` won't work. Start a local server:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

---

## Deploy

Push to `main`. Cloudflare Pages auto-deploys this repo to `niceearth.pages.dev`. There is no build step — Cloudflare just serves the static files.

---

## Adding things later

- **New data** (e.g. region map, language map) → drop a JSON file in `data/`. A plug-in (or the engine, via `STYLE.dataSources`) fetches it.
- **New feature** (badges, monuments per country, themes) → write a plug-in: a single `.js` file in `plugins/`, listed in `plugins/manifest.json`. See `plugins/README.md` for the full API.
- **Restyling** → edit the `STYLE` block at the top of `index.html`. Colours, lighting, mesh density, camera, post-processing, all in one place.
