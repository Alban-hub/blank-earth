# Blank Earth

An interactive 3D globe for tracking the countries you've visited — a stylized, editorial atlas you can rotate, click, and explore in your browser.

Live at **[niceearth.pages.dev](https://niceearth.pages.dev)**

---

## What it is

Click a country, it lights up and rises out of the globe. Click again, it goes back. Your visited countries persist locally in your browser. Search, export, import — all client-side, no account needed.

The whole thing is a single self-contained `index.html` file. It loads three.js from a CDN, generates the globe geometry procedurally from open geographic data, and hands you an interactive scene. No build step, no backend, no tracking.

---

## Repo layout

```
blank-earth/
├── index.html                    The deployed app — open it in any browser
├── blank-earth-3d.html           Same as index.html (kept as canonical copy)
│
├── blender/                      Alternate visual pipeline (work in progress)
│   ├── blank_earth_v1.blend      Blender source scene
│   ├── globe_builder.py          Procedurally builds the .blend from data
│   ├── blank-earth-blender.html  HTML that loads a Blender-exported .glb
│   ├── world.geojson             Country boundaries (decoded from TopoJSON)
│   ├── elevations.json           Mean elevation per country
│   ├── launch.command            Double-click on macOS to start a local server
│   └── README.md                 Pipeline-specific docs
│
└── docs/                         Strategy, architecture, decisions
    ├── atlas-brainstorm.md
    ├── scaling-the-globe.md
    ├── community-and-build.md
    ├── blender-port-brief.md
    └── pipeline-blender-to-web.md
```

---

## How to run locally

The app is a single HTML file. Easiest way:

```bash
open index.html
```

Or for the Blender variant (which fetches a `.glb` and needs a server):

```bash
cd blender
python3 -m http.server 8000
# then open http://localhost:8000/blank-earth-blender.html
```

---

## How deployment works

This repo is connected to [Cloudflare Pages](https://pages.cloudflare.com). Every push to `main` auto-deploys to `niceearth.pages.dev`. There's no build step — Cloudflare just serves `index.html` at the root.

To deploy a change: edit, commit, push. That's it.

---

## Tech notes

- **Rendering:** three.js (r128), procedural geometry generated at runtime
- **Geography:** Natural Earth 1:10m admin_0_countries (TopoJSON, ~250 countries)
- **Persistence:** `localStorage` under key `blank-earth/v1/visits` — per browser, per device
- **State export/import:** plain JSON, manual download / upload buttons in the UI
- **No backend, no tracking, no analytics.** Everything happens in the user's browser.

---

## Project status

This is a personal creative project — part of a broader "Atlas of Imagined Places" idea exploring niche, lesser-known landscapes through stylized 3D visualization. The web build (`index.html`) is the working runtime. The Blender folder is an experimental authoring pipeline for richer visuals down the line.

See `docs/atlas-brainstorm.md` for the full vision and `docs/scaling-the-globe.md` for the technical roadmap.
