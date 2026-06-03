# IAHO Field Scanner

A **deterministic fake prop scanner** for a LARP. It looks like it scans, but every
result comes from an internal table (`scan mode + target → planned result`) so the
NPC always knows what it will say. The fantasy is *"authoritative device makes the
room nervous,"* not functional software.

See **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** for the full design, decisions,
and build order.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Built with React + Vite, plain CSS, no backend. State persists in `localStorage`.
Designed for a handheld phone screen.

> Local note: `base` is the GitHub Pages sub-path, so locally the app is at
> **http://localhost:5173/IAHO-field-scanner/** (not the bare root).

## Install on the game device (PWA)

The app is an installable PWA — install it once **while online** and it then launches
fullscreen (no browser UI) and runs **fully offline** (no backend, everything cached).

1. Open **https://thomashillebrink.github.io/IAHO-field-scanner/** in the phone's browser.
2. **iOS / Safari:** Share → *Add to Home Screen*. **Android / Chrome:** ⋮ menu →
   *Install app* / *Add to Home screen*.
3. Launch it from the home-screen icon. Open it once more online so the service worker
   finishes caching, then it works with the network off.

Regenerate the icons with `npm run icons` (writes PNGs into `public/`).

## What's here

- Six scanner apps (CQ Boundary, Memory Retention, FETR Patch, Architecture Sweep,
  Cradle Residue, Procedure Seal).
- Deterministic results with scripted narrative beats + boring fallbacks.
- Animated scan screen, result cards with an `ACTION:` line for the NPC.
- Audit log with generated evidence IDs (e.g. `IAHO-EV-7C4A-19`).
- Hidden **Auditor Override** (tap the `[ IAHO ]` logo 5× — SL use only).

CQ Boundary and FETR Patch have their signature SVG visuals; the other four modes
use a themed placeholder until their visuals are built.

## Where things live

- `src/config/` — scan modes, targets, result tables, override bands (**edit data here**).
- `src/lib/` — deterministic result resolution + audit log.
- `src/screens/` — Home, Target, Scan, Result, Audit Log.
- `src/visuals/` — per-mode SVG visuals.
